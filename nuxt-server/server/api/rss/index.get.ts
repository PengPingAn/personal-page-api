import Parser from 'rss-parser'
import { formatRssDate } from '~/server/utils/dateUtils'
import { success, error } from '~/server/utils/response'

const parser = new Parser()

// 缓存对象
interface CacheEntry {
  data: any
  timestamp: number
}
const rssCache: Record<string, CacheEntry> = {}
const CACHE_TTL = 5 * 60 * 1000 // 5 分钟
let isFetching = false

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string
  if (!url) {
    setResponseStatus(event, 400)
    return { error: 'Missing URL' }
  }

  // 先检查缓存
  const cached = rssCache[url]
  const now = Date.now()
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return success(cached.data)
  }

  // 如果缓存失效并且有请求正在获取数据，则等待
  if (isFetching) {
    setResponseStatus(event, 503)
    return { error: 'Service is fetching the RSS, please try again later.' }
  }

  try {
    isFetching = true
    const feed = await parser.parseURL(url)

    const posts = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: formatRssDate(item.pubDate || ''),
      author: item.creator || item.author,
    }))

    const data = {
      blogLink: feed.link,
      item: posts.slice(0, 5),
    }

    // 缓存数据
    rssCache[url] = { data, timestamp: now }

    return success(data)
  } catch (err: any) {
    const errorMessage = err.message || 'Failed to fetch RSS'
    console.error(errorMessage, err)

    setResponseStatus(event, 500)
    return {
      error: errorMessage,
      details: err.stack || err,
    }
  } finally {
    isFetching = false
  }
})
