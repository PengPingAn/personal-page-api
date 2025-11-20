import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDB } from "../db/db.js";
import { User, Login, UserInfo, UserPwd } from "../types/user.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router: Router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // 使用环境变量存储 JWT 密钥

// --- 登录接口 ---
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { account, password }: Login = req.body;

    if (!account || !password) return res.error("用户名和密码不能为空");

    const db = await getDB<Login>("user", {
      account: "",
      password: "",
      lastIp: "",
      lastTime: "",
      head: "",
    });

    if (account !== db.data!.account) return res.error("用户不存在");

    const match = await bcrypt.compare(password, db.data!.password);
    if (!match) return res.error("密码错误");

    const xForwardedFor = req.headers["x-forwarded-for"];
    const ip =
      (Array.isArray(xForwardedFor)
        ? xForwardedFor[0]
        : xForwardedFor?.split(",")[0]) ||
      req.socket?.remoteAddress ||
      "";

    const currentTime = new Date().toISOString();

    db.data!.lastIp = ip as string;
    db.data!.lastTime = currentTime;
    await db.write();

    const token = jwt.sign({ userInfo: db.data }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.success({
      token,
      account,
      head: db.data!.head,
    });
  } catch (err) {
    console.error(err);
    res.error("登录失败");
  }
});

// --- 获取当前用户信息 ---
router.get("/me", authMiddleware, async (_req: Request, res: Response) => {
  try {
    const db = await getDB<User>("user", {
      account: "admin",
      head: "",
      lastIp: "",
      lastTime: "",
      email: "",
      nickName: "",
    });

    if (!db.data) return res.error("用户不存在");

    const userInfo: User = {
      account: db.data.account,
      head: db.data.head,
      email: db.data.email,
      nickName: db.data.nickName,
      lastIp: db.data.lastIp,
      lastTime: db.data.lastTime,
    };

    res.success(userInfo);
  } catch (err) {
    console.error(err);
    res.error("获取用户信息失败", 500);
  }
});

// --- 修改密码 ---
router.post(
  "/update_password",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const {
        oldPassword,
        newPassword,
      }: { oldPassword: string; newPassword: string } = req.body;
      const db = await getDB<UserPwd>("user", { password: "" });

      const match = await bcrypt.compare(oldPassword, db.data!.password);
      if (!match) return res.error("旧密码错误");

      db.data!.password = await bcrypt.hash(newPassword, 10);
      await db.write();

      res.success("密码修改成功");
    } catch (err) {
      console.error(err);
      res.error("修改失败");
    }
  }
);

// --- 修改用户信息 ---
router.post(
  "/update_info",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { account, email, head, nickName }: UserInfo = req.body;

      const db = await getDB<UserInfo>("user", {
        account: "",
        email: "",
        head: "",
        nickName: "",
      });

      db.data!.account = account;
      db.data!.email = email;
      db.data!.head = head;
      db.data!.nickName = nickName;
      await db.write();

      res.success("信息修改成功");
    } catch (err) {
      console.error(err);
      res.error("修改失败");
    }
  }
);

export default router;
