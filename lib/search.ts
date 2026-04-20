import { hotels } from '@/data/hotels'
import type { Hotel, ParsedQuery, MatchResult } from './types'

// ============================================================
// Mock search - zero-dependency fallback for searchAgentic
// ============================================================
// Used when agentic keys are missing OR when the full pipeline
// throws. Does naive keyword matching against hotel fields so
// the product still routes briefs without Claude / OpenAI /
// Pinecone configured.
// ============================================================

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'for', 'in', 'on', 'at', 'to', 'of',
  'with', 'i', 'we', 'my', 'our', 'want', 'need', 'looking', 'like', 'some',
  'really', 'very', 'just', 'that', 'this', 'is', 'are', 'be', 'been',
])

const CITY_HINTS: Record<string, string> = {
  paris: 'Paris',
  london: 'London',
  rome: 'Rome',
  tokyo: 'Tokyo',
  'new york': 'New York',
  nyc: 'New York',
  barcelona: 'Barcelona',
  berlin: 'Berlin',
  amsterdam: 'Amsterdam',
  lisbon: 'Lisbon',
  milan: 'Milan',
  copenhagen: 'Copenhagen',
}

function tokenise(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t))
}

function extractCity(raw: string): string | undefined {
  const lower = raw.toLowerCase()
  for (const [hint, city] of Object.entries(CITY_HINTS)) {
    if (lower.includes(hint)) return city
  }
  return undefined
}

function extractMaxPrice(raw: string): number | undefined {
  const match = raw.match(/(?:under|below|max|budget)\s*\u00a3?\s*(\d{2,5})/i)
  if (match) return parseInt(match[1], 10)
  const poundMatch = raw.match(/\u00a3\s*(\d{2,5})/)
  if (poundMatch) return parseInt(poundMatch[1], 10)
  return undefined
}

function parseQueryMock(rawQuery: string): ParsedQuery {
  const city = extractCity(rawQuery)
  const maxPriceGbp = extractMaxPrice(rawQuery)
  const lower = rawQuery.toLowerCase()

  const requiredAmenities: string[] = []
  if (/tub|bath/.test(lower)) requiredAmenities.push('bathtub')
  if (/wifi|internet|ethernet/.test(lower)) requiredAmenities.push('fast wifi')
  if (/desk|workspace|work/.test(lower)) requiredAmenities.push('workspace')
  if (/quiet|silent/.test(lower)) requiredAmenities.push('quiet')

  let workMode: ParsedQuery['workMode'] = 'none'
  if (/deep work|sprint|focus|concentrate/.test(lower)) workMode = 'deep-work'
  else if (/work|laptop|remote/.test(lower)) workMode = 'casual'

  let noisePreference: ParsedQuery['noisePreference'] = 'any'
  if (/silent|quiet/.test(lower)) noisePreference = 'silent'

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

function scoreHotel(hotel: Hotel, parsed: ParsedQuery, tokens: string[]): {
  score: number
  reasons: string[]
} {
  let score = 0
  const reasons: string[] = []

  // City hard-ish preference
  if (parsed.city && hotel.city === parsed.city) {
    score += 0.3
    reasons.push(`In ${hotel.city}`)
  }

  // Price fit
  if (parsed.maxPriceGbp) {
    if (hotel.priceFrom <= parsed.maxPriceGbp) {
      score += 0.15
      reasons.push(`Within your budget (from \u00a3${hotel.priceFrom})`)
    } else {
      score -= 0.1
    }
  }

  // Work mode
  if (parsed.workMode === 'deep-work' && hotel.workFriendliness >= 4) {
    score += 0.15
    reasons.push('Strong for deep work')
  }

  // Noise
  if (parsed.noisePreference === 'silent' && (hotel.noiseLevel === 'silent' || hotel.noiseLevel === 'low')) {
    score += 0.1
    reasons.push(`Noise level: ${hotel.noiseLevel}`)
  }

  // Token / atmosphere overlap
  const atmosphereBlob = (hotel.atmosphere.join(' ') + ' ' + hotel.atmosphereDescription + ' ' + hotel.tagline + ' ' + hotel.rawDescription).toLowerCase()
  let matched = 0
  for (const t of tokens) {
    if (atmosphereBlob.includes(t)) matched++
  }
  if (tokens.length > 0) {
    const overlap = matched / tokens.length
    score += overlap * 0.3
    if (overlap > 0.3) {
      const matchedTags = hotel.atmosphere.filter((tag) => tokens.some((t) => tag.includes(t)))
      if (matchedTags.length > 0) reasons.push(`Matches: ${matchedTags.slice(0, 2).join(', ').replace(/-/g, ' ')}`)
    }
  }

  // Amenity requests
  for (const req of parsed.requiredAmenities) {
    const hit = hotel.amenities.find((a) => a.name.toLowerCase().includes(req) || (a.detail ?? '').toLowerCase().includes(req))
    if (hit) {
      score += 0.05
      if (reasons.length < 4) reasons.push(hit.name)
    }
  }

  // Quality baseline
  score += (hotel.stars - 3) * 0.03

  return { score: Math.max(0, Math.min(1, score)), reasons: reasons.slice(0, 4) }
}

export function searchMock(rawQuery: string): {
  parsed: ParsedQuery
  results: MatchResult[]
} {
  const parsed = parseQueryMock(rawQuery)
  const tokens = tokenise(rawQuery)

  const results: MatchResult[] = hotels.map((hotel) => {
    const { score, reasons } = scoreHotel(hotel, parsed, tokens)
    return {
      hotel,
      matchScore: score,
      matchReasons: reasons.length > 0 ? reasons : [`${hotel.neighbourhood}, ${hotel.city}`],
      vibeScore: score,
      structuredScore: score,
    }
  })

  results.sort((a, b) => b.matchScore - a.matchScore)

  return { parsed, results }
}

export function summariseIntent(parsed: ParsedQuery): string {
  const parts: string[] = []
  if (parsed.city) parts.push(`in ${parsed.city}`)
  if (parsed.workMode === 'deep-work') parts.push('for deep work')
  if (parsed.noisePreference === 'silent') parts.push('somewhere quiet')
  if (parsed.maxPriceGbp) parts.push(`under \u00a3${parsed.maxPriceGbp}`)
  if (parsed.requiredAmenities.length > 0) {
    parts.push(`with ${parsed.requiredAmenities.slice(0, 3).join(', ')}`)
  }
  if (parts.length === 0) return 'Looking at what we have'
  return 'You\'re looking for something ' + parts.join(', ')
}
