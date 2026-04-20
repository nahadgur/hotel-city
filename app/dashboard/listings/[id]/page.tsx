import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/session'
import {
  fetchListingForUser,
  fetchRoutingsForListing,
  fetchThreadMessages,
} from '@/lib/listing'
import { ListingDetailClient } from './ListingDetailClient'

export const metadata: Metadata = {
  title: 'Listing',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await requireUser(`/dashboard/listings/${params.id}`)
  const listing = await fetchListingForUser(params.id, user.id)
  if (!listing) notFound()

  const routings = await fetchRoutingsForListing(listing.id)

  // Fetch messages for each routing in parallel
  const threads = await Promise.all(
    routings.map(async (r) => ({
      routingId: r.id,
      messages: await fetchThreadMessages(r.id),
    }))
  )
  const messagesByRouting = Object.fromEntries(
    threads.map((t) => [t.routingId, t.messages])
  )

  return (
    <ListingDetailClient
      listing={{
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
      }}
      initialRoutings={routings.map((r) => ({
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
      }))}
      initialMessagesByRouting={Object.fromEntries(
        Object.entries(messagesByRouting).map(([rid, msgs]) => [
          rid,
          msgs.map((m) => ({
            id: m.id,
            createdAt: m.created_at,
            sender: m.sender,
            fromEmail: m.from_email,
            bodyText: m.body_text,
            parsedPriceGbp: m.parsed_price_gbp,
            sentVia: m.sent_via,
          })),
        ])
      )}
    />
  )
}
