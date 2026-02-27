import { getDB } from '~/server/utils/db'
import { success } from '~/server/utils/response'
import type { Photo } from '~/server/types/photos'

export default defineEventHandler(async () => {
  const defaults: Photo[] = [{ title: '', img: '' }]
  const db = await getDB<Photo[]>('photos', defaults)
  return success(db.data)
})
