import { NextRequest, NextResponse } from 'next/server'
import { findRoutingByToken, extractPriceFromQuote, fetchBriefWithRoutings } from '@/lib/brief'
import { notifyTravellerOfQuote } from '@/lib/email'
import { getSupabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Resend inbound webhook payload shape (simplified).
// See: https://resend.com/docs/dashboard/webhooks/introduction
// The exact shape varies; we handle the common variants.
type InboundPayload = {
  type?: string
  created_at?: string
  data?: {
    from?: { email?: string } | string
    to?: Array<{ email?: string } | string> | string
    subject?: string
    text?: string
    html?: string
    headers?: Record<string, string>
  }
  // Also support the flatter shape some webhooks use
  from?: string
  to?: string | string[]
  subject?: string
  text?: string
  html?: string
}

/**
 * Inbound email handler.
 * Two ways of locating the routing:
 *   1. If `to` matches brief-{token}@{inbound-domain}, use that.
 *   2. Else, look for [ref: token] in the subject line (fallback mode).
 */
export async function POST(req: NextRequest) {
  let payload: InboundPayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Normalise
  const data = payload.data ?? payload
  const fromEmail =
    typeof data.from === 'string' ? data.from : (data.from as { email?: string })?.email ?? ''
  const toList = Array.isArray(data.to) ? data.to : [data.to]
  const subject = data.subject || ''
  const bodyText = data.text || ''
  const bodyHtml = data.html || null

  // Find the token — try `to` first, then subject line
  let token: string | null = null

  for (const entry of toList) {
    const addr = typeof entry === 'string' ? entry : (entry as { email?: string })?.email
    if (!addr) continue
    const match = addr.match(/brief-([a-z0-9]+)@/i)
    if (match) {
      token = match[1].toLowerCase()
      break
    }
  }

  if (!token) {
    // Subject-line fallback (used when no inbound domain is configured)
    const subjectMatch = subject.match(/\[ref:\s*([a-z0-9]+)\s*\]/i)
    if (subjectMatch) token = subjectMatch[1].toLowerCase()
  }

  if (!token) {
    console.warn('[inbound] could not find token in email', { to: toList, subject })
    return NextResponse.json({ ok: false, reason: 'no_token_found' }, { status: 200 })
  }

  const routing = await findRoutingByToken(token)
  if (!routing) {
    console.warn('[inbound] token has no matching routing', { token })
    return NextResponse.json({ ok: false, reason: 'no_routing' }, { status: 200 })
  }

  // Save the quote
  const supabase = getSupabase()
  const parsedPrice = extractPriceFromQuote(bodyText || '')

  const quoteInsert = await supabase
    .from('quotes')
    .insert({
      routing_id: routing.id,
      from_email: fromEmail || null,
      subject,
      body_text: bodyText || '(empty body)',
      body_html: bodyHtml,
      parsed_price_gbp: parsedPrice,
    })
    .select()
    .single()

  if (quoteInsert.error) {
    console.error('[inbound] failed to insert quote', quoteInsert.error)
    return NextResponse.json({ ok: false, error: quoteInsert.error.message }, { status: 500 })
  }

  // Update brief status to quotes_ready
  await supabase.from('briefs').update({ status: 'quotes_ready' }).eq('id', routing.brief_id)

  // Notify traveller (fire and forget — failure here shouldn't fail the webhook)
  try {
    const { brief } = await fetchBriefWithRoutings(routing.brief_id)
    if (brief) {
      await notifyTravellerOfQuote({ brief, hotelName: routing.hotel_name })
    }
  } catch (err) {
    console.error('[inbound] traveller notification failed:', err)
  }

  return NextResponse.json({ ok: true, quoteId: quoteInsert.data.id })
}

// Simple GET for health-checking the webhook URL.
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'stayward-inbound' })
}
