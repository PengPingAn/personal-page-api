import jwt from 'jsonwebtoken'
import { H3Event } from 'h3'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

/**
 * 验证 JWT Token，返回解码后的用户信息
 * 在需要认证的 API 路由中调用此函数
 */
export function verifyAuth(event: H3Event): { username: string } {
  const authHeader = getRequestHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, data: { code: 401, data: null, msg: '未登录' } })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    throw createError({ statusCode: 401, data: { code: 401, data: null, msg: '未登录' } })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string }
    return { username: decoded.username }
  } catch {
    throw createError({ statusCode: 401, data: { code: 401, data: null, msg: 'Token 无效或已过期' } })
  }
}

/**
 * 签发 JWT Token
 */
export function signToken(payload: object, expiresIn = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}
