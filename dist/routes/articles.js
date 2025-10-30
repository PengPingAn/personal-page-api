"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
router.get("/", async (_req, res) => {
    try {
        const response = await axios_1.default.get("http://localhost:5002/api/WebArticles/get_home_articles");
        res.success(response.data);
    }
    catch (err) {
        console.error(err);
        res.error("Failed to fetch .NET API data");
    }
});
exports.default = router;
//# sourceMappingURL=articles.js.map