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
