import { NextRequest, NextResponse } from 'next/server'
import {
  fetchListingForUser,
  fetchRoutingsForListing,
  fetchThreadMessages,
} from '@/lib/listing'
import { getSessionUser } from '@/lib/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const listing = await fetchListingForUser(params.id, user.id)
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const routings = await fetchRoutingsForListing(listing.id)

  const threads = await Promise.all(
    routings.map(async (r) => ({
      routingId: r.id,
      messages: await fetchThreadMessages(r.id),
    }))
  )

  const messagesByRouting = Object.fromEntries(
    threads.map((t) => [
      t.routingId,
      t.messages.map((m) => ({
        id: m.id,
        createdAt: m.created_at,
        sender: m.sender,
        fromEmail: m.from_email,
        bodyText: m.body_text,
        parsedPriceGbp: m.parsed_price_gbp,
        sentVia: m.sent_via,
      })),
    ])
  )

  return NextResponse.json({
    listing: {
      id: listing.id,
      title: listing.title,
      rawQuery: listing.raw_query,
      city: listing.city,
      checkIn: listing.check_in,
      checkOut: listing.check_out,
      guests: listing.guests,
      rooms: listing.rooms,
      maxPriceGbp: listing.max_price_gbp,
      status: listing.status,
      createdAt: listing.created_at,
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
      messageCount: r.message_count,
      hotelMessageCount: r.hotel_message_count,
      latestMessageAt: r.latest_message_at,
      latestMessagePriceGbp: r.latest_message_price_gbp,
    })),
    messagesByRouting,
  })
}
