import fs from 'fs'
import path from 'path'
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

export default defineEventHandler(async () => {
  try {
    const db = ensureFile()
    return success(db)
  } catch (err) {
    console.error(err)
    return error('获取消息列表失败')
  }
})
