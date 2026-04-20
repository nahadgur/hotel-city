import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getHotelsByRegion } from '@/data/hotels'
import { collectionPageSchema, breadcrumbSchema, jsonLdScript } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Cornwall hotels',
  description: 'The best hotels in Cornwall: The Headland Newquay, The Idle Rocks St Mawes. Editorial profiles of coastal and harbourside luxury hotels in Cornwall.',
  alternates: { canonical: '/guide/cornwall/' },
}

export default function CornwallGuide() {
  const hotels = getHotelsByRegion('cornwall')

  const schemas = [
    collectionPageSchema({
      name: 'Cornwall hotels',
      description: 'Editorial profiles of Cornwall hotels.',
      url: '/guide/cornwall/',
      numberOfItems: hotels.length,
    }),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Guide', url: '/guide/' },
      { name: 'Cornwall', url: '/guide/cornwall/' },
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
            <span>Cornwall</span>
          </div>
          <h1 className="font-display text-display-lg mb-5">Cornwall.</h1>
          <p className="text-ink-700 text-lg leading-relaxed max-w-reading">
            Cornwall&apos;s luxury hotel market is less dense than London or the Cotswolds; the properties here are spread across the coastline and the character of a stay depends substantially on which coastal stretch you choose. The north coast around Newquay is exposed and Atlantic-facing, with the major surfing beaches; the south coast, and the Roseland Peninsula in particular, is sheltered, harbour-dominated, and closer to the vernacular character of small Cornish fishing villages.
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
          <div className="eyebrow mb-5">How Cornwall rates work</div>
          <div className="space-y-4 text-ink-700 leading-relaxed">
            <p>
              Cornwall is the most seasonally extreme of the British luxury markets we cover. July and August, particularly the second half of July through the end of August when school holidays are running, see rates roughly double winter levels and most serious Cornish hotels run at or near full occupancy. September and early October (warm weather, no school holidays) are often the best combination of conditions and availability. November through early April is genuinely low season with substantial rate flexibility.
            </p>
            <p>
              Train access from London runs via Paddington to Truro (four and a half hours) or onward to Penzance, Newquay, and other Cornish stations. The train is practical but slow; most guests drive. The drive from London is five to six hours to west Cornwall and traffic on summer weekends can extend this substantially.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/plan/" className="btn-primary">
              Send us a brief
            </Link>
            <Link href="/guide/lake-district/" className="btn-ghost">
              Lake District hotels
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
