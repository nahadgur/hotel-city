import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/session'
import { fetchListingForUser, statusLabel, statusHelp, type ListingStatus } from '@/lib/listing'
import { ArrowLeft, Mail, Clock, Sparkles, Archive } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Brief',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await requireUser(`/dashboard/listings/${params.id}`)
  const listing = await fetchListingForUser(params.id, user.id)
  if (!listing) notFound()

  const status = listing.status as ListingStatus

  return (
    <>
      <section className="container-edge pt-10 md:pt-16 pb-6">
        <Link href="/dashboard/" className="inline-flex items-center gap-2 text-xs text-ink-500 link-underline mb-6">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>All briefs</span>
        </Link>

        <div className="max-w-3xl">
          <StatusHeader status={status} />

          <h1 className="font-display text-display-lg mb-4 mt-6">
            {listing.title || truncate(listing.raw_query, 80)}
          </h1>

          {status === 'received' && (
            <p className="text-ink-700 leading-relaxed max-w-reading">
              {statusHelp(status)} You\'ll hear from us by email at {listing.traveller_email}.
            </p>
          )}
          {status === 'working' && (
            <p className="text-ink-700 leading-relaxed max-w-reading">
              {statusHelp(status)}
            </p>
          )}
          {status === 'quotes_sent' && (
            <p className="text-ink-700 leading-relaxed max-w-reading">
              {statusHelp(status)} Quotes went out to {listing.traveller_email}. Reply direct to that email with questions or to accept one.
            </p>
          )}
          {status === 'closed' && (
            <p className="text-ink-700 leading-relaxed max-w-reading">
              {statusHelp(status)}
            </p>
          )}
        </div>
      </section>

      <section className="container-edge pb-section">
        <div className="border-l-2 border-terracotta-500 bg-paper-50 p-6 md:p-8 max-w-3xl">
          <div className="eyebrow mb-3 text-ink-500">Your brief</div>
          <p className="font-display italic text-xl md:text-2xl leading-snug text-ink-900 mb-6 max-w-reading">
            &ldquo;{listing.raw_query}&rdquo;
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-sm">
            {listing.city && (
              <div>
                <div className="eyebrow mb-1 text-ink-500">City</div>
                <div className="text-ink-900">{listing.city}</div>
              </div>
            )}
            {listing.check_in && listing.check_out && (
              <div className="col-span-2">
                <div className="eyebrow mb-1 text-ink-500">Dates</div>
                <div className="text-ink-900 tabular">
                  {formatDate(listing.check_in)} &rarr; {formatDate(listing.check_out)}
                </div>
              </div>
            )}
            {listing.guests && (
              <div>
                <div className="eyebrow mb-1 text-ink-500">Guests</div>
                <div className="text-ink-900 tabular">{listing.guests}</div>
              </div>
            )}
            {listing.rooms && (
              <div>
                <div className="eyebrow mb-1 text-ink-500">Rooms</div>
                <div className="text-ink-900 tabular">{listing.rooms}</div>
              </div>
            )}
            {listing.max_price_gbp && (
              <div>
                <div className="eyebrow mb-1 text-ink-500">Max / night</div>
                <div className="text-ink-900 tabular">\u00a3{listing.max_price_gbp}</div>
              </div>
            )}
            <div>
              <div className="eyebrow mb-1 text-ink-500">Sent</div>
              <div className="text-ink-900 tabular">{formatDate(listing.created_at)}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function StatusHeader({ status }: { status: ListingStatus }) {
  const label = statusLabel(status)

  if (status === 'quotes_sent') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-terracotta-500/10 border border-terracotta-500/30 text-terracotta-600 text-xs">
        <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span className="uppercase tracking-wider">{label}</span>
      </div>
    )
  }
  if (status === 'working') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sage-500/10 border border-sage-500/30 text-sage-600 text-xs">
        <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span className="uppercase tracking-wider">{label}</span>
      </div>
    )
  }
  if (status === 'closed') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-ink-900/15 text-ink-500 text-xs">
        <Archive className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span className="uppercase tracking-wider">{label}</span>
      </div>
    )
  }
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-ink-900/15 text-ink-500 text-xs">
      <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
      <span className="uppercase tracking-wider">{label}</span>
    </div>
  )
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  } catch {
    return iso
  }
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1).trim() + '\u2026' : s
}
