import { Router, Request, Response } from "express";
import axios from "axios";

const router: import("express").Router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(
      "http://localhost:5002/api/WebArticles/get_home_articles"
    );
    res.success(response.data);
  } catch (err) {
    console.error(err);
    res.error("Failed to fetch .NET API data");
  }
});

export default router;
