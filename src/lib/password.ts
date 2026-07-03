import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

/** Hash a plain password as `scrypt$salt$hash` using a random salt. */
export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString("hex");
    scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(`scrypt$${salt}$${derivedKey.toString("hex")}`);
    });
  });
}

/** Constant-time verification of a plain password against a stored hash. */
export function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  return new Promise((resolve) => {
    const [scheme, salt, hash] = stored.split("$");
    if (scheme !== "scrypt" || !salt || !hash) {
      resolve(false);
      return;
    }

    scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        resolve(false);
        return;
      }
      const hashBuffer = Buffer.from(hash, "hex");
      if (hashBuffer.length !== derivedKey.length) {
        resolve(false);
        return;
      }
      resolve(timingSafeEqual(hashBuffer, derivedKey));
    });
  });
}
