"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvatarUrl = getAvatarUrl;
const crypto_1 = __importDefault(require("crypto"));
/**
 * 获取用户头像 URL（支持 QQ 邮箱、Gravatar）
 * @param email 用户邮箱
 * @param size 头像大小
 * @returns 头像 URL
 */
function getAvatarUrl(email, size = 100) {
    if (!email)
        return getGravatarUrl("default@example.com", size);
    const emailTrimmed = email.trim().toLowerCase();
    const qqNumber = isQQEmail(emailTrimmed);
    if (qqNumber) {
        return getQQAvatarUrl(qqNumber, size);
    }
    return getGravatarUrl(emailTrimmed, size);
}
/**
 * 判断是否为 QQ 邮箱，并返回 QQ 号
 * @param email 邮箱
 * @returns QQ 号或 null
 */
function isQQEmail(email) {
    const match = email.match(/^(\d{5,12})@qq\.com$/);
    return match ? match[1] : null;
}
/**
 * 获取 QQ 头像 URL
 * @param qq QQ 号
 * @param size 大小
 */
function getQQAvatarUrl(qq, size = 100) {
    return `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=${size}`;
}
/**
 * 获取 Gravatar 头像 URL
 * @param email 邮箱
 * @param size 大小
 */
function getGravatarUrl(email, size = 100) {
    const hash = crypto_1.default.createHash("md5").update(email).digest("hex");
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`;
}
//# sourceMappingURL=avatar.js.map