import { hotels } from '@/data/hotels'
import type { Hotel, ParsedQuery, MatchResult } from './types'

// ============ QUERY PARSER (mock) ============
// In production this is replaced by a Claude API call with structured JSON output.
// The mock version uses keyword heuristics so the demo works with zero dependencies.

const CITY_ALIASES: Record<string, string> = {
  london: 'London',
  paris: 'Paris',
  lisbon: 'Lisbon',
  lisboa: 'Lisbon',
  kyoto: 'Kyoto',
  copenhagen: 'Copenhagen',
  københavn: 'Copenhagen',
  'new york': 'New York',
  nyc: 'New York',
  brooklyn: 'New York',
  manhattan: 'New York',
  venice: 'Venice',
  venezia: 'Venice',
  skye: 'Isle of Skye',
  scotland: 'Isle of Skye',
  antwerp: 'Antwerp',
  granada: 'Granada',
  andalucia: 'Granada',
  spain: 'Granada',
  bergen: 'Bergen',
  norway: 'Bergen',
  fjord: 'Bergen',
}

const WORK_SIGNALS = ['work', 'sprint', 'deep work', 'wifi', 'focus', 'write', 'writing', 'code', 'coding', 'laptop', 'remote work', 'meeting', 'calls']
const QUIET_SIGNALS = ['quiet', 'silent', 'peaceful', 'calm', 'still', 'restful']
const ROMANCE_SIGNALS = ['romantic', 'honeymoon', 'anniversary', 'couple']
const LUXE_SIGNALS = ['luxury', 'luxurious', 'five star', '5 star', 'palazzo', 'suite']
const DETOX_SIGNALS = ['detox', 'switch off', 'switch-off', 'disconnect', 'off-grid', 'escape']

const AMENITY_MATCHERS: { keywords: string[]; amenity: string }[] = [
  { keywords: ['soaking tub', 'deep tub', 'deep bath', 'bathtub'], amenity: 'soaking tub' },
  { keywords: ['rain shower'], amenity: 'rain shower' },
  { keywords: ['fast wifi', 'fast internet', 'quick wifi', 'good wifi', 'high speed'], amenity: 'fast wifi' },
  { keywords: ['ethernet', 'wired internet'], amenity: 'ethernet' },
  { keywords: ['pool', 'swim'], amenity: 'pool' },
  { keywords: ['sauna'], amenity: 'sauna' },
  { keywords: ['balcony', 'terrace'], amenity: 'balcony' },
  { keywords: ['canal', 'water view', 'sea view', 'loch', 'fjord'], amenity: 'water view' },
  { keywords: ['desk'], amenity: 'desk' },
  { keywords: ['bikes', 'bicycle', 'cycling'], amenity: 'bikes' },
  { keywords: ['blackout'], amenity: 'blackout curtains' },
  { keywords: ['courtyard'], amenity: 'courtyard' },
  { keywords: ['vinyl', 'records', 'turntable'], amenity: 'turntable' },
  { keywords: ['breakfast'], amenity: 'breakfast included' },
]

export function parseQuery(rawQuery: string): ParsedQuery {
  const q = rawQuery.toLowerCase()

  // City detection
  let city: string | undefined
  for (const [alias, canonical] of Object.entries(CITY_ALIASES)) {
    if (q.includes(alias)) {
      city = canonical
      break
    }
  }

  // Price detection: "under £300", "below 250", "budget 200"
  let maxPriceGbp: number | undefined
  const priceMatch = q.match(/(?:under|below|less than|budget|around|max)\s*£?\s*(\d{2,4})/i)
  if (priceMatch) {
    maxPriceGbp = parseInt(priceMatch[1], 10)
  }

  // Amenities
  const requiredAmenities: string[] = []
  for (const matcher of AMENITY_MATCHERS) {
    if (matcher.keywords.some((k) => q.includes(k))) {
      requiredAmenities.push(matcher.amenity)
    }
  }

  // Work mode
  let workMode: ParsedQuery['workMode'] = 'none'
  if (WORK_SIGNALS.some((s) => q.includes(s))) workMode = 'deep-work'

  // Noise preference
  let noisePreference: ParsedQuery['noisePreference'] = 'any'
  if (QUIET_SIGNALS.some((s) => q.includes(s))) noisePreference = 'silent'

  return {
    city,
    maxPriceGbp,
    requiredAmenities,
    workMode,
    noisePreference,
    vibeDescription: rawQuery.trim(),
    rawQuery,
  }
}

// ============ VIBE MATCHING (mock) ============
// Production: Pinecone cosine similarity against embedded atmosphereDescription.
// Mock: token overlap with weighted atmosphere tags and rawDescription.

