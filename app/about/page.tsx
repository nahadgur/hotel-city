import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'Stayward is a small concierge team in London. You describe the stay you want, we negotiate with hotels directly, and you get quotes back by email within 24 hours.',
}

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="container-edge pt-12 md:pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-8">How it works</div>
          <h1 className="font-display text-display-xl mb-8">
            A concierge, not a{' '}
            <span className="italic text-terracotta-500">booking site</span>.
          </h1>
          <p className="font-display italic text-xl md:text-2xl text-ink-700 leading-snug max-w-reading">
            You describe what you want. A small team in London reads every brief and negotiates with hotels on your behalf. Quotes come back by email, usually within a day, often below what you\'d find on Booking.com.
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
                t: 'Describe it.',
                d: '"Quiet Paris, deep tub, fast wifi, three nights for a work sprint." The way you\'d tell a friend. Add dates and a rough budget if you have them.',
              },
              {
                n: '02',
                t: 'We read it.',
                d: 'Personally. A real person on our team in London reads every brief. No bots, no automated matching, no mass-routing.',
              },
              {
                n: '03',
                t: 'We ask the hotels.',
                d: 'We reach out to a handful of places that genuinely fit what you asked for, directly. They send us private quotes, the kind they can\'t publish.',
              },
              {
                n: '04',
                t: 'You get an email.',
                d: 'Within 24 hours. Quotes laid out plainly, side by side. Pick one and we introduce you to the hotel directly. The booking is yours and theirs.',
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
            <Link href="/plan/" className="btn-primary">
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
              <span>Start your brief</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY QUOTES ARE OFTEN CHEAPER */}
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
                Booking.com and Expedia charge hotels 15 to 25 per cent commission on every stay. They also require rate parity: the hotel can\'t display a cheaper rate on its own site, on Google, or on any public listing. It\'s how every booking site ends up quoting you an identical price.
              </p>
              <p className="text-ink-700 leading-relaxed">
                But there\'s a carve-out. Every major OTA contract explicitly allows hotels to offer cheaper rates in{' '}
                <span className="italic">private quotes sent directly to a specific traveller</span>. It\'s how returning guests, referrals, and corporate accounts have always worked. It\'s expressly legal, it\'s just not scalable on your own.
              </p>
              <p className="font-display italic text-xl text-ink-900 leading-snug">
                Stayward is the scalable version. We ask on your behalf, hotels quote privately, and the parity rule doesn\'t apply.
              </p>
              <p className="text-ink-700 leading-relaxed">
                Typical discount versus the public rate: 10 to 25 per cent on off-peak dates, sometimes more when a hotel has softness in its calendar. Not guaranteed, but that\'s the bandwidth when the OTA isn\'t taking its cut.
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
              <div className="eyebrow mb-3">What we don\'t do</div>
              <h2 className="font-display text-display-md">
                Things that are absent on purpose.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading space-y-6">
              <div className="flex items-start gap-4 pb-6 hairline">
                <ShieldCheck className="w-5 h-5 mt-1 shrink-0 text-sage-500" strokeWidth={1.5} />
                <div>
                  <h3 className="font-display text-lg mb-1">We don\'t take payment.</h3>
                  <p className="text-sm text-ink-700 leading-relaxed">
                    The transaction is between you and the hotel directly, on their system. Stayward is never in the money path. Nothing to charge back to us, nothing to refund, nothing to audit.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-6 hairline">
                <ShieldCheck className="w-5 h-5 mt-1 shrink-0 text-sage-500" strokeWidth={1.5} />
                <div>
                  <h3 className="font-display text-lg mb-1">We don\'t store your card.</h3>
                  <p className="text-sm text-ink-700 leading-relaxed">
                    No card details touch Stayward, ever. We have no PCI obligations because we handle no payments.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-6 hairline">
                <ShieldCheck className="w-5 h-5 mt-1 shrink-0 text-sage-500" strokeWidth={1.5} />
                <div>
                  <h3 className="font-display text-lg mb-1">We don\'t automate emails to hotels.</h3>
                  <p className="text-sm text-ink-700 leading-relaxed">
                    Every outreach is written by a person. Hotels know they\'re dealing with our concierge team, not a mass-routing bot. That\'s why they reply, and why they give us the rates they do.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 mt-1 shrink-0 text-sage-500" strokeWidth={1.5} />
                <div>
                  <h3 className="font-display text-lg mb-1">We don\'t do urgency theatre.</h3>
                  <p className="text-sm text-ink-700 leading-relaxed">
                    No countdown timers, no &ldquo;5 people are looking,&rdquo; no pre-ticked insurance, no fake discounts against a fake original price. Your brief sits with us until you\'re ready to decide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section>
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <div className="eyebrow mb-3">Who we are</div>
              <h2 className="font-display text-display-md">
                A small team in London.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading space-y-5 text-ink-700 leading-relaxed">
              <p>
                Stayward is run by a handful of people who got tired of how booking sites work. We think the right way to find a good hotel is to talk to a person who\'ll think about your actual stay, not to scroll through thirty listings sorted by whoever paid most for placement.
              </p>
              <p>
                We\'re small on purpose. Every brief gets read. Every reply is written by a person. If you email us with a question, you\'ll get a real answer from a real team member, not a ticket number.
              </p>
              <div>
                <Link href="/plan/" className="link-underline text-ink-900">
                  Try it with your own brief &rarr;
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
                A brief in. Quotes back.{' '}
                <span className="italic text-terracotta-400">Within 24 hours</span>.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4">
              <Link
                href="/plan/"
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
