import type { Metadata } from 'next'
import { Suspense } from 'react'
import { BriefFormClient } from './BriefFormClient'

export const metadata: Metadata = {
  title: 'Start a brief',
  description: 'Describe what you want. We route it to the 5 hotels that fit, and they quote you direct.',
}

export default function NewBriefPage() {
  return (
    <>
      <section className="container-edge pt-12 md:pt-20 pb-10">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-8">Start a brief</div>
          <h1 className="font-display text-display-lg mb-6">
            Tell us what you're after.
          </h1>
          <p className="font-display italic text-xl md:text-2xl text-ink-700 max-w-reading leading-snug">
            We'll route it to five hotels that actually fit. They'll quote you direct,
            often below the public rate. You pick one. That's it.
          </p>
        </div>
      </section>

      <section className="container-edge pb-section">
        <Suspense fallback={<div className="max-w-3xl h-96 animate-pulse bg-paper-100" />}>
          <BriefFormClient />
        </Suspense>
      </section>
    </>
  )
}
