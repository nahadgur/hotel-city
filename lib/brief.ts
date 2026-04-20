import { getSupabase, type BriefRow, type BriefRoutingRow, type RoutingWithQuote } from './supabase'
import { searchAgentic } from './search-agentic'
import { searchMock } from './search'
import { sendBriefToHotel } from './email'
import { generateReplyToken } from './signing'
import { getHotelBySlug } from '@/data/hotels'
import { hasBriefPipeline } from './env'

const MAX_HOTELS_TO_ROUTE = 5
const MIN_HOTELS_TO_ROUTE = 1

export type BriefInput = {
  travellerName: string
  travellerEmail: string
  city?: string
  checkIn?: string // yyyy-mm-dd
  checkOut?: string // yyyy-mm-dd
  guests?: number
  maxPriceGbp?: number
  rawQuery: string
}

export type CreateBriefResult =
  | { ok: true; briefId: string; routedCount: number; emailsFailed: number }
  | { ok: false; error: string }

/**
 * Create a brief, pick hotels, route emails, return brief ID.
 * This runs sequentially inside one request. For MVP that's fine.
 */
export async function createAndRouteBrief(input: BriefInput): Promise<CreateBriefResult> {
  if (!hasBriefPipeline()) {
    return { ok: false, error: 'Brief pipeline not configured. Set Supabase + Resend env vars.' }
  }

  const supabase = getSupabase()

  // 1. Run search to pick the hotels
  let searchResult
  try {
    searchResult = await searchAgentic(input.rawQuery)
  } catch (err) {
    console.error('[createAndRouteBrief] search failed, using mock:', err)
    searchResult = { ...searchMock(input.rawQuery), usedAgentic: false }
  }

  const topMatches = searchResult.results
    .filter((r) => {
      // Respect the hard filters the user specified
      if (input.city && r.hotel.city !== input.city) return false
      if (input.maxPriceGbp && r.hotel.priceFrom > input.maxPriceGbp) return false
      return true
    })
    .slice(0, MAX_HOTELS_TO_ROUTE)

  if (topMatches.length < MIN_HOTELS_TO_ROUTE) {
    return {
      ok: false,
      error:
        'No hotels matched this brief. Try broadening the criteria (drop the city, raise the budget, or describe more loosely).',
    }
  }

  // 2. Insert the brief row
  const briefInsert = await supabase
    .from('briefs')
    .insert({
      traveller_name: input.travellerName,
      traveller_email: input.travellerEmail,
      city: input.city ?? searchResult.parsed.city ?? null,
      check_in: input.checkIn ?? null,
      check_out: input.checkOut ?? null,
      guests: input.guests ?? 2,
      max_price_gbp: input.maxPriceGbp ?? searchResult.parsed.maxPriceGbp ?? null,
      raw_query: input.rawQuery,
      parsed_query: searchResult.parsed as unknown as Record<string, unknown>,
      status: 'routing',
    })
    .select()
    .single()

  if (briefInsert.error || !briefInsert.data) {
    return { ok: false, error: `Failed to create brief: ${briefInsert.error?.message}` }
  }

  const brief = briefInsert.data as BriefRow

  // 3. Insert one routing per hotel
  const routingRows = topMatches.map((match) => {
    const hotel = getHotelBySlug(match.hotel.slug)
    const contactEmail = hotel?.contactEmail || 'jerwinmanongsong2@gmail.com' // safe fallback
    return {
      brief_id: brief.id,
      hotel_slug: match.hotel.slug,
      hotel_name: match.hotel.name,
      hotel_city: match.hotel.city,
      hotel_contact_email: contactEmail,
      match_score: match.matchScore,
      match_reasons: match.matchReasons,
      reply_to_token: generateReplyToken(),
      email_status: 'pending' as const,
    }
  })

  const routingsInsert = await supabase
    .from('brief_routings')
    .insert(routingRows)
    .select()

  if (routingsInsert.error || !routingsInsert.data) {
    return {
      ok: false,
      error: `Failed to create routings: ${routingsInsert.error?.message}`,
    }
  }

  const routings = routingsInsert.data as BriefRoutingRow[]

  // 4. Fire the emails, in parallel, with per-email try/catch
  let failed = 0
  await Promise.all(
    routings.map(async (routing) => {
      const send = await sendBriefToHotel({ brief, routing })

      if (send.error) {
        failed++
        await supabase
          .from('brief_routings')
          .update({ email_status: 'failed', email_sent_at: new Date().toISOString() })
          .eq('id', routing.id)
      } else {
        await supabase
          .from('brief_routings')
          .update({
            email_status: 'sent',
            email_message_id: send.messageId,
            email_sent_at: new Date().toISOString(),
          })
          .eq('id', routing.id)
      }
    })
  )

  return {
    ok: true,
    briefId: brief.id,
    routedCount: routings.length,
    emailsFailed: failed,
  }
}

/**
 * Fetch a brief + all its routings (with latest quote) for the inbox page.
 */
export async function fetchBriefWithRoutings(briefId: string): Promise<{
  brief: BriefRow | null
  routings: RoutingWithQuote[]
}> {
  const supabase = getSupabase()

  const briefResult = await supabase
    .from('briefs')
    .select('*')
    .eq('id', briefId)
    .single()

  if (briefResult.error || !briefResult.data) {
    return { brief: null, routings: [] }
  }

  const routingsResult = await supabase
    .from('brief_routings_with_quote')
    .select('*')
    .eq('brief_id', briefId)
    .order('match_score', { ascending: false })

  return {
    brief: briefResult.data as BriefRow,
    routings: (routingsResult.data ?? []) as RoutingWithQuote[],
  }
}

/**
 * Find a routing by its reply token. Used by the inbound webhook.
 */
export async function findRoutingByToken(token: string): Promise<BriefRoutingRow | null> {
  const supabase = getSupabase()
  const result = await supabase
    .from('brief_routings')
    .select('*')
    .eq('reply_to_token', token.toLowerCase())
    .single()

  if (result.error || !result.data) return null
  return result.data as BriefRoutingRow
}

/**
 * Try to extract a GBP price from a hotel's reply body.
 * Very lightweight — finds £NNN or NNN per night patterns.
 */
export function extractPriceFromQuote(body: string): number | null {
  if (!body) return null

  // £350, £350.00, £1,200
  const poundMatch = body.match(/\u00a3\s*([\d,]+(?:\.\d{1,2})?)/i)
  if (poundMatch) {
    const cleaned = poundMatch[1].replace(/,/g, '')
    const n = parseFloat(cleaned)
    if (n > 20 && n < 20000) return Math.round(n)
  }

  // "350 per night", "350 gbp", "350 pounds"
  const inferredMatch = body.match(/(\d{2,5})\s*(?:per\s*night|\/\s*night|gbp|pounds)/i)
  if (inferredMatch) {
    const n = parseInt(inferredMatch[1], 10)
    if (n > 20 && n < 20000) return n
  }

  return null
}
