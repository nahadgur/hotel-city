import type { Metadata } from 'next'
import { Suspense } from 'react'
import { requireUser } from '@/lib/session'
import { ListingFormClient } from './ListingFormClient'

export const metadata: Metadata = {
  title: 'New listing',
  robots: { index: false, follow: false },
}

export default async function NewListingPage() {
  await requireUser('/dashboard/new')

  return (
    <>
      <section className="container-edge pt-10 md:pt-16 pb-10">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-8">New listing</div>
          <h1 className="font-display text-display-lg mb-4">
            Tell us what you're after.
          </h1>
          <p className="font-display italic text-xl md:text-2xl text-ink-700 max-w-reading leading-snug">
            We'll route your listing to the five hotels that fit. They'll quote you direct,
            often below the public rate. You pick one.
          </p>
        </div>
      </section>

      <section className="container-edge pb-section">
        <Suspense fallback={<div className="max-w-3xl h-96 animate-pulse bg-paper-100" />}>
          <ListingFormClient />
        </Suspense>
      </section>
    </>
  )
}
