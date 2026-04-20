import Anthropic from '@anthropic-ai/sdk'
import type { ParsedQuery } from './types'

// Lazy singleton — don't instantiate until we need it (avoids errors at build time)
let client: Anthropic | null = null
function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return client
}

const PARSE_SYSTEM_PROMPT = `You are the query parser for Stayward, a boutique hotel search engine.

Your job: read a natural-language request from a traveller and return a structured JSON object describing what they want.

You return JSON matching this exact schema (do not wrap in markdown, do not add commentary):

{
  "city": string | null,            // Normalised city name, e.g. "Paris", "London", "New York", "Kyoto", "Lisbon", "Copenhagen", "Venice", "Antwerp", "Granada", "Bergen", "Isle of Skye". Null if no city mentioned.
  "country": string | null,         // Country if mentioned separately. Null otherwise.
  "maxPriceGbp": number | null,     // Max price per night in GBP. Null if not specified. Convert other currencies.
  "requiredAmenities": string[],    // Short list of specific amenities the user needs, e.g. ["soaking tub", "fast wifi", "desk", "pool", "blackout curtains"]. Empty array if none.
  "workMode": "deep-work" | "casual" | "none",  // "deep-work" if they mention work/focus/sprint/writing/coding. "casual" if light work. "none" otherwise.
  "noisePreference": "silent" | "low" | "moderate" | "any",  // "silent" or "low" if they mention quiet/peaceful/calm. "any" otherwise.
  "vibeDescription": string         // A clean, embedding-friendly description of the ATMOSPHERE/VIBE only. Strip out city/price/amenities. Keep it under 30 words. E.g. "a quiet, grown-up retreat for deep thinking, with literary atmosphere".
}

Rules:
- Return ONLY the JSON object. No preamble, no markdown fences, no commentary.
- If the user asks for something impossible or off-topic (not about hotels), still return a valid object with defaults.
- The vibeDescription is the single most important field. It gets embedded and matched against hotel vibe descriptions. Make it count.
- If the user is terse ("Paris"), make the vibeDescription reasonable ("a hotel in Paris").`

/**
 * Parse a natural-language query into a structured object.
 * Uses Claude with structured JSON output.
 * On any failure, throws — caller should catch and fall back to mock.
 */
export async function parseQueryWithClaude(rawQuery: string): Promise<ParsedQuery> {
  const response = await getClient().messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    system: PARSE_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: rawQuery }],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Claude returned no text content')
  }

  // Strip accidental markdown fences if they appear
  const cleaned = textBlock.text
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/\s*```\s*$/m, '')
    .trim()

  const parsed = JSON.parse(cleaned)

  return {
    city: parsed.city ?? undefined,
    country: parsed.country ?? undefined,
    maxPriceGbp: parsed.maxPriceGbp ?? undefined,
    requiredAmenities: Array.isArray(parsed.requiredAmenities) ? parsed.requiredAmenities : [],
    workMode: parsed.workMode ?? 'none',
    noisePreference: parsed.noisePreference ?? 'any',
    vibeDescription: parsed.vibeDescription ?? rawQuery,
    rawQuery,
  }
}

const REASONS_SYSTEM_PROMPT = `You write the "why we matched" sentences for Stayward, a boutique hotel search engine.

Given a traveller's query and a hotel's details, write 2-4 short bullet points explaining why this hotel matches.

Rules:
- Each bullet is under 12 words.
- Specific, not generic. "Cast-iron soaking tub, 68cm deep" not "has a bathtub".
- Reference real details from the hotel data provided.
- Do not use em dashes. Use short sentences.
- Return a JSON array of strings. Example: ["Silent courtyard rooms", "Desk with 200Mbps wifi", "Cast-iron tub 68cm deep"]
- Return ONLY the JSON array. No preamble.`

/**
 * Generate match-reason bullets for a single hotel given the query.
 * Called per-hotel for top results (expensive, only use on top 5-8).
 */
export async function generateMatchReasons(
  rawQuery: string,
  hotelName: string,
  hotelSummary: string,
  relevantAmenities: string[]
): Promise<string[]> {
  const response = await getClient().messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 300,
    system: REASONS_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Traveller wanted: "${rawQuery}"

Hotel: ${hotelName}
${hotelSummary}

Key amenities: ${relevantAmenities.join(', ')}

Why does this hotel match? Return 2-4 short bullets as a JSON array.`,
      },
    ],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Claude returned no reasons')
  }

  const cleaned = textBlock.text
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/\s*```\s*$/m, '')
    .trim()

  const parsed = JSON.parse(cleaned)
  if (!Array.isArray(parsed)) throw new Error('Reasons were not an array')
  return parsed.slice(0, 4).map(String)
}
