import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getHotelsByRegion } from '@/data/hotels'
import { collectionPageSchema, breadcrumbSchema, jsonLdScript } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'London hotels',
  description: 'The grand hotels of London, profiled. The Savoy, Claridge\'s, The Connaught, The Ritz, The Dorchester, The Langham. History, architecture, and what each is actually like to stay in.',
  alternates: { canonical: '/guide/london/' },
}

export default function LondonGuide() {
  const londonHotels = getHotelsByRegion('london')

  
  const schemas = [
    collectionPageSchema({
      name: 'London hotels',
      description: 'Editorial profiles of London hotels.',
      url: '/guide/london/',
      numberOfItems: londonHotels.length,
    }),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Guide', url: '/guide/' },
      { name: 'London', url: '/guide/london/' },
    ]),
  ]

return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(schemas)} />

      <section className="container-edge pt-10 md:pt-16 pb-10">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-6">
            <Link href="/guide/" className="link-underline">Guide</Link>
            <span className="mx-2 text-ink-400">/</span>
            <span>London</span>
          </div>
          <h1 className="font-display text-display-lg mb-5">London.</h1>
          <p className="text-ink-700 text-lg leading-relaxed max-w-reading">
            The grand hotels of London, by which we mean the six or seven properties that occupy the top of the category and have done for between 60 and 160 years. The Savoy on the Strand. Claridge&apos;s, The Connaught, and The Dorchester across Mayfair. The Ritz on Piccadilly. The Langham at the top of Regent Street. Each is a genuinely different institution; the hotels have more in common with their own histories than with each other.
          </p>
          <p className="text-ink-700 leading-relaxed max-w-reading mt-4">
            These profiles are descriptive rather than evaluative. We do not rank them. We tell you what each one is, what it suits, and what it does not.
          </p>
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
        <div className="eyebrow mb-8">The grand hotels</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 max-w-5xl">
          {londonHotels.map((hotel) => (
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
                {hotel.openedYear.split(';')[0]}
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
          <div className="eyebrow mb-5">A note on how London grand hotels price themselves</div>
          <div className="space-y-4 text-ink-700 leading-relaxed">
            <p>
              All six of the hotels we profile here operate on strict rate parity with Booking.com, Expedia, and the other major aggregators. This is why a search on any of those sites returns the same headline rate as the hotel&apos;s own website. Parity is enforced contractually, audited automatically, and penalised heavily.
            </p>
            <p>
              The exception, written into every major OTA contract, is a private rate: a price offered directly to an individual traveller, not listed on any public channel. Private rates at London grand hotels typically run 8 to 22 per cent below the public parity rate on shoulder-season midweek dates, sometimes with added breakfast, late checkout, or a room-category upgrade. The hotels closer to capacity (Claridge&apos;s, The Connaught) tend to be less flexible; the larger-footprint hotels (The Langham, The Dorchester) tend to have more room to move.
            </p>
            <p>
              We ask on your behalf and forward what comes back. That is what this site is.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/plan/" className="btn-primary">
              Send us a brief
            </Link>
            <Link href="/guide/rate-parity/" className="btn-ghost">
              How rate parity works
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
