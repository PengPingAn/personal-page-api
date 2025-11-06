"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeMiddleware = exports.redis = void 0;
const redis_1 = require("redis");
const uuid_1 = require("uuid");
const TTL = 30;
const PREFIX = "active:";
exports.redis = (0, redis_1.createClient)({
    url: "redis://localhost:6379",
});
exports.redis.connect();
const activeMiddleware = async (req, res, next) => {
    let deviceId = req.cookies.device_id;
    if (!deviceId) {
        deviceId = (0, uuid_1.v4)();
        res.cookie("device_id", deviceId, {
            maxAge: 1000 * 60 * 60 * 24 * 365,
            httpOnly: false,
            sameSite: "lax",
        });
    }
    await exports.redis.set(`${PREFIX}${deviceId}`, "1", { EX: TTL });
    req.deviceId = deviceId;
    next();
};
exports.activeMiddleware = activeMiddleware;
//# sourceMappingURL=active.js.map