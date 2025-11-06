"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "your_jwt_secret"; // 和登录一致，部署时用环境变量
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.error("未登录", 401);
    const token = authHeader.split(" ")[1];
    if (!token)
        return res.error("未登录", 401);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = { username: decoded.username }; // 可以在接口中使用 req.user
        next();
    }
    catch (err) {
        return res.error("Token 无效或已过期", 401);
    }
}
//# sourceMappingURL=authMiddleware.js.map