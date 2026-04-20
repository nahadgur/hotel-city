'use client'

import { useState, useEffect, useCallback, FormEvent } from 'react'
import Link from 'next/link'
import {
  Check,
  Clock,
  Mail,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  Send,
  Building2,
  User,
  Info,
} from 'lucide-react'

type Listing = {
  id: string
  title: string | null
  rawQuery: string
  city: string | null
  checkIn: string | null
  checkOut: string | null
  guests: number | null
  rooms: number | null
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
  messageCount: number
  hotelMessageCount: number
  latestMessageAt: string | null
  latestMessagePriceGbp: number | null
}

type Message = {
  id: string
  createdAt: string
  sender: 'customer' | 'hotel' | 'system'
  fromEmail: string | null
  bodyText: string
  parsedPriceGbp: number | null
  sentVia: 'email' | 'dashboard'
}

type Props = {
  listing: Listing
  initialRoutings: Routing[]
  initialMessagesByRouting: Record<string, Message[]>
}

const POLL_INTERVAL_MS = 20_000

export function ListingDetailClient({
  listing,
  initialRoutings,
  initialMessagesByRouting,
}: Props) {
  const [routings, setRoutings] = useState<Routing[]>(initialRoutings)
  const [messagesByRouting, setMessagesByRouting] = useState<Record<string, Message[]>>(
    initialMessagesByRouting
  )
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date>(new Date())

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/listings/${listing.id}`, { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data.routings)) setRoutings(data.routings)
      if (data.messagesByRouting && typeof data.messagesByRouting === 'object') {
        setMessagesByRouting(data.messagesByRouting)
      }
      setLastFetched(new Date())
    } catch {
      // silent
    }
  }, [listing.id])

  useEffect(() => {
    const t = setInterval(refresh, POLL_INTERVAL_MS)
    return () => clearInterval(t)
  }, [refresh])

  const quotesIn = routings.filter((r) => r.hotelMessageCount > 0).length
  const totalRoutings = routings.length

  return (
    <>
      {/* HEADER */}
      <section className="bg-ink-900 text-paper-50">
        <div className="container-edge py-10 md:py-14">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link href="/dashboard/" className="text-xs text-paper-300 link-underline">
              ← All listings
            </Link>
            <span className="text-paper-400">·</span>
            <StatusPill quotesIn={quotesIn} total={totalRoutings} />
          </div>

          <p className="font-display italic text-2xl md:text-3xl max-w-reading leading-snug mb-6">
            "{listing.rawQuery}"
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-3xl">
            {listing.city && (
              <InfoPair label="City" value={listing.city} />
            )}
            {listing.checkIn && listing.checkOut && (
              <InfoPair
                label="Dates"
                value={`${formatDate(listing.checkIn)} – ${formatDate(listing.checkOut)}`}
                mono
              />
            )}
            {listing.guests != null && (
              <InfoPair label="Guests" value={String(listing.guests)} mono />
            )}
            {listing.rooms != null && listing.rooms > 1 && (
              <InfoPair label="Rooms" value={String(listing.rooms)} mono />
            )}
            {listing.maxPriceGbp && (
              <InfoPair label="Max / night" value={`£${listing.maxPriceGbp}`} mono />
            )}
          </div>
        </div>
      </section>

      {/* PROGRESS */}
      <section className="bg-paper-50 hairline">
        <div className="container-edge py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-ink-700">
              <Mail className="w-4 h-4 text-sage-500" strokeWidth={1.5} />
              <span>
                <span className="tabular">{totalRoutings}</span> hotels contacted
              </span>
              <span className="text-ink-400 mx-1">·</span>
              <Sparkles className="w-4 h-4 text-terracotta-500" strokeWidth={1.5} />
              <span>
                <span className="tabular font-medium">{quotesIn}</span> replied
              </span>
            </div>
            <div className="text-xs text-ink-500 italic hidden md:block">
              Refreshing · last checked {formatTime(lastFetched)}
            </div>
          </div>
        </div>
      </section>

      {/* ROUTINGS + THREADS */}
      <section className="container-edge py-section">
        {routings.length === 0 ? (
          <div className="max-w-reading">
            <h2 className="font-display text-display-md mb-4">No hotels routed.</h2>
            <p className="text-ink-700 leading-relaxed">
              This shouldn't happen. Try creating a new listing, or contact us.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="eyebrow mb-3">
                {quotesIn > 0
                  ? `${quotesIn} ${quotesIn === 1 ? 'reply' : 'replies'}`
                  : 'Routed to'}
              </div>
              <h2 className="font-display text-display-md max-w-reading">
                {quotesIn === 0
                  ? 'Waiting for the hotels to reply.'
                  : quotesIn === totalRoutings
                  ? 'All hotels replied. Pick one and message them.'
                  : 'Replies are rolling in. Open any card to read or reply.'}
              </h2>
              {quotesIn === 0 && (
                <p className="mt-3 text-sm text-ink-500 italic max-w-reading">
                  Most replies arrive within a few hours during business hours.
                  We'll email you each time.
                </p>
              )}
            </div>

            <div className="space-y-4">
              {routings.map((r) => (
                <RoutingCard
                  key={r.id}
                  listingId={listing.id}
                  routing={r}
                  messages={messagesByRouting[r.id] ?? []}
                  expanded={expandedId === r.id}
                  onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  onMessageSent={refresh}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}

function InfoPair({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="eyebrow text-paper-300 mb-1">{label}</div>
      <div className={mono ? 'text-base tabular' : 'text-base'}>{value}</div>
    </div>
  )
}

function StatusPill({ quotesIn, total }: { quotesIn: number; total: number }) {
  if (quotesIn === 0) {
    return (
      <div className="inline-flex items-center gap-2 text-xs text-paper-300 px-2.5 py-1 border border-paper-50/20">
        <Clock className="w-3 h-3" strokeWidth={1.5} />
        <span>Routing</span>
      </div>
    )
  }
  if (quotesIn < total) {
    return (
      <div className="inline-flex items-center gap-2 text-xs text-terracotta-400 px-2.5 py-1 border border-terracotta-400/30 bg-terracotta-500/10">
        <Sparkles className="w-3 h-3" strokeWidth={1.5} />
        <span>
          {quotesIn} of {total} replied
        </span>
      </div>
    )
  }
  return (
    <div className="inline-flex items-center gap-2 text-xs text-sage-500 px-2.5 py-1 border border-sage-500/30 bg-sage-500/10">
      <Check className="w-3 h-3" strokeWidth={1.5} />
      <span>All replied</span>
    </div>
  )
}

function RoutingCard({
  listingId,
  routing,
  messages,
  expanded,
  onToggle,
  onMessageSent,
}: {
  listingId: string
  routing: Routing
  messages: Message[]
  expanded: boolean
  onToggle: () => void
  onMessageSent: () => void
}) {
  const hasReply = routing.hotelMessageCount > 0
  const failed = routing.emailStatus === 'failed'
  // Find the latest hotel message for the summary price
  const latestHotelMsg = [...messages].reverse().find((m) => m.sender === 'hotel')
  const displayPrice = latestHotelMsg?.parsedPriceGbp ?? routing.latestMessagePriceGbp

  return (
    <div
      className={`border transition-colors ${
        hasReply
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
              target="_blank"
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
          {hasReply ? (
            <>
              <div className="md:text-right">
                <div className="eyebrow text-ink-500 mb-1">Direct quote</div>
                {displayPrice ? (
                  <div className="font-display text-4xl tabular">£{displayPrice}</div>
                ) : (
                  <div className="font-display text-xl italic">Open to read</div>
                )}
                {routing.latestMessageAt && (
                  <div className="text-xs text-ink-500 mt-1">
                    {formatRelative(routing.latestMessageAt)}
                  </div>
                )}
              </div>
              <button
                onClick={onToggle}
                className="inline-flex items-center gap-2 px-4 py-2 border border-ink-900 text-sm hover:bg-ink-900 hover:text-paper-50 transition-colors"
              >
                <span>{expanded ? 'Hide thread' : 'Open thread'}</span>
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

      {expanded && (
        <Thread
          listingId={listingId}
          routingId={routing.id}
          hotelName={routing.hotelName}
          messages={messages}
          onMessageSent={onMessageSent}
          canReply={hasReply}
        />
      )}
    </div>
  )
}

function Thread({
  listingId,
  routingId,
  hotelName,
  messages,
  onMessageSent,
  canReply,
}: {
  listingId: string
  routingId: string
  hotelName: string
  messages: Message[]
  onMessageSent: () => void
  canReply: boolean
}) {
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendReply(e: FormEvent) {
    e.preventDefault()
    if (!reply.trim() || sending) return
    setError(null)
    setSending(true)
    try {
      const res = await fetch(`/api/listings/${listingId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routingId, bodyText: reply.trim() }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error || 'Failed to send.')
        setSending(false)
        return
      }
      setReply('')
      setSending(false)
      onMessageSent()
    } catch {
      setError('Network error. Try again.')
      setSending(false)
    }
  }

  // Filter out system messages for the primary stream (display them inline separately)
  const visibleMessages = messages

  return (
    <div className="border-t border-ink-900/15 bg-paper-50">
      {/* Thread history */}
      <div className="p-5 md:p-6 space-y-4">
        {visibleMessages.length === 0 ? (
          <div className="text-sm text-ink-500 italic text-center py-6">
            No messages yet.
          </div>
        ) : (
          visibleMessages.map((m) => <MessageBubble key={m.id} message={m} hotelName={hotelName} />)
        )}
      </div>

      {/* Reply box */}
      {canReply && (
        <div className="border-t border-ink-900/15 p-5 md:p-6 bg-paper-100">
          <form onSubmit={sendReply}>
            <label className="eyebrow mb-2 block text-ink-500">
              Reply to {hotelName}
            </label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Accept the quote, ask a question, negotiate…"
              rows={4}
              className="w-full p-4 bg-paper-50 border border-ink-900/15 focus:border-ink-900 outline-none text-base resize-none"
            />
            {error && (
              <div className="mt-3 p-3 bg-terracotta-500/10 border-l-2 border-terracotta-500 text-sm">
                {error}
              </div>
            )}
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-ink-500 italic">
                Your message is sent by email. {hotelName} will reply to your Stayward thread.
              </p>
              <button
                type="submit"
                disabled={!reply.trim() || sending}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink-900 text-paper-50 text-sm hover:bg-terracotta-500 transition-colors disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                    <span>Sending…</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" strokeWidth={1.5} />
                    <span>Send reply</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function MessageBubble({ message, hotelName }: { message: Message; hotelName: string }) {
  if (message.sender === 'system') {
    return (
      <div className="flex items-center gap-2 text-xs text-ink-500 italic py-2 border-b border-ink-900/5 last:border-none">
        <Info className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span>{message.bodyText}</span>
        <span className="ml-auto">{formatTime(new Date(message.createdAt))}</span>
      </div>
    )
  }

  const isHotel = message.sender === 'hotel'
  const Icon = isHotel ? Building2 : User

  return (
    <div className={`flex gap-3 ${isHotel ? '' : 'md:flex-row-reverse'}`}>
      <div className="shrink-0">
        <div
          className={`w-8 h-8 flex items-center justify-center border ${
            isHotel
              ? 'bg-paper-50 border-ink-900/20 text-ink-700'
              : 'bg-ink-900 border-ink-900 text-paper-50'
          }`}
        >
          <Icon className="w-4 h-4" strokeWidth={1.5} />
        </div>
      </div>
      <div className={`flex-1 max-w-2xl ${isHotel ? '' : 'md:text-right'}`}>
        <div className={`flex items-baseline gap-2 mb-1 ${isHotel ? '' : 'md:justify-end'}`}>
          <div className="text-xs font-medium text-ink-900">
            {isHotel ? hotelName : 'You'}
          </div>
          <div className="text-xs text-ink-500">{formatRelative(message.createdAt)}</div>
        </div>
        <div
          className={`p-4 whitespace-pre-wrap text-sm leading-relaxed ${
            isHotel
              ? 'bg-paper-50 border border-ink-900/10'
              : 'bg-ink-900 text-paper-50 border border-ink-900'
          }`}
        >
          {message.bodyText}
        </div>
        {message.parsedPriceGbp && isHotel && (
          <div className="mt-2 inline-flex items-center gap-2 text-xs text-terracotta-600">
            <Sparkles className="w-3 h-3" strokeWidth={1.5} />
            <span>Quote: £{message.parsedPriceGbp}</span>
          </div>
        )}
      </div>
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

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
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
    return `${Math.round(diffHr / 24)}d ago`
  } catch {
    return ''
  }
}
