import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getHotelsByRegion } from '@/data/hotels'

export const metadata: Metadata = {
  title: 'Lake District hotels',
  description: 'The best hotels in the Lake District: Gilpin Hotel, Another Place The Lake, Linthwaite House. Editorial profiles of country-house and lakeshore properties in Cumbria.',
  alternates: { canonical: '/guide/lake-district/' },
}

export default function LakeDistrictGuide() {
  const hotels = getHotelsByRegion('lake-district')

  return (
    <>
      <section className="container-edge pt-10 md:pt-16 pb-10">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-6">
            <Link href="/guide/" className="link-underline">Guide</Link>
            <span className="mx-2 text-ink-400">/</span>
            <span>Lake District</span>
          </div>
          <h1 className="font-display text-display-lg mb-5">The Lake District.</h1>
          <p className="text-ink-700 text-lg leading-relaxed max-w-reading">
            The hotels here sit in three different operational registers: Gilpin (family-owned, Michelin-starred, inland country-house), Another Place (contemporary lakeshore resort with a family focus), and Linthwaite House (Leeu Collection country-house with Simon Rogan&apos;s cooking). The best Lake District stays are shaped more by which lake and which elevation than by the hotel itself; the three here cover three different positions relative to Windermere and Ullswater.
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
          <div className="eyebrow mb-5">How Lake District rates work</div>
          <div className="space-y-4 text-ink-700 leading-relaxed">
            <p>
              Lake District hotels operate on a strongly seasonal curve, heavier than London and closer to the pattern of Cotswolds and Scottish rural properties. Summer and school holidays (July, August, October half-term) run at or near full occupancy across the better properties; private-rate flexibility in these weeks is minimal. Winter midweek stays (January to March, November, and early December) are substantially more negotiable, often 20 to 30 per cent below summer rates.
            </p>
            <p>
              The hotel-by-hotel variation matters. Gilpin is tightly family-managed and slower to negotiate; Another Place&apos;s larger room count and more contemporary operational model means more commercial flexibility; Linthwaite under Leeu Collection is moderately flexible. We adjust our approach per property.
            </p>
            <p>
              Lake District train access from London is better than most British rural destinations. Euston to Windermere via Oxenholme takes approximately three hours. Penrith (for Ullswater hotels) is three hours and fifteen minutes direct. Both are practical for a weekend.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/plan/" className="btn-primary">
              Send us a brief
            </Link>
            <Link href="/guide/cotswolds/" className="btn-ghost">
              Cotswolds hotels
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
