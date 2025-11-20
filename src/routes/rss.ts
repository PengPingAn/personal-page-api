import express from "express";
import Parser from "rss-parser";
import { formatRssDate } from "../utils/dateUtils.js";

const router: import("express").Router = express.Router();
const parser = new Parser();

// 缓存对象
interface CacheEntry {
  data: any;
  timestamp: number;
}
const rssCache: Record<string, CacheEntry> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟

router.get("/", async (req, res) => {
  const url = req.query.url as string;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  // 先检查缓存
  const cached = rssCache[url];
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return res.success(cached.data);
  }

  try {
    const feed = await parser.parseURL(url);

    const posts = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: formatRssDate(item.pubDate || ""),
      author: item.creator || item.author,
    }));

    const data = {
      blogLink: feed.link,
      item: posts.slice(0, 5),
    };

    // 缓存数据
    rssCache[url] = { data, timestamp: now };

    res.success(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch RSS", details: err });
  }
});

export default router;
