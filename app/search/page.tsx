import { SearchInput } from '@/components/SearchInput'
import { HotelCard } from '@/components/HotelCard'
import { search, summariseIntent } from '@/lib/search'
import { hotels } from '@/data/hotels'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
}

type Props = { searchParams: { q?: string } }

export default function SearchPage({ searchParams }: Props) {
  const query = (searchParams.q || '').trim()

  if (!query) {
    return <EmptyState />
  }

  const { parsed, results } = search(query)
  const summary = summariseIntent(parsed)

  return (
    <>
      {/* INTENT BAR */}
      <section className="bg-ink-900 text-paper-50">
        <div className="container-edge py-10 md:py-14">
          <div className="eyebrow text-paper-300 mb-3">What we heard</div>
          <p className="font-display italic text-2xl md:text-3xl max-w-reading leading-snug">
            \u201C{query}\u201D
          </p>
          <p className="mt-4 text-paper-200 text-sm md:text-base max-w-reading">
            {summary}. {results.length === 0 ? 'Nothing matches yet \u2014 try broadening.' : `${results.length} ${results.length === 1 ? 'hotel matches' : 'hotels match'}.`}
          </p>
        </div>
      </section>

      {/* REFINE BAR */}
      <section className="bg-paper-50">
        <div className="container-edge py-8">
          <div className="max-w-3xl">
            <div className="eyebrow mb-3">Refine</div>
            <SearchInput initialQuery={query} />
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="container-edge py-12">
        {results.length === 0 ? (
          <div className="max-w-reading">
            <div className="eyebrow mb-3 text-ink-500">No matches yet</div>
            <h2 className="font-display text-display-md mb-4">Try something less specific.</h2>
            <p className="text-ink-700 leading-relaxed">
              The request you made is narrow. Drop a constraint (the city, the price, the
              specific amenity) and you\u2019ll see more.
            </p>
          </div>
        ) : (
          <div>
            <div className="eyebrow mb-2 text-ink-500">
              {results.length} {results.length === 1 ? 'result' : 'results'}, ranked by match
            </div>
            <div>
              {results.map((match) => (
                <HotelCard key={match.hotel.slug} hotel={match.hotel} match={match} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  )
}

function EmptyState() {
  return (
    <>
      <section className="container-edge pt-12 md:pt-20 pb-10">
        <div className="max-w-3xl">
          <div className="eyebrow eyebrow-rule mb-8">Search</div>
          <h1 className="font-display text-display-lg mb-6">
            Tell us what you\u2019re after.
          </h1>
          <p className="font-display italic text-xl text-ink-700 max-w-reading mb-10">
            In a sentence. The way you\u2019d tell a friend. We read the whole thing, find
            what fits, and tell you why we picked it.
          </p>
          <SearchInput autoFocus />
        </div>
      </section>

      <section className="container-edge py-12">
        <div className="eyebrow mb-4 text-ink-500">Or browse everything</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
          {hotels.slice(0, 6).map((hotel) => (
            <HotelCard key={hotel.slug} hotel={hotel} />
          ))}
        </div>
      </section>
    </>
  )
}
