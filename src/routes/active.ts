import express from "express";
import { activeMiddleware, redis } from "../middleware/active.js";

const router: import("express").Router = express.Router();

// 心跳接口：每次访问都会刷新 TTL
router.get("/ping", activeMiddleware, (req, res) => {
  res.json({ ok: true });
});

// 获取活跃用户数接口
router.get("/count", async (req, res) => {
  let count = 0;
  const iter = redis.scanIterator({ MATCH: "active:*" });
  for await (const _ of iter) count++;
  res.json({ active: count });
});

export default router;
