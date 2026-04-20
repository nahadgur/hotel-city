import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowUpRight, Check, X, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'For hotels',
  description: 'Warm, described-intent quote requests from travellers. Zero commission. Reply by email from the inbox you already use.',
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
              Warm quote requests.{' '}
              <span className="italic text-terracotta-500">Zero</span>{' '}
              commission.
            </h1>
            <p className="font-display italic text-xl md:text-2xl text-ink-700 max-w-reading leading-snug mb-10">
              Travellers describe what they want. We route matching briefs to your inbox.
              You reply with your best direct rate. No parity conflict, no percentage taken,
              no dashboard to manage.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#how-it-works" className="btn-primary">
                <span>See how it works</span>
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <Link href="#vs-ota" className="btn-ghost">
                <span>Compare to Booking.com</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-10 bg-paper-50">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="mb-14">
            <div className="eyebrow mb-3">How it works</div>
            <h2 className="font-display text-display-md max-w-reading">
              Four steps. Your existing email inbox is the whole workflow.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
            {[
              {
                n: '01',
                t: 'A brief arrives',
                d: 'A traveller sends us a brief. We match it to five hotels — you\'re one of them. You get an email with their dates, vibe, and budget.',
              },
              {
                n: '02',
                t: 'You reply',
                d: 'Reply to the email with whatever rate makes sense given your availability. No form, no dashboard, no minimum rate.',
              },
              {
                n: '03',
                t: 'The traveller picks',
                d: 'Your quote appears in their Stayward inbox alongside four others. If yours wins, they email you directly to confirm.',
              },
              {
                n: '04',
                t: 'You handle it like any direct booking',
                d: 'You take the reservation through your usual system. You keep 100% of the revenue. We aren\'t in the payment path.',
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

      {/* WHY THIS IS DIFFERENT */}
      <section className="bg-ink-900 text-paper-50">
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <div className="eyebrow text-paper-300 mb-3">The point</div>
              <h2 className="font-display text-display-md">
                This doesn't replace Booking.com.{' '}
                <span className="italic text-terracotta-400">It routes around it.</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading space-y-5 text-paper-200 leading-relaxed">
              <p>
                OTA parity clauses stop you advertising a cheaper rate on any public website.
                But they don't stop you offering a better rate in a private quote by email.
                That carve-out is in every major OTA contract. It's how returning guests and
                referrals have always been handled.
              </p>
              <p>
                Stayward industrialises that. We source travellers who've described what they
                want in a sentence, we match them to hotels that fit, and we pass the brief
                to your inbox. You quote whatever rate works given your current occupancy.
              </p>
              <p className="font-display italic text-xl text-paper-50">
                Nothing public, nothing indexed, nothing the OTA can see. Direct quotes,
                direct bookings, zero commission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PILOT TERMS */}
      <section id="pricing" className="scroll-mt-10">
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <div className="eyebrow mb-3">Pilot terms</div>
              <h2 className="font-display text-display-md">
                Free while we find out if this works.
              </h2>
              <p className="mt-5 text-ink-700 max-w-reading leading-relaxed">
                We're in pilot with a curated group of boutique hotels. Listing is free during
                this period. When we settle on pricing, it'll be a flat monthly fee — never a
                commission — and early partners get the first year at cost.
              </p>
            </div>

            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading space-y-6">
              <div className="p-6 md:p-8 border-l-2 border-terracotta-500 bg-paper-100">
                <div className="eyebrow text-terracotta-600 mb-2">What pilot partners get</div>
                <ul className="space-y-3">
                  {[
                    'Unlimited brief requests routed to your inbox.',
                    'No commission, no revenue share, no per-lead fee.',
                    'Priority placement in the matching algorithm.',
                    'Direct feedback channel while we shape the product.',
                    'Locked-in cost pricing when we introduce fees.',
                  ].map((s) => (
                    <li key={s} className="flex items-start gap-3 text-ink-800">
                      <Check className="w-4 h-4 mt-1 shrink-0 text-sage-500" strokeWidth={1.5} />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 md:p-8 border border-ink-900/15">
                <div className="eyebrow text-ink-500 mb-2">What we ask</div>
                <ul className="space-y-3">
                  {[
                    'You reply to briefs within 24 hours where possible.',
                    'Your quoted rate beats the OTA rate for the same dates.',
                    'You take the booking through your direct channel.',
                    'You let us know when a brief converts so we learn what works.',
                  ].map((s) => (
                    <li key={s} className="flex items-start gap-3 text-ink-700 text-sm">
                      <span className="text-terracotta-500 mt-1">—</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VS OTA */}
      <section id="vs-ota" className="scroll-mt-10 bg-paper-50">
        <div className="hairline" />
        <div className="container-edge py-section">
          <div className="mb-14">
            <div className="eyebrow mb-3">Versus Booking.com</div>
            <h2 className="font-display text-display-md max-w-reading">
              What changes when quotes come direct.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-ink-900/15 p-8 bg-paper-50">
              <div className="eyebrow mb-5 text-ink-500">Booking.com</div>
              <ul className="space-y-4">
                {[
                  '15–25% commission per booking',
                  'No direct relationship with the guest',
                  'Guest email is masked behind their platform',
                  'Rate parity clauses constrain every public price',
                  'Listing sits among 27,000 others',
                  'Sponsored-first sort — you pay to appear higher',
                  '"5 people are looking!" pressure on your room',
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
                  'Zero commission. Free during pilot.',
                  'Guest is yours from the moment you reply.',
                  'Full email, phone, dates, marketing consent.',
                  'Direct quotes are carved out of every OTA parity clause.',
                  'Curated inventory — under 100 hotels at launch.',
                  'Ranked by brief match, not by who paid most.',
                  'Calm, editorial experience. No urgency theatre.',
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

      {/* FAQ */}
      <section>
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-4">
              <div className="eyebrow mb-3">Straight answers</div>
              <h2 className="font-display text-display-md max-w-reading">
                Questions hotel owners always ask.
              </h2>
            </div>

            <div className="col-span-12 md:col-span-7 md:col-start-6 max-w-reading">
              <dl className="space-y-8">
                {[
                  {
                    q: 'Does this breach OTA rate parity?',
                    a: 'No. Every major OTA contract permits private quotes sent directly to a specific traveller. What they prohibit is advertising a cheaper rate on a public website — which we don\'t do. Your direct quote to the traveller stays private.',
                  },
                  {
                    q: 'What if I don\'t have availability for the dates?',
                    a: 'Don\'t reply. No penalty, no downranking. We prefer silence over a polite decline — it keeps the traveller\'s inbox clean.',
                  },
                  {
                    q: 'How do I get paid?',
                    a: 'The same way you do today for direct bookings. Stayward isn\'t in the payment path. Once the traveller accepts your quote, they contact you directly and you handle the reservation through your existing system.',
                  },
                  {
                    q: 'Is there a contract?',
                    a: 'No contract in the pilot. When we introduce pricing, it\'ll be a monthly flat fee with no minimum term — you can leave any time.',
                  },
                  {
                    q: 'Will my hotel get spam briefs?',
                    a: 'Briefs are routed based on fit. If your hotel is a £400/night design-led property in Copenhagen, you won\'t see briefs for weekend breaks in Blackpool. The whole point is that every brief you see is a genuine candidate.',
                  },
                  {
                    q: 'Can I hide from certain dates or block peak season?',
                    a: 'Yes — in the current manual setup, just let us know. A self-serve availability calendar is on the roadmap once we have meaningful volume.',
                  },
                ].map((item) => (
                  <div key={item.q} className="pb-6 hairline">
                    <dt className="font-display text-xl mb-2">{item.q}</dt>
                    <dd className="text-ink-700 leading-relaxed">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink-900 text-paper-50">
        <div className="container-edge py-section">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
            <div className="col-span-12 md:col-span-8">
              <div className="eyebrow text-paper-300 mb-4">Join the pilot</div>
              <h2 className="font-display text-display-lg">
                Takes one email.
              </h2>
              <p className="mt-6 text-paper-200 max-w-reading leading-relaxed text-lg">
                Send us the name of your property, the city, and the inbox you want briefs to land in.
                We'll come back within 48 hours to confirm your listing is live. No dashboard,
                no onboarding call, nothing to install.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <a
                href="mailto:hotels@stayward.com?subject=Pilot%20application"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-paper-50 text-ink-900 text-sm transition-colors hover:bg-terracotta-500 hover:text-paper-50 w-full"
              >
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                <span>Apply by email</span>
              </a>
              <p className="mt-3 text-xs text-paper-300 italic text-center">
                We reply personally within 48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
