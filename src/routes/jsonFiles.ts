import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { fileURLToPath } from "url";

// 当前文件绝对路径
const __filename = fileURLToPath(import.meta.url);

// 当前文件所在目录
const __dirname = path.dirname(__filename);

const router: import("express").Router = Router();

// JSON 文件所在目录
const jsonDir = path.resolve(__dirname, "../db/json");

// 写入队列，保证并发安全
const writeQueue: (() => Promise<void>)[] = [];
let writing = false;

async function processQueue() {
  if (writing || writeQueue.length === 0) return;
  writing = true;
  const fn = writeQueue.shift()!;
  try {
    await fn();
  } catch (err) {
    console.error("写入队列出错:", err);
  }
  writing = false;
  processQueue();
}

// 确保目录存在
if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });

// 工具函数：校验文件名合法性
function validateFileName(file: string) {
  return /^[a-zA-Z0-9_-]+$/.test(file);
}

// 获取 JSON 文件列表
router.get("/list", authMiddleware, async (_req: Request, res: Response) => {
  try {
    const files = await fs.promises.readdir(jsonDir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));
    res.success(jsonFiles); // 返回文件名数组
  } catch (err: any) {
    console.error("读取 JSON 文件列表失败：", err);
    res.error(`读取文件列表失败: ${err.message || err}`);
  }
});

// 获取指定 JSON 文件内容
router.get("/content", authMiddleware, async (req: Request, res: Response) => {
  try {
    let fileName = req.query.file as string;
    if (!fileName) return res.error("文件名不能为空");

    // 去掉可能存在的 .json 后缀
    if (fileName.toLowerCase().endsWith(".json")) {
      fileName = fileName.slice(0, -5);
    }

    if (!validateFileName(fileName)) return res.error("文件名不合法");

    // 拼接路径
    const filePath = path.join(jsonDir, `${fileName}.json`);

    const content = await fs.promises.readFile(filePath, "utf-8");
    res.success(JSON.parse(content));
  } catch (err: any) {
    console.error("读取 JSON 文件失败：", err);
    res.error(`读取文件失败: ${err.message || err}`);
  }
});

/**
 * 修改文件内容 参数：文件名、内容（覆盖式写入）
 * 兼容 vue-json-pretty 和 JsonEditorVue，支持删除字段
 */
router.post("/update", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { file, data } = req.body;

    if (!file) return res.error("文件名不能为空");
    if (!data) return res.error("数据不能为空");
    if (!validateFileName(file)) return res.error("文件名不合法");

    const filePath = path.join(jsonDir, `${file}.json`);

    // 入队写入，防止并发覆盖
    writeQueue.push(async () => {
      await fs.promises.writeFile(
        filePath,
        JSON.stringify(data, null, 2),
        "utf-8"
      );
      res.success("修改成功");
    });
    processQueue();
  } catch (err: any) {
    console.error("写入 JSON 文件失败：", err);
    res.error(`写入文件失败: ${err.message || err}`);
  }
});

/**
 * 新增 JSON 文件接口
 */
router.post("/create", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { file, data } = req.body;

    if (!file) return res.error("文件名不能为空");
    if (!data) return res.error("数据不能为空");
    if (!validateFileName(file)) return res.error("文件名不合法");

    const filePath = path.join(jsonDir, `${file}.json`);

    // 判断文件是否已存在
    try {
      await fs.promises.access(filePath);
      return res.error("文件已存在，不能重复创建");
    } catch {}

    writeQueue.push(async () => {
      await fs.promises.writeFile(
        filePath,
        JSON.stringify(data, null, 2),
        "utf-8"
      );
      res.success({ message: "文件创建成功", file, data });
    });
    processQueue();
  } catch (err: any) {
    console.error("创建 JSON 文件失败：", err);
    res.error(`创建文件失败: ${err.message || err}`);
  }
});

/**
 * 删除 JSON 文件接口
 */
router.post("/delete", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { file } = req.body;

    if (!file) return res.error("文件名不能为空");
    if (!validateFileName(file)) return res.error("文件名不合法");

    const filePath = path.join(jsonDir, `${file}.json`);

    try {
      await fs.promises.access(filePath);
    } catch {
      return res.error("指定文件不存在，无法删除");
    }

    writeQueue.push(async () => {
      await fs.promises.unlink(filePath);
      res.success({ message: "文件删除成功", file });
    });
    processQueue();
  } catch (err: any) {
    console.error("删除 JSON 文件失败：", err);
    res.error(`删除文件失败: ${err.message || err}`);
  }
});

export default router;
