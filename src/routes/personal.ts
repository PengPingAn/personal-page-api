import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router: Router = Router();

// JSON 文件路径
const DATA_DIR = path.resolve("./db");
const FILE_PATH = path.join(DATA_DIR, "personal.json");

// 队列控制写入
let writeQueue: (() => Promise<void>)[] = [];
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

// 确保文件存在
function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE_PATH))
    fs.writeFileSync(
      FILE_PATH,
      JSON.stringify({ name: "", bio: "", projects: [] })
    );
  const raw = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(raw);
}

// GET 个人信息
router.get("/get_personal", authMiddleware, (_req: Request, res: Response) => {
  try {
    const db = ensureFile();
    res.success(db);
  } catch (err) {
    console.error(err);
    res.error("获取个人信息失败");
  }
});

// POST 更新个人信息
router.post(
  "/update_personal",
  authMiddleware,
  (req: Request, res: Response) => {
    try {
      const { name, bio, projects } = req.body;

      writeQueue.push(async () => {
        const db = ensureFile();
        if (name !== undefined) db.name = name;
        if (bio !== undefined) db.bio = bio;
        if (projects !== undefined) db.projects = projects;

        fs.writeFileSync(FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
        res.success(db);
      });

      processQueue();
    } catch (err) {
      console.error(err);
      res.error("写入失败");
    }
  }
);

export default router;
