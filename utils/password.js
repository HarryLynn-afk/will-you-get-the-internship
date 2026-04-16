import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export function hashPassword(password) {
  const safePassword = String(password || "");
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(safePassword, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password, storedHash) {
  const safePassword = String(password || "");
  const [salt, hash] = String(storedHash || "").split(":");

  if (!salt || !hash) {
    return false;
  }

  const derivedKey = scryptSync(safePassword, salt, KEY_LENGTH);
  const storedBuffer = Buffer.from(hash, "hex");

  if (derivedKey.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, storedBuffer);
}
