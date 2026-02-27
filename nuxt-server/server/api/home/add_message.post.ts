import { getDB } from '~/server/utils/db'
import { getAvatarUrl } from '~/server/utils/avatar'
import { success, error } from '~/server/utils/response'
import type { Message } from '~/server/types/message'

export default defineEventHandler(async (event) => {
  try {
    const { nickName, email, content } = await readBody(event)
    if (!nickName || !content) return error('昵称和内容不能为空')

    const xForwardedFor = getRequestHeader(event, 'x-forwarded-for')
    const ip = xForwardedFor?.split(',')[0] || ''

    const createTime = new Date().toISOString()
    const headUrl = getAvatarUrl(email)

    const db = await getDB<Message[]>('message', [])
    const newMsg: Message = { nickName, email, content, createTime, ip, headUrl }

    db.data!.push(newMsg)
    await db.write()

    return success(newMsg)
  } catch (err) {
    console.error(err)
    return error('留言失败')
  }
})
