import type { Metadata } from 'next'
import Link from 'next/link'
import { articleSchema, breadcrumbSchema, jsonLdScript } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'What a private rate actually is',
  description: 'The contractual carve-out in every major OTA agreement that lets hotels offer rates below their public parity price. How it works, when it applies, and how to get one.',
  alternates: { canonical: '/guide/private-rates/' },
}

export default function PrivateRates() {
  const schemas = [
    articleSchema({
      headline: 'What a private rate actually is',
      description: 'The contractual carve-out in every major OTA agreement that lets hotels offer rates below their public parity price.',
      url: '/guide/private-rates/',
      datePublished: '2026-04-20',
    }),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Guide', url: '/guide/' },
      { name: 'Private rates', url: '/guide/private-rates/' },
    ]),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(schemas)} />
      <section className="container-edge pt-10 md:pt-16 pb-8">
        <div className="max-w-reading">
          <div className="eyebrow eyebrow-rule mb-6">
            <Link href="/guide/" className="link-underline">Guide</Link>
            <span className="mx-2 text-ink-400">/</span>
            <span>Private rates</span>
          </div>
          <h1 className="font-display text-display-lg mb-5 leading-tight">
            What a private rate actually is.
          </h1>
          <p className="text-ink-700 text-lg italic font-display max-w-reading">
            The rate that exists in every major OTA contract but never appears in a search result.
          </p>
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-10 md:py-14">
        <div className="max-w-reading space-y-5 text-ink-900 leading-relaxed">
          <p>
            A private rate is a room rate offered by a hotel directly to a specific named traveller, in a message that is not displayed on any public channel. It is usually sent by email, sometimes over the phone. The rate does not appear on Booking.com, on Expedia, on Google Hotels, on the hotel&apos;s own website booking engine, or on any metasearch comparison.
          </p>
          <p>
            Every major OTA parity clause allows this. The logic is straightforward: parity prevents the hotel from undercutting the OTA in public; it does not and cannot prevent a hotel from negotiating a rate with a specific individual. Corporate accounts have been booked at private rates since the 1970s. Returning VIPs, referrals, travel advisors, concierges, and travel agents have always been quoted privately. What is new is that very few individual travellers know this exists, and most do not know how to ask.
          </p>
          <p>
            Private rates at grand hotels typically run 8 to 22 per cent below the public parity rate on shoulder-season midweek dates, with more flexibility on larger-footprint hotels and less at smaller, capacity-constrained ones. Hotels will often include additional value in a private quote rather than a pure price cut: breakfast for two, a late 4pm checkout, an upgrade to a higher room category, a bottle of wine, a spa credit. These inclusions are part of the standard private-rate playbook and are usually worth £100 to £300 in themselves.
          </p>
          <p>
            The obvious question: why does the hotel do this? The answer is commission. A £500 room booked through Booking.com earns the hotel roughly £375 net. The same room booked direct, at a £420 private rate, earns the hotel £420. The hotel keeps more money, you pay less money, and the only loser is the aggregator. This is why hotels are, in our experience, usually happy to be asked.
          </p>
          <p>
            The reason more people do not do this: most travellers do not know the mechanism exists, and those who do find that writing, sending, and negotiating a brief with five different hotels is a time cost most people would rather not pay. Stayward exists because a concierge handling this is obviously more efficient than every traveller doing it from scratch.
          </p>
        </div>

        <div className="max-w-reading mt-10 flex flex-wrap gap-3">
          <Link href="/plan/" className="btn-primary">Send us a brief</Link>
          <Link href="/guide/rate-parity/" className="btn-ghost">How rate parity works</Link>
        </div>
      </section>
    </>
  )
}
