/**
 * Nuxt server 全局 CORS 中间件
 * 只对 /api 路径生效
 */
export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  // 只对 /api 路径设置 CORS
  if (!url.pathname.startsWith('/api')) return

  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cache-Control, Pragma',
    'Access-Control-Allow-Credentials': 'true',
  })

  // 处理 preflight 请求
  if (getMethod(event) === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.end()
    return
  }
})
