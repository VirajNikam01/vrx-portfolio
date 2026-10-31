import "server-only";
import { and, eq, gt, lt } from "drizzle-orm";
import { getDb } from "@/backend/db/client";
import { adminSessions } from "@/backend/db/schema/admin-sessions";

async function create(tokenHash: string, credentialVersion: string, expiresAt: Date) {
    await getDb().delete(adminSessions).where(lt(adminSessions.expiresAt, new Date()));
    await getDb().insert(adminSessions).values({ tokenHash, credentialVersion, expiresAt });
}
async function find(tokenHash: string, credentialVersion: string, now: Date): Promise<typeof adminSessions.$inferSelect | null> {
    const [row] = await getDb().select().from(adminSessions).where(and(eq(adminSessions.tokenHash, tokenHash), eq(adminSessions.credentialVersion, credentialVersion), gt(adminSessions.expiresAt, now))).limit(1);
    return row ?? null;
}
async function revoke(tokenHash: string) { await getDb().delete(adminSessions).where(eq(adminSessions.tokenHash, tokenHash)); }
export const adminSessionsRepository = { create, find, revoke };
