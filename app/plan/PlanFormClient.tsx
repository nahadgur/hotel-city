'use client'

import { useState, useRef, FormEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { DateRangePicker } from './DateRangePicker'

const HOTEL_NAMES: Record<string, string> = {
  'the-savoy-london': 'The Savoy, London',
  'claridges-london': "Claridge's, London",
  'the-connaught-london': 'The Connaught, London',
  'the-ritz-london': 'The Ritz London',
  'the-dorchester-london': 'The Dorchester, London',
  'the-langham-london': 'The Langham, London',
  'browns-hotel-london': "Brown's Hotel, London",
  'the-goring-london': 'The Goring, London',
  'the-lanesborough-london': 'The Lanesborough, London',
  'the-berkeley-london': 'The Berkeley, London',
  'the-ned-london': 'The Ned, London',
  'chiltern-firehouse-london': 'Chiltern Firehouse, London',
  'the-beaumont-london': 'The Beaumont, London',
  'rosewood-london': 'Rosewood London',
  '45-park-lane-london': '45 Park Lane, London',
  'mandarin-oriental-hyde-park-london': 'Mandarin Oriental Hyde Park, London',
  'soho-farmhouse-cotswolds': 'Soho Farmhouse, Cotswolds',
  'thyme-cotswolds': 'Thyme, Cotswolds',
  'the-lygon-arms-cotswolds': 'The Lygon Arms, Cotswolds',
  'barnsley-house-cotswolds': 'Barnsley House, Cotswolds',
  'the-wild-rabbit-cotswolds': 'The Wild Rabbit, Cotswolds',
  'dormy-house-cotswolds': 'Dormy House, Cotswolds',
  'the-slaughters-manor-house-cotswolds': 'The Slaughters Manor House, Cotswolds',
  'gleneagles-scotland': 'Gleneagles, Perthshire',
  'the-fife-arms-scotland': 'The Fife Arms, Braemar',
  'the-balmoral-scotland': 'The Balmoral, Edinburgh',
  'cromlix-scotland': 'Cromlix, Perthshire',
  'inverlochy-castle-scotland': 'Inverlochy Castle, Fort William',
  'the-torridon-scotland': 'The Torridon, Wester Ross',
  'gilpin-hotel-lake-district': 'Gilpin Hotel & Lake House, Lake District',
  'another-place-lake-district': 'Another Place, The Lake, Lake District',
  'linthwaite-house-lake-district': 'Linthwaite House, Lake District',
  'the-headland-cornwall': 'The Headland, Newquay',
  'the-idle-rocks-cornwall': 'The Idle Rocks, St Mawes',
  'watergate-bay-cornwall': 'Watergate Bay Hotel, Cornwall',
  'hotel-tresanton-cornwall': 'Hotel Tresanton, St Mawes',
  'the-nare-cornwall': 'The Nare, Cornwall',
  'the-star-at-harome-yorkshire': 'The Star Inn at Harome, Yorkshire',
  'middlethorpe-hall-yorkshire': 'Middlethorpe Hall, York',
  'grantley-hall-yorkshire': 'Grantley Hall, Yorkshire',
  'swinton-park-yorkshire': 'Swinton Park, Yorkshire',
  'the-royal-crescent-bath': 'The Royal Crescent Hotel & Spa, Bath',
  'macdonald-bath-spa-other': 'Macdonald Bath Spa Hotel, Bath',
  'the-randolph-oxford': 'The Randolph Hotel, Oxford',
  'old-parsonage-oxford': 'Old Parsonage Hotel, Oxford',
  'chewton-glen-other': 'Chewton Glen, New Forest',
  'hartwell-house-other': 'Hartwell House, Buckinghamshire',
  'le-manoir-aux-quat-saisons-other': "Le Manoir aux Quat'Saisons, Oxfordshire",
}

const EXAMPLES = [
  'A quiet room in Paris with a deep soaking tub, fast wifi, for a 3-day work sprint.',
  'Somewhere on an island, off-grid, for a week with my partner. First week of June.',
  'Design-led Copenhagen under \u00a3300 with a canal view. Solo. Four nights.',
  'A silent place in Kyoto for our honeymoon, ideally with a private bath.',
]

export function PlanFormClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [form, setForm] = useState({
    rawQuery: '',
    name: '',
    email: '',
    city: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    rooms: '1',
    maxPriceGbp: '',
  })

  useEffect(() => {
    const hotelSlug = searchParams?.get('hotel')
    if (hotelSlug && HOTEL_NAMES[hotelSlug]) {
      const hotelName = HOTEL_NAMES[hotelSlug]
      setForm((f) => ({
        ...f,
        rawQuery: f.rawQuery || `Looking for a private rate quote for ${hotelName}. `,
        city: f.city || 'London',
      }))
      setTimeout(() => {
        const el = textareaRef.current
        if (el) {
          el.focus()
          const len = el.value.length
          el.setSelectionRange(len, len)
        }
      }, 50)
    }
  }, [searchParams])

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function useExample(s: string) {
    update('rawQuery', s)
    textareaRef.current?.focus()
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/plan/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawQuery: form.rawQuery,
          name: form.name || undefined,
          email: form.email || undefined,
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

      try {
        sessionStorage.setItem(
          'stayward:last-brief',
          JSON.stringify({
            rawQuery: form.rawQuery,
            name: form.name,
            email: form.email,
            city: form.city,
            checkIn: form.checkIn,
            checkOut: form.checkOut,
            guests: form.guests,
            rooms: form.rooms,
            maxPriceGbp: form.maxPriceGbp,
          })
        )
      } catch {
        // sessionStorage blocked, fine
      }

      router.push('/plan/received/')
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl">
      <div className="mb-10">
        <label htmlFor="rawQuery" className="eyebrow mb-3 block">
          What you&apos;re looking for
        </label>
        <div className="relative border border-ink-900/15 bg-paper-50 focus-within:border-ink-900 transition-colors">
          <div className="flex items-start gap-4 p-5 md:p-6">
            <Sparkles className="w-5 h-5 mt-1 text-terracotta-500 shrink-0" strokeWidth={1.5} />
            <textarea
              ref={textareaRef}
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
          <label htmlFor="name" className="eyebrow mb-2 block">
            Your name <span className="text-ink-400 normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="First name is fine"
            className="w-full px-4 py-3 bg-paper-50 border border-ink-900/15 focus:border-ink-900 outline-none text-base"
          />
        </div>

        <div>
          <label htmlFor="email" className="eyebrow mb-2 block">
            Your email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@domain.com"
            className="w-full px-4 py-3 bg-paper-50 border border-ink-900/15 focus:border-ink-900 outline-none text-base"
          />
        </div>

        <div className="md:col-span-2">
          <DateRangePicker
            checkIn={form.checkIn}
            checkOut={form.checkOut}
            onChange={(r) => setForm((f) => ({ ...f, checkIn: r.checkIn, checkOut: r.checkOut }))}
          />
        </div>

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
            Max per night <span className="text-ink-400 normal-case tracking-normal">(GBP, optional)</span>
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
              <span>Sending to the team&hellip;</span>
            </>
          ) : (
            <>
              <span>Send your brief</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </>
          )}
        </button>

        <p className="text-xs text-ink-500 italic max-w-xs">
          We&apos;ll read it and reply with quotes within 24 hours.
        </p>
      </div>
    </form>
  )
}
