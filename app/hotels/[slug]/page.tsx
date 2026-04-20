import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getHotelBySlug, hotels } from '@/data/hotels'
import type { Metadata } from 'next'
import { ArrowRight, Check } from 'lucide-react'
import type { Amenity } from '@/lib/types'

export const dynamicParams = false

export async function generateStaticParams() {
  return hotels.map((h) => ({ slug: h.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const hotel = getHotelBySlug(params.slug)
  if (!hotel) return { title: 'Not found' }
  return {
    title: `${hotel.name}, ${hotel.city}`,
    description: `${hotel.tagline} ${hotel.signatureDetail}`,
    openGraph: {
      title: `${hotel.name} in ${hotel.city}`,
      description: hotel.tagline,
      images: [hotel.heroImage],
    },
  }
}

// Group amenity categories into broad descriptive buckets.
// No numeric specs, no brand names, no measurements.
const CATEGORY_LABELS: Record<Amenity['category'], string> = {
  sleep: 'The room',
  work: 'Workspace & connectivity',
  bathroom: 'Bathroom',
  food: 'Food & drink',
  light: 'Light & ambience',
  layout: 'Layout',
  service: 'Service',
}

// Strip any numeric specs or measurement detail before display.
// Internal metadata stays in data/hotels.ts for matching. We just
// don't surface it publicly.
function isNumericDetail(s: string | undefined): boolean {
  if (!s) return false
  return /\d/.test(s) || /\b(cm|mm|mbps|gbps|kbps|bps|inches|\"|hz|lumen|watts?)\b/i.test(s)
}

export default function HotelPage({ params }: { params: { slug: string } }) {
  const hotel = getHotelBySlug(params.slug)
  if (!hotel) notFound()

  const grouped: Record<string, Amenity[]> = {}
  for (const a of hotel.amenities) {
    if (!grouped[a.category]) grouped[a.category] = []
    grouped[a.category].push(a)
  }

  const related = hotels
    .filter((h) => h.slug !== hotel.slug && (h.country === hotel.country || h.atmosphere.some((t) => hotel.atmosphere.includes(t))))
    .slice(0, 3)

  // JSON-LD: Service schema, not Hotel / LocalBusiness.
  // Stayward routes briefs. It does not list or represent hotels
  // as bookable inventory. No aggregateRating, no priceRange.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Direct quote request, ${hotel.name}`,
    description: `Request a private, direct quote from ${hotel.name} in ${hotel.city}. Stayward routes your stay brief to this hotel and four others that match.`,
    provider: {
      '@type': 'Organization',
      name: 'Stayward',
      url: 'https://stayward.vercel.app',
    },
    areaServed: {
      '@type': 'City',
      name: hotel.city,
    },
    image: [hotel.heroImage, ...hotel.gallery.slice(0, 3)],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="container-edge pt-6 md:pt-10 pb-8">
        <div className="mb-6">
          <Link href="/" className="text-xs text-ink-500 link-underline">
            \u2190 Back to Stayward
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-3 md:gap-4 mb-10">
          <div className="col-span-12 md:col-span-8 relative aspect-[16/10] overflow-hidden bg-ink-100">
            <Image
              src={hotel.heroImage}
              alt={hotel.name}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="col-span-12 md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
            {hotel.gallery.slice(0, 3).map((src, i) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden bg-ink-100">
                <Image
                  src={src}
                  alt={`${hotel.name}, gallery ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-8">
            <div className="eyebrow text-ink-500 mb-3">
              {hotel.city} \u00b7 {hotel.neighbourhood} \u00b7 {hotel.country}
            </div>
            <h1 className="font-display text-display-lg mb-4">{hotel.name}</h1>
            <p className="font-display italic text-xl md:text-2xl text-ink-700 max-w-reading leading-snug mb-8">
              {hotel.tagline}
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {hotel.atmosphere.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1.5 border border-ink-900/15 text-ink-700">
                  {tag.replace(/-/g, ' ')}
                </span>
              ))}
            </div>

            <div className="max-w-reading prose-editorial">
              <p className="text-ink-800 text-lg leading-relaxed mb-5">
                {hotel.atmosphereDescription}
              </p>
              <p className="text-ink-700 leading-relaxed">{hotel.rawDescription}</p>
            </div>

            {hotel.signatureDetail && (
              <div className="mt-10 p-6 md:p-8 bg-paper-200 border-l-2 border-terracotta-500">
                <div className="eyebrow mb-2 text-terracotta-600">The one thing</div>
                <p className="font-display text-xl md:text-2xl leading-snug max-w-reading">
                  {hotel.signatureDetail}
                </p>
              </div>
            )}
          </div>

          {/* DIRECT QUOTE PANEL, NO PRICES */}
          <aside className="col-span-12 md:col-span-4">
            <div className="md:sticky md:top-6 border border-ink-900/15 bg-paper-50 p-6">
              <div className="eyebrow text-ink-500 mb-2">Rates</div>
              <div className="font-display text-2xl leading-snug mb-3">
                Direct rates on request.
              </div>
              <p className="text-sm text-ink-700 leading-relaxed mb-6">
                Stayward doesn't publish prices. Rates are private, quoted directly by the hotel for your specific stay. Usually below the Booking.com rate.
              </p>

              <Link
                href={`/dashboard/new/?city=${encodeURIComponent(hotel.city)}&hotel=${encodeURIComponent(hotel.slug)}`}
                className="btn-primary w-full mb-3 text-center justify-center"
              >
                <span>Get a direct quote</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>

              <div className="pt-4 hairline space-y-3 text-xs text-ink-600">
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-sage-500" strokeWidth={1.5} />
                  <span>Your brief reaches this hotel plus four others that match.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-sage-500" strokeWidth={1.5} />
                  <span>They quote you direct by email, usually within hours.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-sage-500" strokeWidth={1.5} />
                  <span>Your email stays private until you accept a quote.</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* DESCRIPTIVE AMENITIES, NO NUMERIC SPECS */}
      <section className="bg-paper-50 mt-12">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="mb-10">
            <div className="eyebrow eyebrow-rule mb-3">What you'll find here</div>
            <h2 className="font-display text-display-md max-w-reading">
              The character of the place, in plain terms.
            </h2>
            <p className="mt-4 text-ink-700 max-w-reading leading-relaxed">
              Broad strokes. If you need the exact specs, workspace dimensions, wifi speed, mattress, bathroom detail, put that in your brief. The hotel will confirm in their quote.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <div className="eyebrow text-ink-500 mb-4">{CATEGORY_LABELS[cat as Amenity['category']]}</div>
                <ul className="space-y-3">
                  {items.map((a) => (
                    <li key={a.name} className="flex items-start gap-3 pb-3 hairline">
                      <Check className="w-4 h-4 mt-1 shrink-0 text-ink-400" strokeWidth={1.5} />
                      <div>
                        <div className="text-ink-900">{a.name}</div>
                        {a.detail && !isNumericDetail(a.detail) && (
                          <div className="text-sm text-ink-500 italic">{a.detail}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {hotel.sustainability && hotel.sustainability.length > 0 && (
            <div className="mt-14 pt-10 hairline">
              <div className="eyebrow mb-3 text-sage-600">Sustainability</div>
              <ul className="flex flex-wrap gap-3">
                {hotel.sustainability.map((s) => (
                  <li key={s} className="text-sm px-3 py-1.5 border border-sage-500/30 text-sage-600">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* BEST FOR */}
      <section className="container-edge py-section">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-5">
            <div className="eyebrow mb-3">Best for</div>
            <h2 className="font-display text-display-md">
              Who this place is really for.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7 space-y-2">
            {hotel.bestFor.map((b) => (
              <div key={b} className="py-3 hairline flex items-center gap-3">
                <span className="text-terracotta-500 tabular text-xs">\u2013</span>
                <span className="font-display text-xl capitalize">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="bg-ink-900 text-paper-50">
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-center">
            <div className="col-span-12 md:col-span-8">
              <div className="eyebrow text-paper-300 mb-3">Ready?</div>
              <h2 className="font-display text-display-md max-w-reading">
                Describe your stay. Hotels quote you direct.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4">
              <Link
                href={`/dashboard/new/?city=${encodeURIComponent(hotel.city)}&hotel=${encodeURIComponent(hotel.slug)}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-paper-50 text-ink-900 text-sm transition-colors hover:bg-terracotta-500 hover:text-paper-50 w-full md:w-auto"
              >
                <span>Get a quote from {hotel.name.split(' ').slice(0, 2).join(' ')}</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="bg-paper-50">
          <div className="hairline" />
          <div className="container-edge py-section">
            <div className="eyebrow mb-3">If you like this</div>
            <h2 className="font-display text-display-md mb-12">You might also consider</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {related.map((h) => (
                <Link key={h.slug} href={`/hotels/${h.slug}/`} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-ink-100 mb-4">
                    <Image
                      src={h.heroImage}
                      alt={h.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="eyebrow mb-1 text-ink-500">{h.city}</div>
                  <h3 className="font-display text-2xl mb-1 group-hover:text-terracotta-500 transition-colors">
                    {h.name}
                  </h3>
                  <p className="text-sm text-ink-600 italic">{h.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
