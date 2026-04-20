import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How we think',
  description: 'No dark patterns, no surprise taxes, no fake urgency. A different way to book a hotel.',
}

export default function AboutPage() {
  return (
    <>
      <section className="container-edge pt-12 md:pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-8">Philosophy</div>
          <h1 className="font-display text-display-xl mb-8">
            We thought the whole{' '}
            <span className="italic text-terracotta-500">thing</span>{' '}
            could be better.
          </h1>
          <p className="font-display italic text-xl md:text-2xl text-ink-700 leading-snug max-w-reading">
            Hotel booking sites have grown so hostile to the person actually booking
            that using one feels like negotiating with a cornered animal. We don\u2019t
            want to build that. So we haven\u2019t.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-paper-50">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="eyebrow mb-3">How it works</div>
          <h2 className="font-display text-display-md mb-14 max-w-reading">
            Type a sentence. Read what we matched. Book in one screen.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                n: '01',
                t: 'Describe it.',
                d: '\u201CQuiet Paris, deep soaking tub, fast wifi, for a 3-day work sprint.\u201D The sentence is the query. You don\u2019t click filters.',
              },
              {
                n: '02',
                t: 'We read it properly.',
                d: 'We parse what you said into structure (city, price, amenities) and vibe (quiet, work-focused, grown-up). We search both. We show you the match with reasons, not scores.',
              },
              {
                n: '03',
                t: 'Book without the theatre.',
                d: 'All-in price on the card. Reserve in three taps. No pre-ticked upsells, no account required to see the price, no \u201COnly 1 room left!\u201D',
              },
            ].map((s) => (
              <div key={s.n}>
                <div className="font-display text-4xl text-terracotta-500 mb-4">{s.n}</div>
                <h3 className="font-display text-2xl mb-3">{s.t}</h3>
                <p className="text-ink-700 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE DROP PROTECTION */}
      <section id="price-drop" className="scroll-mt-10">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <div className="eyebrow mb-3">Included on every booking</div>
              <h2 className="font-display text-display-md">
                Price Drop{' '}
                <span className="italic text-terracotta-500">Protection</span>.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading">
              <p className="text-lg text-ink-700 leading-relaxed mb-6">
                If the price of your room drops between booking and check-in, we credit you the
                difference automatically. No form to fill, no manual monitoring, no asking.
              </p>
              <p className="text-ink-700 leading-relaxed mb-6">
                It works because we hold the booking until check-in. Every six hours we re-check
                the current rate for your room. If it\u2019s lower, the delta goes straight to
                your Stayward account as a credit, ready for your next booking.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10 text-sm">
                <div>
                  <div className="font-display text-2xl tabular text-terracotta-500 mb-1">Every 6h</div>
                  <div className="text-ink-600">Re-check cadence</div>
                </div>
                <div>
                  <div className="font-display text-2xl tabular text-terracotta-500 mb-1">\u00A310</div>
                  <div className="text-ink-600">Minimum credit \u2014 avoids noise</div>
                </div>
                <div>
                  <div className="font-display text-2xl tabular text-terracotta-500 mb-1">Auto</div>
                  <div className="text-ink-600">Applied to your next stay</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSIDER MEMBERSHIP */}
      <section id="insider" className="scroll-mt-10 bg-ink-900 text-paper-50">
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <div className="eyebrow text-paper-300 mb-3">\u00A349 per year</div>
              <h2 className="font-display text-display-md">
                Insider{' '}
                <span className="italic text-terracotta-400">membership</span>.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading">
              <p className="text-lg text-paper-200 leading-relaxed mb-8">
                A private rate card, a first look at new hotels before they\u2019re public, and
                priority on the rooms every boutique holds back. \u00A349 a year. The first booking
                usually pays for it.
              </p>
              <ul className="space-y-4">
                {[
                  ['Private rate card', 'Rates that bypass the public listing, often 8\u201315% lower on direct.'],
                  ['Early access inventory', 'Rooms hotels hold back specifically for us. First look is yours.'],
                  ['Silent upgrades', 'Where an upgrade is available at check-in, you get it. Same price.'],
                  ['Transferable credits', 'Refer a friend. Both of you get a credit on your next stay.'],
                ].map(([t, d]) => (
                  <li key={t} className="py-4 border-t border-paper-50/15 flex gap-5">
                    <span className="text-terracotta-400 tabular text-xs mt-1.5">\u25CF</span>
                    <div>
                      <div className="font-display text-xl mb-1">{t}</div>
                      <div className="text-paper-200 text-sm leading-relaxed">{d}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <button className="inline-flex items-center gap-2 px-6 py-3.5 bg-paper-50 text-ink-900 text-sm hover:bg-terracotta-500 hover:text-paper-50 transition-colors">
                  <span>Join Insider</span>
                  <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <div className="mt-3 text-xs text-paper-300">
                  Coming at launch. We\u2019ll let you know.
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
                50 things Expedia ignores, that actually decide whether a room is good.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading space-y-5 text-ink-700 leading-relaxed">
              <p>
                \u201CFast Wi-Fi\u201D is not a specification. Neither is \u201Csoaking tub.\u201D
                Neither is \u201Cquiet room.\u201D All three of those phrases have decided an entire
                stay against somebody who booked in good faith.
              </p>
              <p>
                We store tub depth in centimetres. We store wifi speed as a tested number with
                a date. We store whether the AC rattles, whether the shower has pressure, whether
                the room shares a wall with a lift shaft, whether the mattress is pocket-spring
                or foam, whether the ethernet port is at the desk or behind the television.
              </p>
              <p>
                Hotels fill this in themselves at onboarding. Our team spot-checks. Verified
                details wear a badge. Everything else is self-reported but visible.
              </p>
              <div>
                <Link href="/search/" className="link-underline text-ink-900">
                  Search with it \u2192
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
