import crypto from 'crypto'

/**
 * 获取用户头像 URL（支持 QQ 邮箱、Gravatar）
 */
export function getAvatarUrl(email?: string, size = 100): string {
  if (!email) return getGravatarUrl('default@example.com', size)

  const emailTrimmed = email.trim().toLowerCase()

  const qqNumber = isQQEmail(emailTrimmed)
  if (qqNumber) {
    return getQQAvatarUrl(qqNumber, size)
  }

  return getGravatarUrl(emailTrimmed, size)
}

function isQQEmail(email: string): string | null {
  const match = email.match(/^(\d{5,12})@qq\.com$/)
  return match ? (match[1] as string) : null
}

function getQQAvatarUrl(qq: string, size = 100): string {
  return `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=${size}`
}

function getGravatarUrl(email: string, size = 100): string {
  const hash = crypto.createHash('md5').update(email).digest('hex')
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`
}
