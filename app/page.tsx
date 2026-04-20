import Link from 'next/link'
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden grain">
        <div className="container-edge pt-10 md:pt-20 pb-16 md:pb-24">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-center">
            {/* TEXT COLUMN */}
            <div className="col-span-12 lg:col-span-6 xl:col-span-5">
              <div className="eyebrow eyebrow-rule mb-8 md:mb-10 animate-fade-in" style={{ animationDelay: '80ms' }}>
                A concierge for direct hotel quotes
              </div>

              <h1 className="font-display text-display-xl mb-8 animate-fade-up" style={{ animationDelay: '120ms' }}>
                Describe your stay.{' '}
                <span className="italic text-terracotta-500">We find it</span>.
              </h1>

              <p className="font-display italic text-xl md:text-2xl text-ink-700 max-w-reading leading-snug mb-10 animate-fade-up" style={{ animationDelay: '260ms' }}>
                A small team in London, reading every brief by hand. We reach out to hotels that fit, then email you quotes within 24 hours. No search engine. No booking site. No bots.
              </p>

              <div className="flex flex-wrap items-center gap-5 animate-fade-up" style={{ animationDelay: '400ms' }}>
                <Link href="/plan/" className="btn-primary">
                  <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                  <span>Plan a stay</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </Link>
                <Link href="/about/" className="text-sm text-ink-700 link-underline">
                  How it works
                </Link>
              </div>

              <p className="mt-8 text-sm text-ink-500 italic max-w-reading animate-fade-up" style={{ animationDelay: '520ms' }}>
                Free. No login required. A real person replies within 24 hours.
              </p>
            </div>

            {/* VIDEO COLUMN */}
            <div className="col-span-12 lg:col-span-6 xl:col-span-7 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <figure className="relative overflow-hidden bg-ink-100 aspect-[4/3] md:aspect-[16/10]">
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: 'scale(1.04) translate(-0.5%, -1%)', transformOrigin: 'center center' }}
                  src="/hero.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/hero-poster.jpg"
                  aria-hidden="true"
                />

                <div className="absolute inset-x-0 bottom-0 pointer-events-none">
                  <div
                    className="h-16 md:h-20"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(20, 18, 15, 1) 0%, rgba(20, 18, 15, 0.92) 55%, rgba(20, 18, 15, 0) 100%)',
                    }}
                  />
                </div>

                <div
                  className="absolute inset-x-0 top-0 h-20 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to bottom, rgba(20, 18, 15, 0.5) 0%, rgba(20, 18, 15, 0) 100%)',
                  }}
                />

                <figcaption className="absolute inset-x-0 bottom-0 pointer-events-none">
                  <div className="flex items-center justify-between gap-4 px-4 md:px-6 pb-4 md:pb-5 text-[10px] md:text-xs uppercase tracking-[0.18em] text-paper-50/90">
                    <div className="flex items-center gap-3">
                      <span className="inline-block w-6 md:w-10 h-px bg-paper-50/40" />
                      <span>Stayward, London</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>A stay from our network</span>
                      <span className="inline-block w-6 md:w-10 h-px bg-paper-50/40" />
                    </div>
                  </div>
                </figcaption>

                <figcaption className="absolute top-4 left-4 md:top-5 md:left-6 text-[10px] md:text-xs uppercase tracking-[0.18em] text-paper-50/90 flex items-center gap-3 pointer-events-none">
                  <span>Golden hour, sea-facing</span>
                  <span className="inline-block w-6 md:w-10 h-px bg-paper-50/40" />
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* STAT BAND */}
      <section className="relative bg-ink-900 text-paper-50">
        <div className="container-edge py-14 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            <div>
              <div className="font-display text-5xl md:text-6xl mb-3 tabular">24h</div>
              <div className="text-sm text-paper-200 leading-relaxed">
                a reply in your inbox, from a real person. Not a ticket number, not an auto-responder.
              </div>
            </div>
            <div>
              <div className="font-display text-5xl md:text-6xl mb-3 tabular">0</div>
              <div className="text-sm text-paper-200 leading-relaxed">
                public prices. Quotes are private, negotiated for your specific stay, usually below the OTA.
              </div>
            </div>
            <div>
              <div className="font-display text-5xl md:text-6xl mb-3 tabular">\u00a30</div>
              <div className="text-sm text-paper-200 leading-relaxed">
                for travellers, always. We don\'t take a cut from you. Hotels pay us when a booking is made.
              </div>
            </div>
          </div>
          <p className="mt-10 text-xs text-paper-400 italic">
            Early access. A small team, replying personally to every brief.
          </p>
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
                A brief in. Quotes back. Nothing in between.
              </h2>
            </div>

            <div className="col-span-12 md:col-span-7 md:col-start-6 space-y-12 max-w-reading">
              <div>
                <div className="font-display text-3xl text-terracotta-500 mb-3">01</div>
                <h3 className="font-display text-xl mb-2">Describe it.</h3>
                <p className="text-ink-700 leading-relaxed">
                  In your own words. &ldquo;Quiet Paris, deep tub, fast wifi, three nights for a work sprint.&rdquo; The way you\'d tell a friend. Add dates and a rough budget if you have them.
                </p>
              </div>

              <div>
                <div className="font-display text-3xl text-terracotta-500 mb-3">02</div>
                <h3 className="font-display text-xl mb-2">We read it, personally.</h3>
                <p className="text-ink-700 leading-relaxed">
                  Someone on our team in London reads the whole thing. No parsing, no keywords, no routing algorithm. Just a person thinking about where might actually fit.
                </p>
              </div>

              <div>
                <div className="font-display text-3xl text-terracotta-500 mb-3">03</div>
                <h3 className="font-display text-xl mb-2">We ask the hotels.</h3>
                <p className="text-ink-700 leading-relaxed">
                  We reach out to a handful of places that fit, directly, on your behalf. They quote us private rates, the kind they can\'t publish publicly.
                </p>
              </div>

              <div>
                <div className="font-display text-3xl text-terracotta-500 mb-3">04</div>
                <h3 className="font-display text-xl mb-2">You get an email.</h3>
                <p className="text-ink-700 leading-relaxed">
                  Within 24 hours. Side-by-side quotes, short, plain. Pick one and we introduce you to the hotel directly. We step out. You book with them, not us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE LOOPHOLE */}
      <section className="relative bg-paper-50">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <div className="eyebrow mb-4">Why it works</div>
              <h2 className="font-display text-display-md">
                Hotels can quote you rates they{' '}
                <span className="italic text-terracotta-500">can\'t publish</span>.
              </h2>
            </div>

            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading space-y-5 text-ink-700 leading-relaxed">
              <p>
                Booking.com and Expedia charge hotels 15 to 25 per cent commission on every stay, and then require rate parity. No cheaper rate can appear on any public website. That\'s why every site looks identical.
              </p>
              <p>
                That parity only applies to <em>public</em> rates. A private quote, negotiated directly for a specific traveller, is expressly allowed under every major parity clause. Hotels have always used this for returning guests, referrals, and concierge relationships.
              </p>
              <p className="font-display italic text-xl text-ink-900">
                Stayward is the concierge relationship, made available to anyone who asks. Nothing public, nothing searchable, nothing the OTA can see.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-4">
              <div className="eyebrow mb-4">Common questions</div>
              <h2 className="font-display text-display-md max-w-reading">
                The things people ask before they try it.
              </h2>
            </div>

            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <div className="divide-y divide-ink-900/10">
                <FaqItem
                  q="Do I need an account?"
                  a="No account, no login, nothing to set up. Send us a brief from the plan page and we\'ll email you within 24 hours."
                />
                <FaqItem
                  q="Is this legal per OTA parity clauses?"
                  a="Yes. Every major parity clause explicitly carves out private, unpublished quotes sent directly to an individual traveller. The quote that lands in your inbox was never on a public website, and cannot be. That\'s the mechanism."
                />
                <FaqItem
                  q="Do I pay Stayward anything?"
                  a="No. Travellers never pay us. Hotels pay a small introduction fee if a booking goes through, which is still much less than the 15 to 25 per cent they\'d lose to an OTA. Our incentives stay aligned with yours."
                />
                <FaqItem
                  q="How fast will I hear back?"
                  a="Within 24 hours during business hours, often much faster. We\'re a small team, and every brief gets read and replied to by a person. No auto-responses."
                />
                <FaqItem
                  q="What if nothing fits my brief?"
                  a="We\'ll still reply, honestly. Sometimes a brief is too specific for the hotels we work with, or the dates are too tight. We\'ll tell you, and often suggest a tweak that would open up better options."
                />
                <FaqItem
                  q="What happens after I pick a quote?"
                  a="Reply to our email telling us which one you want. We introduce you to the hotel directly by email. They take the booking, payment, any special requests. From there, Stayward steps out."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="relative bg-ink-900 text-paper-50">
        <div className="container-edge py-section">
          <div className="max-w-3xl">
            <div className="eyebrow text-paper-300 mb-4">Start a brief</div>
            <h2 className="font-display text-display-lg mb-6">
              Describe where you want to be.{' '}
              <span className="italic text-terracotta-400">We\'ll take it from there</span>.
            </h2>
            <p className="text-paper-200 leading-relaxed max-w-reading mb-10 text-lg">
              Takes a minute. No login, no commitment, no marketing emails. Just a brief in, quotes back.
            </p>
            <Link
              href="/plan/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-paper-50 text-ink-900 text-sm transition-colors hover:bg-terracotta-500 hover:text-paper-50"
            >
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
              <span>Plan a stay</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-5">
      <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
        <span className="font-display text-lg md:text-xl leading-snug pr-4">{q}</span>
        <ChevronDown className="w-5 h-5 mt-1 shrink-0 text-ink-500 transition-transform group-open:rotate-180" strokeWidth={1.5} />
      </summary>
      <p className="mt-3 text-ink-700 leading-relaxed max-w-reading">{a}</p>
    </details>
  )
}
