import { Router, Request, Response } from "express";
import { getDB } from "../db/db.ts"; // 简单 JSON DB
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface User {
  account: string;
  password: string;
}

const router = Router();
const JWT_SECRET = "your_jwt_secret"; // ⚠️ 部署时请放环境变量

// --- 注册接口（可选） ---
router.post("/register", async (req: Request, res: Response) => {
  try {
    const db = await getDB<User>("user", { account: "admin", password: "" });
    const { account, password } = req.body;

    if (!account || !password) return res.error("用户名和密码不能为空");

    // 单用户判断：如果已经有用户名且不同，则提示已存在
    if (db.data!.account && db.data!.account !== account)
      return res.error("已存在用户");

    // 加密密码
    const hashed = await bcrypt.hash(password, 10);
    db.data!.account = account;
    db.data!.password = hashed;
    await db.write();

    res.success({ account });
  } catch (err) {
    console.error(err);
    res.error("注册失败");
  }
});

// --- 登录接口 ---
router.post("/login", async (req: Request, res: Response) => {
  try {
    const db = await getDB<User>("user", { account: "admin", password: "" });
    const { account, password } = req.body;

    if (!account || !password) return res.error("用户名和密码不能为空");

    if (account !== db.data!.account) return res.error("用户不存在");

    const match = await bcrypt.compare(password, db.data!.password);
    if (!match) return res.error("密码错误");

    // 生成 JWT
    const token = jwt.sign({ account }, JWT_SECRET, { expiresIn: "7d" });

    res.success({ token, account });
  } catch (err) {
    console.error(err);
    res.error("登录失败");
  }
});

// --- 获取当前用户信息 ---
router.get("/me", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.error("未登录", 401);

    const token = authHeader.split(" ")[1];
    if (!token) return res.error("未登录", 401);

    const decoded: any = jwt.verify(token, JWT_SECRET);
    res.success({ account: decoded.account });
  } catch (err) {
    res.error("Token 无效", 401);
  }
});

// --- 修改密码（可选） ---
router.post("/update_password", async (req: Request, res: Response) => {
  try {
    const db = await getDB<User>("user", { account: "admin", password: "" });
    const { oldPassword, newPassword } = req.body;

    const match = await bcrypt.compare(oldPassword, db.data!.password);
    if (!match) return res.error("旧密码错误");

    db.data!.password = await bcrypt.hash(newPassword, 10);
    await db.write();

    res.success("密码修改成功");
  } catch (err) {
    console.error(err);
    res.error("修改失败");
  }
});

export default router;
