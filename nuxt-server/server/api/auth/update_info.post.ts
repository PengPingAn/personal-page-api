import { getDB } from '~/server/utils/db'
import { verifyAuth } from '~/server/utils/auth'
import { success, error } from '~/server/utils/response'
import type { UserInfo } from '~/server/types/user'

export default defineEventHandler(async (event) => {
  try {
    verifyAuth(event)

    const { account, email, head, nickName } = await readBody<UserInfo>(event)

    const db = await getDB<UserInfo>('user', {
      account: '',
      email: '',
      head: '',
      nickName: '',
    })

    db.data!.account = account
    db.data!.email = email
    db.data!.head = head
    db.data!.nickName = nickName
    await db.write()

    return success('信息修改成功')
  } catch (err: any) {
    if (err.statusCode === 401) throw err
    console.error(err)
    return error('修改失败')
  }
})
