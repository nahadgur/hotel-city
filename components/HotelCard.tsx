import Image from 'next/image'
import Link from 'next/link'
import type { MatchResult } from '@/lib/types'
import type { Hotel } from '@/lib/types'
import { ArrowUpRight } from 'lucide-react'

export function HotelCard({ hotel, match }: { hotel: Hotel; match?: MatchResult }) {
  return (
    <Link href={`/hotels/${hotel.slug}/`} className="group block">
      <article className="grid grid-cols-12 gap-6 md:gap-10 py-8 hairline">
        <div className="col-span-12 md:col-span-5 relative aspect-[4/3] overflow-hidden bg-ink-100">
          <Image
            src={hotel.heroImage}
            alt={hotel.name}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
            priority={false}
          />
          {match && match.matchScore > 0.4 && (
            <div className="absolute top-3 left-3 bg-paper-50/95 backdrop-blur-sm px-2.5 py-1 text-xs tracking-wide text-ink-900">
              {Math.round(match.matchScore * 100)}% match
            </div>
          )}
        </div>

        <div className="col-span-12 md:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <div className="eyebrow text-ink-500">
                {hotel.city} \u00B7 {hotel.neighbourhood}
              </div>
              <div className="text-xs text-ink-500 tabular">
                {'\u2605'.repeat(hotel.stars)}
              </div>
            </div>

            <h3 className="font-display text-3xl md:text-4xl leading-tight mb-2">
              {hotel.name}
            </h3>

            <p className="text-ink-700 max-w-reading mb-5 leading-relaxed">
              {hotel.tagline}
            </p>

            {match && match.matchReasons.length > 0 && (
              <div className="mb-5 space-y-1.5">
                {match.matchReasons.map((r) => (
                  <div key={r} className="flex items-start gap-2 text-sm text-ink-700">
                    <span className="text-terracotta-500 mt-0.5">\u2014</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 text-xs text-ink-500">
              {hotel.bestFor.slice(0, 3).map((b) => (
                <span key={b} className="px-2 py-1 bg-ink-100/50">
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between mt-6 pt-6 hairline">
            <div>
              <div className="text-xs text-ink-500 mb-1">All-in, per night</div>
              <div className="font-display text-2xl tabular">
                \u00A3{hotel.priceFrom}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-700 group-hover:text-terracotta-500 transition-colors">
              <span>See the room</span>
              <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
