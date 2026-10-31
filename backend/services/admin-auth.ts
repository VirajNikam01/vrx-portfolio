import "server-only";
import { getAdminCredentials, verifyAdminPassword } from "@/backend/security/admin-credentials";
import { adminSessionsService } from "./admin-sessions";
import { adminLoginLimitsService } from "./admin-login-limits";
import { AdminError } from "@/backend/errors/admin";

async function login(email: string, password: string, ip: string, previousToken?: string) {
    const credentials = getAdminCredentials();
    const keys = await adminLoginLimitsService.reserve(credentials.email, ip);
    const matches = await verifyAdminPassword(password, credentials.passwordHash);
    if (email.trim().toLowerCase() !== credentials.email || !matches) throw new AdminError(401, "Email or password is incorrect.");
    await adminSessionsService.revoke(previousToken);
    const session = await adminSessionsService.create();
    await adminLoginLimitsService.clear(keys);
    return session;
}
export const adminAuthService = { login };
