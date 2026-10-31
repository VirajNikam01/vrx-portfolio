import "server-only";
import { randomBytes } from "node:crypto";
import { adminSessionsRepository } from "@/backend/repository/admin_sessions";
import { getAdminCredentials, hashToken } from "@/backend/security/admin-credentials";

async function create() {
    const credentials = getAdminCredentials();
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
    await adminSessionsRepository.create(hashToken(token), credentials.version, expiresAt);
    return { token, expiresAt };
}
async function validate(token: string | undefined) {
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
    const credentials = getAdminCredentials();
    const row = await adminSessionsRepository.find(hashToken(token), credentials.version, new Date());
    return row ? { email: credentials.email, expiresAt: row.expiresAt.toISOString() } : null;
}
async function revoke(token: string | undefined) { if (token && /^[a-f0-9]{64}$/.test(token)) await adminSessionsRepository.revoke(hashToken(token)); }
export const adminSessionsService = { create, validate, revoke };
