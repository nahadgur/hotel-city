import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, ShieldCheck, Mail, Sparkles, ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'For hotels',
  description:
    'Warm, pre-qualified leads from the Stayward concierge team. No OTA commission, no parity conflict, no platform fees. You set the rate, quote when it fits, decline when it doesn\'t.',
}

export default function ForHotelsPage() {
  return (
    <>
      {/* HERO */}
      <section className="container-edge pt-12 md:pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-8">For hotels</div>
          <h1 className="font-display text-display-xl mb-8">
            Warm leads from a real concierge.{' '}
            <span className="italic text-terracotta-500">Zero commission</span>.
          </h1>
          <p className="font-display italic text-xl md:text-2xl text-ink-700 leading-snug max-w-reading">
            We\'re a small team in London, reading traveller briefs by hand and reaching out to hotels that fit. You quote what makes sense, decline what doesn\'t, and keep 100% of the booking when one closes.
          </p>
          <div className="mt-10 flex flex-wrap gap-5 items-center">
            <a href="mailto:hotels@stayward.co?subject=Stayward%20pilot%20enquiry" className="btn-primary">
              <Mail className="w-4 h-4" strokeWidth={1.5} />
              <span>Join the pilot</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <a href="#how-it-works" className="text-sm text-ink-700 link-underline">
              How it works for hotels
            </a>
          </div>
        </div>
      </section>

      {/* THE FOUR STEPS FOR HOTELS */}
      <section id="how-it-works" className="bg-paper-50">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="eyebrow mb-3">How it works, for you</div>
          <h2 className="font-display text-display-md mb-14 max-w-reading">
            Pre-qualified briefs. No auction. No race to the bottom.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
            {[
              {
                n: '01',
                t: 'A traveller sends a brief.',
                d: 'They describe their stay in plain language: dates, vibe, what matters. "Quiet Paris, deep tub, fast wifi, three nights."',
              },
              {
                n: '02',
                t: 'We read it. Then we email you.',
                d: 'A person on our team picks a handful of hotels that genuinely fit. You get a personal email with the brief and the dates. No bulk blast.',
              },
              {
                n: '03',
                t: 'You quote, or you don\'t.',
                d: 'Reply with a rate you\'d offer a returning guest. Or decline, no hard feelings. No pressure, no rating penalty.',
              },
              {
                n: '04',
                t: 'We introduce you directly.',
                d: 'If the traveller picks your quote, we hand them to you by email. The booking happens on your system. Payment, confirmation, special requests, all you.',
              },
            ].map((s) => (
              <div key={s.n}>
                <div className="font-display text-3xl text-terracotta-500 mb-3">{s.n}</div>
                <h3 className="font-display text-xl mb-2">{s.t}</h3>
                <p className="text-ink-700 leading-relaxed text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VS OTA */}
      <section id="vs-ota">
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <div className="eyebrow mb-3">Versus the OTAs</div>
              <h2 className="font-display text-display-md">
                Stayward isn\'t fighting the OTA.{' '}
                <span className="italic text-terracotta-500">It routes around it</span>.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading space-y-5 text-ink-700 leading-relaxed">
              <p>
                Parity clauses stop you from publishing a better rate publicly. They don\'t stop you from quoting a specific traveller a specific price in a private message. Every major OTA contract expressly allows it.
              </p>
              <p>
                That\'s all we do: we bring you specific travellers, and you send them a private quote. Nothing appears on any public channel. Nothing your OTA account manager can see or flag. The travellers who come through us are travellers who wouldn\'t have been on Booking.com at all.
              </p>
              <p className="font-display italic text-xl text-ink-900 leading-snug">
                The OTA keeps its volume. You keep 100% of the traveller.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-paper-50">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <div className="eyebrow mb-3">Pricing</div>
              <h2 className="font-display text-display-md">
                Pay only when a booking closes.
              </h2>
              <p className="mt-5 text-ink-700 leading-relaxed max-w-reading">
                No monthly fee during the pilot. No platform subscription. No listing cost.
              </p>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading space-y-6">
              <div className="border-l-2 border-terracotta-500 bg-paper-50 p-6 md:p-8">
                <div className="eyebrow mb-2 text-terracotta-600">Booking fee</div>
                <div className="font-display text-4xl md:text-5xl mb-2 tabular">5%</div>
                <p className="text-sm text-ink-700 leading-relaxed">
                  Of the room rate, invoiced monthly, only for bookings that actually close. Compared to 15&ndash;25% with an OTA, you keep 10&ndash;20 points more on every stay we send.
                </p>
              </div>
              <div className="text-sm text-ink-700 space-y-3 leading-relaxed">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-sage-500" strokeWidth={1.5} />
                  <span>No fee if the traveller doesn\'t book with you.</span>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-sage-500" strokeWidth={1.5} />
                  <span>No fee on cancelled or refunded stays.</span>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-sage-500" strokeWidth={1.5} />
                  <span>No fee on extras: food, spa, late checkout, you keep it all.</span>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-sage-500" strokeWidth={1.5} />
                  <span>No fee for the traveller. They never pay us a penny.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-4">
              <div className="eyebrow mb-4">Questions from hoteliers</div>
              <h2 className="font-display text-display-md max-w-reading">
                What we get asked, and straight answers.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <div className="divide-y divide-ink-900/10">
                <FaqItem
                  q="Does this breach my OTA parity clause?"
                  a="No. Parity only applies to public, published rates. Stayward quotes are private emails to a specific traveller, which is expressly allowed under every major parity clause. The rate never appears on any public channel."
                />
                <FaqItem
                  q="How often will I get briefs?"
                  a="We\'re small, so this is honest: not flooded. During the pilot, expect a handful of briefs per month that genuinely fit your property. If you want volume, stay on the OTAs. If you want quality, we\'re for you."
                />
                <FaqItem
                  q="Do I have to quote?"
                  a="Never. If the dates don\'t work, or the budget\'s wrong, just reply 'pass' or ignore it. No metric, no ranking, no penalty. We only pass briefs to hotels that are likely to fit."
                />
                <FaqItem
                  q="Who handles the booking?"
                  a="You do. We introduce the traveller, you take the booking on your own system, they pay you directly. Stayward is never in the money path. We just send the invoice for our cut afterwards."
                />
                <FaqItem
                  q="Is this exclusive?"
                  a="No. You keep your OTA listings, your direct booking engine, everything. Stayward sits alongside. Most of our pilot hotels see us as a small high-margin channel on top of their existing mix."
                />
                <FaqItem
                  q="How do I join the pilot?"
                  a={
                    <>
                      Email{' '}
                      <a href="mailto:hotels@stayward.co" className="link-underline">hotels@stayward.co</a>{' '}
                      with the name of your hotel, a link to your site, and what sort of stays suit you best. We\'ll be in touch within a day.
                    </>
                  }
                />
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
              <div className="eyebrow text-paper-300 mb-4">Join the pilot</div>
              <h2 className="font-display text-display-lg">
                A channel that behaves like your{' '}
                <span className="italic text-terracotta-400">best returning guest</span>.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4">
              <a
                href="mailto:hotels@stayward.co?subject=Stayward%20pilot%20enquiry"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-paper-50 text-ink-900 text-sm transition-colors hover:bg-terracotta-500 hover:text-paper-50 w-full"
              >
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                <span>Email us</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function FaqItem({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details className="group py-5">
      <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
        <span className="font-display text-lg md:text-xl leading-snug pr-4">{q}</span>
        <ChevronDown className="w-5 h-5 mt-1 shrink-0 text-ink-500 transition-transform group-open:rotate-180" strokeWidth={1.5} />
      </summary>
      <div className="mt-3 text-ink-700 leading-relaxed max-w-reading">{a}</div>
    </details>
  )
}
