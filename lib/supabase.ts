import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Server-only Supabase client using the service-role key.
// Never import this into client components.
let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    )
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}

// Database row types (matches supabase/schema.sql)

export type BriefRow = {
  id: string
  created_at: string
  traveller_name: string
  traveller_email: string
  city: string | null
  check_in: string | null
  check_out: string | null
  guests: number | null
  max_price_gbp: number | null
  raw_query: string
  parsed_query: unknown | null
  status: 'routing' | 'quotes_ready' | 'booked' | 'expired'
}

export type BriefRoutingRow = {
  id: string
  created_at: string
  brief_id: string
  hotel_slug: string
  hotel_name: string
  hotel_city: string
  hotel_contact_email: string
  match_score: number | null
  match_reasons: string[] | null
  reply_to_token: string
  email_sent_at: string | null
  email_message_id: string | null
  email_status: 'pending' | 'sent' | 'failed' | 'bounced'
}

export type QuoteRow = {
  id: string
  received_at: string
  routing_id: string
  from_email: string | null
  subject: string | null
  body_text: string
  body_html: string | null
  parsed_price_gbp: number | null
  parsed_notes: string | null
}

export type RoutingWithQuote = BriefRoutingRow & {
  quote_id: string | null
  quote_received_at: string | null
  quote_price_gbp: number | null
  quote_notes: string | null
  quote_body: string | null
  quote_from_email: string | null
}
