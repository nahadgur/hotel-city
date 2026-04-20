import { NextRequest, NextResponse } from 'next/server'
import { createListing, type ListingInput } from '@/lib/listing'
import { getSessionUser } from '@/lib/session'
import { hasBriefPipeline } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!hasBriefPipeline()) {
    return NextResponse.json(
      { error: 'Listing pipeline is not configured on this deployment.' },
      { status: 503 }
    )
  }

  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'You need to sign in first.' }, { status: 401 })
  }

  let body: Partial<ListingInput>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const rawQuery = (body.rawQuery || '').trim()
  if (!rawQuery || rawQuery.length < 10) {
    return NextResponse.json(
      { error: 'Describe what you want in at least a sentence.' },
      { status: 400 }
    )
  }

  const input: ListingInput = {
    userId: user.id,
    userEmail: user.email || '',
    userName: user.name || 'Stayward traveller',
    city: body.city?.trim() || undefined,
    checkIn: body.checkIn || undefined,
    checkOut: body.checkOut || undefined,
    guests: typeof body.guests === 'number' && body.guests > 0 ? body.guests : undefined,
    rooms: typeof body.rooms === 'number' && body.rooms > 0 ? body.rooms : undefined,
    maxPriceGbp:
      typeof body.maxPriceGbp === 'number' && body.maxPriceGbp > 0 ? body.maxPriceGbp : undefined,
    rawQuery,
  }

  const result = await createListing(input)

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 })
  }

  return NextResponse.json({
    ok: true,
    listingId: result.listingId,
    routedCount: result.routedCount,
    emailsFailed: result.emailsFailed,
  })
}
