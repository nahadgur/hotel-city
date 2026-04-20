import Link from 'next/link'
import Image from 'next/image'
import { SearchInput } from '@/components/SearchInput'
import { hotels } from '@/data/hotels'
import { ArrowUpRight } from 'lucide-react'

export default function HomePage() {
  const featured = hotels.slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden grain">
        <div className="container-edge pt-10 md:pt-20 pb-20 md:pb-28">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 lg:col-span-8">
              <div className="eyebrow eyebrow-rule mb-8 md:mb-10 animate-fade-in" style={{ animationDelay: '80ms' }}>
                A different way to find a hotel
              </div>

              <h1 className="font-display text-display-xl mb-6 animate-fade-up" style={{ animationDelay: '120ms' }}>
                Hotels, found{' '}
                <span className="italic text-terracotta-500">properly</span>.
              </h1>

              <p className="font-display italic text-xl md:text-2xl text-ink-700 max-w-reading leading-snug mb-12 animate-fade-up" style={{ animationDelay: '260ms' }}>
                No dark patterns. No surprise taxes. No fake urgency. Just rooms,
                photographed honestly, described properly, priced in full.
              </p>

              <div className="animate-fade-up" style={{ animationDelay: '400ms' }}>
                <SearchInput />
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-4 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="relative aspect-[3/4] overflow-hidden bg-ink-100">
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
                  alt="A quiet hotel room"
                  fill
                  sizes="33vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="mt-3 text-xs text-ink-500 italic">
                The Wren, Shoreditch
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="relative">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-4">
              <div className="eyebrow mb-4">The idea</div>
              <h2 className="font-display text-display-md max-w-reading">
                A booking site that behaves like a good concierge, not a street hawker.
              </h2>
            </div>

            <div className="col-span-12 md:col-span-7 md:col-start-6 space-y-12 max-w-reading">
              <div>
                <div className="font-display text-3xl text-terracotta-500 mb-3">01</div>
                <h3 className="font-display text-xl mb-2">Describe it, don\u2019t filter it.</h3>
                <p className="text-ink-700 leading-relaxed">
                  Type \u201Cquiet Paris, deep tub, fast wifi\u201D the way you\u2019d tell a friend.
                  We understand the sentence. You don\u2019t click fourteen boxes.
                </p>
              </div>

              <div>
                <div className="font-display text-3xl text-terracotta-500 mb-3">02</div>
                <h3 className="font-display text-xl mb-2">The price you see is the price you pay.</h3>
                <p className="text-ink-700 leading-relaxed">
                  Every number is all-in. Taxes, fees, city levies, all of it. If the price
                  drops after you book, we credit you automatically.
                </p>
              </div>

              <div>
                <div className="font-display text-3xl text-terracotta-500 mb-3">03</div>
                <h3 className="font-display text-xl mb-2">Details Expedia ignores.</h3>
                <p className="text-ink-700 leading-relaxed">
                  Tub depth in centimetres. Wifi speed, tested. Whether the AC rattles. Whether
                  the shower has pressure. The small things that decide whether a room is good.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED HOTELS */}
      <section className="relative bg-paper-50">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="eyebrow mb-3">Selected</div>
              <h2 className="font-display text-display-lg">Just opened, worth knowing.</h2>
            </div>
            <Link href="/search/" className="hidden md:inline-flex items-center gap-2 text-sm link-underline">
              <span>See them all</span>
              <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {featured.map((hotel, i) => (
              <Link
                key={hotel.slug}
                href={`/hotels/${hotel.slug}/`}
                className="group block animate-fade-up"
                style={{ animationDelay: `${i * 140 + 200}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-ink-100 mb-4">
                  <Image
                    src={hotel.heroImage}
                    alt={hotel.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="eyebrow mb-1 text-ink-500">{hotel.city}, {hotel.neighbourhood}</div>
                <h3 className="font-display text-2xl mb-1 group-hover:text-terracotta-500 transition-colors">
                  {hotel.name}
                </h3>
                <p className="text-sm text-ink-600 italic">{hotel.tagline}</p>
                <div className="mt-3 text-sm tabular">From \u00A3{hotel.priceFrom} / night, all-in</div>
              </Link>
            ))}
          </div>

          <div className="mt-10 md:hidden">
            <Link href="/search/" className="btn-ghost w-full">
              <span>See them all</span>
              <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* VS BOOKING.COM */}
      <section className="relative">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <div className="eyebrow mb-4">Honest comparison</div>
              <h2 className="font-display text-display-md">
                We don\u2019t try to trick you into booking.
              </h2>
              <p className="mt-5 text-ink-700 max-w-reading leading-relaxed">
                Here\u2019s exactly what you won\u2019t find on this site.
              </p>
            </div>

            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                {[
                  ['\u201C5 people are looking now\u201D', 'counters'],
                  ['\u201COnly 1 room left!\u201D', 'scarcity banners'],
                  ['Price reveals at checkout', 'surprise taxes'],
                  ['Pre-ticked insurance', 'upsells by default'],
                  ['Forced account creation', 'to see a price'],
                  ['Fake countdown timers', 'urgency games'],
                  ['Hidden fees', 'cleaning, resort, service'],
                  ['Sponsored-first sort', 'masquerading as \u201Cbest match\u201D'],
                ].map(([thing, what]) => (
                  <div key={thing} className="py-3 hairline flex items-start gap-3">
                    <span className="text-terracotta-500 mt-1 tabular text-xs">\u2715</span>
                    <div>
                      <div className="text-ink-900">{thing}</div>
                      <div className="text-sm text-ink-500">{what}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR HOTELS */}
      <section className="relative bg-ink-900 text-paper-50">
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
            <div className="col-span-12 md:col-span-8">
              <div className="eyebrow text-paper-300 mb-4">For hotels</div>
              <h2 className="font-display text-display-lg">
                Keep{' '}
                <span className="italic text-terracotta-400">100%</span>
                {' '}of your revenue.
              </h2>
              <p className="mt-6 text-paper-200 max-w-reading leading-relaxed text-lg">
                Flat monthly fee instead of a 15\u201325% commission. Direct relationships with
                your guests. A listing that actually looks like your hotel.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <Link
                href="/for-hotels/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-paper-50 text-ink-900 text-sm transition-colors hover:bg-terracotta-500 hover:text-paper-50"
              >
                <span>See our pricing</span>
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
