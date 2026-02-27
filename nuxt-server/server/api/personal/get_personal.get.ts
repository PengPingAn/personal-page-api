import fs from 'fs'
import path from 'path'
import { verifyAuth } from '~/server/utils/auth'
import { success, error } from '~/server/utils/response'

const DATA_DIR = path.resolve(process.cwd(), 'server/db')
const FILE_PATH = path.join(DATA_DIR, 'personal.json')

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(FILE_PATH))
    fs.writeFileSync(FILE_PATH, JSON.stringify({ name: '', bio: '', projects: [] }))
  const raw = fs.readFileSync(FILE_PATH, 'utf-8')
  return JSON.parse(raw)
}

export default defineEventHandler(async (event) => {
  try {
    verifyAuth(event)
    const db = ensureFile()
    return success(db)
  } catch (err: any) {
    if (err.statusCode === 401) throw err
    console.error(err)
    return error('获取个人信息失败')
  }
})
