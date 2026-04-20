import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <section className="container-edge pt-12 md:pt-20 pb-10">
        <div className="max-w-reading">
          <div className="eyebrow eyebrow-rule mb-8">Not found</div>
          <h1 className="font-display text-display-lg mb-6 leading-tight">
            That page doesn&apos;t exist.
          </h1>
          <p className="font-display italic text-xl text-ink-700 mb-4">
            Or it did, and we retired it. Either way, you&apos;re here now.
          </p>
          <p className="text-ink-700 leading-relaxed mb-10">
            A handful of places worth going next, in case one of them is what you were looking for.
          </p>
          <Link href="/plan/" className="btn-primary">
            Send us a brief
          </Link>
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
        <div className="eyebrow mb-8">Guide by region</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6 max-w-5xl">
          {[
            { href: '/guide/london/', label: 'London', sub: 'The Savoy, Claridge\u2019s, The Ritz, The Connaught, and 12 others.' },
            { href: '/guide/cotswolds/', label: 'Cotswolds', sub: 'Soho Farmhouse, Thyme, The Lygon Arms, The Wild Rabbit.' },
            { href: '/guide/scotland/', label: 'Scotland', sub: 'Gleneagles, The Fife Arms, The Balmoral, The Torridon.' },
            { href: '/guide/lake-district/', label: 'Lake District', sub: 'Gilpin Hotel, Another Place, Linthwaite House.' },
            { href: '/guide/cornwall/', label: 'Cornwall', sub: 'The Headland, Hotel Tresanton, The Nare, The Idle Rocks.' },
            { href: '/guide/yorkshire/', label: 'Yorkshire', sub: 'Grantley Hall, Swinton Park, Middlethorpe Hall.' },
            { href: '/guide/bath-oxford-and-country/', label: 'Bath, Oxford and country', sub: 'The Royal Crescent, Le Manoir, Chewton Glen, Hartwell House.' },
          ].map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group block border-t border-ink-900/15 pt-5 hover:border-ink-900 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-display text-xl">{r.label}</h3>
                <ArrowUpRight className="w-4 h-4 mt-1.5 text-ink-400 group-hover:text-terracotta-500 transition-colors shrink-0" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-ink-700 italic">{r.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
        <div className="eyebrow mb-8">Guide by theme</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6 max-w-5xl">
          {[
            { href: '/guide/afternoon-tea/', label: 'Afternoon tea', sub: 'The hotels where the meal is still taken seriously.' },
            { href: '/guide/michelin-starred-hotels/', label: 'Michelin-starred', sub: 'Hotels where the restaurant is the reason to book.' },
            { href: '/guide/dog-friendly-hotels/', label: 'Dog-friendly', sub: 'Hotels that actively want your dog.' },
            { href: '/guide/historic-hotels/', label: 'Historic hotels', sub: 'Grade I and II* listed buildings where the architecture is the draw.' },
            { href: '/guide/small-luxury-hotels/', label: 'Small luxury', sub: 'Boutique properties under 50 rooms where scale is the point.' },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group block border-t border-ink-900/15 pt-5 hover:border-ink-900 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-display text-xl">{t.label}</h3>
                <ArrowUpRight className="w-4 h-4 mt-1.5 text-ink-400 group-hover:text-terracotta-500 transition-colors shrink-0" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-ink-700 italic">{t.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="hairline" />

      <section className="container-edge py-12 md:py-16">
        <div className="max-w-reading">
          <div className="eyebrow mb-5">Or just go here</div>
          <ul className="space-y-2.5">
            <li>
              <Link href="/hotels/" className="text-ink-900 link-underline">
                The full list of 48 hotels we cover
              </Link>
            </li>
            <li>
              <Link href="/guide/" className="text-ink-900 link-underline">
                The guide pillar page
              </Link>
            </li>
            <li>
              <Link href="/about/" className="text-ink-900 link-underline">
                How Stayward works
              </Link>
            </li>
            <li>
              <Link href="/" className="text-ink-900 link-underline">
                Back to the start
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
