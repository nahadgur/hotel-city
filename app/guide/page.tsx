import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'The guide',
  description: 'Stayward\'s editorial guide to British hotels, rate parity, direct booking, and the mechanics of how hotels quote. Written by the concierge team.',
  alternates: { canonical: '/guide/' },
}

export default function GuidePage() {
  return (
    <>
      <section className="container-edge pt-10 md:pt-16 pb-12">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-6">The guide</div>
          <h1 className="font-display text-display-lg mb-5">
            How hotel booking actually works.
          </h1>
          <p className="text-ink-700 text-lg leading-relaxed max-w-reading">
            Writing from our concierge team on how hotels price themselves, how rate parity works, why every booking site quotes you the same number, and how to get a better one. Plus descriptive profiles of the British hotels we write about.
          </p>
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
        <div className="eyebrow mb-8">Regions</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8 max-w-5xl">
          <Link
            href="/guide/london/"
            className="group block border-t border-ink-900/15 pt-5 hover:border-ink-900 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="font-display text-2xl">London</h2>
              <ArrowUpRight className="w-4 h-4 mt-1.5 text-ink-400 group-hover:text-terracotta-500 transition-colors shrink-0" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-ink-700 italic">
              The grand hotels. The Savoy, Claridge&apos;s, The Connaught, The Ritz, The Dorchester, The Langham.
            </p>
          </Link>

          <div className="block border-t border-ink-900/15 pt-5 opacity-50">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="font-display text-2xl text-ink-500">Cotswolds</h2>
              <span className="text-xs text-ink-400 mt-2 tabular">Coming</span>
            </div>
            <p className="text-sm text-ink-500 italic">
              Country-house hotels in the Cotswolds, written up properly.
            </p>
          </div>

          <div className="block border-t border-ink-900/15 pt-5 opacity-50">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="font-display text-2xl text-ink-500">Scottish Highlands</h2>
              <span className="text-xs text-ink-400 mt-2 tabular">Coming</span>
            </div>
            <p className="text-sm text-ink-500 italic">
              Gleneagles, The Fife Arms, Inverlochy Castle, Cromlix.
            </p>
          </div>

          <div className="block border-t border-ink-900/15 pt-5 opacity-50">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="font-display text-2xl text-ink-500">Lake District</h2>
              <span className="text-xs text-ink-400 mt-2 tabular">Coming</span>
            </div>
            <p className="text-sm text-ink-500 italic">
              Sharrow Bay, Gilpin, Linthwaite, Another Place.
            </p>
          </div>

          <div className="block border-t border-ink-900/15 pt-5 opacity-50">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="font-display text-2xl text-ink-500">Cornwall</h2>
              <span className="text-xs text-ink-400 mt-2 tabular">Coming</span>
            </div>
            <p className="text-sm text-ink-500 italic">
              Tresanton, Idle Rocks, The Nare, The Headland, Watergate Bay.
            </p>
          </div>

          <div className="block border-t border-ink-900/15 pt-5 opacity-50">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="font-display text-2xl text-ink-500">Yorkshire</h2>
              <span className="text-xs text-ink-400 mt-2 tabular">Coming</span>
            </div>
            <p className="text-sm text-ink-500 italic">
              Grantley Hall, Swinton Park, Middlethorpe Hall, The Star at Harome.
            </p>
          </div>
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
        <div className="max-w-reading">
          <div className="eyebrow mb-5">Start here</div>
          <p className="text-ink-700 leading-relaxed mb-6">
            If you want to know how any of this actually works, these are the pieces we are writing first. The rest of the guide follows from them.
          </p>
          <ul className="space-y-4">
            <li>
              <Link href="/guide/rate-parity/" className="group block">
                <div className="font-display text-xl text-ink-900 group-hover:text-terracotta-500 transition-colors">
                  Why every hotel site quotes you the same price
                </div>
                <div className="text-sm text-ink-500 mt-1">On rate parity, OTA commission, and the contractual architecture behind hotel pricing.</div>
              </Link>
            </li>
            <li>
              <Link href="/guide/private-rates/" className="group block">
                <div className="font-display text-xl text-ink-900 group-hover:text-terracotta-500 transition-colors">
                  What a private rate actually is
                </div>
                <div className="text-sm text-ink-500 mt-1">The contractual carve-out that lets hotels quote you less than the public rate.</div>
              </Link>
            </li>
            <li>
              <Link href="/guide/london/" className="group block">
                <div className="font-display text-xl text-ink-900 group-hover:text-terracotta-500 transition-colors">
                  The London grand hotels
                </div>
                <div className="text-sm text-ink-500 mt-1">Descriptive profiles of the six properties that define the category.</div>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
