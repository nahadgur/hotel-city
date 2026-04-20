export type Hotel = {
  slug: string
  name: string
  tagline: string
  city: string
  country: string
  neighbourhood: string
  coordinates: { lat: number; lng: number }
  heroImage: string
  gallery: string[]
  rooms: number
  priceFrom: number // all-in, GBP
  currency: 'GBP'
  stars: 3 | 4 | 5
  atmosphere: string[] // the "vibe" tags — semantic-searchable
  atmosphereDescription: string // prose for embedding
  workFriendliness: 1 | 2 | 3 | 4 | 5
  noiseLevel: 'silent' | 'low' | 'moderate' | 'lively'
  bestFor: string[]
  amenities: Amenity[]
  signatureDetail: string // the one thing
  rawDescription: string
  sustainability?: string[]
  yearOpened?: number
  contactEmail?: string
}

export type Amenity = {
  name: string
  category: 'sleep' | 'work' | 'bathroom' | 'food' | 'light' | 'layout' | 'service'
  verified: boolean
  detail?: string
}

export type SearchFilters = {
  city?: string
  maxPrice?: number
  minWorkFriendliness?: number
  requiredAmenities?: string[]
  checkIn?: string
  checkOut?: string
}

export type ParsedQuery = {
  city?: string
  country?: string
  maxPriceGbp?: number
  requiredAmenities: string[]
  workMode?: 'deep-work' | 'casual' | 'none'
  noisePreference?: 'silent' | 'low' | 'moderate' | 'any'
  vibeDescription: string
  rawQuery: string
}

export type MatchResult = {
  hotel: Hotel
  matchScore: number
  matchReasons: string[]
  vibeScore: number
  structuredScore: number
}
