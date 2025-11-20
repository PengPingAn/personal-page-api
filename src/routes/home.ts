import { Router, Request, Response } from "express";
import { promises as fs } from "fs";
import path from "path";
import type { Message } from "../types/message.js";
import { getAvatarUrl } from "../utils/avatar.js";
import { getDB } from "../db/db.js";
import { YearlyGoals } from "../types/matter.js";
import { UserProfile } from "../types/personal.js";
import { MBTICharacter } from "../types/MBTI.js";
import { Photo } from "../types/photos.js";
import { fileURLToPath } from "url";

const router: import("express").Router = Router();

// 当前文件绝对路径（ESM 下 __dirname 替代）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON 文件所在目录
const jsonDir = path.join(__dirname, "../db/json");

/**
 * 获取作品集
 */
router.get("/get_projects", async (req: Request, res: Response) => {
  try {
    const fileName = "projects.json";
    const filePath = path.join(jsonDir, fileName);
    const content = await fs.readFile(filePath, "utf-8");
    res.success(JSON.parse(content));
  } catch (err: any) {
    console.error("读取 JSON 文件失败：", err);
    res.error(`读取文件失败: ${err.message || err}`);
  }
});

/**
 * 获取留言
 */
router.get("/get_message_list", async (_req: Request, res: Response) => {
  try {
    const db = await getDB<Message[]>("message", []); // 直接指定返回类型为对象数组
    res.success(db.data);
  } catch (err) {
    console.error(err);
    res.error("获取消息列表失败");
  }
});

/**
 * 添加留言
 */
router.post("/add_message", async (req: Request, res: Response) => {
  try {
    const { nickName, email, content } = req.body;
    if (!nickName || !content) return res.error("昵称和内容不能为空");

    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.socket.remoteAddress ||
      "";

    const createTime = new Date().toISOString();
    const headUrl = getAvatarUrl(email);

    const db = await getDB<Message[]>("message", []);
    const newMsg = { nickName, email, content, createTime, ip, headUrl };

    db.data!.push(newMsg);
    await db.write();

    res.success(newMsg);
  } catch (err) {
    console.error(err);
    res.error("留言失败");
  }
});

/**
 * 获取目标列表
 */
router.get("/get_matter_list", async (_req: Request, res: Response) => {
  try {
    const db = await getDB<YearlyGoals[]>("matter", []); // 直接指定返回类型为对象数组
    res.success(db.data);
  } catch (err) {
    console.error(err);
    res.error("获取消息列表失败");
  }
});

/**
 * 获取主页用户信息
 */
router.get("/get_personal", async (_req: Request, res: Response) => {
  const defaults: UserProfile = {
    name: "",
    occupation: "",
    job: { desc: "", item: [] },
    introduction: "",
    contact: [],
    location: { country: "", city: "", region: "", Motto: "" },
    sponsorshipUrls: [],
    particleImage: "",
  };
  const db = await getDB<UserProfile>("personal", defaults);
  res.success(db.data); // 这里仍然能用 success
});

router.get("/get_MBTI", async (_req: Request, res: Response) => {
  const defaults: MBTICharacter = {
    mbti: "",
    name: "",
    description: "",
    imgUrl: "",
    data: [],
  };
  const db = await getDB<MBTICharacter>("MBTICharacter", defaults);
  res.success(db.data);
});

/**
 * 获取相册
 */
router.get("/get_photos", async (_req: Request, res: Response) => {
  const defaults: Photo[] = [
    {
      title: "",
      img: "",
    },
  ];
  const db = await getDB<Photo[]>("photos", defaults);
  res.success(db.data);
});

export default router;
