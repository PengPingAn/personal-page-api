import { getDB } from '~/server/utils/db'
import { success } from '~/server/utils/response'
import type { UserProfile } from '~/server/types/personal'

export default defineEventHandler(async () => {
  const defaults: UserProfile = {
    name: '',
    occupation: '',
    job: { desc: '', item: [] },
    introduction: '',
    contact: [],
    location: { country: '', city: '', region: '', Motto: '' },
    sponsorshipUrls: [],
    particleImage: '',
    rss: '',
    skills: [],
  }
  const db = await getDB<UserProfile>('personal', defaults)
  return success(db.data)
})
