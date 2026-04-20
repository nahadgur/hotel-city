import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowUpRight, Check, X } from 'lucide-react'

export const metadata: Metadata = {
  title: 'For hotels',
  description: 'Flat monthly fee, 100% of your revenue, direct relationships with guests. The OTA alternative.',
}

export default function ForHotelsPage() {
  return (
    <>
      {/* HERO */}
      <section className="container-edge pt-12 md:pt-20 pb-16">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-8">
            <div className="eyebrow eyebrow-rule mb-8">For hotel owners</div>
            <h1 className="font-display text-display-xl mb-8">
              Keep{' '}
              <span className="italic text-terracotta-500">100%</span>{' '}
              of your room revenue.
            </h1>
            <p className="font-display italic text-xl md:text-2xl text-ink-700 max-w-reading leading-snug mb-10">
              Flat monthly fee instead of 15\u201325% commission. Direct relationships with the
              guests who booked. A listing that looks like your hotel, not a catalogue entry.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary">
                <span>Apply to list</span>
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <Link href="#vs-ota" className="btn-ghost">
                <span>See the comparison</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COMMISSION MATHS */}
      <section className="bg-ink-900 text-paper-50">
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <div className="eyebrow text-paper-300 mb-3">The maths</div>
              <h2 className="font-display text-display-md">
                You\u2019re losing roughly{' '}
                <span className="italic text-terracotta-400">a room a week</span>{' '}
                to Booking.com.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading">
              <p className="text-lg text-paper-200 leading-relaxed mb-8">
                A 20-room boutique at \u00A3200/night, 70% occupancy, 60% booked via OTAs at 18%
                commission, loses roughly \u00A3110,000 a year in commission alone. That\u2019s nine
                rooms of revenue, handed to an intermediary, for every year you\u2019re open.
              </p>

              <div className="border-t border-paper-50/15 pt-8 space-y-4">
                {[
                  ['Rooms', '20'],
                  ['ADR', '\u00A3200'],
                  ['Occupancy', '70%'],
                  ['Via OTAs', '60% of bookings'],
                  ['OTA commission', '18% (blended)'],
                  ['Annual commission lost', '\u00A3110,376'],
                  ['On Stayward instead (flat fee)', '\u00A34,788/year'],
                ].map(([k, v], i) => (
                  <div
                    key={k}
                    className={`flex items-baseline justify-between gap-6 pb-3 ${i === 5 || i === 6 ? 'border-t border-paper-50/15 pt-4' : ''}`}
                  >
                    <span className="text-paper-200 text-sm">{k}</span>
                    <span className={`font-display tabular ${i === 5 ? 'text-2xl text-terracotta-400' : i === 6 ? 'text-2xl text-sage-500' : 'text-base'}`}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-sm text-paper-300 italic">
                Break-even vs Booking.com is roughly one booking a month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="scroll-mt-10">
        <div className="container-edge py-section">
          <div className="mb-14">
            <div className="eyebrow mb-3">Pricing</div>
            <h2 className="font-display text-display-lg max-w-reading">
              Three flat rates. No commission. No bid-for-placement.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: 'Atelier',
                price: '\u00A3199',
                period: 'per month',
                desc: 'Up to 10 rooms. Best for small guesthouses and townhouses.',
                features: [
                  'Unlimited bookings',
                  'Natural-language listing',
                  '0% commission',
                  'Direct guest details',
                  'Apps Script / webhook hooks',
                  'Quarterly photography credit',
                ],
              },
              {
                name: 'Maison',
                price: '\u00A3399',
                period: 'per month',
                desc: 'Up to 50 rooms. Our typical boutique hotel fit.',
                features: [
                  'Everything in Atelier',
                  'Verified amenity badges',
                  'Priority placement in search',
                  'Dedicated onboarding session',
                  'Channel manager integration',
                  'Monthly performance report',
                ],
                highlight: true,
              },
              {
                name: 'Maison+',
                price: '\u00A3799',
                period: 'per month',
                desc: '50+ rooms. Small chains and premium properties.',
                features: [
                  'Everything in Maison',
                  'Multi-property dashboard',
                  'Insider-exclusive rate card',
                  'Early access inventory tools',
                  'Named account manager',
                  'API access',
                ],
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`p-8 border ${tier.highlight ? 'border-ink-900 bg-ink-900 text-paper-50' : 'border-ink-900/15 bg-paper-50'}`}
              >
                <div className={`eyebrow mb-2 ${tier.highlight ? 'text-paper-300' : 'text-ink-500'}`}>
                  {tier.name}
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <div className="font-display text-5xl tabular">{tier.price}</div>
                  <div className={`text-sm ${tier.highlight ? 'text-paper-300' : 'text-ink-500'}`}>
                    {tier.period}
                  </div>
                </div>
                <p className={`text-sm mb-8 ${tier.highlight ? 'text-paper-200' : 'text-ink-600'}`}>
                  {tier.desc}
                </p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check
                        className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlight ? 'text-terracotta-400' : 'text-sage-500'}`}
                        strokeWidth={1.5}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 text-sm transition-colors ${
                    tier.highlight
                      ? 'bg-paper-50 text-ink-900 hover:bg-terracotta-500 hover:text-paper-50'
                      : 'bg-ink-900 text-paper-50 hover:bg-terracotta-500'
                  }`}
                >
                  Apply to list
                </button>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-ink-500 text-center italic">
            3-month minimum commitment. Cancel any time after.
          </p>
        </div>
      </section>

      {/* VS OTA */}
      <section id="vs-ota" className="scroll-mt-10 bg-paper-50">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="mb-14">
            <div className="eyebrow mb-3">Versus Booking.com</div>
            <h2 className="font-display text-display-md max-w-reading">
              What changes when you move bookings direct.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-ink-900/15 p-8">
              <div className="eyebrow mb-5 text-ink-500">Booking.com</div>
              <ul className="space-y-4">
                {[
                  '15\u201325% commission per booking',
                  'No direct relationship with guest',
                  'Email address routed through them',
                  'Price-parity clauses constrain you',
                  'Listing sits among 27,000 others',
                  'Sponsored-first sort \u2014 you pay to appear',
                  '\u201C5 people are looking!\u201D pressure on your room',
                ].map((s) => (
                  <li key={s} className="flex items-start gap-3 text-ink-700">
                    <X className="w-4 h-4 mt-0.5 shrink-0 text-terracotta-500" strokeWidth={1.5} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-ink-900 p-8 bg-paper-100">
              <div className="eyebrow mb-5 text-ink-500">Stayward</div>
              <ul className="space-y-4">
                {[
                  'Flat monthly fee. 0% commission.',
                  'Guest books with you. Their details are yours.',
                  'Full email, marketing consent, repeat-booking pipeline.',
                  'Loyalty mechanics that bypass parity clauses cleanly.',
                  'Curated inventory. Under 1,000 hotels at launch.',
                  'Ranked by match quality, not who paid most.',
                  'Calm, honest listing. No urgency theatre.',
                ].map((s) => (
                  <li key={s} className="flex items-start gap-3 text-ink-800">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-sage-500" strokeWidth={1.5} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="container-edge py-section">
          <div className="max-w-reading">
            <div className="eyebrow mb-3">Apply to list</div>
            <h2 className="font-display text-display-md mb-6">
              We onboard slowly, on purpose.
            </h2>
            <p className="text-ink-700 leading-relaxed mb-8">
              We\u2019re not trying to hit 100,000 hotels. We\u2019re looking for boutique and
              independent properties that take the detail seriously. We\u2019ll visit yours
              before you go live.
            </p>
            <button className="btn-primary">
              <span>Apply</span>
              <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
