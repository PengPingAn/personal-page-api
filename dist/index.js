"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // ✅ 引入 cors 包
const personal_1 = __importDefault(require("./routes/personal")); // 注意 .ts 或 .js
const articles_1 = __importDefault(require("./routes/articles"));
const auth_1 = __importDefault(require("./routes/auth"));
const jsonFiles_1 = __importDefault(require("./routes/jsonFiles"));
const response_1 = require("./middleware/response");
const active_1 = __importDefault(require("./routes/active"));
const message_1 = __importDefault(require("./routes/message"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(response_1.responseEnhancer);
// 使用 cors 中间件
app.use((0, cors_1.default)({
    origin: true, //["http://localhost:3000"] // 允许的域名
    methods: ["GET", "POST", "PUT", "DELETE"], // 允许的请求方法
    credentials: true, // 是否允许携带 cookie
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Pragma",
    ], // 允许的请求头
}));
// --- 统一 API 前缀 ---
const apiRouter = express_1.default.Router();
// 挂载具体路由
apiRouter.use("/personal", personal_1.default);
apiRouter.use("/articles", articles_1.default);
apiRouter.use("/auth", auth_1.default);
apiRouter.use("/file", jsonFiles_1.default);
apiRouter.use("/active", active_1.default);
apiRouter.use("/message", message_1.default);
// 挂载到 /api
app.use("/api", apiRouter);
// --- 启动服务器 ---
let port = process.env.PORT ? Number(process.env.PORT) : 5000;
const maxPort = 5100;
function startServer() {
    const server = app.listen(port, () => {
        console.log(`API running at http://localhost:${port}/api`);
    });
    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.warn(`Port ${port} is in use, trying next port...`);
            port++;
            if (port > maxPort) {
                console.error("No available port found.");
                process.exit(1);
            }
            else {
                startServer();
            }
        }
        else {
            console.error(err);
            process.exit(1);
        }
    });
}
startServer();
//# sourceMappingURL=index.js.map