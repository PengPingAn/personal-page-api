"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDB = getDB;
const lowdb_1 = require("lowdb");
const node_1 = require("lowdb/node");
const path_1 = require("path");
const fs_1 = require("fs");
/**
 * 通用 DB 获取方法
 * @param name 文件名（不带后缀）
 * @param defaults 默认数据结构
 */
async function getDB(name, defaults) {
    const dir = (0, path_1.join)(__dirname); // 存放位置（你可以改成 join(__dirname, '../data')）
    if (!(0, fs_1.existsSync)(dir))
        (0, fs_1.mkdirSync)(dir, { recursive: true });
    const file = (0, path_1.join)(dir, `${name}.json`);
    // 如果文件不存在则创建并写入默认值
    if (!(0, fs_1.existsSync)(file)) {
        (0, fs_1.writeFileSync)(file, JSON.stringify(defaults, null, 2));
    }
    const adapter = new node_1.JSONFile(file);
    const db = new lowdb_1.Low(adapter, defaults);
    await db.read();
    return db;
}
//# sourceMappingURL=db.js.map