function vibeScore(hotel: Hotel, parsed: ParsedQuery): { score: number; reasons: string[] } {
  const q = parsed.vibeDescription.toLowerCase()
  const reasons: string[] = []
  let score = 0

  // Atmosphere tag matches
  for (const tag of hotel.atmosphere) {
    const tagWords = tag.split(/[-_\s]/)
    const hits = tagWords.filter((w) => q.includes(w.toLowerCase())).length
    if (hits > 0) {
      score += hits * 0.15
    }
  }

  // Description word overlap (very rough proxy)
  const descWords = hotel.atmosphereDescription.toLowerCase().split(/\W+/)
  const qWords = q.split(/\W+/).filter((w) => w.length > 3)
  const overlap = qWords.filter((qw) => descWords.includes(qw)).length
  score += overlap * 0.08

  // Signal matches (quiet, romantic, luxe, detox, work)
  if (parsed.noisePreference === 'silent' && (hotel.noiseLevel === 'silent' || hotel.noiseLevel === 'low')) {
    score += 0.25
    reasons.push(hotel.noiseLevel === 'silent' ? 'Genuinely silent' : 'Low noise')
  }

  if (parsed.workMode === 'deep-work' && hotel.workFriendliness >= 4) {
    score += 0.3
    reasons.push(`Work-friendly (${hotel.workFriendliness}/5)`)
  }

  if (ROMANCE_SIGNALS.some((s) => q.includes(s)) && hotel.bestFor.some((b) => b.includes('couple') || b.includes('honeymoon') || b.includes('anniversary') || b.includes('romance'))) {
    score += 0.25
    reasons.push('Built for couples')
  }

  if (LUXE_SIGNALS.some((s) => q.includes(s)) && hotel.stars === 5) {
    score += 0.2
    reasons.push('Five-star')
  }

  if (DETOX_SIGNALS.some((s) => q.includes(s)) && hotel.bestFor.some((b) => b.includes('switch') || b.includes('detox') || b.includes('disconnect'))) {
    score += 0.35
    reasons.push('True disconnect')
  }

  return { score: Math.min(score, 1), reasons }
}

// ============ STRUCTURED MATCH ============

function structuredScore(hotel: Hotel, parsed: ParsedQuery): { score: number; reasons: string[]; pass: boolean } {
  const reasons: string[] = []
  let score = 0
  let pass = true

  // Hard filter: city
  if (parsed.city && hotel.city !== parsed.city) {
    pass = false
  }

  // Hard filter: price
  if (parsed.maxPriceGbp && hotel.priceFrom > parsed.maxPriceGbp) {
    pass = false
  } else if (parsed.maxPriceGbp) {
    score += 0.2
    reasons.push(`From £${hotel.priceFrom} (under £${parsed.maxPriceGbp})`)
  }

  // Soft match: amenities
  const amenityNames = hotel.amenities.map((a) => a.name.toLowerCase())
  for (const req of parsed.requiredAmenities) {
    const found = amenityNames.find((n) => n.includes(req))
    if (found) {
      score += 0.25
      const amenity = hotel.amenities.find((a) => a.name.toLowerCase() === found)
      if (amenity) {
        reasons.push(amenity.detail ? `${amenity.name} – ${amenity.detail}` : amenity.name)
      }
    }
  }

  return { score: Math.min(score, 1), reasons, pass }
}

// ============ MAIN SEARCH ============

export function search(rawQuery: string): { parsed: ParsedQuery; results: MatchResult[] } {
  const parsed = parseQuery(rawQuery)

  const scored: MatchResult[] = []

  for (const hotel of hotels) {
    const structured = structuredScore(hotel, parsed)
    if (!structured.pass) continue

    const vibe = vibeScore(hotel, parsed)

    // Weighted: 60% vibe, 30% structured, 10% base quality (stars)
    const baseQuality = (hotel.stars - 3) * 0.1
    const matchScore = vibe.score * 0.6 + structured.score * 0.3 + baseQuality * 0.1

    // Merge reasons, dedupe, cap at 4
    const allReasons = Array.from(new Set([...vibe.reasons, ...structured.reasons])).slice(0, 4)

    scored.push({
      hotel,
      matchScore,
      matchReasons: allReasons,
      vibeScore: vibe.score,
      structuredScore: structured.score,
    })
  }

  // Sort by match score, then by signature quality tie-breaker
  scored.sort((a, b) => b.matchScore - a.matchScore)

  return { parsed, results: scored }
}

// ============ VIBE SUMMARY ============
// Production: Claude generates a one-line summary of the user's intent.
// Mock: template based on parsed fields.

export function summariseIntent(parsed: ParsedQuery): string {
  const parts: string[] = []

  if (parsed.city) parts.push(`in ${parsed.city}`)
  if (parsed.workMode === 'deep-work') parts.push('for deep work')
  if (parsed.noisePreference === 'silent') parts.push('somewhere quiet')
  if (parsed.maxPriceGbp) parts.push(`under £${parsed.maxPriceGbp}`)
  if (parsed.requiredAmenities.length > 0) {
    const list = parsed.requiredAmenities.slice(0, 3).join(', ')
    parts.push(`with ${list}`)
  }

  if (parts.length === 0) return 'Looking at what we have'
  return 'You\'re looking for something ' + parts.join(', ')
}
