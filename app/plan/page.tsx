import type { Metadata } from 'next'
import { PlanFormClient } from './PlanFormClient'

export const metadata: Metadata = {
  title: 'Plan a stay',
  description:
    'Describe the stay you want. The Stayward team reads every brief personally and replies within 24 hours with direct quotes from hotels that fit.',
}

export const dynamic = 'force-dynamic'

export default function PlanPage() {
  return (
    <>
      <section className="container-edge pt-10 md:pt-16 pb-8">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-6">Plan a stay</div>
          <h1 className="font-display text-display-lg mb-4">
            Tell us what you want.
          </h1>
          <p className="text-ink-700 leading-relaxed max-w-reading mb-3">
            We read every brief personally. No bots, no mass-routing. Within 24 hours you'll get an email from the Stayward team with direct quotes that fit, usually below what you'd find on Booking.com.
          </p>
          <p className="text-sm text-ink-500 italic max-w-reading">
            No account needed. Free. Takes about a minute.
          </p>
        </div>
      </section>

      <section className="container-edge pb-section">
        <PlanFormClient />
      </section>
    </>
  )
}
