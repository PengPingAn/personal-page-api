import { Router, Request, Response } from "express";
import axios from "axios";

// 如果你后续有自定义 res 方法，可以扩展类型
// 这里先用默认 Response
const router: Router = Router();

// 这里是模拟代理 .NET API
router.get("/", async (req: Request, res: Response) => {
  try {
    // 请求你的 .NET API
    const response = await axios.get(
      "http://localhost:5002/api/WebArticles/get_home_articles"
    );
    const articles = response.data;

    // 可以在这里处理数据，比如分页、过滤
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch .NET API data" });
  }
});

export default router;
