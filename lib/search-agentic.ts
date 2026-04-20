import { hotels, getHotelBySlug } from '@/data/hotels'
import { parseQueryWithClaude, generateMatchReasons } from './claude'
import { embed } from './embeddings'
import { queryVibes } from './pinecone'
import { searchMock } from './search'
import { hasAgenticKeys } from './env'
import type { Hotel, ParsedQuery, MatchResult } from './types'

// ============================================================
// Agentic search pipeline
// ============================================================
// 1. Claude parses the raw query into structured + vibe
// 2. OpenAI embeds the vibe description
// 3. Pinecone returns top-N semantically similar hotels
// 4. Hard-filter on structured constraints (city, price)
// 5. Score-merge and rank
// 6. Claude generates match-reason bullets for the top 5
// ============================================================

const VIBE_WEIGHT = 0.6
const STRUCTURED_WEIGHT = 0.3
const QUALITY_WEIGHT = 0.1
const TOP_K_FROM_PINECONE = 20
const TOP_K_FOR_REASONS = 5

/**
 * Run the hard-filter over the structured query.
 * Returns true if the hotel passes all hard constraints.
 */
function passesHardFilter(hotel: Hotel, parsed: ParsedQuery): boolean {
  if (parsed.city && hotel.city !== parsed.city) return false
  if (parsed.maxPriceGbp && hotel.priceFrom > parsed.maxPriceGbp) return false
  return true
}

/**
 * Score the structured dimension (price fit + amenity coverage).
 * Returns 0..1.
 */
function structuredFit(hotel: Hotel, parsed: ParsedQuery): number {
  let score = 0

  if (parsed.maxPriceGbp) {
    // Cheaper under-the-budget = higher score, max 0.3
    const priceRatio = hotel.priceFrom / parsed.maxPriceGbp
    score += Math.max(0, 0.3 * (1 - priceRatio * 0.5))
  }

  if (parsed.requiredAmenities.length > 0) {
    const amenityText = hotel.amenities.map((a) => a.name.toLowerCase()).join(' ')
    const hits = parsed.requiredAmenities.filter((a) =>
      amenityText.includes(a.toLowerCase().split(' ')[0])
    ).length
    score += Math.min(0.7, (hits / parsed.requiredAmenities.length) * 0.7)
  }

  if (parsed.noisePreference === 'silent' && (hotel.noiseLevel === 'silent' || hotel.noiseLevel === 'low')) {
    score += 0.2
  }

  if (parsed.workMode === 'deep-work' && hotel.workFriendliness >= 4) {
    score += 0.2
  }

  return Math.min(1, score)
}

/**
 * Build a short summary of a hotel for the reasons-generation prompt.
 */
function summariseHotel(hotel: Hotel): string {
  return `${hotel.tagline} ${hotel.atmosphereDescription}`
}

/**
 * Extract amenities most relevant to the query for reasons prompt.
 */
function relevantAmenities(hotel: Hotel, parsed: ParsedQuery): string[] {
  const queryTerms = [
    ...parsed.requiredAmenities,
    parsed.workMode === 'deep-work' ? 'work' : '',
    parsed.noisePreference === 'silent' ? 'quiet' : '',
  ]
    .filter(Boolean)
    .map((s) => s.toLowerCase())

  const matched = hotel.amenities.filter((a) => {
    const n = a.name.toLowerCase()
    return queryTerms.some((q) => n.includes(q.split(' ')[0]))
  })

  // Fall back to first 5 amenities if no specific matches
  return (matched.length > 0 ? matched : hotel.amenities.slice(0, 5)).map((a) =>
    a.detail ? `${a.name} (${a.detail})` : a.name
  )
}

/**
 * Main agentic search entry point.
 * Falls back to mock search gracefully on ANY failure.
 */
