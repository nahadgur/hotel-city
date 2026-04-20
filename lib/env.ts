// Env flags and helpers.
//
// Supabase is optional: logged-in users need it to see their listing history,
// but anonymous submissions can still go through to the Google Sheet without it.
// The webhook URL is required for any submission to succeed.

export function hasPlanWebhook(): boolean {
  return Boolean(process.env.PLAN_WEBHOOK_URL)
}

export function getPlanWebhookUrl(): string {
  return process.env.PLAN_WEBHOOK_URL || ''
}

export function hasSupabase(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export function hasAuth(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.NEXTAUTH_SECRET
  )
}

export function getPublicBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
