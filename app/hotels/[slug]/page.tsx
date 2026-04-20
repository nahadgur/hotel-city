import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getHotelBySlug, hotels } from '@/data/hotels'
import type { Metadata } from 'next'
import { ArrowUpRight, Check, ShieldCheck } from 'lucide-react'
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
      title: `${hotel.name} – ${hotel.city}`,
      description: hotel.tagline,
      images: [hotel.heroImage],
    },
  }
}

const CATEGORY_LABELS: Record<Amenity['category'], string> = {
  sleep: 'Sleep',
  work: 'Work & connectivity',
  bathroom: 'Bathroom',
  food: 'Food & drink',
  light: 'Light & ambience',
  layout: 'Room & layout',
  service: 'Service',
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

  // JSON-LD – Hotel type, no fake aggregateRating
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    description: hotel.atmosphereDescription,
    address: {
      '@type': 'PostalAddress',
      addressLocality: hotel.city,
      addressRegion: hotel.neighbourhood,
      addressCountry: hotel.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: hotel.coordinates.lat,
      longitude: hotel.coordinates.lng,
    },
    starRating: { '@type': 'Rating', ratingValue: hotel.stars },
    priceRange: `£${hotel.priceFrom}–£${hotel.priceFrom * 2}`,
    image: [hotel.heroImage, ...hotel.gallery],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="container-edge pt-6 md:pt-10 pb-8">
        <div className="mb-6">
          <Link href="/search/" className="text-xs text-ink-500 link-underline">
            ← All hotels
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
                  alt={`${hotel.name} – ${i + 1}`}
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
              {hotel.city} · {hotel.neighbourhood} · {hotel.country}
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

          {/* BOOKING SIDE PANEL */}
          <aside className="col-span-12 md:col-span-4">
            <div className="md:sticky md:top-6 border border-ink-900/15 bg-paper-50 p-6">
              <div className="flex items-baseline justify-between mb-1">
                <div className="eyebrow text-ink-500">Public rate from</div>
                <div className="text-xs text-ink-500 tabular">
                  {'★'.repeat(hotel.stars)}
                </div>
              </div>
              <div className="font-display text-5xl tabular mb-1">
                £{hotel.priceFrom}
              </div>
              <div className="text-xs text-ink-500 mb-6">
                Per night. The direct quote is usually lower.
              </div>

              <Link
                href={`/brief/new/?city=${encodeURIComponent(hotel.city)}&hotel=${encodeURIComponent(hotel.slug)}`}
                className="btn-primary w-full mb-3 text-center justify-center"
              >
                <span>Get a direct quote</span>
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
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

            <div className="mt-6 text-xs text-ink-500">
              <div className="mb-1">{hotel.rooms} rooms · Opened {hotel.yearOpened ?? ''}</div>
              <div className="italic">Work-friendliness: {hotel.workFriendliness}/5 · Noise: {hotel.noiseLevel}</div>
            </div>
          </aside>
        </div>
      </section>

      {/* AMENITIES – THE DETAIL EXPEDIA IGNORES */}
      <section className="bg-paper-50 mt-12">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="mb-10">
            <div className="eyebrow eyebrow-rule mb-3">The detail</div>
            <h2 className="font-display text-display-md max-w-reading">
              What you actually want to know about this room.
            </h2>
            <p className="mt-4 text-ink-700 max-w-reading leading-relaxed">
              Verified items (<ShieldCheck className="inline w-4 h-4 text-sage-500" strokeWidth={1.5} />) have been
              checked by our team. Everything else is self-reported by the hotel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <div className="eyebrow text-ink-500 mb-4">{CATEGORY_LABELS[cat as Amenity['category']]}</div>
                <ul className="space-y-3">
                  {items.map((a) => (
                    <li key={a.name} className="flex items-start gap-3 pb-3 hairline">
                      {a.verified ? (
                        <ShieldCheck className="w-4 h-4 mt-1 shrink-0 text-sage-500" strokeWidth={1.5} />
                      ) : (
                        <Check className="w-4 h-4 mt-1 shrink-0 text-ink-400" strokeWidth={1.5} />
                      )}
                      <div>
                        <div className="text-ink-900">{a.name}</div>
                        {a.detail && <div className="text-sm text-ink-500 italic">{a.detail}</div>}
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
                <span className="text-terracotta-500 tabular text-xs">–</span>
                <span className="font-display text-xl capitalize">{b}</span>
              </div>
            ))}
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
