import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import type { Message } from "../types/message.js";
import { getAvatarUrl } from "../utils/avatar.js";

const router: Router = Router();

// JSON 文件路径
const DATA_DIR = path.resolve("./db");
const FILE_PATH = path.join(DATA_DIR, "message.json");

// 队列控制写入，防止并发覆盖
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
  processQueue(); // 处理下一个
}

// 确保文件存在
function ensureFile(): Message[] {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE_PATH))
    fs.writeFileSync(FILE_PATH, JSON.stringify([]));
  const raw = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(raw) as Message[];
}

// GET 留言列表
router.get("/get_message_list", (_req: Request, res: Response) => {
  try {
    const db = ensureFile();
    res.success(db);
  } catch (err) {
    console.error(err);
    res.error("获取消息列表失败");
  }
});

// POST 新增留言
router.post("/add_message", (req: Request, res: Response) => {
  try {
    const { nickName, email, content } = req.body;
    if (!nickName || !content) return res.error("昵称和内容不能为空");

    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.socket.remoteAddress ||
      "";

    const createTime = new Date().toISOString();
    const headUrl = getAvatarUrl(email);

    const newMsg: Message = {
      nickName,
      email,
      content,
      createTime,
      ip,
      headUrl,
    };

    // 入队写入
    writeQueue.push(async () => {
      const db = ensureFile();
      db.push(newMsg);
      fs.writeFileSync(FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
    });
    processQueue();

    res.success(newMsg);
  } catch (err) {
    console.error(err);
    res.error("留言失败");
  }
});

export default router;
