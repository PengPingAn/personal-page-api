/**
 * 将 RSS pubDate 或其他时间字符串统一转换为 YYYY-MM-DD HH:mm:ss
 */
export function formatRssDate(dateStr: string, useUTC = false): string {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', dateStr)
    return dateStr
  }

  const pad = (n: number) => n.toString().padStart(2, '0')

  const year = useUTC ? date.getUTCFullYear() : date.getFullYear()
  const month = useUTC ? date.getUTCMonth() + 1 : date.getMonth() + 1
  const day = useUTC ? date.getUTCDate() : date.getDate()
  const hours = useUTC ? date.getUTCHours() : date.getHours()
  const minutes = useUTC ? date.getUTCMinutes() : date.getMinutes()
  const seconds = useUTC ? date.getUTCSeconds() : date.getSeconds()

  return `${year}-${pad(month)}-${pad(day)} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}
