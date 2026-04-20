// Centralised JSON-LD schema generators.
// Every page that wants schema imports from here.

const SITE_URL = 'https://hotel-city-khaki.vercel.app'
const ORG_NAME = 'Stayward'

// ---------- Organization (used on homepage and layout) ----------

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NAME,
    url: SITE_URL,
    description:
      'A concierge service for direct hotel quotes. We brief hotels on your behalf and return private rates below the public parity price.',
    slogan: 'A concierge for direct hotel quotes.',
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
  }
}

// ---------- WebSite (homepage) ----------

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORG_NAME,
    url: SITE_URL,
    description:
      'Editorial profiles of British luxury hotels and a concierge service for sourcing private rates.',
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE_URL,
    },
  }
}

// ---------- Breadcrumbs ----------

type BreadcrumbItem = {
  name: string
  url: string
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}

// ---------- Hotel (profile pages) ----------

type HotelInput = {
  slug: string
  name: string
  city: string
  address: string
  postcode: string
  oneLiner: string
  openedYear: string
  restaurants: string[]
  owner: string
  operator: string
}

export function hotelSchema(hotel: HotelInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    description: hotel.oneLiner,
    address: {
      '@type': 'PostalAddress',
      streetAddress: hotel.address,
      postalCode: hotel.postcode,
      addressLocality: hotel.city,
      addressCountry: 'GB',
    },
    url: `${SITE_URL}/hotels/${hotel.slug}/`,
    brand: {
      '@type': 'Organization',
      name: hotel.operator,
    },
    identifier: hotel.owner ? { '@type': 'PropertyValue', propertyID: 'owner', value: hotel.owner } : undefined,
  }
}

// ---------- CollectionPage (hub and index pages) ----------

type CollectionInput = {
  name: string
  description: string
  url: string
  numberOfItems: number
}

export function collectionPageSchema(input: CollectionInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.name,
    description: input.description,
    url: input.url.startsWith('http') ? input.url : `${SITE_URL}${input.url}`,
    numberOfItems: input.numberOfItems,
    isPartOf: {
      '@type': 'WebSite',
      name: ORG_NAME,
      url: SITE_URL,
    },
  }
}

// ---------- Article (editorial spokes) ----------

type ArticleInput = {
  headline: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
}

export function articleSchema(input: ArticleInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: input.url.startsWith('http') ? input.url : `${SITE_URL}${input.url}`,
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    author: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE_URL,
    },
  }
}

// ---------- WebPage (static pages like /about, /for-hotels) ----------

type WebPageInput = {
  name: string
  description: string
  url: string
}

export function webPageSchema(input: WebPageInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.name,
    description: input.description,
    url: input.url.startsWith('http') ? input.url : `${SITE_URL}${input.url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: ORG_NAME,
      url: SITE_URL,
    },
  }
}

// ---------- Helper: emit JSON-LD as a script ----------

export function jsonLdScript(schemas: unknown[]) {
  const payload = schemas.length === 1 ? schemas[0] : schemas
  return {
    __html: JSON.stringify(payload).replace(/</g, '\\u003c'),
  }
}
