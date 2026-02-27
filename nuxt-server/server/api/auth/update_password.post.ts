import bcrypt from 'bcryptjs'
import { getDB } from '~/server/utils/db'
import { verifyAuth } from '~/server/utils/auth'
import { success, error } from '~/server/utils/response'
import type { UserPwd } from '~/server/types/user'

export default defineEventHandler(async (event) => {
  try {
    verifyAuth(event)

    const { oldPassword, newPassword } = await readBody(event)
    const db = await getDB<UserPwd>('user', { password: '' })

    const match = await bcrypt.compare(oldPassword, db.data!.password)
    if (!match) return error('旧密码错误')

    db.data!.password = await bcrypt.hash(newPassword, 10)
    await db.write()

    return success('密码修改成功')
  } catch (err: any) {
    if (err.statusCode === 401) throw err
    console.error(err)
    return error('修改失败')
  }
})
