import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
  // 默认放到 src/db/json
  const dir = useSubFolder ? join(__dirname, "json") : join(__dirname);

  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const file = join(dir, `${name}.json`);

  // 如果文件不存在则创建并写入默认值
  if (!existsSync(file)) {
    writeFileSync(file, JSON.stringify(defaults, null, 2));
  }

  const adapter = new JSONFile<T>(file);
  const db = new Low<T>(adapter, defaults);

  await db.read();
  return db;
}
