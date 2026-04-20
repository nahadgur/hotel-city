import { getSupabase } from './supabase'
import { searchAgentic } from './search-agentic'
import { searchMock } from './search'
import { sendBriefToHotel, sendCustomerMessageToHotel } from './email'
import { generateReplyToken } from './signing'
import { getHotelBySlug } from '@/data/hotels'
import { hasBriefPipeline } from './env'

const MAX_HOTELS_TO_ROUTE = 5
const MIN_HOTELS_TO_ROUTE = 1

// --- Types ---

export type ListingInput = {
  userId: string
  userEmail: string
  userName: string
  city?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  rooms?: number
  maxPriceGbp?: number
  rawQuery: string
}

export type ListingRow = {
  id: string
  created_at: string
  user_id: string
  title: string | null
  city: string | null
  check_in: string | null
  check_out: string | null
  guests: number | null
  rooms: number | null
  max_price_gbp: number | null
  raw_query: string
  parsed_query: unknown | null
  status: 'routing' | 'quotes_ready' | 'booked' | 'expired'
  traveller_name: string | null
  traveller_email: string | null
}

export type ListingRoutingRow = {
  id: string
  created_at: string
  listing_id: string
  hotel_slug: string
  hotel_name: string
  hotel_city: string
  hotel_contact_email: string
  match_score: number | null
  match_reasons: string[] | null
  reply_to_token: string
  thread_token: string
  email_sent_at: string | null
  email_message_id: string | null
  email_status: 'pending' | 'sent' | 'failed' | 'bounced'
}

export type MessageRow = {
  id: string
  created_at: string
  routing_id: string
  sender: 'customer' | 'hotel' | 'system'
  from_email: string | null
  subject: string | null
  body_text: string
  body_html: string | null
  parsed_price_gbp: number | null
  parsed_notes: string | null
  sent_via: 'email' | 'dashboard'
  email_message_id: string | null
}

export type RoutingWithLatest = ListingRoutingRow & {
  latest_message_id: string | null
  latest_message_at: string | null
  latest_message_sender: string | null
  latest_message_body: string | null
  latest_message_price_gbp: number | null
  message_count: number
  hotel_message_count: number
}

export type CreateListingResult =
  | { ok: true; listingId: string; routedCount: number; emailsFailed: number }
  | { ok: false; error: string }

// --- Helpers ---

function buildListingTitle(rawQuery: string, city: string | null): string {
  // Simple title generation: city + truncated query
  const head = rawQuery.length > 60 ? rawQuery.slice(0, 57).trim() + '…' : rawQuery.trim()
  return city ? `${city}: ${head}` : head
}

// --- Main flow ---

export async function createListing(input: ListingInput): Promise<CreateListingResult> {
  if (!hasBriefPipeline()) {
    return { ok: false, error: 'Listing pipeline not configured. Set Supabase + Resend env vars.' }
  }

  const supabase = getSupabase()

  // 1. Run search
  let searchResult
  try {
    searchResult = await searchAgentic(input.rawQuery)
  } catch (err) {
    console.error('[createListing] search failed, using mock:', err)
    searchResult = { ...searchMock(input.rawQuery), usedAgentic: false }
  }

  const topMatches = searchResult.results
    .filter((r) => {
      if (input.city && r.hotel.city !== input.city) return false
      if (input.maxPriceGbp && r.hotel.priceFrom > input.maxPriceGbp) return false
      return true
    })
    .slice(0, MAX_HOTELS_TO_ROUTE)

  if (topMatches.length < MIN_HOTELS_TO_ROUTE) {
    return {
      ok: false,
      error:
        'No hotels matched. Try broadening: drop the city, raise the budget, or describe more loosely.',
    }
  }

  // 2. Create the listing
  const city = input.city ?? searchResult.parsed.city ?? null
  const title = buildListingTitle(input.rawQuery, city)

  const listingInsert = await supabase
    .from('listings')
    .insert({
      user_id: input.userId,
      traveller_name: input.userName,
      traveller_email: input.userEmail,
      title,
      city,
      check_in: input.checkIn ?? null,
      check_out: input.checkOut ?? null,
      guests: input.guests ?? 2,
      rooms: input.rooms ?? 1,
      max_price_gbp: input.maxPriceGbp ?? searchResult.parsed.maxPriceGbp ?? null,
      raw_query: input.rawQuery,
      parsed_query: searchResult.parsed as unknown as Record<string, unknown>,
      status: 'routing',
    })
    .select()
    .single()

  if (listingInsert.error || !listingInsert.data) {
    return { ok: false, error: `Failed to create listing: ${listingInsert.error?.message}` }
  }

  const listing = listingInsert.data as ListingRow

  // 3. Create routings (one per hotel)
  const routingRows = topMatches.map((match) => {
    const hotel = getHotelBySlug(match.hotel.slug)
    const contactEmail = hotel?.contactEmail || 'jerwinmanongsong2@gmail.com'
    return {
      listing_id: listing.id,
      hotel_slug: match.hotel.slug,
      hotel_name: match.hotel.name,
      hotel_city: match.hotel.city,
      hotel_contact_email: contactEmail,
      match_score: match.matchScore,
      match_reasons: match.matchReasons,
      reply_to_token: generateReplyToken(),
      thread_token: generateReplyToken(),
      email_status: 'pending' as const,
    }
  })

  const routingsInsert = await supabase
    .from('listing_routings')
    .insert(routingRows)
    .select()

  if (routingsInsert.error || !routingsInsert.data) {
    return { ok: false, error: `Failed to create routings: ${routingsInsert.error?.message}` }
  }

  const routings = routingsInsert.data as ListingRoutingRow[]

  // 4. Fire emails in parallel with per-email try/catch
  let failed = 0
  await Promise.all(
    routings.map(async (routing) => {
      const send = await sendBriefToHotel({
        listing,
        routing,
      })

      if (send.error) {
        failed++
        await supabase
          .from('listing_routings')
          .update({ email_status: 'failed', email_sent_at: new Date().toISOString() })
          .eq('id', routing.id)
      } else {
        await supabase
          .from('listing_routings')
          .update({
            email_status: 'sent',
            email_message_id: send.messageId,
            email_sent_at: new Date().toISOString(),
          })
          .eq('id', routing.id)

        // Log a system message so the thread has a "we sent your brief" entry
        await supabase.from('messages').insert({
          routing_id: routing.id,
          sender: 'system',
          body_text: `Brief sent to ${routing.hotel_name} at ${routing.hotel_contact_email}.`,
          sent_via: 'email',
          email_message_id: send.messageId ?? null,
        })
      }
    })
  )

  return {
    ok: true,
    listingId: listing.id,
    routedCount: routings.length,
    emailsFailed: failed,
  }
}

