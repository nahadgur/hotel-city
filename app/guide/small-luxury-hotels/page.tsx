import type { Metadata } from 'next'
import { GuideLayout } from '../GuideLayout'
import { SMALL_LUXURY_HOTELS } from '@/data/guides'

export const metadata: Metadata = {
  title: 'Small luxury hotels in Britain',
  description: 'Boutique British hotels under 50 rooms, where scale is the point. Family-owned country houses, restaurant-with-rooms properties, and historic buildings where the small footprint shapes the experience.',
  alternates: { canonical: '/guide/small-luxury-hotels/' },
}

export default function SmallLuxuryGuide() {
  return (
    <GuideLayout
      eyebrow="Small luxury hotels"
      title="The hotels where scale is the point."
      intro="There is a specific category of British hotel where the room count is kept deliberately low, usually under 40 keys, often under 20. The hotels below make their small footprint a commercial feature rather than a limitation."
      bodyParagraphs={[
        "Small luxury hotels operate on a different model from the London grand hotels. A 15-room property cannot support the operational infrastructure of a 200-room hotel: no separate concierge, sommelier, and assistant manager on every shift; no three separate restaurants. What they trade in exchange is a specific kind of personal attention that depends on staff actually knowing each guest, rooms that are individually specified rather than standardised, and operational decisions made by the owner rather than by a corporate layer.",
        "The smallest properties on this list have fewer than 20 rooms: The Star at Harome (13), Cromlix (15), The Wild Rabbit (15), Inverlochy Castle (17), The Torridon (18), Barnsley House (18), The Idle Rocks (19), The Slaughters Manor House (19). At this scale, a hotel is effectively a large private house with rooms for paying guests; the register is closer to staying with knowledgeable friends than to commercial hospitality.",
        "The middle of this list (20 to 40 rooms) includes properties like Hotel Tresanton, Middlethorpe Hall, Le Manoir aux Quat'Saisons, Old Parsonage, and The Fife Arms. These are large enough to support proper restaurant kitchens and a small amount of leisure infrastructure while remaining small enough that staff recognise returning guests and decisions are made quickly.",
        "Small does not equal cheap. Several of the hotels on this list command rates higher than larger competitors specifically because of the small-footprint premium. Le Manoir, at 32 rooms, is among the most expensive country-house properties in Britain. The Fife Arms and Hotel Tresanton similarly price at the top of their regional markets.",
        "The commercial structure of small luxury hotels is usually independent ownership or small-group operation rather than corporate chain. On this list: Thyme (Hibbert family), The Nare (Ashworth family), Cromlix (Murray family), The Wild Rabbit (Bamford family through Daylesford), The Fife Arms (Wirth family through Artfarm), The Goring (Goring family, four generations). This continuity of ownership is one of the category's defining operational features.",
        "When working on behalf of guests, small hotels are often more flexible on room-type upgrades and bundled inclusions than on pure rate discounts. The commercial logic: a 15-room hotel losing a single booking to a competitor is proportionally three times the revenue hit of a 45-room hotel losing the same booking, so these properties tend to negotiate carefully on base rate but more willingly on inclusions that cost them less to offer.",
      ]}
      hotelSlugs={SMALL_LUXURY_HOTELS}
      canonicalPath="/guide/small-luxury-hotels/"
      schemaName="Small luxury hotels in Britain"
      schemaDescription="Boutique British hotels under 50 rooms, profiled by region."
      relatedGuides={[
        { href: '/guide/historic-hotels/', label: 'Historic hotels of Britain' },
        { href: '/guide/dog-friendly-hotels/', label: 'Dog-friendly luxury hotels' },
        { href: '/guide/michelin-starred-hotels/', label: 'Michelin-starred hotels' },
      ]}
      closingNote="The hotels on this list are the ones where calling ahead genuinely matters. We regularly find that private rates at small luxury hotels come with room-type upgrades (a larger suite, a room with a view, a garden-facing cottage) rather than rate reductions; the cost to the hotel of upgrading is low, and for the guest the difference in experience is substantial."
    />
  )
}
