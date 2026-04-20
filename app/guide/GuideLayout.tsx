import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { hotels, type Hotel } from '@/data/hotels'
import { collectionPageSchema, breadcrumbSchema, jsonLdScript } from '@/lib/schema'

type GuideLayoutProps = {
  eyebrow: string
  title: string
  intro: string
  bodyParagraphs: string[]
  hotelSlugs: string[]
  relatedGuides: { href: string; label: string }[]
  closingNote?: string
  canonicalPath: string
  schemaName: string
  schemaDescription: string
}

export function GuideLayout({
  eyebrow,
  title,
  intro,
  bodyParagraphs,
  hotelSlugs,
  relatedGuides,
  closingNote,
  canonicalPath,
  schemaName,
  schemaDescription,
}: GuideLayoutProps) {
  const matchedHotels: Hotel[] = hotelSlugs
    .map((slug) => hotels.find((h) => h.slug === slug))
    .filter((h): h is Hotel => Boolean(h))

  const schemas = [
    collectionPageSchema({
      name: schemaName,
      description: schemaDescription,
      url: canonicalPath,
      numberOfItems: matchedHotels.length,
    }),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Guide', url: '/guide/' },
      { name: eyebrow, url: canonicalPath },
    ]),
  ]

  // Group by region for the card list
  const regionOrder = ['london', 'cotswolds', 'scotland', 'lake-district', 'cornwall', 'yorkshire', 'other']
  const regionLabels: Record<string, string> = {
    'london': 'London',
    'cotswolds': 'Cotswolds',
    'scotland': 'Scotland',
    'lake-district': 'Lake District',
    'cornwall': 'Cornwall',
    'yorkshire': 'Yorkshire',
    'other': 'Bath, Oxford and country',
  }

  const groupedHotels = regionOrder
    .map((region) => ({
      region,
      label: regionLabels[region],
      hotels: matchedHotels.filter((h) => h.region === region),
    }))
    .filter((g) => g.hotels.length > 0)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(schemas)} />

      <section className="container-edge pt-10 md:pt-16 pb-8">
        <div className="max-w-reading">
          <div className="eyebrow eyebrow-rule mb-6">
            <Link href="/guide/" className="link-underline">Guide</Link>
            <span className="mx-2 text-ink-400">/</span>
            <span>{eyebrow}</span>
          </div>
          <h1 className="font-display text-display-lg mb-5 leading-tight">
            {title}
          </h1>
          <p className="text-ink-700 text-lg italic font-display max-w-reading">
            {intro}
          </p>
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-10 md:py-14">
        <div className="max-w-reading space-y-5 text-ink-900 leading-relaxed">
          {bodyParagraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
        <div className="eyebrow mb-8">The hotels</div>
        <div className="space-y-12 max-w-5xl">
          {groupedHotels.map(({ region, label, hotels: regionHotels }) => (
            <div key={region}>
              <div className="eyebrow text-ink-500 mb-5">{label}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {regionHotels.map((hotel) => (
                  <Link
                    key={hotel.slug}
                    href={`/hotels/${hotel.slug}/`}
                    className="group block border-t border-ink-900/15 pt-5 hover:border-ink-900 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-display text-xl md:text-2xl leading-tight">
                        {hotel.name}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 mt-1.5 text-ink-400 group-hover:text-terracotta-500 transition-colors shrink-0" strokeWidth={1.5} />
                    </div>
                    <div className="text-xs text-ink-500 uppercase tracking-wider mb-2 tabular">
                      {hotel.city}
                    </div>
                    <p className="text-sm text-ink-700 leading-relaxed italic font-display">
                      {hotel.oneLiner}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {closingNote && (
        <>
          <div className="hairline" />
          <section className="container-edge py-12 md:py-16">
            <div className="max-w-reading bg-ink-900 text-paper-50 p-8 md:p-10">
              <div className="eyebrow text-paper-50/70 mb-4">The Stayward note</div>
              <p className="leading-relaxed mb-6">
                {closingNote}
              </p>
              <Link
                href="/plan/"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-terracotta-500 text-paper-50 text-sm tracking-wide hover:bg-paper-50 hover:text-ink-900 transition-colors"
              >
                <span>Send us a brief</span>
              </Link>
            </div>
          </section>
        </>
      )}

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
        <div className="max-w-reading">
          <div className="eyebrow mb-5">Related guides</div>
          <ul className="space-y-2.5">
            {relatedGuides.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="text-ink-900 link-underline">
                  {g.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
