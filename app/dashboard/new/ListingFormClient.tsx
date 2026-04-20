'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'

const EXAMPLES = [
  'A quiet room in Paris with a deep soaking tub, fast wifi, for a 3-day work sprint.',
  'Somewhere on an island, off-grid, for a week with my partner. First week of June.',
  'Design-led Copenhagen under £300 with a canal view. Solo. Four nights.',
  'A silent place in Kyoto for our honeymoon, ideally with a private bath.',
]

export function ListingFormClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    rawQuery: '',
    city: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    rooms: '1',
    maxPriceGbp: '',
  })

  useEffect(() => {
    const cityParam = searchParams.get('city')
    const hotelParam = searchParams.get('hotel')
    if (cityParam || hotelParam) {
      setForm((f) => ({
        ...f,
        city: cityParam || f.city,
        rawQuery:
          !f.rawQuery && hotelParam
            ? `I'd like a quote for ${hotelParam.replace(/-/g, ' ')}${cityParam ? ` in ${cityParam}` : ''}. `
            : f.rawQuery,
      }))
    }
  }, [searchParams])

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function useExample(s: string) {
    update('rawQuery', s)
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawQuery: form.rawQuery,
          city: form.city || undefined,
          checkIn: form.checkIn || undefined,
          checkOut: form.checkOut || undefined,
          guests: form.guests ? parseInt(form.guests, 10) : undefined,
          rooms: form.rooms ? parseInt(form.rooms, 10) : undefined,
          maxPriceGbp: form.maxPriceGbp ? parseInt(form.maxPriceGbp, 10) : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      router.push(`/dashboard/listings/${data.listingId}/`)
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl">
      <div className="mb-10">
        <label htmlFor="rawQuery" className="eyebrow mb-3 block">
          What you're looking for
        </label>
        <div className="relative border border-ink-900/15 bg-paper-50 focus-within:border-ink-900 transition-colors">
          <div className="flex items-start gap-4 p-5 md:p-6">
            <Sparkles className="w-5 h-5 mt-1 text-terracotta-500 shrink-0" strokeWidth={1.5} />
            <textarea
              id="rawQuery"
              required
              autoFocus
              rows={4}
              value={form.rawQuery}
              onChange={(e) => update('rawQuery', e.target.value)}
              placeholder="Describe what you want. The way you'd tell a friend. We read the whole thing."
              className="flex-1 bg-transparent resize-none outline-none font-display text-xl md:text-2xl leading-snug placeholder:text-ink-400 placeholder:font-display placeholder:italic"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-ink-500 self-center mr-1">Or borrow one:</span>
          {EXAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => useExample(s)}
              className="text-xs px-3 py-1.5 border border-ink-900/15 text-ink-700 hover:border-ink-900 hover:bg-ink-900 hover:text-paper-50 transition-colors text-left max-w-sm truncate"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
        <div>
          <label htmlFor="city" className="eyebrow mb-2 block">
            City <span className="text-ink-400 normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="city"
            type="text"
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder="Leave blank and we'll infer from your description"
            className="w-full px-4 py-3 bg-paper-50 border border-ink-900/15 focus:border-ink-900 outline-none text-base"
          />
        </div>

        <div>
          <label htmlFor="maxPriceGbp" className="eyebrow mb-2 block">
            Max per night <span className="text-ink-400 normal-case tracking-normal">(GBP)</span>
          </label>
          <input
            id="maxPriceGbp"
            type="number"
            min={50}
            max={10000}
            value={form.maxPriceGbp}
            onChange={(e) => update('maxPriceGbp', e.target.value)}
            placeholder="e.g. 350"
            className="w-full px-4 py-3 bg-paper-50 border border-ink-900/15 focus:border-ink-900 outline-none text-base tabular"
          />
        </div>

        <div>
          <label htmlFor="checkIn" className="eyebrow mb-2 block">
            Check in <span className="text-ink-400 normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="checkIn"
            type="date"
            value={form.checkIn}
            onChange={(e) => update('checkIn', e.target.value)}
            className="w-full px-4 py-3 bg-paper-50 border border-ink-900/15 focus:border-ink-900 outline-none text-base tabular"
          />
        </div>

        <div>
          <label htmlFor="checkOut" className="eyebrow mb-2 block">
            Check out <span className="text-ink-400 normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="checkOut"
            type="date"
            value={form.checkOut}
            onChange={(e) => update('checkOut', e.target.value)}
            className="w-full px-4 py-3 bg-paper-50 border border-ink-900/15 focus:border-ink-900 outline-none text-base tabular"
          />
        </div>

        <div>
          <label htmlFor="guests" className="eyebrow mb-2 block">
            Guests
          </label>
          <input
            id="guests"
            type="number"
            min={1}
            max={50}
            value={form.guests}
            onChange={(e) => update('guests', e.target.value)}
            className="w-full px-4 py-3 bg-paper-50 border border-ink-900/15 focus:border-ink-900 outline-none text-base tabular"
          />
        </div>

        <div>
          <label htmlFor="rooms" className="eyebrow mb-2 block">
            Rooms
          </label>
          <input
            id="rooms"
            type="number"
            min={1}
            max={20}
            value={form.rooms}
            onChange={(e) => update('rooms', e.target.value)}
            className="w-full px-4 py-3 bg-paper-50 border border-ink-900/15 focus:border-ink-900 outline-none text-base tabular"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-terracotta-500/10 border-l-2 border-terracotta-500 text-sm text-ink-900">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
              <span>Routing to hotels…</span>
            </>
          ) : (
            <>
              <span>Send listing to hotels</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </>
          )}
        </button>

        <p className="text-xs text-ink-500 italic max-w-xs">
          We'll pick the 5 hotels that fit best. Quotes usually start within hours.
        </p>
      </div>
    </form>
  )
}
