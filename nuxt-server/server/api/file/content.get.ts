import fs from 'fs'
import path from 'path'
import { verifyAuth } from '~/server/utils/auth'
import { success, error } from '~/server/utils/response'

const jsonDir = path.resolve(process.cwd(), 'server/db/json')

function validateFileName(file: string) {
  return /^[a-zA-Z0-9_-]+$/.test(file)
}

export default defineEventHandler(async (event) => {
  try {
    verifyAuth(event)

    const query = getQuery(event)
    let fileName = query.file as string
    if (!fileName) return error('文件名不能为空')

    // 去掉可能存在的 .json 后缀
    if (fileName.toLowerCase().endsWith('.json')) {
      fileName = fileName.slice(0, -5)
    }

    if (!validateFileName(fileName)) return error('文件名不合法')

    const filePath = path.join(jsonDir, `${fileName}.json`)
    const content = await fs.promises.readFile(filePath, 'utf-8')
    return success(JSON.parse(content))
  } catch (err: any) {
    if (err.statusCode === 401) throw err
    console.error('读取 JSON 文件失败：', err)
    return error(`读取文件失败: ${err.message || err}`)
  }
})
