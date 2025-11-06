"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db/db");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/get_personal", authMiddleware_1.authMiddleware, async (_req, res) => {
    const db = await (0, db_1.getDB)("personal", { name: "", bio: "", projects: [] });
    res.success(db.data); // 这里仍然能用 success
});
router.post("/update_personal", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const db = await (0, db_1.getDB)("personal", { name: "", bio: "", projects: [] });
        const { name, bio, projects } = req.body;
        if (name !== undefined)
            db.data.name = name;
        if (bio !== undefined)
            db.data.bio = bio;
        if (projects !== undefined)
            db.data.projects = projects;
        await db.write();
        res.success(db.data);
    }
    catch (err) {
        console.error(err);
        res.error("写入失败");
    }
});
exports.default = router;
//# sourceMappingURL=personal.js.map