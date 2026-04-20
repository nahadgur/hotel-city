import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Why every hotel site quotes you the same price',
  description: 'How rate parity works, why Booking.com and a hotel\'s own website show identical prices, and where the contractual gaps are.',
  alternates: { canonical: '/guide/rate-parity/' },
}

export default function RateParity() {
  return (
    <>
      <section className="container-edge pt-10 md:pt-16 pb-8">
        <div className="max-w-reading">
          <div className="eyebrow eyebrow-rule mb-6">
            <Link href="/guide/" className="link-underline">Guide</Link>
            <span className="mx-2 text-ink-400">/</span>
            <span>Rate parity</span>
          </div>
          <h1 className="font-display text-display-lg mb-5 leading-tight">
            Why every hotel site quotes you the same price.
          </h1>
          <p className="text-ink-700 text-lg italic font-display max-w-reading">
            Search a hotel on Booking.com, Expedia, and its own website. The price is the same. This is not a coincidence, and it is not market efficiency. It is a contract.
          </p>
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-10 md:py-14">
        <div className="max-w-reading space-y-5 text-ink-900 leading-relaxed">
          <p>
            When a hotel signs up with an Online Travel Agent (OTA) such as Booking.com or Expedia, one of the commercial terms it agrees to is rate parity. In practical terms: the hotel promises not to display a lower rate on any other public channel, including its own website. If Booking.com shows £450 a night for a standard room, the hotel&apos;s own booking engine is contractually required to show £450 too.
          </p>
          <p>
            The OTAs enforce parity automatically. Most large operators (Booking.com in particular) run continuous rate-scraping software against the hotel&apos;s own site and against competitor aggregators. A parity breach typically results in the hotel being demoted in Booking.com&apos;s default sort order, which is how the majority of its bookings are generated. A repeat breach can get the hotel removed from the platform entirely.
          </p>
          <p>
            The commission the hotel pays Booking.com or Expedia on each booking generated through those channels is typically 15 to 25 per cent of the room rate, depending on hotel size and market. For a £500 room, the hotel receives £375 to £425. Parity means the hotel cannot incentivise you to book direct by offering you a lower price, because that would be a parity breach. It cannot even offer its own past guests a discount on a public page. The commission structure is, in effect, priced into every rate you see.
          </p>
          <p>
            The contractual exception, which every major OTA parity clause contains in some form, is a private rate: a rate quoted directly to an individual, not listed on any publicly accessible channel. A hotel can legally offer a private rate 20 per cent below its public rate without breaching parity, because the private rate is not public. This is how corporate accounts, returning guests, referrals, and concierges have always got better prices. It is how every major OTA contract is designed. It is the mechanism Stayward uses.
          </p>
          <p>
            There is nothing underhand about this. The OTAs permit it explicitly because the alternative (blocking it) would have obvious antitrust implications and would close off hotels&apos; own direct customer relationships entirely. The only catch is that you have to actually ask.
          </p>
        </div>

        <div className="max-w-reading mt-10 flex flex-wrap gap-3">
          <Link href="/plan/" className="btn-primary">Send us a brief</Link>
          <Link href="/guide/private-rates/" className="btn-ghost">What a private rate is</Link>
        </div>
      </section>
    </>
  )
}
