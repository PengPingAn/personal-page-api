import { success, error } from '~/server/utils/response'

export default defineEventHandler(async () => {
  try {
    const response = await $fetch('http://localhost:5002/api/WebArticles/get_home_articles')
    return success(response)
  } catch (err) {
    console.error(err)
    return error('Failed to fetch .NET API data')
  }
})
