import bcrypt from 'bcryptjs'
import { getDB } from '~/server/utils/db'
import { signToken } from '~/server/utils/auth'
import { success, error } from '~/server/utils/response'
import type { Login } from '~/server/types/user'

export default defineEventHandler(async (event) => {
  try {
    const { account, password } = await readBody(event)

    if (!account || !password) return error('用户名和密码不能为空')

    const db = await getDB<Login>('user', {
      account: '',
      password: '',
      lastIp: '',
      lastTime: '',
      head: '',
    })

    if (account !== db.data!.account) return error('用户不存在')

    const match = await bcrypt.compare(password, db.data!.password)
    if (!match) return error('密码错误')

    const xForwardedFor = getRequestHeader(event, 'x-forwarded-for')
    const ip = xForwardedFor?.split(',')[0] || ''

    const currentTime = new Date().toISOString()

    db.data!.lastIp = ip
    db.data!.lastTime = currentTime
    await db.write()

    const token = signToken({ userInfo: db.data }, '7d')

    return success({
      token,
      account,
      head: db.data!.head,
    })
  } catch (err) {
    console.error(err)
    return error('登录失败')
  }
})
