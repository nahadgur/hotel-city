import { NextRequest, NextResponse } from 'next/server'
import {
  findRoutingByReplyToken,
  findRoutingByThreadToken,
  extractPriceFromMessage,
} from '@/lib/listing'
import { notifyCustomerOfReply } from '@/lib/email'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type InboundPayload = {
  type?: string
  data?: {
    from?: { email?: string } | string
    to?: Array<{ email?: string } | string> | string
    subject?: string
    text?: string
    html?: string
    headers?: Record<string, string>
  }
  from?: string
  to?: string | string[]
  subject?: string
  text?: string
  html?: string
}

/**
 * Inbound webhook — handles hotel replies.
 *
 * Routing cascade:
 *   1. Look for `thread-{token}@` in the to: field (ongoing conversation)
 *   2. Look for `brief-{token}@` in the to: field (first reply to initial brief)
 *   3. Look for [thread: xxx] or [ref: xxx] in the subject line (domain-fallback mode)
 *
 * Both token types resolve to the same routing, but we log which path matched
 * in case we want to distinguish later.
 */
export async function POST(req: NextRequest) {
  let payload: InboundPayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const data = payload.data ?? payload
  const fromEmail =
    typeof data.from === 'string' ? data.from : (data.from as { email?: string })?.email ?? ''
  const toList = Array.isArray(data.to) ? data.to : [data.to]
  const subject = data.subject || ''
  const bodyText = data.text || ''
  const bodyHtml = data.html || null

  // Find the token in the to: field
  let threadToken: string | null = null
  let briefToken: string | null = null

  for (const entry of toList) {
    const addr = typeof entry === 'string' ? entry : (entry as { email?: string })?.email
    if (!addr) continue
    const threadMatch = addr.match(/thread-([a-z0-9]+)@/i)
    if (threadMatch) {
      threadToken = threadMatch[1].toLowerCase()
      break
    }
    const briefMatch = addr.match(/brief-([a-z0-9]+)@/i)
    if (briefMatch) {
      briefToken = briefMatch[1].toLowerCase()
      break
    }
  }

  // Subject-line fallback (no inbound domain configured)
  if (!threadToken && !briefToken) {
    const threadSubj = subject.match(/\[thread:\s*([a-z0-9]+)\s*\]/i)
    if (threadSubj) threadToken = threadSubj[1].toLowerCase()
    else {
      const briefSubj = subject.match(/\[ref:\s*([a-z0-9]+)\s*\]/i)
      if (briefSubj) briefToken = briefSubj[1].toLowerCase()
    }
  }

  if (!threadToken && !briefToken) {
    console.warn('[inbound] no token found', { to: toList, subject })
    return NextResponse.json({ ok: false, reason: 'no_token' }, { status: 200 })
  }

  const routing = threadToken
    ? await findRoutingByThreadToken(threadToken)
    : await findRoutingByReplyToken(briefToken!)

  if (!routing) {
    console.warn('[inbound] token has no routing', { threadToken, briefToken })
    return NextResponse.json({ ok: false, reason: 'no_routing' }, { status: 200 })
  }

  const supabase = getSupabase()
  const parsedPrice = extractPriceFromMessage(bodyText)

  const messageInsert = await supabase
    .from('messages')
    .insert({
      routing_id: routing.id,
      sender: 'hotel',
      from_email: fromEmail || null,
      subject,
      body_text: bodyText || '(empty body)',
      body_html: bodyHtml,
      parsed_price_gbp: parsedPrice,
      sent_via: 'email',
    })
    .select()
    .single()

  if (messageInsert.error) {
    console.error('[inbound] failed to insert message', messageInsert.error)
    return NextResponse.json({ ok: false, error: messageInsert.error.message }, { status: 500 })
  }

  // Update listing status
  await supabase
    .from('listings')
    .update({ status: 'quotes_ready' })
    .eq('id', routing.listing_id)

  // Notify customer (fire and forget)
  try {
    const listingResult = await supabase
      .from('listings')
      .select('traveller_name, traveller_email, id')
      .eq('id', routing.listing_id)
      .single()

    if (listingResult.data) {
      await notifyCustomerOfReply({
        customerEmail: listingResult.data.traveller_email,
        customerName: listingResult.data.traveller_name || 'there',
        hotelName: routing.hotel_name,
        listingId: listingResult.data.id,
      })
    }
  } catch (err) {
    console.error('[inbound] notify customer failed:', err)
  }

  return NextResponse.json({ ok: true, messageId: messageInsert.data.id })
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'stayward-inbound' })
}
