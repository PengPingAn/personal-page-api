import { createClient } from 'redis'
import { v4 as uuidv4 } from 'uuid'

const TTL = 30
const PREFIX = 'active:'

let redis: ReturnType<typeof createClient> | null = null

async function getRedis() {
  if (!redis) {
    redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })
    await redis.connect()
  }
  return redis
}

export default defineEventHandler(async (event) => {
  try {
    const client = await getRedis()

    // 从 cookie 中获取 device_id
    const cookies = parseCookies(event)
    let deviceId = cookies.device_id

    if (!deviceId) {
      deviceId = uuidv4()
      setCookie(event, 'device_id', deviceId, {
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: false,
        sameSite: 'lax',
      })
    }

    await client.set(`${PREFIX}${deviceId}`, '1', { EX: TTL })

    return { ok: true }
  } catch (err) {
    console.error('Active ping error:', err)
    return { ok: false }
  }
})
