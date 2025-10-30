"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const personal_1 = __importDefault(require("./routes/personal"));
const articles_1 = __importDefault(require("./routes/articles"));
const response_1 = require("./middleware/response");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(response_1.responseEnhancer);
app.use("/personal", personal_1.default);
app.use("/articles", articles_1.default);
let port = 5000; // 默认端口
const maxPort = 5100; // 最大尝试端口
function startServer() {
    const server = app.listen(port, () => {
        console.log(`API running at http://localhost:${port}`);
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