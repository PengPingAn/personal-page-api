"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db/db");
const avatar_1 = require("../utils/avatar");
const router = (0, express_1.Router)();
router.get("/get_message_list", async (_req, res) => {
    try {
        const db = await (0, db_1.getDB)("message", []); // 直接指定返回类型为对象数组
        // 数据已经是对象数组了，可以直接返回
        res.success(db.data);
    }
    catch (err) {
        console.error(err);
        res.error("获取消息列表失败");
    }
});
router.post("/add_message", async (req, res) => {
    try {
        const { nickName, email, content } = req.body;
        if (!nickName || !content)
            return res.error("昵称和内容不能为空");
        const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
            req.socket.remoteAddress ||
            "";
        const createTime = new Date().toISOString();
        const headUrl = (0, avatar_1.getAvatarUrl)(email);
        const db = await (0, db_1.getDB)("message", []);
        const newMsg = { nickName, email, content, createTime, ip, headUrl };
        db.data.push(newMsg);
        await db.write();
        res.success(newMsg);
    }
    catch (err) {
        console.error(err);
        res.error("留言失败");
    }
});
exports.default = router;
//# sourceMappingURL=message.js.map