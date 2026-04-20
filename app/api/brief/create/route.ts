import { NextRequest, NextResponse } from 'next/server'
import { createAndRouteBrief, type BriefInput } from '@/lib/brief'
import { signBriefId } from '@/lib/signing'
import { getPublicBaseUrl, hasBriefPipeline } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!hasBriefPipeline()) {
    return NextResponse.json(
      { error: 'Brief pipeline is not configured on this deployment.' },
      { status: 503 }
    )
  }

  let body: Partial<BriefInput>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  // Validate
  const name = (body.travellerName || '').trim()
  const email = (body.travellerEmail || '').trim().toLowerCase()
  const rawQuery = (body.rawQuery || '').trim()

  if (!name) return NextResponse.json({ error: 'Please give us your name.' }, { status: 400 })
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Please give us a valid email.' }, { status: 400 })
  }
  if (!rawQuery || rawQuery.length < 10) {
    return NextResponse.json(
      { error: 'Please describe what you want in at least a sentence.' },
      { status: 400 }
    )
  }

  const input: BriefInput = {
    travellerName: name,
    travellerEmail: email,
    city: body.city?.trim() || undefined,
    checkIn: body.checkIn || undefined,
    checkOut: body.checkOut || undefined,
    guests: typeof body.guests === 'number' && body.guests > 0 ? body.guests : undefined,
    maxPriceGbp:
      typeof body.maxPriceGbp === 'number' && body.maxPriceGbp > 0 ? body.maxPriceGbp : undefined,
    rawQuery,
  }

  const result = await createAndRouteBrief(input)

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 })
  }

  const token = signBriefId(result.briefId)
  const baseUrl = getPublicBaseUrl()
  const briefUrl = `${baseUrl}/brief/${result.briefId}/?t=${token}`

  return NextResponse.json({
    ok: true,
    briefId: result.briefId,
    briefUrl,
    routedCount: result.routedCount,
    emailsFailed: result.emailsFailed,
  })
}
