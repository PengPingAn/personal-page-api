import fs from 'fs'
import path from 'path'
import { verifyAuth } from '~/server/utils/auth'
import { success, error } from '~/server/utils/response'

const jsonDir = path.resolve(process.cwd(), 'server/db/json')

export default defineEventHandler(async (event) => {
  try {
    verifyAuth(event)

    if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true })

    const files = await fs.promises.readdir(jsonDir)
    const jsonFiles = files.filter((file) => file.endsWith('.json'))
    return success(jsonFiles)
  } catch (err: any) {
    if (err.statusCode === 401) throw err
    console.error('读取 JSON 文件列表失败：', err)
    return error(`读取文件列表失败: ${err.message || err}`)
  }
})
