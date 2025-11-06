"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// userRouter.ts
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db/db");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // 使用环境变量存储 JWT 密钥
// --- 登录接口 ---
router.post("/login", async (req, res) => {
    try {
        const { account, password } = req.body;
        if (!account || !password)
            return res.error("用户名和密码不能为空");
        // 获取用户数据
        const db = await (0, db_1.getDB)("user", {
            account: "",
            password: "",
            lastIp: "",
            lastTime: "",
            head: "",
        });
        if (account !== db.data.account)
            return res.error("用户不存在");
        const match = await bcryptjs_1.default.compare(password, db.data.password);
        if (!match)
            return res.error("密码错误");
        // 获取客户端 IP 和当前时间
        const xForwardedFor = req.headers["x-forwarded-for"];
        const ip = (Array.isArray(xForwardedFor)
            ? xForwardedFor[0]
            : xForwardedFor?.split(",")[0]) ||
            req.connection?.remoteAddress ||
            req.socket?.remoteAddress;
        const currentTime = new Date().toISOString();
        // 更新登录信息
        db.data.lastIp = ip;
        db.data.lastTime = currentTime;
        await db.write();
        const head = db.data.head;
        // 生成 JWT Token
        const token = jsonwebtoken_1.default.sign({ userInfo: db.data }, JWT_SECRET, {
            expiresIn: "7d",
        });
        res.success({
            token,
            account,
            head,
        });
    }
    catch (err) {
        console.error(err);
        res.error("登录失败");
    }
});
// --- 获取当前用户信息 ---
router.get("/me", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        // 获取用户数据（假设 JSON 文件存储用户信息在 "user"）
        const db = await (0, db_1.getDB)("user", {
            account: "admin",
            head: "",
            lastIp: "",
            lastTime: "",
            email: "",
            nickName: "",
        });
        if (!db.data)
            return res.error("用户不存在");
        // 只取 User 需要的字段
        const userInfo = {
            account: db.data.account,
            head: db.data.head,
            email: db.data.email,
            nickName: db.data.nickName,
            lastIp: db.data.lastIp,
            lastTime: db.data.lastTime,
        };
        res.success(userInfo);
    }
    catch (err) {
        console.error(err);
        res.error("获取用户信息失败", 500);
    }
});
// --- 修改密码 ---
router.post("/update_password", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const { oldPassword, newPassword, } = req.body;
        const db = await (0, db_1.getDB)("user", { password: "" });
        const match = await bcryptjs_1.default.compare(oldPassword, db.data.password);
        if (!match)
            return res.error("旧密码错误");
        db.data.password = await bcryptjs_1.default.hash(newPassword, 10);
        await db.write();
        res.success("密码修改成功");
    }
    catch (err) {
        console.error(err);
        res.error("修改失败");
    }
});
// --- 修改用户信息 ---
router.post("/update_info", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const { account, email, head, nickName } = req.body;
        const db = await (0, db_1.getDB)("user", {
            account: "",
            email: "",
            head: "",
            nickName: "",
        });
        // 更新用户信息
        db.data.account = account;
        db.data.email = email;
        db.data.head = head;
        db.data.nickName = nickName;
        await db.write();
        res.success("信息修改成功");
    }
    catch (err) {
        console.error(err);
        res.error("修改失败");
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map