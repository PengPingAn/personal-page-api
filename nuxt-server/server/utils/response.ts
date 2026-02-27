import { H3Event } from 'h3'

/**
 * 统一成功响应
 */
export function success(data?: any) {
  return { code: 200, data: data ?? null, msg: 'success' }
}

/**
 * 统一错误响应
 */
export function error(msg?: string, code?: number) {
  return { code: code ?? 500, data: null, msg: msg ?? 'error' }
}

/**
 * 抛出带有统一格式的错误（Nuxt 会自动处理 createError）
 */
export function throwApiError(msg: string, statusCode = 500) {
  throw createError({
    statusCode,
    data: { code: statusCode, data: null, msg },
  })
}
