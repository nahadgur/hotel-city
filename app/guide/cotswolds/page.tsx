import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getHotelsByRegion } from '@/data/hotels'

export const metadata: Metadata = {
  title: 'Cotswolds hotels',
  description: 'The hotels of the Cotswolds: Soho Farmhouse, Thyme, The Lygon Arms, Barnsley House, The Wild Rabbit. Editorial profiles of country-house and farm-estate properties in Oxfordshire, Gloucestershire, and Worcestershire.',
  alternates: { canonical: '/guide/cotswolds/' },
}

export default function CotswoldsGuide() {
  const cotswoldsHotels = getHotelsByRegion('cotswolds')

  return (
    <>
      <section className="container-edge pt-10 md:pt-16 pb-10">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-6">
            <Link href="/guide/" className="link-underline">Guide</Link>
            <span className="mx-2 text-ink-400">/</span>
            <span>Cotswolds</span>
          </div>
          <h1 className="font-display text-display-lg mb-5">The Cotswolds.</h1>
          <p className="text-ink-700 text-lg leading-relaxed max-w-reading">
            A 90-mile stretch of limestone hills running through Oxfordshire, Gloucestershire, and Worcestershire, designated an Area of Outstanding Natural Beauty, and home to the most concentrated collection of notable country-house and farm-estate hotels in England. The hotels profiled here represent the modern Cotswolds hospitality market, which has shifted substantially since 2015.
          </p>
          <p className="text-ink-700 leading-relaxed max-w-reading mt-4">
            Two operational models dominate: the group-operated, design-led properties that opened in the past decade (Soho Farmhouse, the former Barnsley House now transitioning to THE PIG) and the long-established country-house and coaching-inn properties that have been here much longer (The Lygon Arms, which has operated since the sixteenth century). Thyme and The Wild Rabbit sit between these two poles.
          </p>
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
        <div className="eyebrow mb-8">The hotels</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 max-w-5xl">
          {cotswoldsHotels.map((hotel) => (
            <Link
              key={hotel.slug}
              href={`/hotels/${hotel.slug}/`}
              className="group block border-t border-ink-900/15 pt-6 hover:border-ink-900 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="font-display text-2xl md:text-3xl leading-tight">
                  {hotel.name}
                </h2>
                <ArrowUpRight className="w-5 h-5 mt-1 text-ink-400 group-hover:text-terracotta-500 transition-colors shrink-0" strokeWidth={1.5} />
              </div>
              <div className="text-xs text-ink-500 uppercase tracking-wider mb-3 tabular">
                {hotel.city}
              </div>
              <p className="text-sm text-ink-700 leading-relaxed italic font-display">
                {hotel.oneLiner}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
        <div className="max-w-reading">
          <div className="eyebrow mb-5">How Cotswolds rates work</div>
          <div className="space-y-4 text-ink-700 leading-relaxed">
            <p>
              Cotswolds hotels operate under rate parity with the major booking channels in the same way their London counterparts do, but the private-rate conversation is different. Several of the properties here are family-owned or small-group operated rather than part of international chains, which means the commercial structure is less rigid and the negotiation happens property by property.
            </p>
            <p>
              Seasonality is more pronounced than in London. Summer weekends (June through September) routinely run at full occupancy across the better properties, and private-rate flexibility on those dates is minimal. January through March, midweek stays in autumn, and the shoulder weeks either side of Christmas are when Cotswolds private rates move most noticeably; we have seen 20 to 30 per cent reductions on shoulder-season stays at properties that are 90 per cent full in August.
            </p>
            <p>
              The other variable specific to the region is length of stay. Cotswolds hotels are typically booked for two to three nights rather than one, and rates that are rigid for a single night often become negotiable for three or four.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/plan/" className="btn-primary">
              Send us a brief
            </Link>
            <Link href="/guide/london/" className="btn-ghost">
              London hotels
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
