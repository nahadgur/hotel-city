import type { Metadata } from 'next'
import { GuideLayout } from '../GuideLayout'
import { MICHELIN_STARRED_HOTELS } from '@/data/guides'

export const metadata: Metadata = {
  title: 'Michelin-starred hotels in Britain',
  description: 'British hotels with Michelin-starred restaurants on site. Three-star rooms (Hélène Darroze at The Connaught, Alain Ducasse at The Dorchester), two-star rooms (Dinner by Heston Blumenthal, Restaurant Andrew Fairlie, Le Manoir aux Quat\'Saisons), and notable one-star kitchens.',
  alternates: { canonical: '/guide/michelin-starred-hotels/' },
}

export default function MichelinGuide() {
  return (
    <GuideLayout
      eyebrow="Michelin-starred hotels"
      title="Hotels where the restaurant is the reason to book."
      intro="Britain has roughly 200 Michelin-starred restaurants; only a small subset are inside hotels where you can walk upstairs to sleep after dinner. This is the list of those hotels."
      bodyParagraphs={[
        "A Michelin-starred restaurant inside a hotel solves a specific problem: you can book a serious tasting menu without needing to drive, taxi, or return to your own bed afterwards. The inconvenience of a late finish becomes a walk to the lift. For hotels with kitchens at this level, the restaurant is also usually the property's primary creative and commercial anchor, which shapes the register of the hotel around it.",
        "Three-star rooms in Britain are a vanishingly small category. Only five restaurants hold three Michelin stars at time of writing, and three of those five are inside hotels on this list: Hélène Darroze at The Connaught, Alain Ducasse at The Dorchester, and Core by Clare Smyth (which is not in a hotel). The three-star rooms at The Connaught and The Dorchester are among the most difficult Michelin reservations in Britain; typical lead time is six to twelve weeks for a weekday table, longer for Saturday.",
        "Two-star rooms are slightly more accessible. Dinner by Heston Blumenthal at the Mandarin Oriental Hyde Park, Restaurant Andrew Fairlie at Gleneagles, and Le Manoir aux Quat'Saisons all sit at two stars and have held them for over a decade. Le Manoir is technically a restaurant with rooms rather than a hotel with a restaurant, and its accommodation structure reflects this: the rooms exist to support the dinner.",
        "The one-star rooms at the hotels below are worth listing because in several cases the cooking is arguably at a higher level than the single star would suggest. The Star Inn at Harome recovered its one star in 2024 after the 2021 fire and subsequent rebuild; Grantley Hall's Shaun Rankin restaurant has held its star continuously since 2021; Gilpin's SOURCE and Linthwaite House's Henrock (the latter from Simon Rogan's L'Enclume operation in Cartmel) both operate Michelin kitchens in country-house settings.",
        "Tasting menus at all these properties range from roughly £120 to £220 per person, with wine pairings typically adding 60 to 100 per cent on top. Booking lead times vary substantially: the three-star rooms require months of advance planning; several one-star rooms have weekday tables available within a week or two.",
      ]}
      hotelSlugs={MICHELIN_STARRED_HOTELS}
      canonicalPath="/guide/michelin-starred-hotels/"
      schemaName="Michelin-starred hotels in Britain"
      schemaDescription="British hotels with Michelin-starred restaurants, profiled by star level and region."
      relatedGuides={[
        { href: '/guide/afternoon-tea/', label: 'Afternoon tea at British hotels' },
        { href: '/guide/small-luxury-hotels/', label: 'Small luxury hotels in Britain' },
        { href: '/guide/london/', label: 'The London grand hotels' },
      ]}
      closingNote="We can package hotel stays at these properties with restaurant reservations, often with the tasting menu credit or wine pairing included in a private rate. For the three-star London rooms, the restaurant booking is the harder asset to secure than the room; a concierge approach sometimes opens tables that are not available on the hotel's own public booking system."
    />
  )
}
