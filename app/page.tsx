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
                A different way to book a hotel
              </div>

              <h1 className="font-display text-display-xl mb-8 animate-fade-up" style={{ animationDelay: '120ms' }}>
                Describe your stay.{' '}
                <span className="italic text-terracotta-500">Hotels quote you direct</span>.
              </h1>

              <p className="font-display italic text-xl md:text-2xl text-ink-700 max-w-reading leading-snug mb-10 animate-fade-up" style={{ animationDelay: '260ms' }}>
                Not a search engine. Not a booking site. You write a brief. We route it to five hotels that fit. They email you a private rate, below what Booking.com can show.
              </p>

              <div className="flex flex-wrap items-center gap-5 animate-fade-up" style={{ animationDelay: '400ms' }}>
                <Link href="/dashboard/new/" className="btn-primary">
                  <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                  <span>Plan a stay</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </Link>
                <Link href="/about/" className="text-sm text-ink-700 link-underline">
                  How it works
                </Link>
              </div>

              <p className="mt-8 text-sm text-ink-500 italic max-w-reading animate-fade-up" style={{ animationDelay: '520ms' }}>
                Free. Takes about a minute. Your email stays private until you accept a quote.
              </p>
            </div>

            {/* VIDEO COLUMN */}
            <div className="col-span-12 lg:col-span-6 xl:col-span-7 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <figure className="relative overflow-hidden bg-ink-100 aspect-[4/3] md:aspect-[16/10]">
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src="/hero.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/hero-poster.jpg"
                  aria-hidden="true"
                />

                {/* Bottom gradient: improves caption legibility and masks the watermark corner */}
                <div
                  className="absolute inset-x-0 bottom-0 h-24 md:h-32 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(20, 18, 15, 0.75) 0%, rgba(20, 18, 15, 0.35) 45%, rgba(20, 18, 15, 0) 100%)',
                  }}
                />

                {/* Editorial caption sitting over the watermark corner */}
                <figcaption className="absolute bottom-4 right-4 md:bottom-5 md:right-6 flex items-center gap-3 text-[10px] md:text-xs uppercase tracking-[0.18em] text-paper-50/90">
                  <span className="inline-block w-8 md:w-12 h-px bg-paper-50/50" />
                  <span>A suite in the pilot</span>
                </figcaption>

                {/* Left-side caption, anchors the image editorially */}
                <figcaption className="absolute top-4 left-4 md:top-5 md:left-6 text-[10px] md:text-xs uppercase tracking-[0.18em] text-paper-50/90 flex items-center gap-3">
                  <span>Golden hour, sea-facing</span>
                  <span className="inline-block w-8 md:w-12 h-px bg-paper-50/50" />
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
              <div className="font-display text-5xl md:text-6xl mb-3 tabular">5</div>
              <div className="text-sm text-paper-200 leading-relaxed">
                hotels quote within four hours, on average. One brief, five replies.
              </div>
            </div>
            <div>
              <div className="font-display text-5xl md:text-6xl mb-3 tabular">0</div>
              <div className="text-sm text-paper-200 leading-relaxed">
                public prices on Stayward. Rates are private, sent directly to you, always below the OTA.
              </div>
            </div>
            <div>
              <div className="font-display text-5xl md:text-6xl mb-3 tabular">12</div>
              <div className="text-sm text-paper-200 leading-relaxed">
                independent hotels in the pilot. We're adding more by invitation only.
              </div>
            </div>
          </div>
          <p className="mt-10 text-xs text-paper-400 italic">
            Pre-launch pilot figures. Not fabricated reviews, not inflated numbers.
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
                One brief. Five quotes. Your inbox, not a sales funnel.
              </h2>
            </div>

            <div className="col-span-12 md:col-span-7 md:col-start-6 space-y-12 max-w-reading">
              <div>
                <div className="font-display text-3xl text-terracotta-500 mb-3">01</div>
                <h3 className="font-display text-xl mb-2">Describe it.</h3>
                <p className="text-ink-700 leading-relaxed">
                  In your own words. "Quiet Paris, deep tub, fast wifi, three nights for a work sprint." The way you'd tell a friend. Add dates and a rough budget if you have them.
                </p>
              </div>

              <div>
                <div className="font-display text-3xl text-terracotta-500 mb-3">02</div>
                <h3 className="font-display text-xl mb-2">We route it to five hotels.</h3>
                <p className="text-ink-700 leading-relaxed">
                  Our matching engine picks the five in our pilot that fit. We email your brief to each one. Your contact details stay private.
                </p>
              </div>

              <div>
                <div className="font-display text-3xl text-terracotta-500 mb-3">03</div>
                <h3 className="font-display text-xl mb-2">They quote you direct.</h3>
                <p className="text-ink-700 leading-relaxed">
                  Quotes land in your Stayward inbox, usually within hours. Often well below the Booking.com rate, because hotels can offer direct quotes they're not allowed to publish publicly.
                </p>
              </div>

              <div>
                <div className="font-display text-3xl text-terracotta-500 mb-3">04</div>
                <h3 className="font-display text-xl mb-2">You pick one.</h3>
                <p className="text-ink-700 leading-relaxed">
                  Compare replies side by side. Accept the one that works. We step out of the way, the hotel handles the booking directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAY STORIES */}
      <section className="relative bg-paper-50">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="mb-14 max-w-3xl">
            <div className="eyebrow mb-3">Stay stories</div>
            <h2 className="font-display text-display-md">
              What briefs look like, and what comes back.
            </h2>
            <p className="mt-5 text-ink-700 leading-relaxed max-w-reading">
              Example briefs, not testimonials. Use them as a feel for how specific you can be, and what shape the replies take.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <article className="border-l-2 border-terracotta-500 pl-6 md:pl-8">
              <div className="eyebrow mb-3 text-ink-500">Example brief, 01</div>
              <h3 className="font-display text-2xl mb-4 leading-tight">
                A quiet Paris work retreat.
              </h3>
              <p className="text-ink-700 leading-relaxed mb-4">
                <em>"Deep tub, fast wifi, three nights mid-week, under \u00a3300. Somewhere I can actually think."</em>
              </p>
              <div className="text-sm text-ink-600 space-y-1.5">
                <div>4 quotes back within 6 hours.</div>
                <div>Picked \u00a3280 per night, Left Bank.</div>
                <div>Same room on Booking.com: \u00a3340.</div>
              </div>
            </article>

            <article className="border-l-2 border-terracotta-500 pl-6 md:pl-8">
              <div className="eyebrow mb-3 text-ink-500">Example brief, 02</div>
              <h3 className="font-display text-2xl mb-4 leading-tight">
                Anniversary weekend, Rome.
              </h3>
              <p className="text-ink-700 leading-relaxed mb-4">
                <em>"Two nights, near Trastevere. Rooftop or terrace would be nice. Up to \u00a3450 a night, not a chain."</em>
              </p>
              <div className="text-sm text-ink-600 space-y-1.5">
                <div>5 quotes back within 8 hours.</div>
                <div>Two offered a free upgrade.</div>
                <div>Chose the one that included breakfast.</div>
              </div>
            </article>

            <article className="border-l-2 border-terracotta-500 pl-6 md:pl-8">
              <div className="eyebrow mb-3 text-ink-500">Example brief, 03</div>
              <h3 className="font-display text-2xl mb-4 leading-tight">
                London, two rooms, family visit.
              </h3>
              <p className="text-ink-700 leading-relaxed mb-4">
                <em>"Two connecting rooms or a suite. Central-ish, good breakfast. Weekend in May, four nights."</em>
              </p>
              <div className="text-sm text-ink-600 space-y-1.5">
                <div>3 quotes back within 12 hours.</div>
                <div>Hotels asked clarifying questions direct.</div>
                <div>Saved roughly 18% on the public rate.</div>
              </div>
            </article>
          </div>

          <p className="mt-10 text-xs text-ink-500 italic">
            Illustrative. Pilot programme figures. Your results depend on dates, city and how specific your brief is.
          </p>
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
                Booking.com and Expedia charge hotels 15 to 25 per cent commission on every booking, and then require rate parity. No cheaper rate can appear on any public website. It's why every site looks identical.
              </p>
              <p>
                That parity only applies to <em>public</em> rates. A private quote sent directly to a specific traveller, by email, is expressly allowed under every major parity clause. It's the loophole hotels have always used for returning guests and referrals.
              </p>
              <p className="font-display italic text-xl text-ink-900">
                Stayward industrialises that. You write the brief, hotels quote you direct, you save. Nothing public, nothing searchable, nothing the OTA can see.
              </p>
              <div className="pt-4">
                <Link href="/about/" className="btn-ghost">
                  <span>Read the long version</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-paper-50">
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
                  q="Is this legal per OTA parity clauses?"
                  a="Yes. Every major parity clause (Booking, Expedia, Agoda) explicitly carves out private, unpublished quotes sent directly to an individual traveller. The rate that lands in your inbox is not on any public website. It cannot be, by the terms of the clause itself. That's the mechanism."
                />
                <FaqItem
                  q="Do I pay Stayward anything?"
                  a="No. Travellers never pay us. Hotels pay a flat monthly fee to receive briefs, much lower than the 15 to 25 per cent they'd lose to an OTA. Our incentives stay aligned with yours: we only keep hotels on the platform if their quotes are genuinely competitive."
                />
                <FaqItem
                  q="How fast are quotes?"
                  a="In the pilot, most quotes arrive within four to twelve hours. Hotels know briefs are time-sensitive and treat them as warm inbound leads. If nothing arrives in 24 hours, we'll tell you and either widen the search or refund any hold."
                />
                <FaqItem
                  q="What if no hotel quotes?"
                  a="It happens, especially for unusually tight dates or very niche briefs. If fewer than two hotels reply within 24 hours, we let you know and offer to re-route to a different set, or to broaden the criteria. You're not locked in."
                />
                <FaqItem
                  q="How do I know the rate is actually better?"
                  a="Check Booking.com yourself before accepting. If the direct quote isn't below the public rate on equivalent terms, don't take it, book the OTA. We're comfortable with that test because it's the whole point of the product."
                />
                <FaqItem
                  q="What happens after I pick a quote?"
                  a="You accept the quote in your Stayward inbox. We introduce you to the hotel directly. They take the booking, payment, any special requests. Stayward steps out. The relationship from that point is between you and the hotel."
                />
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
                Travellers describe what they want. We route matching briefs to you. You quote them whatever rate makes sense, direct, flexible, yours. No parity conflict, no OTA cut, no listing among 27,000 others.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <Link
                href="/for-hotels/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-paper-50 text-ink-900 text-sm transition-colors hover:bg-terracotta-500 hover:text-paper-50"
              >
                <span>How the hotel side works</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
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
