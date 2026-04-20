'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

type Brief = {
  rawQuery?: string
  email?: string
  city?: string
  checkIn?: string
  checkOut?: string
  guests?: string
  rooms?: string
  maxPriceGbp?: string
}

function formatDate(iso?: string): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  } catch {
    return iso
  }
}

export function ReceivedClient() {
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('stayward:last-brief')
      if (raw) setBrief(JSON.parse(raw) as Brief)
    } catch {
      // ignore
    }
    setLoaded(true)
  }, [])

  if (!loaded) {
    return <div className="h-32 bg-paper-100 animate-pulse" />
  }

  return (
    <div className="max-w-2xl">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sage-500/10 border border-sage-500/30 text-sage-600 text-xs mb-8">
        <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span className="uppercase tracking-wider">Brief received</span>
      </div>

      <h1 className="font-display text-display-lg mb-4">
        We\'ve got it. Expect a reply within 24 hours.
      </h1>
      <p className="text-ink-700 leading-relaxed mb-10 max-w-reading">
        A real person on the Stayward team is reading your brief now. We\'ll reach out to the hotels that fit and email you quotes{brief?.email ? ` at ${brief.email}` : ''}, usually within a day during business hours.
      </p>

      {brief?.rawQuery && (
        <div className="border-l-2 border-terracotta-500 bg-paper-50 p-6 md:p-8 mb-10">
          <div className="eyebrow mb-3 text-ink-500">What you sent us</div>
          <p className="font-display italic text-xl md:text-2xl leading-snug text-ink-900 mb-6 max-w-reading">
            &ldquo;{brief.rawQuery}&rdquo;
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-sm">
            {brief.city && (
              <div>
                <div className="eyebrow mb-1 text-ink-500">City</div>
                <div className="text-ink-900">{brief.city}</div>
              </div>
            )}
            {brief.checkIn && brief.checkOut && (
              <div className="col-span-2">
                <div className="eyebrow mb-1 text-ink-500">Dates</div>
                <div className="text-ink-900 tabular">
                  {formatDate(brief.checkIn)} &rarr; {formatDate(brief.checkOut)}
                </div>
              </div>
            )}
            {brief.guests && (
              <div>
                <div className="eyebrow mb-1 text-ink-500">Guests</div>
                <div className="text-ink-900 tabular">{brief.guests}</div>
              </div>
            )}
            {brief.rooms && (
              <div>
                <div className="eyebrow mb-1 text-ink-500">Rooms</div>
                <div className="text-ink-900 tabular">{brief.rooms}</div>
              </div>
            )}
            {brief.maxPriceGbp && (
              <div>
                <div className="eyebrow mb-1 text-ink-500">Max / night</div>
                <div className="text-ink-900 tabular">\u00a3{brief.maxPriceGbp}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center">
        <Link href="/" className="btn-ghost">
          <span>Back to the homepage</span>
          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
        </Link>
        <p className="text-xs text-ink-500 italic">
          Keep an eye on your inbox. If you don\'t hear back within 24 hours, drop us a line at hello@stayward.co.
        </p>
      </div>
    </div>
  )
}
