import crypto from "crypto";

/**
 * 获取用户头像 URL（支持 QQ 邮箱、Gravatar）
 * @param email 用户邮箱
 * @param size 头像大小
 * @returns 头像 URL
 */
export function getAvatarUrl(email?: string, size = 100): string {
  if (!email) return getGravatarUrl("default@example.com", size);

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
function isQQEmail(email: string): string | null {
  const match = email.match(/^(\d{5,12})@qq\.com$/);
  return match ? (match[1] as string) : null;
}

/**
 * 获取 QQ 头像 URL
 * @param qq QQ 号
 * @param size 大小
 */
function getQQAvatarUrl(qq: string, size = 100): string {
  return `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=${size}`;
}

/**
 * 获取 Gravatar 头像 URL
 * @param email 邮箱
 * @param size 大小
 */
function getGravatarUrl(email: string, size = 100): string {
  const hash = crypto.createHash("md5").update(email).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`;
}
