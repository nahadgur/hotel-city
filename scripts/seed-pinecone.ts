#!/usr/bin/env tsx
/**
 * Seed the Pinecone index with hotel vibes.
 *
 * Usage (locally, with .env.local in the project root):
 *   npm run seed
 *
 * What it does:
 *   1. Loads all hotels from data/hotels.ts
 *   2. Builds a "vibe text" for each hotel (atmosphere description + tags + raw description)
 *   3. Embeds them all in one batch via OpenAI text-embedding-3-small
 *   4. Upserts them to the Pinecone index (default: "stayward-vibes")
 *
 * Re-run this any time you edit data/hotels.ts.
 */

import 'dotenv/config'
import { hotels } from '../data/hotels'
import { embedBatch } from '../lib/embeddings'
import { upsertVibes } from '../lib/pinecone'
import { getPineconeIndexName } from '../lib/env'

function buildVibeText(hotel: typeof hotels[number]): string {
  // Combine the fields most indicative of vibe, in order of weight.
  return [
    hotel.atmosphereDescription,
    `Atmosphere: ${hotel.atmosphere.join(', ')}`,
    `Best for: ${hotel.bestFor.join(', ')}`,
    `Noise: ${hotel.noiseLevel}. Work-friendliness: ${hotel.workFriendliness}/5.`,
    hotel.signatureDetail,
    hotel.rawDescription,
  ].join('\n\n')
}

async function main() {
  console.log('Stayward - seeding Pinecone vibe index')
  console.log('-'.repeat(50))

  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY in environment. Add it to .env.local.')
    process.exit(1)
  }
  if (!process.env.PINECONE_API_KEY) {
    console.error('Missing PINECONE_API_KEY in environment. Add it to .env.local.')
    process.exit(1)
  }

  const indexName = getPineconeIndexName()
  console.log(`Target index: ${indexName}`)
  console.log(`Hotels to embed: ${hotels.length}`)
  console.log('')

  console.log('Building vibe texts...')
  const vibeTexts = hotels.map(buildVibeText)

  console.log('Embedding (OpenAI text-embedding-3-small, 1536-dim)...')
  const embeddings = await embedBatch(vibeTexts)
  console.log(`   Got ${embeddings.length} vectors, each ${embeddings[0].length} dimensions`)

  console.log('Upserting to Pinecone...')
  const vectors = hotels.map((hotel, i) => ({
    id: hotel.slug,
    values: embeddings[i],
    metadata: {
      slug: hotel.slug,
      name: hotel.name,
      city: hotel.city,
    },
  }))

  await upsertVibes(vectors)
  console.log(`   Upserted ${vectors.length} vectors`)
  console.log('')
  console.log('Done. Your search index is live.')
  console.log('')
  console.log('Test queries to try on the deployed site:')
  console.log('   - "somewhere that feels like a Wes Anderson film"')
  console.log('   - "a hotel where the wifi actually works"')
  console.log('   - "a room I can cry in without being bothered"')
  console.log('   - "make me feel like I\'m not on Earth"')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
