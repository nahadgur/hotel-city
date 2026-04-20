import type { Metadata } from 'next'
import { GuideLayout } from '../GuideLayout'
import { DOG_FRIENDLY_HOTELS } from '@/data/guides'

export const metadata: Metadata = {
  title: 'Dog-friendly luxury hotels in Britain',
  description: 'Hotels that take dogs seriously, not grudgingly. Grand London hotels with documented dog programmes (Brown\'s, The Connaught, The Beaumont), country-house properties with walkable estates, and coastal hotels with beach access.',
  alternates: { canonical: '/guide/dog-friendly-hotels/' },
}

export default function DogFriendlyGuide() {
  return (
    <GuideLayout
      eyebrow="Dog-friendly hotels"
      title="The hotels that actually want your dog."
      intro="Most British hotels will grudgingly accept a dog in exchange for a cleaning fee. The hotels below treat dogs as an intentional part of the property: named dog beds, welcome bowls, ground-floor rooms with direct garden access, estate walks. The difference is obvious once you stay at one."
      bodyParagraphs={[
        "Dog-friendly is not a binary. At one end are hotels where dogs are tolerated in specific rooms for a fee, with expectations that they not enter public areas. At the other end are hotels with an intentional dog programme: treats at check-in, branded beds and bowls in the room, ground-floor access for easy outdoor toileting, dog-walking guides for the estate, sometimes a resident hotel dog as a mascot. The hotels on this list skew toward the second category.",
        "London is structurally more difficult for dogs than the country, which is why the London hotels on this list are the exception rather than the norm. Brown's is the London hotel with the most substantial dog programme, followed by The Connaught. Claridge's accepts dogs up to 15kg. The Beaumont, The Lanesborough, and 45 Park Lane all accept smaller dogs. Grand hotels restricting weight or breed typically cite insurance and other-guest considerations.",
        "The country-house and coastal hotels are where dog-friendliness genuinely matters, because the stay typically involves walking the dog for an hour or more each morning and evening. The Torridon and Inverlochy Castle (with their Highland estates), Gleneagles (850 acres of parkland), Swinton Park (20,000 acres), Chewton Glen (130 acres bordering the New Forest), and The Headland (with direct access to the coastal path above Fistral Beach) all offer substantial on-property or immediately adjacent walking. Cotswolds properties including Soho Farmhouse (in specific cabins), The Lygon Arms, and The Wild Rabbit all welcome dogs.",
        "Policies vary substantially in the detail. Some hotels restrict dogs to specific room types (ground floor, coach house, cottages). Some charge a nightly supplement (typically £25 to £50 per dog per night). Some limit the number of dogs per room. Dogs are often excluded from dining rooms but allowed in bars and public lounges. When we book on your behalf, we confirm these specifics for each stay.",
        "Chewton Glen, worth noting specifically, permits dogs only in the treehouses, not the main hotel; this is the most restrictive policy on this list but the treehouse setting is arguably the best-suited accommodation for a dog-accompanied stay of any British hotel.",
      ]}
      hotelSlugs={DOG_FRIENDLY_HOTELS}
      relatedGuides={[
        { href: '/guide/historic-hotels/', label: 'Historic hotels of Britain' },
        { href: '/guide/small-luxury-hotels/', label: 'Small luxury hotels in Britain' },
        { href: '/guide/cotswolds/', label: 'Cotswolds hotels' },
      ]}
      closingNote="When you brief us on a dog-accompanied stay, we confirm three things with each hotel on your behalf: the specific room types dogs are allowed in, the nightly dog supplement, and any restrictions on public areas. This saves a round of back-and-forth that is common when booking direct."
    />
  )
}
