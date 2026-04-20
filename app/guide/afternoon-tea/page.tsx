import type { Metadata } from 'next'
import { GuideLayout } from '../GuideLayout'
import { AFTERNOON_TEA_HOTELS } from '@/data/guides'

export const metadata: Metadata = {
  title: 'Afternoon tea at British hotels',
  description: 'The hotels where afternoon tea is genuinely worth booking. The Langham (where it was invented), The Ritz Palm Court, Claridge\'s Foyer, The Savoy Thames Foyer, and the regional alternatives. Editorial reference.',
  alternates: { canonical: '/guide/afternoon-tea/' },
}

export default function AfternoonTeaGuide() {
  return (
    <GuideLayout
      eyebrow="Afternoon tea"
      title="Where to take afternoon tea properly."
      intro="The English afternoon tea was effectively invented in a specific room at the Langham in the 1860s. The hotels on this list are the ones where the meal is still taken seriously, not the 99 per cent of British hotels where it is served because guests expect it."
      bodyParagraphs={[
        "Afternoon tea at a grand hotel is one of the few British culinary traditions where format matters substantially. The sequence (sandwiches first, then warm scones with clotted cream and jam, then patisserie), the china, the tea service, and the room all contribute to whether the meal is a genuine ritual or a performance of one. The hotels below take the format seriously: most require reservations two to six weeks in advance, most enforce a dress code, and most produce the patisserie in their own kitchens rather than outsourcing to a supplier.",
        "The single most historically important tea service in Britain is the Palm Court at the Langham, where the modern ritual was codified in the 1860s. The Palm Court at the Ritz is the most consistently sought-after reservation, with five daily sittings that routinely book out weeks in advance; a dress code (jackets, no sportswear) is genuinely enforced. The Foyer and Reading Room at Claridge's and the Thames Foyer at the Savoy are the other two most widely recognised London tea rooms.",
        "Outside London, the tradition continues most strongly at the Edwardian and Victorian railway-era hotels (The Balmoral in Edinburgh, The Randolph in Oxford) and at country-house properties with pre-existing tea traditions (Hartwell House, Chewton Glen, The Royal Crescent). The Berkeley's Prêt-à-Portea is a category of its own: fashion-themed patisserie shaped as miniature couture, rotating with the season.",
        "Rates for afternoon tea at these properties range from roughly £55 to £120 per person for the base service, with champagne packages adding £25 to £50. Tea service is typically 90 minutes to two hours. Reservations are required at all the hotels on this list.",
      ]}
      hotelSlugs={AFTERNOON_TEA_HOTELS}
      relatedGuides={[
        { href: '/guide/michelin-starred-hotels/', label: 'Michelin-starred hotels in Britain' },
        { href: '/guide/historic-hotels/', label: 'Historic hotels of Britain' },
        { href: '/guide/london/', label: 'The London grand hotels' },
      ]}
      closingNote="We can book afternoon tea as part of a hotel stay, often at rates below the published service price when included in a private room quote. At hotels with high tea demand (the Ritz, Claridge's, the Langham), a same-week booking is effectively impossible through public channels; a concierge reservation is often the difference between securing a table and being told the next availability is in November."
    />
  )
}
