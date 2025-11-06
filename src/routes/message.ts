import { Router, Request, Response } from "express";
import { getDB } from "../db/db.js";
import type { Message } from "../types/message.js";
import { getAvatarUrl } from "../utils/avatar.js";

const router: Router = Router();

router.get("/get_message_list", async (_req: Request, res: Response) => {
  try {
    const db = await getDB<Message[]>("message", []); // 直接指定返回类型为对象数组

    // 数据已经是对象数组了，可以直接返回
    res.success(db.data);
  } catch (err) {
    console.error(err);
    res.error("获取消息列表失败");
  }
});

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

export default router;
