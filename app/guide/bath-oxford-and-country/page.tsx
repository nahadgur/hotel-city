import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getHotelsByRegion } from '@/data/hotels'
import { collectionPageSchema, breadcrumbSchema, jsonLdScript } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Bath, Oxford and country-house hotels',
  description: 'The best hotels in Bath, Oxford, and the surrounding English country: The Royal Crescent, The Randolph, Old Parsonage, Chewton Glen, Hartwell House, Le Manoir aux Quat\'Saisons. Editorial profiles of heritage and country-house properties outside our regional hubs.',
  alternates: { canonical: '/guide/bath-oxford-and-country/' },
}

export default function OtherGuide() {
  const hotels = getHotelsByRegion('other')

  const schemas = [
    collectionPageSchema({
      name: 'Bath, Oxford and country-house hotels',
      description: 'Editorial profiles of Bath, Oxford and country-house hotels.',
      url: '/guide/bath-oxford-and-country/',
      numberOfItems: hotels.length,
    }),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Guide', url: '/guide/' },
      { name: 'Bath, Oxford and country', url: '/guide/bath-oxford-and-country/' },
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
            <span>Bath, Oxford and country-house</span>
          </div>
          <h1 className="font-display text-display-lg mb-5">Bath, Oxford, and the country.</h1>
          <p className="text-ink-700 text-lg leading-relaxed max-w-reading">
            Seven properties that sit outside our main regional hubs but belong in the same category of British hotel. Bath and Oxford together account for three urban heritage hotels (The Royal Crescent, The Randolph, Old Parsonage) where the building is a significant part of the stay. The remaining four are rural country-house properties scattered across southern England: Chewton Glen in the New Forest, Hartwell House in Buckinghamshire, Le Manoir aux Quat&apos;Saisons in Oxfordshire, and Macdonald Bath Spa at the edge of Bath.
          </p>
          <p className="text-ink-700 leading-relaxed max-w-reading mt-4">
            Several of these properties are among the most historically significant hotels in Britain. The Royal Crescent occupies the most architecturally important residential address outside London. Hartwell House was the exile residence of Louis XVIII of France. Le Manoir has held two Michelin stars continuously since 1984. The Randolph has been the defining Oxford hotel since 1866. These are hotels where the building&apos;s story is not decoration but substance.
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
          <div className="eyebrow mb-5">How rates work outside the main regions</div>
          <div className="space-y-4 text-ink-700 leading-relaxed">
            <p>
              These hotels operate across several commercial registers. Le Manoir is among the least rate-flexible in this list, partly because it is a restaurant with rooms rather than a hotel and partly because its 32-room inventory is small relative to demand. The Randolph under Hilton ownership operates within a chain loyalty framework. Hartwell House, Middlethorpe Hall (profiled under Yorkshire), and Bodysgallen Hall in Wales operate on a non-profit basis for the National Trust. Chewton Glen and Macdonald Bath Spa operate at more conventional group-hotel flexibility.
            </p>
            <p>
              Oxford&apos;s commercial calendar is driven by university terms (hotel rates tighten through October, February, and late April; loosen during the long vacation weeks of June to mid-September). Bath&apos;s is driven by heritage tourism (spring and autumn are peaks, winter midweek is negotiable). The rural country-house properties follow the broader country-house seasonal pattern: summer weekends are tight; January to March midweek is most flexible.
            </p>
            <p>
              All private-rate quotes at these properties depend substantially on the specific dates, party size, and length of stay; longer stays at the rural properties tend to be substantially more negotiable than single nights.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/plan/" className="btn-primary">Send us a brief</Link>
            <Link href="/guide/cotswolds/" className="btn-ghost">Cotswolds hotels</Link>
          </div>
        </div>
      </section>
    </>
  )
}
