import { NextRequest, NextResponse } from 'next/server'
import { createListing, type ListingInput } from '@/lib/listing'
import { getSessionUser } from '@/lib/session'
import { hasPlanWebhook } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  if (!hasPlanWebhook()) {
    return NextResponse.json(
      { error: 'Brief submission is not configured on this deployment.' },
      { status: 503 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const rawQuery = String(body.rawQuery || '').trim()
  if (!rawQuery || rawQuery.length < 10) {
    return NextResponse.json(
      { error: 'Please describe what you want in at least a sentence.' },
      { status: 400 }
    )
  }

  // Email is always required so we have somewhere to reply.
  // For logged-in users, prefer their session email unless they overrode it.
  const user = await getSessionUser()
  const bodyEmail = String(body.email || '').trim().toLowerCase()
  const email = bodyEmail || user?.email?.toLowerCase() || ''

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'A valid email address is required so we can reply with quotes.' },
      { status: 400 }
    )
  }

  const toInt = (v: unknown): number | undefined => {
    const n = typeof v === 'number' ? v : parseInt(String(v), 10)
    return Number.isFinite(n) && n > 0 ? n : undefined
  }

  const input: ListingInput = {
    userId: user?.id ?? null,
    userName: user?.name ?? null,
    email,
    rawQuery,
    city: body.city ? String(body.city).trim() || undefined : undefined,
    checkIn: body.checkIn ? String(body.checkIn) : undefined,
    checkOut: body.checkOut ? String(body.checkOut) : undefined,
    guests: toInt(body.guests),
    rooms: toInt(body.rooms),
    maxPriceGbp: toInt(body.maxPriceGbp),
  }

  const result = await createListing(input)

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    listingId: result.listingId,
    signedIn: Boolean(user),
  })
}
