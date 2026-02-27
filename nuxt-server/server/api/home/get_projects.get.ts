import fs from 'fs'
import path from 'path'
import { success, error } from '~/server/utils/response'

const jsonDir = path.resolve(process.cwd(), 'server/db/json')

export default defineEventHandler(async () => {
  try {
    const filePath = path.join(jsonDir, 'projects.json')
    const content = await fs.promises.readFile(filePath, 'utf-8')
    return success(JSON.parse(content))
  } catch (err: any) {
    console.error('读取 JSON 文件失败：', err)
    return error(`读取文件失败: ${err.message || err}`)
  }
})
