import { Router, Request, Response } from "express";
import { promises as fs } from "fs";
import path from "path";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// JSON 文件所在目录
const jsonDir = path.resolve("./src/db/json");

// 获取 JSON 文件列表
router.get("/list", authMiddleware, async (_req: Request, res: Response) => {
  try {
    const files = await fs.readdir(jsonDir);
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
    const fileName = req.query.file as string;
    if (!fileName) return res.error("文件名不能为空");

    const filePath = path.join(jsonDir, fileName);
    const content = await fs.readFile(filePath, "utf-8");
    res.success(JSON.parse(content));
  } catch (err: any) {
    console.error("读取 JSON 文件失败：", err);
    res.error(`读取文件失败: ${err.message || err}`);
  }
});

// 更新 JSON 文件内容
router.post("/update", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { file, data } = req.body;
    if (!file) return res.error("文件名不能为空");
    if (!data) return res.error("数据不能为空");

    const filePath = path.join(jsonDir, file);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    res.success(data);
  } catch (err: any) {
    console.error("写入 JSON 文件失败：", err);
    res.error(`写入文件失败: ${err.message || err}`);
  }
});

export default router;
