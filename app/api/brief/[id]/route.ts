import { NextRequest, NextResponse } from 'next/server'
import { fetchBriefWithRoutings } from '@/lib/brief'
import { verifyBriefToken } from '@/lib/signing'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const briefId = params.id
  const token = req.nextUrl.searchParams.get('t') || ''

  if (!verifyBriefToken(briefId, token)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const { brief, routings } = await fetchBriefWithRoutings(briefId)
  if (!brief) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    brief: {
      id: brief.id,
      travellerName: brief.traveller_name,
      rawQuery: brief.raw_query,
      city: brief.city,
      checkIn: brief.check_in,
      checkOut: brief.check_out,
      guests: brief.guests,
      maxPriceGbp: brief.max_price_gbp,
      status: brief.status,
      createdAt: brief.created_at,
    },
    routings: routings.map((r) => ({
      id: r.id,
      hotelSlug: r.hotel_slug,
      hotelName: r.hotel_name,
      hotelCity: r.hotel_city,
      matchScore: r.match_score,
      matchReasons: r.match_reasons,
      emailStatus: r.email_status,
      emailSentAt: r.email_sent_at,
      quoteId: r.quote_id,
      quoteReceivedAt: r.quote_received_at,
      quotePriceGbp: r.quote_price_gbp,
      quoteBody: r.quote_body,
      quoteFromEmail: r.quote_from_email,
    })),
  })
}
