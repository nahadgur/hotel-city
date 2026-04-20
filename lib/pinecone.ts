import { Pinecone } from '@pinecone-database/pinecone'
import { getPineconeIndexName } from './env'

let client: Pinecone | null = null
function getClient(): Pinecone {
  if (!client) {
    client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
  }
  return client
}

export type PineconeHit = {
  slug: string
  score: number
}

/**
 * Query Pinecone for the top K hotels most similar to the given embedding.
 * Returns hotel slugs with similarity scores.
 */
export async function queryVibes(embedding: number[], topK = 50): Promise<PineconeHit[]> {
  const index = getClient().index(getPineconeIndexName())

  const response = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  })

  return response.matches.map((m) => ({
    slug: (m.metadata?.slug as string) || m.id,
    score: m.score ?? 0,
  }))
}

/**
 * Upsert hotel vibes. Used by the seed script.
 */
export async function upsertVibes(
  vectors: { id: string; values: number[]; metadata: { slug: string; name: string; city: string } }[]
): Promise<void> {
  const index = getClient().index(getPineconeIndexName())
  // Pinecone recommends batching at 100 or fewer; we have 12, so one batch
  await index.upsert(vectors)
}
