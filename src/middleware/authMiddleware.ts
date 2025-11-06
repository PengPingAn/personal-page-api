import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_jwt_secret"; // 和登录一致，部署时用环境变量

export interface AuthRequest extends Request {
  user?: { username: string };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.error("未登录", 401);

  const token = authHeader.split(" ")[1];
  if (!token) return res.error("未登录", 401);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    req.user = { username: decoded.username }; // 可以在接口中使用 req.user
    next();
  } catch (err) {
    return res.error("Token 无效或已过期", 401);
  }
}
