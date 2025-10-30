import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";

/**
 * 通用 DB 获取方法
 * @param name 文件名（不带后缀）
 * @param defaults 默认数据结构
 */
export async function getDB<T extends object>(
  name: string,
  defaults: T
): Promise<Low<T>> {
  const dir = join(__dirname); // 存放位置（你可以改成 join(__dirname, '../data')）
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
