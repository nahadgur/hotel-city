import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getHotelsByRegion } from '@/data/hotels'

export const metadata: Metadata = {
  title: 'Scotland hotels',
  description: 'The grand hotels of Scotland: Gleneagles, The Fife Arms, The Balmoral Edinburgh, Cromlix, Inverlochy Castle. Editorial profiles of Highland resorts, Edinburgh landmarks, and country estates.',
  alternates: { canonical: '/guide/scotland/' },
}

export default function ScotlandGuide() {
  const scotlandHotels = getHotelsByRegion('scotland')

  return (
    <>
      <section className="container-edge pt-10 md:pt-16 pb-10">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-6">
            <Link href="/guide/" className="link-underline">Guide</Link>
            <span className="mx-2 text-ink-400">/</span>
            <span>Scotland</span>
          </div>
          <h1 className="font-display text-display-lg mb-5">Scotland.</h1>
          <p className="text-ink-700 text-lg leading-relaxed max-w-reading">
            Five hotels that define contemporary Scottish hospitality: Gleneagles, Britain&apos;s largest luxury resort; The Fife Arms, the Hauser and Wirth-owned contemporary-art Highland hotel; The Balmoral, Edinburgh&apos;s preeminent railway-era grand hotel; Cromlix, the Murray-owned Perthshire country house; and Inverlochy Castle, the Victorian baronial property at the foot of Ben Nevis.
          </p>
          <p className="text-ink-700 leading-relaxed max-w-reading mt-4">
            Scottish luxury hospitality has shifted substantially in the past decade, driven largely by the 2015 Ennismore acquisition of Gleneagles and the 2018 reopening of The Fife Arms under Iwan and Manuela Wirth. The five properties here represent the range of what the country now offers, from Edinburgh urban to remote Highland.
          </p>
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
        <div className="eyebrow mb-8">The hotels</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 max-w-5xl">
          {scotlandHotels.map((hotel) => (
            <Link
              key={hotel.slug}
              href={`/hotels/${hotel.slug}/`}
              className="group block border-t border-ink-900/15 pt-6 hover:border-ink-900 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="font-display text-2xl md:text-3xl leading-tight">
                  {hotel.name}
                </h2>
                <ArrowUpRight className="w-5 h-5 mt-1 text-ink-400 group-hover:text-terracotta-500 transition-colors shrink-0" strokeWidth={1.5} />
              </div>
              <div className="text-xs text-ink-500 uppercase tracking-wider mb-3 tabular">
                {hotel.city}
              </div>
              <p className="text-sm text-ink-700 leading-relaxed italic font-display">
                {hotel.oneLiner}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
        <div className="max-w-reading">
          <div className="eyebrow mb-5">How Scottish hotel rates work</div>
          <div className="space-y-4 text-ink-700 leading-relaxed">
            <p>
              Scottish hotel pricing runs against a different seasonal curve from London. Summer (June to September) is the high season for leisure visitors, and Hogmanay (the New Year period, 30 December to 2 January) is peak for Edinburgh specifically; the Edinburgh Festival in August is a secondary peak. Winter outside Hogmanay is genuinely low season across most Scottish hotels and the private-rate conversation is substantially more flexible.
            </p>
            <p>
              Gleneagles specifically is one of the more commercially flexible British resort hotels because its revenue model depends on activity packages (golf, shooting, spa) as much as on room rates. Private rates are often structured as bundled activity inclusions. The Fife Arms, Cromlix, and Inverlochy Castle are all family-owned or independent, which typically means more negotiating room than at the group-operated Balmoral.
            </p>
            <p>
              The London to Scotland rail link makes these hotels more accessible than the drive times suggest. London Kings Cross to Edinburgh Waverley is four hours twenty minutes; onward to Gleneagles is another hour. London to Fort William (for Inverlochy Castle) takes longer via the West Highland line but is one of the more scenic rail journeys in Britain.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/plan/" className="btn-primary">
              Send us a brief
            </Link>
            <Link href="/guide/london/" className="btn-ghost">
              London hotels
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
