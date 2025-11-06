import { Low } from "lowdb";
/**
 * 通用 DB 获取方法
 * @param name 文件名（不带后缀）
 * @param defaults 默认数据结构
 * @param useSubFolder 是否放到 json 子文件夹，默认 true
 */
export declare function getDB<T extends object>(name: string, defaults: T, useSubFolder?: boolean): Promise<Low<T>>;
//# sourceMappingURL=db.d.ts.map