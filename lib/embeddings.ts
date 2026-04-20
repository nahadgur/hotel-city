import OpenAI from 'openai'

let client: OpenAI | null = null
function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return client
}

// text-embedding-3-small -> 1536 dimensions, matches our Pinecone index
const MODEL = 'text-embedding-3-small'

export async function embed(text: string): Promise<number[]> {
  const response = await getClient().embeddings.create({
    model: MODEL,
    input: text,
  })
  return response.data[0].embedding
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const response = await getClient().embeddings.create({
    model: MODEL,
    input: texts,
  })
  return response.data.map((d) => d.embedding)
}
