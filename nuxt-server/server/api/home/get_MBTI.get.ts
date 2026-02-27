import { getDB } from '~/server/utils/db'
import { success } from '~/server/utils/response'
import type { MBTICharacter } from '~/server/types/MBTI'

export default defineEventHandler(async () => {
  const defaults: MBTICharacter = {
    mbti: '',
    name: '',
    description: '',
    imgUrl: '',
    data: [],
  }
  const db = await getDB<MBTICharacter>('MBTICharacter', defaults)
  return success(db.data)
})
