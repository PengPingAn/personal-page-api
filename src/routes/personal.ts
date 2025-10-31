import { Router, Request, Response } from "express";
import { getDB } from "../db/db.ts";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/get_personal",
  authMiddleware,
  async (_req: Request, res: Response) => {
    const db = await getDB("personal", { name: "", bio: "", projects: [] });
    res.success(db.data); // 这里仍然能用 success
  }
);

router.post(
  "/update_personal",
  authMiddleware,
  async (req: Request, res: Response) => {
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
  }
);

export default router;
