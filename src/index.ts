import express from "express";
import cors from "cors"; // ✅ 引入 cors 包
import personalRouter from "./routes/personal.js"; // 注意 .ts 或 .js
import articlesRouter from "./routes/articles.js";
import auth from "./routes/auth.js";
import jsonFile from "./routes/jsonFiles.js";
import { responseEnhancer } from "./middleware/response.js";
import activeRouter from "./routes/active.js";
import homeRouter from "./routes/home.js";

const app = express();
app.use(express.json());
app.use(responseEnhancer as unknown as import("express").RequestHandler);

// 使用 cors 中间件
app.use(
  cors({
    origin: true, //["http://localhost:3000"] // 允许的域名
    methods: ["GET", "POST", "PUT", "DELETE"], // 允许的请求方法
    credentials: true, // 是否允许携带 cookie
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Pragma",
    ], // 允许的请求头
  })
);

// --- 统一 API 前缀 ---
const apiRouter = express.Router();

// 挂载具体路由
apiRouter.use("/personal", personalRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/auth", auth);
apiRouter.use("/file", jsonFile);
apiRouter.use("/active", activeRouter);
apiRouter.use("/home", homeRouter);

// 挂载到 /api
app.use("/api", apiRouter);

// --- 启动服务器 ---
let port = process.env.PORT ? Number(process.env.PORT) : 5000;
const maxPort = 5100;

function startServer() {
  const server = app.listen(port, () => {
    console.log(`API running at http://localhost:${port}/api`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${port} is in use, trying next port...`);
      port++;
      if (port > maxPort) {
        console.error("No available port found.");
        process.exit(1);
      } else {
        startServer();
      }
    } else {
      console.error(err);
      process.exit(1);
    }
  });
}

startServer();
