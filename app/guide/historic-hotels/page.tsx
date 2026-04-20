import type { Metadata } from 'next'
import { GuideLayout } from '../GuideLayout'
import { HISTORIC_HOTELS } from '@/data/guides'

export const metadata: Metadata = {
  title: 'Historic hotels of Britain',
  description: 'Hotels where the building is the reason to stay. Grade I and Grade II* listed properties across London, the Cotswolds, Scotland, Yorkshire, and Oxford, each with documented histories spanning centuries.',
  alternates: { canonical: '/guide/historic-hotels/' },
}

export default function HistoricGuide() {
  return (
    <GuideLayout
      eyebrow="Historic hotels"
      title="Hotels where the building is the reason."
      intro="British heritage architecture is the country's strongest differentiator in the luxury hotel category. The hotels below occupy buildings whose histories run from 1300 to 1931, and the building is the reason to be there."
      bodyParagraphs={[
        "A historic hotel is not the same as an old hotel. The meaningful distinction is whether the building's heritage is genuinely preserved (Grade I and Grade II* listed buildings are regulated such that exterior and most interior alterations require consent from Historic England or its devolved equivalents, which makes superficial modernisation essentially impossible) or whether the building has been gutted and the heritage signalling is decorative. The hotels on this list are the former: the building's historical fabric is the stay.",
        "The oldest building on this list is The Star at Harome in Yorkshire, a fourteenth-century cruck-framed thatched inn. Cruck framing, using curved timber pairs as the primary load-bearing structure, is one of the oldest surviving English vernacular building traditions and only a small number of intact examples remain. The 2021 fire destroyed the thatched roof; the 2022 rebuild used traditional construction methods.",
        "The sixteenth and seventeenth-century buildings on this list are mostly country-house and coaching-inn properties: The Lygon Arms (sixteenth century), The Slaughters Manor House (1658), Barnsley House (1697), Le Manoir aux Quat'Saisons (fifteenth-century origins), Hartwell House (early seventeenth century with substantial James Wyatt eighteenth-century additions), and Middlethorpe Hall (1699). These are the properties where staying in a genuinely preserved pre-Georgian building is the point.",
        "The Georgian period (roughly 1714 to 1830) produced some of the most architecturally significant buildings on this list. The Royal Crescent in Bath is Grade I listed and is one of the most important Palladian domestic compositions in Europe. Brown's occupies a row of 1837 Georgian townhouses. Swinton Park's Georgian core (with Gothic Revival additions) is Grade II*.",
        "The Victorian period is represented by most of the London grand hotels built between 1865 and 1906, the railway-era hotels (The Balmoral in Edinburgh, The Randolph in Oxford), and the Highland shooting lodges (The Fife Arms 1856, Inverlochy Castle 1863, The Torridon 1887). These buildings represent the peak of the Victorian commercial-luxury building boom.",
        "The early twentieth-century properties (The Ritz, The Dorchester, The Headland) close the list. After 1930, British commercial luxury construction essentially stopped until the 1990s; the hotels on this list effectively constitute the surviving inventory of British heritage luxury hospitality.",
      ]}
      hotelSlugs={HISTORIC_HOTELS}
      canonicalPath="/guide/historic-hotels/"
      schemaName="Historic hotels of Britain"
      schemaDescription="Grade I and Grade II* listed hotel buildings across Britain, profiled by region and period."
      relatedGuides={[
        { href: '/guide/small-luxury-hotels/', label: 'Small luxury hotels in Britain' },
        { href: '/guide/michelin-starred-hotels/', label: 'Michelin-starred hotels' },
        { href: '/guide/london/', label: 'The London grand hotels' },
      ]}
      closingNote="For guests specifically interested in heritage architecture, we can brief hotels on room-selection preferences (request the original building section rather than a newer wing, request a room with original fireplace or architectural features). Not all rooms at a listed hotel retain historic fabric; some are in newer extensions built alongside the protected shell. Worth asking."
    />
  )
}
