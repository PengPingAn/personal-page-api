import express from "express";
import { getDB } from "../db/db";

const router = express.Router();

router.get("/get_personal", async (_req, res) => {
  const db = await getDB("personal", { name: "", bio: "", projects: [] });
  (res as any).success(db.data); // 类型断言，TS 不会报错
});

router.post("/update_personal", async (req, res) => {
  try {
    const db = await getDB("personal", { name: "", bio: "", projects: [] });
    const { name, bio, projects } = req.body;

    if (name !== undefined) db.data!.name = name;
    if (bio !== undefined) db.data!.bio = bio;
    if (projects !== undefined) db.data!.projects = projects;

    await db.write();
    (res as any).success(db.data);
  } catch (err) {
    console.error(err);
    (res as any).error("写入失败");
  }
});

export default router;
