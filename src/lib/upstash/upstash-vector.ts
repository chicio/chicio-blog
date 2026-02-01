import { VectorData } from '@/types/chat/vector-data'
import { Index } from '@upstash/vector'

export const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
})

export async function upsert(vectoreData: VectorData[]) {
  await index.upsert(vectoreData)
}

export async function findRelevantContent(query: string, k = 2) {
  const result = await index.query({
    data: query,
    topK: k,
    includeMetadata: true,
  })

  return result
}
