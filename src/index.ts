import express from "express";
import personalRouter from "./routes/personal.ts"; // 注意 .js 部署用
import articlesRouter from "./routes/articles.ts";
import { responseEnhancer } from "./middleware/response.ts";

const app = express();
app.use(express.json());
app.use(responseEnhancer); // ⚠️ 这里直接传原生 Response

app.use("/personal", personalRouter);
app.use("/articles", articlesRouter);

let port = process.env.PORT ? Number(process.env.PORT) : 5000;
const maxPort = 5100;

function startServer() {
  const server = app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
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
