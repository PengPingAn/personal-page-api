import { getDB } from '~/server/utils/db'
import { success, error } from '~/server/utils/response'
import type { YearlyGoals } from '~/server/types/matter'

export default defineEventHandler(async () => {
  try {
    const db = await getDB<YearlyGoals[]>('matter', [])
    return success(db.data)
  } catch (err) {
    console.error(err)
    return error('获取消息列表失败')
  }
})
