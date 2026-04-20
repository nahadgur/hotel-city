'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Check, Clock, Mail, AlertTriangle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'

type Brief = {
  id: string
  travellerName: string
  rawQuery: string
  city: string | null
  checkIn: string | null
  checkOut: string | null
  guests: number | null
  maxPriceGbp: number | null
  status: string
  createdAt: string
}

type Routing = {
  id: string
  hotelSlug: string
  hotelName: string
  hotelCity: string
  matchScore: number | null
  matchReasons: string[] | null
  emailStatus: string
  emailSentAt: string | null
  quoteId: string | null
  quoteReceivedAt: string | null
  quotePriceGbp: number | null
  quoteBody: string | null
  quoteFromEmail: string | null
}

type Props = {
  brief: Brief
  initialRoutings: Routing[]
  pollToken: string
}

const POLL_INTERVAL_MS = 20_000

export function BriefInboxClient({ brief, initialRoutings, pollToken }: Props) {
  const [routings, setRoutings] = useState<Routing[]>(initialRoutings)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date>(new Date())

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/brief/${brief.id}?t=${pollToken}`, { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data.routings)) {
        setRoutings(data.routings)
        setLastFetched(new Date())
      }
    } catch {
      // silent fail — we'll try again
    }
  }, [brief.id, pollToken])

  useEffect(() => {
    const t = setInterval(refresh, POLL_INTERVAL_MS)
    return () => clearInterval(t)
  }, [refresh])

  const quotesArrived = routings.filter((r) => r.quoteId).length
  const emailsSent = routings.filter((r) => r.emailStatus === 'sent').length
  const totalRoutings = routings.length

  return (
    <>
      {/* HEADER */}
      <section className="bg-ink-900 text-paper-50">
        <div className="container-edge py-10 md:py-14">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="eyebrow text-paper-300">Your brief</div>
            <StatusPill
              quotesArrived={quotesArrived}
              totalRoutings={totalRoutings}
            />
          </div>
          <p className="font-display italic text-2xl md:text-3xl max-w-reading leading-snug mb-6">
            &ldquo;{brief.rawQuery}&rdquo;
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mt-8 max-w-3xl">
            {brief.city && (
              <div>
                <div className="eyebrow text-paper-300 mb-1">City</div>
                <div className="text-lg">{brief.city}</div>
              </div>
            )}
            {brief.checkIn && brief.checkOut && (
              <div>
                <div className="eyebrow text-paper-300 mb-1">Dates</div>
                <div className="text-sm tabular">
                  {formatDate(brief.checkIn)}<br />
                  to {formatDate(brief.checkOut)}
                </div>
              </div>
            )}
            {brief.guests && (
              <div>
                <div className="eyebrow text-paper-300 mb-1">Guests</div>
                <div className="text-lg tabular">{brief.guests}</div>
              </div>
            )}
            {brief.maxPriceGbp && (
              <div>
                <div className="eyebrow text-paper-300 mb-1">Max / night</div>
                <div className="text-lg tabular">£{brief.maxPriceGbp}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PROGRESS BAR */}
      <section className="bg-paper-50 hairline">
        <div className="container-edge py-6">
          <div className="flex items-center justify-between gap-4 max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-ink-700">
              <Mail className="w-4 h-4 text-sage-500" strokeWidth={1.5} />
              <span>
                <span className="tabular">{emailsSent}</span> of{' '}
                <span className="tabular">{totalRoutings}</span> hotels contacted
              </span>
              <span className="text-ink-400 mx-1">·</span>
              <Sparkles className="w-4 h-4 text-terracotta-500" strokeWidth={1.5} />
              <span>
                <span className="tabular font-medium">{quotesArrived}</span> quote
                {quotesArrived === 1 ? '' : 's'} in
              </span>
            </div>
            <div className="text-xs text-ink-500 italic hidden md:block">
              Refreshing every 20s · last checked {formatTime(lastFetched)}
            </div>
          </div>
        </div>
      </section>

      {/* ROUTINGS LIST */}
      <section className="container-edge py-section">
        {totalRoutings === 0 ? (
          <div className="max-w-reading">
            <h2 className="font-display text-display-md mb-4">No hotels routed yet.</h2>
            <p className="text-ink-700 leading-relaxed">
              This is unusual. Please <Link href="/brief/new/" className="link-underline">start a new brief</Link> or contact us.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="eyebrow mb-3">
                {quotesArrived > 0
                  ? `${quotesArrived} quote${quotesArrived === 1 ? '' : 's'} so far`
                  : 'Routed to'}
              </div>
              <h2 className="font-display text-display-md max-w-reading">
                {quotesArrived === 0
                  ? 'Waiting for the hotels to reply.'
                  : quotesArrived === totalRoutings
                  ? 'All quotes are in. Pick one.'
                  : 'Quotes are rolling in. Pick when ready.'}
              </h2>
              {quotesArrived === 0 && (
                <p className="mt-3 text-sm text-ink-500 italic max-w-reading">
                  Most quotes arrive within a few hours during business hours. We'll email you each time one arrives.
                </p>
              )}
            </div>

            <div className="space-y-4">
              {routings.map((r) => (
                <RoutingCard
                  key={r.id}
                  routing={r}
                  expanded={expandedId === r.id}
                  onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}

function StatusPill({
  quotesArrived,
  totalRoutings,
}: {
  quotesArrived: number
  totalRoutings: number
}) {
  if (quotesArrived === 0) {
    return (
      <div className="inline-flex items-center gap-2 text-xs text-paper-300 px-2.5 py-1 border border-paper-50/20">
        <Clock className="w-3 h-3" strokeWidth={1.5} />
        <span>Routing</span>
      </div>
    )
  }
  if (quotesArrived < totalRoutings) {
    return (
      <div className="inline-flex items-center gap-2 text-xs text-terracotta-400 px-2.5 py-1 border border-terracotta-400/30 bg-terracotta-500/10">
        <Sparkles className="w-3 h-3" strokeWidth={1.5} />
        <span>{quotesArrived} of {totalRoutings} quoted</span>
      </div>
    )
  }
  return (
    <div className="inline-flex items-center gap-2 text-xs text-sage-500 px-2.5 py-1 border border-sage-500/30 bg-sage-500/10">
      <Check className="w-3 h-3" strokeWidth={1.5} />
      <span>All quotes in</span>
    </div>
  )
}

function RoutingCard({
  routing,
  expanded,
  onToggle,
}: {
  routing: Routing
  expanded: boolean
  onToggle: () => void
}) {
  const hasQuote = !!routing.quoteId
  const failed = routing.emailStatus === 'failed'

  return (
    <div
      className={`border transition-colors ${
        hasQuote
          ? 'border-ink-900 bg-paper-100'
          : failed
          ? 'border-terracotta-500/30 bg-terracotta-500/5'
          : 'border-ink-900/15 bg-paper-50'
      }`}
    >
      <div className="grid grid-cols-12 gap-4 p-5 md:p-6 items-start">
        <div className="col-span-12 md:col-span-7">
          <div className="flex items-baseline gap-3 mb-1">
            <Link
              href={`/hotels/${routing.hotelSlug}/`}
              className="font-display text-2xl md:text-3xl leading-tight hover:text-terracotta-500 transition-colors"
            >
              {routing.hotelName}
            </Link>
          </div>
          <div className="eyebrow text-ink-500 mb-3">{routing.hotelCity}</div>

          {routing.matchReasons && routing.matchReasons.length > 0 && (
            <div className="space-y-1 mb-3">
              {routing.matchReasons.slice(0, 3).map((r) => (
                <div key={r} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="text-terracotta-500 mt-0.5">—</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-12 md:col-span-5 flex md:flex-col md:items-end justify-between md:justify-start gap-3">
          {hasQuote ? (
            <>
              <div className="md:text-right">
                <div className="eyebrow text-ink-500 mb-1">Quote</div>
                {routing.quotePriceGbp ? (
                  <div className="font-display text-4xl tabular">£{routing.quotePriceGbp}</div>
                ) : (
                  <div className="font-display text-xl italic">See details</div>
                )}
                {routing.quoteReceivedAt && (
                  <div className="text-xs text-ink-500 mt-1">
                    Received {formatRelative(routing.quoteReceivedAt)}
                  </div>
                )}
              </div>
              <button
                onClick={onToggle}
                className="inline-flex items-center gap-2 px-4 py-2 border border-ink-900 text-sm hover:bg-ink-900 hover:text-paper-50 transition-colors"
              >
                <span>{expanded ? 'Hide' : 'Read the quote'}</span>
                {expanded ? (
                  <ChevronUp className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
                )}
              </button>
            </>
          ) : failed ? (
            <div className="flex items-center gap-2 text-xs text-terracotta-600">
              <AlertTriangle className="w-4 h-4" strokeWidth={1.5} />
              <span>Email delivery failed</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-ink-500">
              <Clock className="w-4 h-4" strokeWidth={1.5} />
              <span>Waiting for reply</span>
            </div>
          )}
        </div>
      </div>

      {expanded && hasQuote && routing.quoteBody && (
        <div className="border-t border-ink-900/15 p-5 md:p-6 bg-paper-50">
          <div className="eyebrow text-ink-500 mb-3">Message from {routing.hotelName}</div>
          <pre className="whitespace-pre-wrap font-sans text-sm text-ink-800 leading-relaxed max-w-reading">
            {routing.quoteBody}
          </pre>
          {routing.quoteFromEmail && (
            <div className="mt-6 pt-4 hairline flex flex-wrap items-center gap-3">
              <div className="text-xs text-ink-500">
                Reply direct to {routing.hotelName}:
              </div>
              <a
                href={`mailto:${routing.quoteFromEmail}?subject=Re%3A%20Stayward%20quote`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-ink-900 text-paper-50 text-sm hover:bg-terracotta-500 transition-colors"
              >
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                <span>Accept this quote</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    })
  } catch {
    return iso
  }
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function formatRelative(iso: string): string {
  try {
    const then = new Date(iso).getTime()
    const now = Date.now()
    const diffMin = Math.round((now - then) / 60000)
    if (diffMin < 1) return 'just now'
    if (diffMin < 60) return `${diffMin} min ago`
    const diffHr = Math.round(diffMin / 60)
    if (diffHr < 24) return `${diffHr} hr ago`
    return `${Math.round(diffHr / 24)} days ago`
  } catch {
    return ''
  }
}
