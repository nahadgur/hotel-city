import type { Metadata } from 'next'
import { ReceivedClient } from './ReceivedClient'

export const metadata: Metadata = {
  title: 'Brief received',
  description: 'Your brief has been received. The Stayward team will reply within 24 hours.',
  robots: { index: false, follow: false },
}

export default function ReceivedPage() {
  return (
    <section className="container-edge pt-10 md:pt-16 pb-section">
      <ReceivedClient />
    </section>
  )
}
