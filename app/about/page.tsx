import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Mail, ShieldCheck, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How it works',
  description: 'One brief, five quotes, direct from the hotels. How Stayward routes around the OTA tax without breaking any rules.',
}

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="container-edge pt-12 md:pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-8">How it works</div>
          <h1 className="font-display text-display-xl mb-8">
            A booking site that behaves like a{' '}
            <span className="italic text-terracotta-500">good concierge</span>,
            not a street hawker.
          </h1>
          <p className="font-display italic text-xl md:text-2xl text-ink-700 leading-snug max-w-reading">
            You describe what you want. Five hotels quote you directly. You pick one.
            No dark patterns, no surprise taxes, no fake urgency — and usually a better
            rate than anything Booking.com will ever let you see.
          </p>
        </div>
      </section>

      {/* THE FOUR STEPS */}
      <section className="bg-paper-50">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="eyebrow mb-3">The flow</div>
          <h2 className="font-display text-display-md mb-14 max-w-reading">
            Four steps. One inbox. No login required.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
            {[
              {
                n: '01',
                t: 'Start a brief.',
                d: '"Quiet Paris, deep soaking tub, fast wifi, for a 3-day work sprint." That sentence is your brief. Add dates and a budget if you have them.',
              },
              {
                n: '02',
                t: 'We route it.',
                d: 'Our matching engine picks the five hotels that genuinely fit what you described. We email each with your dates and brief.',
              },
              {
                n: '03',
                t: 'They quote you.',
                d: 'Quotes land in your inbox on Stayward, usually within a few hours. You see the rate, the message from the hotel, and how they match your brief.',
              },
              {
                n: '04',
                t: 'Pick one.',
                d: 'When you accept a quote, you\'re put in direct contact with that hotel. They handle the booking through their own system.',
              },
            ].map((s) => (
              <div key={s.n}>
                <div className="font-display text-3xl text-terracotta-500 mb-3">{s.n}</div>
                <h3 className="font-display text-xl mb-2">{s.t}</h3>
                <p className="text-ink-700 leading-relaxed text-sm">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 pt-10 hairline">
            <Link href="/dashboard/new/" className="btn-primary">
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
              <span>Start your brief</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY QUOTES ARE CHEAPER */}
      <section>
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <div className="eyebrow mb-3">Why the quotes are often cheaper</div>
              <h2 className="font-display text-display-md">
                The parity loophole,{' '}
                <span className="italic text-terracotta-500">explained</span>.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading space-y-5">
              <p className="text-ink-700 leading-relaxed">
                Booking.com and Expedia charge hotels 15 to 25 per cent commission on every
                booking. Then they require rate parity: the hotel can't display a cheaper rate
                on its own website, on Google, or on any public listing. That's how every
                booking site ends up showing you an identical price.
              </p>
              <p className="text-ink-700 leading-relaxed">
                But there's a specific carve-out. Every major OTA contract explicitly allows
                hotels to offer cheaper rates in{' '}
                <span className="italic">private quotes sent directly to a specific traveller</span>.
                It's how returning guests, referrals, and corporate accounts have always worked.
              </p>
              <p className="font-display italic text-xl text-ink-900 leading-snug">
                Stayward turns that carve-out into a product. We route your brief to hotels,
                they quote you privately, and the OTA parity rule doesn't apply.
              </p>
              <p className="text-ink-700 leading-relaxed">
                Typical discount versus the public rate: 10 to 25 per cent on off-peak dates,
                sometimes more when the hotel has softness. This is not a guarantee — it's
                just what hotels are free to offer when the OTA isn't in the middle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DON'T DO */}
      <section className="bg-paper-50">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <div className="eyebrow mb-3">What we don't do</div>
              <h2 className="font-display text-display-md">
                Things that are absent on purpose.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading space-y-6">
              <div className="flex items-start gap-4 pb-6 hairline">
                <ShieldCheck className="w-5 h-5 mt-1 shrink-0 text-sage-500" strokeWidth={1.5} />
                <div>
                  <h3 className="font-display text-lg mb-1">We don't take payment.</h3>
                  <p className="text-sm text-ink-700 leading-relaxed">
                    The transaction is between you and the hotel, on their booking system.
                    We're never in the money path. Nothing to charge back to, nothing to
                    refund from, nothing to audit.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-6 hairline">
                <ShieldCheck className="w-5 h-5 mt-1 shrink-0 text-sage-500" strokeWidth={1.5} />
                <div>
                  <h3 className="font-display text-lg mb-1">We don't store your card.</h3>
                  <p className="text-sm text-ink-700 leading-relaxed">
                    No card details touch Stayward, ever. We don't have PCI compliance obligations
                    because we never handle payments.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-6 hairline">
                <ShieldCheck className="w-5 h-5 mt-1 shrink-0 text-sage-500" strokeWidth={1.5} />
                <div>
                  <h3 className="font-display text-lg mb-1">We don't share your email.</h3>
                  <p className="text-sm text-ink-700 leading-relaxed">
                    Hotels receive your brief through our reply-routing system. Your actual
                    email stays private until you accept a quote, at which point you're put
                    in direct contact with just that one hotel.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 mt-1 shrink-0 text-sage-500" strokeWidth={1.5} />
                <div>
                  <h3 className="font-display text-lg mb-1">We don't do urgency theatre.</h3>
                  <p className="text-sm text-ink-700 leading-relaxed">
                    No countdown timers, no "5 people are looking," no pre-ticked insurance,
                    no fake discounts against a fake original price. Your brief sits there
                    until you're ready to decide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIDDEN METADATA */}
      <section>
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <div className="eyebrow mb-3">The detail</div>
              <h2 className="font-display text-display-md">
                We index the things Expedia ignores.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading space-y-5 text-ink-700 leading-relaxed">
              <p>
                "Fast Wi-Fi" is not a specification. Neither is "soaking tub." Neither is
                "quiet room." All three of those phrases have decided an entire stay against
                someone who booked in good faith.
              </p>
              <p>
                We store tub depth in centimetres. We store wifi speed as a tested number
                with a date. We store whether the AC rattles, whether the shower has
                pressure, whether the room shares a wall with a lift shaft. These details
                feed the matching engine — which is how your brief for "deep tub + fast wifi"
                lands with the right hotels.
              </p>
              <div>
                <Link href="/dashboard/new/" className="link-underline text-ink-900">
                  Try it with your own brief →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-ink-900 text-paper-50">
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
            <div className="col-span-12 md:col-span-8">
              <div className="eyebrow text-paper-300 mb-4">Ready?</div>
              <h2 className="font-display text-display-lg">
                One brief. Five quotes.{' '}
                <span className="italic text-terracotta-400">No middleman fees</span>.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4">
              <Link
                href="/dashboard/new/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-paper-50 text-ink-900 text-sm transition-colors hover:bg-terracotta-500 hover:text-paper-50 w-full"
              >
                <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                <span>Start your brief</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
