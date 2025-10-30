import { Router } from "express";
import type { Request, Response } from "express"; // 类型-only 导入
import axios from "axios";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      "http://localhost:5002/api/WebArticles/get_home_articles"
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch .NET API data" });
  }
});

export default router;
