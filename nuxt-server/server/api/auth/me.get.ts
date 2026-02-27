import { getDB } from '~/server/utils/db'
import { verifyAuth } from '~/server/utils/auth'
import { success, error } from '~/server/utils/response'
import type { User } from '~/server/types/user'

export default defineEventHandler(async (event) => {
  try {
    verifyAuth(event)

    const db = await getDB<User>('user', {
      account: 'admin',
      head: '',
      lastIp: '',
      lastTime: '',
      email: '',
      nickName: '',
    })

    if (!db.data) return error('用户不存在')

    const userInfo: User = {
      account: db.data.account,
      head: db.data.head,
      email: db.data.email,
      nickName: db.data.nickName,
      lastIp: db.data.lastIp,
      lastTime: db.data.lastTime,
    }

    return success(userInfo)
  } catch (err: any) {
    if (err.statusCode === 401) throw err
    console.error(err)
    return error('获取用户信息失败', 500)
  }
})
