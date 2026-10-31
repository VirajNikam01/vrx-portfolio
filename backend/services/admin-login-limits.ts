import "server-only";
import { adminLoginLimitsRepository } from "@/backend/repository/admin_login_limits";
import { hashToken } from "@/backend/security/admin-credentials";
import { AdminError } from "@/backend/errors/admin";

async function reserve(account: string, ip: string) {
    const keys = [hashToken(`account:${account}`), hashToken(`ip:${ip}`)];
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);
    for (const key of keys) {
        const row = await adminLoginLimitsRepository.reserve(key, now, expiresAt);
        if (row.attempts > 5) throw new AdminError(429, "Too many sign-in attempts. Please try again later.", undefined, Math.max(1, Math.ceil((row.expiresAt.getTime() - now.getTime()) / 1000)));
    }
    return keys;
}
async function clear(keys: string[]) { await Promise.all(keys.map(key => adminLoginLimitsRepository.clear(key))); }
export const adminLoginLimitsService = { reserve, clear };
