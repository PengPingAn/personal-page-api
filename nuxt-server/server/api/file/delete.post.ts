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

    const { file } = await readBody(event)

    if (!file) return error('文件名不能为空')
    if (!validateFileName(file)) return error('文件名不合法')

    const filePath = path.join(jsonDir, `${file}.json`)

    try {
      await fs.promises.access(filePath)
    } catch {
      return error('指定文件不存在，无法删除')
    }

    await fs.promises.unlink(filePath)
    return success({ message: '文件删除成功', file })
  } catch (err: any) {
    if (err.statusCode === 401) throw err
    console.error('删除 JSON 文件失败：', err)
    return error(`删除文件失败: ${err.message || err}`)
  }
})
