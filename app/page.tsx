import Link from 'next/link'
import Image from 'next/image'
import { hotels } from '@/data/hotels'
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'

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
                A different way to book a hotel
              </div>

              <h1 className="font-display text-display-xl mb-6 animate-fade-up" style={{ animationDelay: '120ms' }}>
                Skip the OTA. Get quotes{' '}
                <span className="italic text-terracotta-500">direct</span>.
              </h1>

              <p className="font-display italic text-xl md:text-2xl text-ink-700 max-w-reading leading-snug mb-10 animate-fade-up" style={{ animationDelay: '260ms' }}>
                Describe what you want. We route your brief to the five hotels that fit.
                They quote you direct, often well below the public rate. You pick one.
              </p>

              <div className="flex flex-wrap items-center gap-5 animate-fade-up" style={{ animationDelay: '400ms' }}>
                <Link href="/dashboard/new/" className="btn-primary">
                  <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                  <span>Start a brief</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </Link>
                <Link href="/search/" className="text-sm text-ink-700 link-underline">
                  Or browse the hotels
                </Link>
              </div>

              <p className="mt-8 text-sm text-ink-500 italic max-w-reading animate-fade-up" style={{ animationDelay: '520ms' }}>
                Takes a minute. Free. Your email stays private until you accept a quote.
              </p>
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

      {/* HOW IT WORKS */}
      <section className="relative">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-4">
              <div className="eyebrow mb-4">How it works</div>
              <h2 className="font-display text-display-md max-w-reading">
                One brief. Five quotes. Your inbox, not a sales funnel.
              </h2>
            </div>

            <div className="col-span-12 md:col-span-7 md:col-start-6 space-y-12 max-w-reading">
              <div>
                <div className="font-display text-3xl text-terracotta-500 mb-3">01</div>
                <h3 className="font-display text-xl mb-2">Describe it.</h3>
                <p className="text-ink-700 leading-relaxed">
                  "Quiet Paris, deep tub, fast wifi, for a 3-day work sprint." The way
                  you'd tell a friend. Add dates and a budget if you have them.
                </p>
              </div>

              <div>
                <div className="font-display text-3xl text-terracotta-500 mb-3">02</div>
                <h3 className="font-display text-xl mb-2">We route to five hotels.</h3>
                <p className="text-ink-700 leading-relaxed">
                  Our matching engine picks the five that fit your brief. We email them
                  each with your dates and what you want. Your contact details stay private.
                </p>
              </div>

              <div>
                <div className="font-display text-3xl text-terracotta-500 mb-3">03</div>
                <h3 className="font-display text-xl mb-2">They quote you direct.</h3>
                <p className="text-ink-700 leading-relaxed">
                  Quotes land in your Stayward inbox. Often well below the Booking.com rate,
                  because hotels can offer direct rates they can't publish publicly. You pick one.
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
              <h2 className="font-display text-display-lg">Hotels that quote direct.</h2>
            </div>
            <Link href="/search/" className="hidden md:inline-flex items-center gap-2 text-sm link-underline">
              <span>Browse them all</span>
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
                <div className="mt-3 text-sm tabular text-ink-500">From £{hotel.priceFrom} / night, public rate</div>
              </Link>
            ))}
          </div>

          <div className="mt-10 md:hidden">
            <Link href="/search/" className="btn-ghost w-full">
              <span>Browse them all</span>
              <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* THE LOOPHOLE */}
      <section className="relative">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <div className="eyebrow mb-4">Why it works</div>
              <h2 className="font-display text-display-md">
                Hotels can quote you a rate they{' '}
                <span className="italic text-terracotta-500">can't publish</span>.
              </h2>
            </div>

            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading space-y-5 text-ink-700 leading-relaxed">
              <p>
                Booking.com and Expedia charge hotels 15 to 25 per cent commission on every booking,
                and then require rate parity — no cheaper rate can appear on any public website.
                It's why every site looks identical.
              </p>
              <p>
                But that rate parity only applies to public rates. A private quote sent directly to
                a specific traveller, by email, is expressly allowed. That's the loophole hotels
                have always used for returning guests and referrals.
              </p>
              <p className="font-display italic text-xl text-ink-900">
                Stayward industrialises that. We route your brief, the hotel quotes you direct,
                you save. Nothing public, nothing searchable, nothing the OTA can see.
              </p>
              <div className="pt-4">
                <Link href="/dashboard/new/" className="btn-ghost">
                  <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                  <span>Start your brief</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VS BOOKING.COM */}
      <section className="relative bg-paper-50">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <div className="eyebrow mb-4">Honest comparison</div>
              <h2 className="font-display text-display-md">
                We don't try to trick you into booking.
              </h2>
              <p className="mt-5 text-ink-700 max-w-reading leading-relaxed">
                Here's exactly what you won't find on this site.
              </p>
            </div>

            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                {[
                  ['"5 people are looking now"', 'counters'],
                  ['"Only 1 room left!"', 'scarcity banners'],
                  ['Price reveals at checkout', 'surprise taxes'],
                  ['Pre-ticked insurance', 'upsells by default'],
                  ['Forced account creation', 'to see a price'],
                  ['Fake countdown timers', 'urgency games'],
                  ['Hidden fees', 'cleaning, resort, service'],
                  ['Sponsored-first sort', 'masquerading as "best match"'],
                ].map(([thing, what]) => (
                  <div key={thing} className="py-3 hairline flex items-start gap-3">
                    <span className="text-terracotta-500 mt-1 tabular text-xs">×</span>
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
                Warm leads.{' '}
                <span className="italic text-terracotta-400">Zero</span>
                {' '}commission.
              </h2>
              <p className="mt-6 text-paper-200 max-w-reading leading-relaxed text-lg">
                Travellers describe what they want. We route matching briefs to you.
                You quote them whatever rate makes sense — direct, flexible, yours.
                No parity conflict, no OTA cut, no listing among 27,000 others.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <Link
                href="/for-hotels/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-paper-50 text-ink-900 text-sm transition-colors hover:bg-terracotta-500 hover:text-paper-50"
              >
                <span>How the hotel side works</span>
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
