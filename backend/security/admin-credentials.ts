import "server-only";
import { createHash, scrypt, timingSafeEqual } from "node:crypto";

export function hashToken(value: string) { return createHash("sha256").update(value).digest("hex"); }

export function getAdminCredentials() {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!email || !passwordHash || !/^scrypt:65536:8:2:[a-f0-9]{32}:[a-f0-9]{128}$/.test(passwordHash)) throw new Error("Admin credentials are not configured");
    return { email, passwordHash, version: hashToken(`${email}\0${passwordHash}\0${process.env.ADMIN_CREDENTIAL_VERSION ?? ""}`) };
}

export async function verifyAdminPassword(password: string, encoded: string) {
    const [, , , , salt, expected] = encoded.split(":");
    const actual = await new Promise<Buffer>((resolve, reject) => {
        scrypt(password, Buffer.from(salt, "hex"), 64, { N: 65536, r: 8, p: 2, maxmem: 128 * 1024 * 1024 }, (error, key) => error ? reject(error) : resolve(key));
    });
    return timingSafeEqual(actual, Buffer.from(expected, "hex"));
}
