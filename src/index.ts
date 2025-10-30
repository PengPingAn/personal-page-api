import express from "express";
import personalRouter from "./routes/personal";
import articlesRouter from "./routes/articles";
import { responseEnhancer } from "./middleware/response";

const app = express();
app.use(express.json());
app.use(responseEnhancer);
app.use("/personal", personalRouter);
app.use("/articles", articlesRouter);

let port = 5000; // 默认端口
const maxPort = 5100; // 最大尝试端口

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
