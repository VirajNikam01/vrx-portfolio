/** @jest-environment node */
import { randomBytes, scryptSync } from "node:crypto";
import { adminAuthService } from "@/backend/services/admin-auth";
import { adminSessionsService } from "@/backend/services/admin-sessions";
import { adminSessionsRepository } from "@/backend/repository/admin_sessions";
import { adminLoginLimitsRepository } from "@/backend/repository/admin_login_limits";
import { getAdminCredentials, hashToken } from "@/backend/security/admin-credentials";

jest.mock("@/backend/repository/admin_sessions", () => ({ adminSessionsRepository: { create: jest.fn(), find: jest.fn(), revoke: jest.fn() } }));
jest.mock("@/backend/repository/admin_login_limits", () => ({ adminLoginLimitsRepository: { reserve: jest.fn(), clear: jest.fn() } }));
jest.setTimeout(30000);
const original = { email: process.env.ADMIN_EMAIL, hash: process.env.ADMIN_PASSWORD_HASH, version: process.env.ADMIN_CREDENTIAL_VERSION };
const salt = randomBytes(16);
const hash = `scrypt:65536:8:2:${salt.toString("hex")}:${scryptSync("test-owner-password", salt, 64, { N: 65536, r: 8, p: 2, maxmem: 128 * 1024 * 1024 }).toString("hex")}`;

beforeEach(() => {
    jest.resetAllMocks();
    process.env.ADMIN_EMAIL = "owner@example.com"; process.env.ADMIN_PASSWORD_HASH = hash; process.env.ADMIN_CREDENTIAL_VERSION = "v1";
    const buckets = new Map<string, number>();
    jest.mocked(adminLoginLimitsRepository.reserve).mockImplementation(async (key, _now, expiresAt) => {
        const attempts = (buckets.get(key) ?? 0) + 1; buckets.set(key, attempts);
        return { key, attempts, expiresAt };
    });
});
afterAll(() => {
    for (const [name, value] of Object.entries({ ADMIN_EMAIL: original.email, ADMIN_PASSWORD_HASH: original.hash, ADMIN_CREDENTIAL_VERSION: original.version })) {
        if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
});

it("issues random eight-hour sessions and stores only the token hash", async () => {
    const session = await adminAuthService.login(" OWNER@example.com ", "test-owner-password", "ip");
    expect(session.token).toMatch(/^[a-f0-9]{64}$/);
    expect(session.expiresAt.getTime() - Date.now()).toBeGreaterThan(7.9 * 60 * 60 * 1000);
    expect(adminSessionsRepository.create).toHaveBeenCalledWith(hashToken(session.token), getAdminCredentials().version, session.expiresAt);
    expect(adminLoginLimitsRepository.clear).toHaveBeenCalledTimes(2);
});

it("uses generic credential errors and does not create sessions on a wrong email or password", async () => {
    await expect(adminAuthService.login("other@example.com", "test-owner-password", "ip")).rejects.toMatchObject({ status: 401, message: "Email or password is incorrect." });
    await expect(adminAuthService.login("owner@example.com", "wrong", "ip")).rejects.toMatchObject({ status: 401, message: "Email or password is incorrect." });
    expect(adminSessionsRepository.create).not.toHaveBeenCalled();
});

it("reserves attempts in persistent buckets and blocks the sixth failed login", async () => {
    for (let attempt = 0; attempt < 5; attempt++) await expect(adminAuthService.login("owner@example.com", "wrong", "ip")).rejects.toMatchObject({ status: 401 });
    await expect(adminAuthService.login("owner@example.com", "test-owner-password", "another-ip")).rejects.toMatchObject({ status: 429 });
    expect(adminSessionsRepository.create).not.toHaveBeenCalled();
}, 30000);

it("rejects malformed tokens and invalidates sessions when credentials rotate", async () => {
    await expect(adminSessionsService.validate("bad-token")).resolves.toBeNull();
    expect(adminSessionsRepository.find).not.toHaveBeenCalled();
    const token = "a".repeat(64);
    const previousVersion = getAdminCredentials().version;
    jest.mocked(adminSessionsRepository.find).mockImplementation(async (_hash, version) => version === previousVersion ? { tokenHash: hashToken(token), credentialVersion: previousVersion, expiresAt: new Date(Date.now() + 60000) } : null);
    await expect(adminSessionsService.validate(token)).resolves.toMatchObject({ email: "owner@example.com" });
    process.env.ADMIN_CREDENTIAL_VERSION = "v2";
    await expect(adminSessionsService.validate(token)).resolves.toBeNull();
    await adminSessionsService.revoke(token);
    expect(adminSessionsRepository.revoke).toHaveBeenCalledWith(hashToken(token));
});

it("fails closed on missing configuration and database errors", async () => {
    delete process.env.ADMIN_PASSWORD_HASH;
    await expect(adminAuthService.login("owner@example.com", "anything", "ip")).rejects.toThrow("not configured");
    expect(adminSessionsRepository.create).not.toHaveBeenCalled();
    process.env.ADMIN_PASSWORD_HASH = hash;
    jest.mocked(adminSessionsRepository.find).mockRejectedValue(new Error("offline"));
    await expect(adminSessionsService.validate("a".repeat(64))).rejects.toThrow("offline");
});
