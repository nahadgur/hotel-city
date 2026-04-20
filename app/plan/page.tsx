import type { Metadata } from 'next'
import { getSessionUser } from '@/lib/session'
import { PlanFormClient } from './PlanFormClient'

export const metadata: Metadata = {
  title: 'Plan a stay',
  description:
    'Describe the stay you want. The Stayward team reads it personally and replies within 24 hours with direct quotes from hotels that fit.',
}

export const dynamic = 'force-dynamic'

export default async function PlanPage() {
  const user = await getSessionUser()

  return (
    <>
      <section className="container-edge pt-10 md:pt-16 pb-8">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-6">
            {user ? 'New brief' : 'Plan a stay'}
          </div>
          <h1 className="font-display text-display-lg mb-4">
            Tell us what you want.
          </h1>
          <p className="text-ink-700 leading-relaxed max-w-reading mb-3">
            We read every brief personally. No bots, no mass-routing. Within 24 hours you\'ll get an email from the Stayward team with direct quotes that fit, usually below what you\'d find on Booking.com.
          </p>
          {!user && (
            <p className="text-sm text-ink-500 italic max-w-reading">
              You don\'t need an account to send a brief. If you\'d like to track replies from a dashboard, you can <a href="/login/?next=/plan/" className="link-underline">sign in with Google</a> first.
            </p>
          )}
        </div>
      </section>

      <section className="container-edge pb-section">
        <PlanFormClient
          initialEmail={user?.email ?? null}
          initialName={user?.name ?? null}
          signedIn={Boolean(user)}
        />
      </section>
    </>
  )
}
