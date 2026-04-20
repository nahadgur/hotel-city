import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, MapPin, Building2, Users, Utensils } from 'lucide-react'
import { hotels, getHotel } from '@/data/hotels'

export const dynamicParams = false

export async function generateStaticParams() {
  return hotels.map((h) => ({ slug: h.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const h = getHotel(params.slug)
  if (!h) return {}
  return {
    title: `${h.name}, ${h.city}`,
    description: h.oneLiner,
    alternates: { canonical: `/hotels/${h.slug}/` },
  }
}

export default function HotelPage({ params }: { params: { slug: string } }) {
  const hotel = getHotel(params.slug)
  if (!hotel) notFound()

  const siblings = hotel.siblings
    .map((s) => getHotel(s))
    .filter((h): h is NonNullable<typeof h> => Boolean(h))
    .slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: hotel.address,
      postalCode: hotel.postcode,
      addressLocality: hotel.city,
      addressCountry: 'GB',
    },
    url: `https://hotel-city-khaki.vercel.app/hotels/${hotel.slug}/`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="container-edge pt-10 md:pt-16 pb-6">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-6">
            <Link href={`/guide/${hotel.region}/`} className="link-underline">
              {hotel.city}
            </Link>
          </div>
          <h1 className="font-display text-display-lg md:text-display-xl mb-5 leading-none">
            {hotel.name}
          </h1>
          <p className="text-ink-700 text-lg md:text-xl leading-relaxed max-w-reading italic font-display">
            {hotel.oneLiner}
          </p>
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl">
          <div>
            <div className="eyebrow mb-4">The facts</div>
            <dl className="text-sm space-y-3">
              <div className="flex gap-4">
                <dt className="w-32 shrink-0 text-ink-500">Location</dt>
                <dd className="text-ink-900">{hotel.address}, {hotel.postcode}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-32 shrink-0 text-ink-500">Nearest station</dt>
                <dd className="text-ink-900">{hotel.nearestStation}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-32 shrink-0 text-ink-500">Opened</dt>
                <dd className="text-ink-900">{hotel.openedYear}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-32 shrink-0 text-ink-500">Architect</dt>
                <dd className="text-ink-900">{hotel.architect}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-32 shrink-0 text-ink-500">Listed status</dt>
                <dd className="text-ink-900">{hotel.listedStatus}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-32 shrink-0 text-ink-500">Rooms</dt>
                <dd className="text-ink-900 tabular">{hotel.rooms}</dd>
              </div>
            </dl>
          </div>

          <div>
            <div className="eyebrow mb-4">Dining &amp; bars</div>
            <dl className="text-sm space-y-3">
              <div>
                <dt className="text-ink-500 mb-1.5">Restaurants</dt>
                <dd className="text-ink-900 leading-relaxed">
                  {hotel.restaurants.join(', ')}
                </dd>
              </div>
              <div>
                <dt className="text-ink-500 mb-1.5">Bars</dt>
                <dd className="text-ink-900 leading-relaxed">
                  {hotel.bars.join(', ')}
                </dd>
              </div>
              <div>
                <dt className="text-ink-500 mb-1.5">Owner</dt>
                <dd className="text-ink-900 leading-relaxed">{hotel.owner}</dd>
              </div>
              <div>
                <dt className="text-ink-500 mb-1.5">Operator</dt>
                <dd className="text-ink-900 leading-relaxed">{hotel.operator}</dd>
              </div>
            </dl>
          </div>
        </div>

        <details className="max-w-4xl mt-10 border-t border-ink-900/10 pt-6 group">
          <summary className="eyebrow cursor-pointer select-none hover:text-ink-900 transition-colors">
            Architecture &amp; history
            <span className="ml-2 text-ink-400 group-open:hidden">+</span>
            <span className="ml-2 text-ink-400 hidden group-open:inline">−</span>
          </summary>
          <div className="mt-5 text-sm text-ink-700 leading-relaxed max-w-reading">
            {hotel.architectureHistory}
          </div>
        </details>
      </section>

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
        <div className="max-w-reading">
          <div className="eyebrow mb-5">The brief</div>
          <div className="space-y-5 text-ink-900 leading-relaxed">
            {hotel.brief.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="container-edge pb-16">
        <div className="max-w-reading bg-ink-900 text-paper-50 p-8 md:p-10">
          <div className="eyebrow text-paper-50/70 mb-4">The Stayward note</div>
          <p className="leading-relaxed mb-6">
            {hotel.stayWardNote}
          </p>
          <Link
            href={`/plan/?hotel=${hotel.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-terracotta-500 text-paper-50 text-sm tracking-wide hover:bg-paper-50 hover:text-ink-900 transition-colors"
          >
            <span>Ask us for a {hotel.name.replace(/^The /, '')} quote</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 max-w-5xl">
          <div>
            <div className="eyebrow mb-4">
              {hotel.region === 'london' ? 'Other grand London hotels' : hotel.region === 'cotswolds' ? 'Other Cotswolds hotels' : 'Other hotels we cover'}
            </div>
            <ul className="space-y-2.5">
              {siblings.map((sib) => (
                <li key={sib.slug}>
                  <Link href={`/hotels/${sib.slug}/`} className="text-ink-900 link-underline text-sm">
                    {sib.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-4">Understanding how rates work</div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/guide/rate-parity/" className="text-ink-900 link-underline">
                  Why every hotel site quotes the same price
                </Link>
              </li>
              <li>
                <Link href="/guide/private-rates/" className="text-ink-900 link-underline">
                  What a private rate actually is
                </Link>
              </li>
              <li>
                <Link href={`/guide/${hotel.region}/`} className="text-ink-900 link-underline">
                  All {hotel.region === 'london' ? 'London' : hotel.region === 'cotswolds' ? 'Cotswolds' : ''} hotels we cover
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-4">About Stayward</div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about/" className="text-ink-900 link-underline">
                  How the concierge works
                </Link>
              </li>
              <li>
                <Link href="/plan/" className="text-ink-900 link-underline">
                  Plan a stay
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
