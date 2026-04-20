import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type PlanPayload = {
  rawQuery?: string
  name?: string
  email?: string
  city?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  rooms?: number
  maxPriceGbp?: number
}

export async function POST(req: Request) {
  const webhook = process.env.PLAN_WEBHOOK_URL
  if (!webhook) {
    return NextResponse.json(
      { ok: false, error: 'Server not configured.' },
      { status: 500 }
    )
  }

  let body: PlanPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid request.' },
      { status: 400 }
    )
  }

  const rawQuery = (body.rawQuery || '').trim()
  const email = (body.email || '').trim()

  if (!rawQuery) {
    return NextResponse.json(
      { ok: false, error: 'Please describe what you\'re looking for.' },
      { status: 400 }
    )
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'A valid email is required.' },
      { status: 400 }
    )
  }

  const payload = {
    rawQuery,
    name: (body.name || '').trim(),
    email,
    city: (body.city || '').trim(),
    checkIn: body.checkIn || '',
    checkOut: body.checkOut || '',
    guests: Number.isFinite(body.guests) ? body.guests : undefined,
    rooms: Number.isFinite(body.rooms) ? body.rooms : undefined,
    maxPriceGbp: Number.isFinite(body.maxPriceGbp) ? body.maxPriceGbp : undefined,
    submittedAt: new Date().toISOString(),
    source: 'stayward-web',
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    })

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: 'Could not deliver your brief. Please try again.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Network error reaching our system. Please try again.' },
      { status: 502 }
    )
  }
}
