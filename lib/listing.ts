import { getSupabase } from './supabase'
import { hasSupabase, getPlanWebhookUrl } from './env'

// Minimal listing logic.
//
// Stayward is a brief-routing concierge, not a marketplace. The team handles
// outreach to hotels manually based on what comes in. So all we do here is:
//   1. Write the brief to the Google Sheet (always, via webhook)
//   2. If the submitter is logged in, also write to Supabase so they can see
//      their history
//
// Anonymous submitters get a confirmation page and an email reply from the
// Stayward team within 24 hours. Logged-in submitters get the same plus
// a listing in their dashboard that the team updates manually as they work
// through it.

export type ListingInput = {
  // Identity (optional — null for anonymous)
  userId?: string | null
  userName?: string | null

  // Always captured on the form
  email: string
  rawQuery: string

  // Optional structure
  city?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  rooms?: number
  maxPriceGbp?: number
}

export type ListingRow = {
  id: string
  created_at: string
  user_id: string | null
  title: string | null
  city: string | null
  check_in: string | null
  check_out: string | null
  guests: number | null
  rooms: number | null
  max_price_gbp: number | null
  raw_query: string
  parsed_query: unknown | null
  status: ListingStatus
  traveller_name: string | null
  traveller_email: string | null
}

// Human-readable statuses used both in the DB and the UI. Updated manually
// by the Stayward team via the Supabase table editor.
export type ListingStatus =
  | 'received'
  | 'working'
  | 'quotes_sent'
  | 'closed'

export type CreateListingResult =
  | { ok: true; listingId: string | null }
  | { ok: false; error: string }

function buildTitle(rawQuery: string, city: string | null): string {
  const head = rawQuery.length > 60 ? rawQuery.slice(0, 57).trim() + '\u2026' : rawQuery.trim()
  return city ? `${city}: ${head}` : head
}

// --- Google Sheet webhook ---

async function postToSheet(input: ListingInput & { listingId: string | null }): Promise<void> {
  const url = getPlanWebhookUrl()
  if (!url) return // No webhook configured, silently skip

  const payload = {
    timestamp: new Date().toISOString(),
    listingId: input.listingId ?? '',
    userId: input.userId ?? '',
    name: input.userName ?? '',
    email: input.email,
    rawQuery: input.rawQuery,
    city: input.city ?? '',
    checkIn: input.checkIn ?? '',
    checkOut: input.checkOut ?? '',
    guests: input.guests ?? '',
    rooms: input.rooms ?? '',
    maxPriceGbp: input.maxPriceGbp ?? '',
    source: input.userId ? 'dashboard' : 'public',
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error('[postToSheet] webhook returned non-ok:', res.status, await res.text())
    }
  } catch (err) {
    console.error('[postToSheet] webhook call failed:', err)
  }
}

// --- Main: create a listing ---

export async function createListing(input: ListingInput): Promise<CreateListingResult> {
  const city = input.city ?? null

  // Anonymous submission: post to sheet, done.
  if (!input.userId) {
    await postToSheet({ ...input, listingId: null })
    return { ok: true, listingId: null }
  }

  // Logged-in submission: persist to Supabase first, then post to sheet with
  // the listing ID so the team can cross-reference.
  if (!hasSupabase()) {
    // Should never happen if auth is configured, but handle gracefully.
    await postToSheet({ ...input, listingId: null })
    return { ok: true, listingId: null }
  }

  const supabase = getSupabase()
  const title = buildTitle(input.rawQuery, city)

  const insertResult = await supabase
    .from('listings')
    .insert({
      user_id: input.userId,
      traveller_name: input.userName ?? null,
      traveller_email: input.email,
      title,
      city,
      check_in: input.checkIn ?? null,
      check_out: input.checkOut ?? null,
      guests: input.guests ?? null,
      rooms: input.rooms ?? null,
      max_price_gbp: input.maxPriceGbp ?? null,
      raw_query: input.rawQuery,
      parsed_query: null,
      status: 'received',
    })
    .select()
    .single()

  if (insertResult.error || !insertResult.data) {
    const msg = insertResult.error?.message || 'Unknown database error'
    console.error('[createListing] insert failed:', msg)
    // Try to save via the sheet anyway so we don't lose the lead
    await postToSheet({ ...input, listingId: null })
    return { ok: false, error: `Failed to save listing: ${msg}` }
  }

  const listing = insertResult.data as ListingRow

  // Fire-and-forget the sheet post, don't block the user response on it
  postToSheet({ ...input, listingId: listing.id }).catch(() => {})

  return { ok: true, listingId: listing.id }
}

// --- Fetchers for the dashboard ---

export async function fetchUserListings(userId: string): Promise<ListingRow[]> {
  if (!hasSupabase()) return []
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
  if (!hasSupabase()) return null
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

// --- Status display helpers ---

export function statusLabel(s: ListingStatus): string {
  switch (s) {
    case 'received':
      return 'Received'
    case 'working':
      return 'Sourcing quotes'
    case 'quotes_sent':
      return 'Quotes sent to you'
    case 'closed':
      return 'Closed'
    default:
      return 'Received'
  }
}

export function statusHelp(s: ListingStatus): string {
  switch (s) {
    case 'received':
      return 'We\'ve got your brief. Expect a reply within 24 hours.'
    case 'working':
      return 'The team is reaching out to hotels that fit. Quotes coming soon.'
    case 'quotes_sent':
      return 'Check your inbox. We\'ve emailed you the quotes.'
    case 'closed':
      return 'This listing is archived.'
    default:
      return ''
  }
}
