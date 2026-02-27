import fs from 'fs'
import path from 'path'
import { getAvatarUrl } from '~/server/utils/avatar'
import { success, error } from '~/server/utils/response'
import type { Message } from '~/server/types/message'

const DATA_DIR = path.resolve(process.cwd(), 'server/db')
const FILE_PATH = path.join(DATA_DIR, 'message.json')

function ensureFile(): Message[] {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(FILE_PATH))
    fs.writeFileSync(FILE_PATH, JSON.stringify([]))
  const raw = fs.readFileSync(FILE_PATH, 'utf-8')
  return JSON.parse(raw) as Message[]
}

export default defineEventHandler(async (event) => {
  try {
    const { nickName, email, content } = await readBody(event)
    if (!nickName || !content) return error('昵称和内容不能为空')

    const xForwardedFor = getRequestHeader(event, 'x-forwarded-for')
    const ip = xForwardedFor?.split(',')[0] || ''

    const createTime = new Date().toISOString()
    const headUrl = getAvatarUrl(email)

    const newMsg: Message = { nickName, email, content, createTime, ip, headUrl }

    const db = ensureFile()
    db.push(newMsg)
    fs.writeFileSync(FILE_PATH, JSON.stringify(db, null, 2), 'utf-8')

    return success(newMsg)
  } catch (err) {
    console.error(err)
    return error('留言失败')
  }
})
