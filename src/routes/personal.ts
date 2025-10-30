import express, { Router } from "express";
import type { Request, Response } from "express";
import { getDB } from "../db/db.js";

// 扩展 Response 类型，增加 success 和 error 方法
interface CustomResponse extends Response {
  success: (data: any) => void;
  error: (msg: string) => void;
}

const router: Router = express.Router();

router.get("/get_personal", async (_req: Request, res: CustomResponse) => {
  const db = await getDB("personal", { name: "", bio: "", projects: [] });
  res.success(db.data);
});

router.post("/update_personal", async (req: Request, res: CustomResponse) => {
  try {
    const db = await getDB("personal", { name: "", bio: "", projects: [] });
    const { name, bio, projects } = req.body;

    if (name !== undefined) db.data!.name = name;
    if (bio !== undefined) db.data!.bio = bio;
    if (projects !== undefined) db.data!.projects = projects;

    await db.write();
    res.success(db.data);
  } catch (err) {
    console.error(err);
    res.error("写入失败");
  }
});

export default router;
