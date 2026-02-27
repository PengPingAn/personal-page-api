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

    const { file, data } = await readBody(event)

    if (!file) return error('文件名不能为空')
    if (!data) return error('数据不能为空')
    if (!validateFileName(file)) return error('文件名不合法')

    const filePath = path.join(jsonDir, `${file}.json`)
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return success('修改成功')
  } catch (err: any) {
    if (err.statusCode === 401) throw err
    console.error('写入 JSON 文件失败：', err)
    return error(`写入文件失败: ${err.message || err}`)
  }
})
