import type { Metadata } from 'next'
import Link from 'next/link'
import { requireUser } from '@/lib/session'
import { fetchUserListings } from '@/lib/listing'
import { ArrowRight, Sparkles, Clock, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await requireUser('/dashboard')
  const listings = await fetchUserListings(user.id)

  return (
    <>
      <section className="container-edge pt-10 md:pt-16 pb-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-2">
          <div>
            <div className="eyebrow eyebrow-rule mb-6">Dashboard</div>
            <h1 className="font-display text-display-lg">
              Hello, {user.name?.split(' ')[0] || 'you'}.
            </h1>
          </div>

          <Link href="/dashboard/new/" className="btn-primary">
            <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            <span>New listing</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>

      <section className="container-edge pb-section">
        {listings.length === 0 ? (
          <div className="max-w-reading py-10">
            <div className="eyebrow mb-3 text-ink-500">No listings yet</div>
            <h2 className="font-display text-display-md mb-4">
              Start your first listing.
            </h2>
            <p className="text-ink-700 leading-relaxed mb-8 max-w-reading">
              Describe the hotel you want. We'll route it to five matching hotels,
              and they'll quote you direct. Usually well below the public rate.
            </p>
            <Link href="/dashboard/new/" className="btn-primary">
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
              <span>Create a listing</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        ) : (
          <div>
            <div className="eyebrow mb-6 text-ink-500">
              {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
            </div>
            <div className="space-y-3">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/dashboard/listings/${listing.id}/`}
                  className="block border border-ink-900/15 hover:border-ink-900 bg-paper-50 transition-colors group"
                >
                  <div className="p-5 md:p-6 grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-12 md:col-span-7">
                      <div className="flex flex-wrap items-baseline gap-3 mb-1">
                        <ListingStatusPill status={listing.status} />
                        {listing.city && (
                          <div className="eyebrow text-ink-500">{listing.city}</div>
                        )}
                        <div className="text-xs text-ink-400">
                          {formatRelative(listing.created_at)}
                        </div>
                      </div>
                      <h3 className="font-display text-xl md:text-2xl leading-tight group-hover:text-terracotta-500 transition-colors">
                        {listing.title || truncate(listing.raw_query, 80)}
                      </h3>
                      <p className="mt-2 text-sm text-ink-700 italic line-clamp-2 max-w-reading">
                        "{listing.raw_query}"
                      </p>
                    </div>

                    <div className="col-span-12 md:col-span-5 flex md:flex-col md:items-end justify-between md:justify-start gap-2 text-sm">
                      {listing.check_in && listing.check_out && (
                        <div className="md:text-right">
                          <div className="eyebrow text-ink-500 mb-0.5">Dates</div>
                          <div className="tabular">
                            {formatDate(listing.check_in)} – {formatDate(listing.check_out)}
                          </div>
                        </div>
                      )}
                      {listing.max_price_gbp && (
                        <div className="md:text-right">
                          <div className="eyebrow text-ink-500 mb-0.5">Max / night</div>
                          <div className="tabular">£{listing.max_price_gbp}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  )
}

function ListingStatusPill({ status }: { status: string }) {
  if (status === 'quotes_ready') {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 bg-terracotta-500/10 text-terracotta-600 border border-terracotta-500/30">
        <Sparkles className="w-3 h-3" strokeWidth={1.5} />
        <span>Quotes in</span>
      </div>
    )
  }
  if (status === 'booked') {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 bg-sage-500/10 text-sage-600 border border-sage-500/30">
        <Check className="w-3 h-3" strokeWidth={1.5} />
        <span>Booked</span>
      </div>
    )
  }
  return (
    <div className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 border border-ink-900/15 text-ink-500">
      <Clock className="w-3 h-3" strokeWidth={1.5} />
      <span>Routing</span>
    </div>
  )
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  } catch {
    return iso
  }
}

function formatRelative(iso: string): string {
  try {
    const then = new Date(iso).getTime()
    const now = Date.now()
    const diffMin = Math.round((now - then) / 60000)
    if (diffMin < 1) return 'just now'
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHr = Math.round(diffMin / 60)
    if (diffHr < 24) return `${diffHr}h ago`
    const diffDay = Math.round(diffHr / 24)
    return `${diffDay}d ago`
  } catch {
    return ''
  }
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1).trim() + '…' : s
}
