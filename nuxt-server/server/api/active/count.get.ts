import { createClient } from 'redis'

let redis: ReturnType<typeof createClient> | null = null

async function getRedis() {
  if (!redis) {
    redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })
    await redis.connect()
  }
  return redis
}

export default defineEventHandler(async () => {
  try {
    const client = await getRedis()

    let count = 0
    const iter = client.scanIterator({ MATCH: 'active:*' })
    for await (const _ of iter) count++

    return { active: count }
  } catch (err) {
    console.error('Active count error:', err)
    return { active: 0 }
  }
})
