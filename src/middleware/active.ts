import { RequestHandler } from "express";
import { createClient, RedisClientType } from "redis";
import { v4 as uuidv4 } from "uuid";

const TTL = 30;
const PREFIX = "active:";
export const redis: RedisClientType = createClient({
  url: "redis://localhost:6379",
});
redis.connect();

export const activeMiddleware: RequestHandler = async (req, res, next) => {
  let deviceId = req.cookies.device_id;
  if (!deviceId) {
    deviceId = uuidv4();
    res.cookie("device_id", deviceId, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: false,
      sameSite: "lax",
    });
  }

  await redis.set(`${PREFIX}${deviceId}`, "1", { EX: TTL });

  (req as any).deviceId = deviceId;

  next();
};
