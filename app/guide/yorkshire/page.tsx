import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getHotelsByRegion } from '@/data/hotels'

export const metadata: Metadata = {
  title: 'Yorkshire hotels',
  description: 'The best hotels in Yorkshire: The Star Inn at Harome, Middlethorpe Hall, Grantley Hall, Swinton Park. Editorial profiles of country-house, estate, and restaurant-with-rooms properties across North Yorkshire.',
  alternates: { canonical: '/guide/yorkshire/' },
}

export default function YorkshireGuide() {
  const hotels = getHotelsByRegion('yorkshire')

  return (
    <>
      <section className="container-edge pt-10 md:pt-16 pb-10">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-6">
            <Link href="/guide/" className="link-underline">Guide</Link>
            <span className="mx-2 text-ink-400">/</span>
            <span>Yorkshire</span>
          </div>
          <h1 className="font-display text-display-lg mb-5">Yorkshire.</h1>
          <p className="text-ink-700 text-lg leading-relaxed max-w-reading">
            Four properties that cover most of the range of contemporary Yorkshire hospitality. The Star Inn at Harome sits at the restaurant-with-rooms end of the scale, with chef Andrew Pern&apos;s Michelin-starred cooking in a rebuilt fourteenth-century thatched inn. Middlethorpe Hall is the National Trust-owned country-house option near York. Grantley Hall is the largest and most ambitious recent opening in the north of England, with four restaurants and one of the larger hotel spas in Britain. Swinton Park is the ancestral seat of the Earls of Swinton, set on a 20,000-acre family estate in the Dales.
          </p>
          <p className="text-ink-700 leading-relaxed max-w-reading mt-4">
            Between them, these four cover the main registers available in the region: thatched village inn, historic country house, contemporary resort, working ancestral estate. Yorkshire&apos;s luxury hotel market has grown substantially since the 2019 Grantley Hall opening, and the range of serious properties is now at its strongest in decades.
          </p>
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
        <div className="eyebrow mb-8">The hotels</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 max-w-5xl">
          {hotels.map((hotel) => (
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
          <div className="eyebrow mb-5">How Yorkshire rates work</div>
          <div className="space-y-4 text-ink-700 leading-relaxed">
            <p>
              The Yorkshire market runs on different seasonality from the London or coastal markets. York Races (five major race meetings between May and October, particularly the Ebor Festival in August) drive city-adjacent demand substantially; Middlethorpe Hall sits directly next to the racecourse and its commercial calendar is shaped by the race dates. The Yorkshire Dales and Moors run on walking and country-sport seasonality: August through October is the strongest period for Swinton Park and Grantley Hall for shooting parties; May through September is walking-focused.
            </p>
            <p>
              Private-rate flexibility is generally higher in Yorkshire than in London or the Cotswolds, partly because the region has less international leisure demand and more domestic weekday travel. Midweek stays in January to March and November have the most room to negotiate; weekend racedays at York, the Ebor Festival, and the Yorkshire Game Fair tighten availability and rates correspondingly.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/plan/" className="btn-primary">Send us a brief</Link>
            <Link href="/guide/scotland/" className="btn-ghost">Scotland hotels</Link>
          </div>
        </div>
      </section>
    </>
  )
}