// --- Fetchers ---

export async function fetchUserListings(userId: string): Promise<ListingRow[]> {
  const supabase = getSupabase()
  const result = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return (result.data ?? []) as ListingRow[]
}

export async function fetchListingForUser(
  listingId: string,
  userId: string
): Promise<ListingRow | null> {
  const supabase = getSupabase()
  const result = await supabase
    .from('listings')
    .select('*')
    .eq('id', listingId)
    .eq('user_id', userId)
    .single()

  if (result.error || !result.data) return null
  return result.data as ListingRow
}

export async function fetchRoutingsForListing(
  listingId: string
): Promise<RoutingWithLatest[]> {
  const supabase = getSupabase()
  const result = await supabase
    .from('listing_routings_with_latest_message')
    .select('*')
    .eq('listing_id', listingId)
    .order('match_score', { ascending: false })

  return (result.data ?? []) as RoutingWithLatest[]
}

export async function fetchThreadMessages(routingId: string): Promise<MessageRow[]> {
  const supabase = getSupabase()
  const result = await supabase
    .from('messages')
    .select('*')
    .eq('routing_id', routingId)
    .order('created_at', { ascending: true })

  return (result.data ?? []) as MessageRow[]
}

export async function fetchRoutingById(routingId: string): Promise<ListingRoutingRow | null> {
  const supabase = getSupabase()
  const result = await supabase
    .from('listing_routings')
    .select('*')
    .eq('id', routingId)
    .single()

  if (result.error || !result.data) return null
  return result.data as ListingRoutingRow
}

// Find routing by the reply token (used by inbound webhook for hotel replies)
export async function findRoutingByReplyToken(token: string): Promise<ListingRoutingRow | null> {
  const supabase = getSupabase()
  const result = await supabase
    .from('listing_routings')
    .select('*')
    .eq('reply_to_token', token.toLowerCase())
    .single()

  if (result.error || !result.data) return null
  return result.data as ListingRoutingRow
}

// Find routing by thread token (for customer-to-hotel outbound replies coming back)
export async function findRoutingByThreadToken(token: string): Promise<ListingRoutingRow | null> {
  const supabase = getSupabase()
  const result = await supabase
    .from('listing_routings')
    .select('*')
    .eq('thread_token', token.toLowerCase())
    .single()

  if (result.error || !result.data) return null
  return result.data as ListingRoutingRow
}

// --- Customer-side: post a message ---

export async function postCustomerMessage(params: {
  routingId: string
  userId: string
  bodyText: string
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabase()

  // Verify the routing belongs to a listing owned by this user
  const routingResult = await supabase
    .from('listing_routings')
    .select('*, listings!inner(user_id, title, raw_query, traveller_name)')
    .eq('id', params.routingId)
    .single()

  if (routingResult.error || !routingResult.data) {
    return { ok: false, error: 'Routing not found' }
  }

  const routing = routingResult.data as ListingRoutingRow & {
    listings: {
      user_id: string
      title: string
      raw_query: string
      traveller_name: string | null
    }
  }

  if (routing.listings.user_id !== params.userId) {
    return { ok: false, error: 'Not authorised for this listing' }
  }

  // Send email to hotel with thread_token as the reply-to
  const send = await sendCustomerMessageToHotel({
    hotelEmail: routing.hotel_contact_email,
    hotelName: routing.hotel_name,
    customerName: routing.listings.traveller_name || 'A Stayward traveller',
    threadToken: routing.thread_token,
    listingTitle: routing.listings.title,
    bodyText: params.bodyText,
  })

  // Save the message regardless (so the customer sees their own message in the thread)
  const insert = await supabase.from('messages').insert({
    routing_id: params.routingId,
    sender: 'customer',
    body_text: params.bodyText,
    sent_via: 'dashboard',
    email_message_id: send.messageId,
  })

  if (insert.error) {
    return { ok: false, error: insert.error.message }
  }

  if (send.error) {
    return { ok: false, error: `Message saved but email delivery failed: ${send.error}` }
  }

  return { ok: true }
}

// --- Price parsing (shared with inbound webhook) ---

export function extractPriceFromMessage(body: string): number | null {
  if (!body) return null
  const poundMatch = body.match(/\u00a3\s*([\d,]+(?:\.\d{1,2})?)/i)
  if (poundMatch) {
    const cleaned = poundMatch[1].replace(/,/g, '')
    const n = parseFloat(cleaned)
    if (n > 20 && n < 20000) return Math.round(n)
  }
  const inferredMatch = body.match(/(\d{2,5})\s*(?:per\s*night|\/\s*night|gbp|pounds)/i)
  if (inferredMatch) {
    const n = parseInt(inferredMatch[1], 10)
    if (n > 20 && n < 20000) return n
  }
  return null
}
