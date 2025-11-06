import { Router, Request, Response } from "express";
import { promises as fs } from "fs";
import path from "path";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router: import("express").Router = Router();

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

/**
 * 修改文件内容 参数：文件名、内容（覆盖式写入）
 * 兼容 vue-json-pretty 和 JsonEditorVue，支持删除字段
 */
router.post("/update", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { file, data } = req.body;

    if (!file) return res.status(400).json({ error: "文件名不能为空" });
    if (!data) return res.status(400).json({ error: "数据不能为空" });

    // 防止路径穿越攻击
    if (!/^[a-zA-Z0-9_-]+$/.test(file)) {
      return res
        .status(400)
        .json({ error: "文件名不合法，只能包含字母、数字、下划线或中划线" });
    }

    const filePath = path.join(jsonDir, `${file}.json`);

    // 检查文件是否存在
    try {
      await fs.access(filePath);
    } catch {
      return res.status(400).json({ error: "指定文件不存在，无法修改" });
    }

    // 解析传入的 data
    let parsedData: Record<string, any>;
    if (typeof data === "string") {
      try {
        parsedData = JSON.parse(data);
      } catch (err) {
        return res.status(400).json({ error: "JSON 格式错误" });
      }
    } else {
      parsedData = data;
    }

    // 覆盖写入，不再做合并
    await fs.writeFile(filePath, JSON.stringify(parsedData, null, 2), "utf-8");

    res.success("修改成功");
  } catch (err: any) {
    console.error("写入 JSON 文件失败：", err);
    res.status(500).json({ error: `写入文件失败: ${err.message || err}` });
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

    // ✅ 验证文件名合法性（防止路径穿越）
    if (!/^[a-zA-Z0-9_-]+$/.test(file)) {
      return res.error("文件名只能包含字母、数字、下划线和中划线");
    }

    const filePath = path.join(jsonDir, `${file}.json`);

    // ✅ 判断文件是否已存在
    try {
      await fs.access(filePath);
      return res.error("文件已存在，不能重复创建");
    } catch {
      // 文件不存在，可以创建
    }

    // ✅ 写入新文件（自动格式化）
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    res.success({ message: "文件创建成功", file, data });
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

    // ✅ 验证文件名合法性（防止路径穿越）
    if (!/^[a-zA-Z0-9_-]+$/.test(file)) {
      return res.error("文件名不合法，只能包含字母、数字、下划线或中划线");
    }

    const filePath = path.join(jsonDir, `${file}.json`);

    // 检查文件是否存在
    try {
      await fs.access(filePath);
    } catch {
      return res.error("指定文件不存在，无法删除");
    }

    // 删除文件
    await fs.unlink(filePath);

    res.success({ message: "文件删除成功", file });
  } catch (err: any) {
    console.error("删除 JSON 文件失败：", err);
    res.error(`删除文件失败: ${err.message || err}`);
  }
});

export default router;
