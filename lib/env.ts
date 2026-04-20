// Centralised check for whether the agentic search pipeline is available.
// If any key is missing, the site falls back to mock search automatically.
//
// This means:
// - Local dev without .env.local -> mock search (works)
// - Vercel preview without env vars -> mock search (works)
// - Production with one API down -> mock search (works, just less magical)

export function hasAgenticKeys(): boolean {
  return Boolean(
    process.env.ANTHROPIC_API_KEY &&
    process.env.OPENAI_API_KEY &&
    process.env.PINECONE_API_KEY
  )
}

export function getPineconeIndexName(): string {
  return process.env.PINECONE_INDEX_NAME || 'stayward-vibes'
}

// Brief routing — requires Supabase + Resend
export function hasBriefPipeline(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.RESEND_API_KEY &&
    process.env.BRIEF_SIGNING_SECRET
  )
}

// Outbound email domain. Resend's shared sender works with zero DNS.
// Override via env once you have your own domain verified in Resend.
export function getOutboundFromAddress(): string {
  return process.env.RESEND_FROM_ADDRESS || 'Stayward <onboarding@resend.dev>'
}

// Inbound reply domain. If unset, we route the encoded token via
// the subject line and fall back to manual forwarding.
export function getInboundDomain(): string | null {
  return process.env.RESEND_INBOUND_DOMAIN || null
}

// Public base URL of the deployed site (for links in emails).
export function getPublicBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
