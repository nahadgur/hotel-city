import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { fetchBriefWithRoutings } from '@/lib/brief'
import { verifyBriefToken, signBriefId } from '@/lib/signing'
import { BriefInboxClient } from './BriefInboxClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Your quotes',
  robots: { index: false, follow: false },
}

type Props = {
  params: { id: string }
  searchParams: { t?: string }
}

export default async function BriefInboxPage({ params, searchParams }: Props) {
  const briefId = params.id
  const token = searchParams.t

  // Magic link auth: accept either a valid signed token, OR the just-created
  // brief (no token required on the first redirect) — which we handle by
  // signing it inline and then the client uses it for polling.
  const hasValidToken = token ? verifyBriefToken(briefId, token) : false

  if (!hasValidToken) {
    // Render a simple access-denied view rather than leaking the brief
    return (
      <section className="container-edge py-section">
        <div className="max-w-reading">
          <div className="eyebrow mb-3 text-ink-500">Access</div>
          <h1 className="font-display text-display-md mb-4">This link needs a token.</h1>
          <p className="text-ink-700 leading-relaxed">
            Brief inboxes are private. Use the link we emailed you when the brief was created, or
            from any quote notification.
          </p>
        </div>
      </section>
    )
  }

  const { brief, routings } = await fetchBriefWithRoutings(briefId)

  if (!brief) notFound()

  // Hand a fresh token to the client so it can keep polling
  const pollToken = signBriefId(briefId)

  return (
    <BriefInboxClient
      brief={{
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
        quoteId: r.quote_id,
        quoteReceivedAt: r.quote_received_at,
        quotePriceGbp: r.quote_price_gbp,
        quoteBody: r.quote_body,
        quoteFromEmail: r.quote_from_email,
      }))}
      pollToken={pollToken}
    />
  )
}
