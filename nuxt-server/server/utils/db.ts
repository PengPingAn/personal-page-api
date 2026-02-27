import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

/**
 * 获取 JSON 数据存储目录
 * Nuxt 中使用 process.cwd() 获取项目根目录，数据存放在 server/db/json 下
 */
function getDbDir(useSubFolder = true): string {
  const baseDir = join(process.cwd(), 'server', 'db')
  return useSubFolder ? join(baseDir, 'json') : baseDir
}

/**
 * 通用 DB 获取方法
 * @param name 文件名（不带后缀）
 * @param defaults 默认数据结构
 * @param useSubFolder 是否放到 json 子文件夹，默认 true
 */
export async function getDB<T extends object>(
  name: string,
  defaults: T,
  useSubFolder = true
): Promise<Low<T>> {
  const dir = getDbDir(useSubFolder)

  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

  const file = join(dir, `${name}.json`)

  // 如果文件不存在则创建并写入默认值
  if (!existsSync(file)) {
    writeFileSync(file, JSON.stringify(defaults, null, 2))
  }

  const adapter = new JSONFile<T>(file)
  const db = new Low<T>(adapter, defaults)

  await db.read()
  return db
}
