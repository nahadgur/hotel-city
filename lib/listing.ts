import { getPlanWebhookUrl } from './env'

// Stripped-down listing flow.
//
// Every brief goes to the Google Sheet webhook. That's it.
// No database, no auth, no status tracking. The Stayward team replies
// by email within 24 hours.

export type ListingInput = {
  name?: string | null
  email: string
  rawQuery: string
  city?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  rooms?: number
  maxPriceGbp?: number
}

export type CreateListingResult = { ok: true } | { ok: false; error: string }

export async function createListing(input: ListingInput): Promise<CreateListingResult> {
  const url = getPlanWebhookUrl()
  if (!url) {
    return { ok: false, error: 'Submission endpoint is not configured.' }
  }

  const payload = {
    timestamp: new Date().toISOString(),
    source: 'public',
    name: input.name ?? '',
    email: input.email,
    rawQuery: input.rawQuery,
    city: input.city ?? '',
    checkIn: input.checkIn ?? '',
    checkOut: input.checkOut ?? '',
    guests: input.guests ?? '',
    rooms: input.rooms ?? '',
    maxPriceGbp: input.maxPriceGbp ?? '',
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('[createListing] webhook returned non-ok:', res.status, text)
      return { ok: false, error: 'We couldn\'t save your brief right now. Please try again shortly.' }
    }
  } catch (err) {
    console.error('[createListing] webhook call failed:', err)
    return { ok: false, error: 'Network issue reaching our team. Please try again.' }
  }

  return { ok: true }
}
