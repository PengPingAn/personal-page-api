import express from "express";
import { getDB } from "../db/db.js";

const router: any = express.Router();

router.get("/get_personal", async (_req: Request, res: Response) => {
  const db = await getDB("personal", { name: "", bio: "", projects: [] });
  res.success(db.data);
});

router.post("/update_personal", async (req, res) => {
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