export async function searchAgentic(
  rawQuery: string
): Promise<{ parsed: ParsedQuery; results: MatchResult[]; usedAgentic: boolean }> {
  // 0. No keys? Go straight to mock.
  if (!hasAgenticKeys()) {
    const mock = searchMock(rawQuery)
    return { ...mock, usedAgentic: false }
  }

  try {
    // 1. Parse the query with Claude
    const parsed = await parseQueryWithClaude(rawQuery)

    // 2. Embed the vibe description
    const vibeEmbedding = await embed(parsed.vibeDescription)

    // 3. Query Pinecone for semantically nearest hotels
    const pineconeHits = await queryVibes(vibeEmbedding, TOP_K_FROM_PINECONE)

    // 4. Build a score map from Pinecone (vibeScore 0..1)
    const vibeScoreBySlug = new Map<string, number>()
    for (const hit of pineconeHits) {
      vibeScoreBySlug.set(hit.slug, hit.score)
    }

    // 5. Combine with hard filter + structured score
    const scored: MatchResult[] = []
    for (const hotel of hotels) {
      if (!passesHardFilter(hotel, parsed)) continue

      const vibeScore = vibeScoreBySlug.get(hotel.slug) ?? 0
      const structScore = structuredFit(hotel, parsed)
      const quality = (hotel.stars - 3) * 0.3

      const matchScore =
        vibeScore * VIBE_WEIGHT +
        structScore * STRUCTURED_WEIGHT +
        quality * QUALITY_WEIGHT

      scored.push({
        hotel,
        matchScore,
        matchReasons: [], // filled in next step for top results
        vibeScore,
        structuredScore: structScore,
      })
    }

    scored.sort((a, b) => b.matchScore - a.matchScore)

    // 6. Generate real match reasons for the top K with Claude
    //    (parallel, graceful per-hotel fallback to fabricated reasons)
    const topForReasons = scored.slice(0, TOP_K_FOR_REASONS)
    await Promise.all(
      topForReasons.map(async (result) => {
        try {
          const reasons = await generateMatchReasons(
            rawQuery,
            result.hotel.name,
            summariseHotel(result.hotel),
            relevantAmenities(result.hotel, parsed)
          )
          result.matchReasons = reasons
        } catch {
          // Per-hotel fallback: derive reasons from amenities
          result.matchReasons = relevantAmenities(result.hotel, parsed).slice(0, 3)
        }
      })
    )

    // For results beyond the top K, use structured amenity matches as reasons
    for (const result of scored.slice(TOP_K_FOR_REASONS)) {
      result.matchReasons = relevantAmenities(result.hotel, parsed).slice(0, 3)
    }

    return { parsed, results: scored, usedAgentic: true }
  } catch (err) {
    // Whole-pipeline fallback — log and serve mock
    console.error('[searchAgentic] pipeline failed, falling back to mock:', err)
    const mock = searchMock(rawQuery)
    return { ...mock, usedAgentic: false }
  }
}

/**
 * Summarise intent — prefers the cleaner Claude-parsed vibe description
 * when available, else falls back to a template.
 */
export function summariseIntentAgentic(parsed: ParsedQuery): string {
  // If Claude gave us a decent vibe description, use it directly.
  if (parsed.vibeDescription && parsed.vibeDescription.length > 20 && parsed.vibeDescription !== parsed.rawQuery) {
    return 'You\'re looking for ' + parsed.vibeDescription
  }

  // Else fall back to the template approach.
  const parts: string[] = []
  if (parsed.city) parts.push(`in ${parsed.city}`)
  if (parsed.workMode === 'deep-work') parts.push('for deep work')
  if (parsed.noisePreference === 'silent') parts.push('somewhere quiet')
  if (parsed.maxPriceGbp) parts.push(`under £${parsed.maxPriceGbp}`)
  if (parsed.requiredAmenities.length > 0) {
    parts.push(`with ${parsed.requiredAmenities.slice(0, 3).join(', ')}`)
  }
  if (parts.length === 0) return 'Looking at what we have'
  return 'You\'re looking for something ' + parts.join(', ')
}
