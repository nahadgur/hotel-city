import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { hotels } from '@/data/hotels'
import { collectionPageSchema, breadcrumbSchema, jsonLdScript } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Hotels',
  description: 'Editorial profiles of the hotels we can source private rates from. British grand hotels, country houses, and design-led stays, catalogued for reference.',
  alternates: { canonical: '/hotels/' },
}

export default function HotelsIndex() {
  const schemas = [
    collectionPageSchema({
      name: 'Hotels we write about',
      description: 'Editorial profiles of British hotels we can source private rates from.',
      url: '/hotels/',
      numberOfItems: hotels.length,
    }),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Hotels', url: '/hotels/' },
    ]),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(schemas)} />

      <section className="container-edge pt-10 md:pt-16 pb-10">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-6">The catalogue</div>
          <h1 className="font-display text-display-lg mb-5">Hotels we write about.</h1>
          <p className="text-ink-700 leading-relaxed max-w-reading">
            Editorial profiles of British hotels we can source private rates from. Descriptive, factual, written by people who have been to most of them. We do not rank them. We do not sell them. We ask for quotes on your behalf when you tell us to.
          </p>
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
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
              <div className="eyebrow mb-3">{hotel.city}</div>
              <p className="text-sm text-ink-700 leading-relaxed italic font-display">
                {hotel.oneLiner}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
