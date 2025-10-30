"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db/db");
const router = express_1.default.Router();
router.get("/get_personal", async (_req, res) => {
    const db = await (0, db_1.getDB)("personal", { name: "", bio: "", projects: [] });
    res.success(db.data);
});
router.post("/update_personal", async (req, res) => {
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