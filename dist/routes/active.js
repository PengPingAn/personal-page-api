"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const active_1 = require("../middleware/active");
const router = express_1.default.Router();
// 心跳接口：每次访问都会刷新 TTL
router.get("/ping", active_1.activeMiddleware, (req, res) => {
    res.json({ ok: true });
});
// 获取活跃用户数接口
router.get("/count", async (req, res) => {
    let count = 0;
    const iter = active_1.redis.scanIterator({ MATCH: "active:*" });
    for await (const _ of iter)
        count++;
    res.json({ active: count });
});
exports.default = router;
//# sourceMappingURL=active.js.map