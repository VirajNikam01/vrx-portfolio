import "server-only";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/backend/db/client";
import { adminLoginLimits } from "@/backend/db/schema/admin-login-limits";

async function reserve(key: string, now: Date, expiresAt: Date) {
    const [row] = await getDb().insert(adminLoginLimits).values({ key, attempts: 1, expiresAt }).onConflictDoUpdate({
        target: adminLoginLimits.key,
        set: {
            attempts: sql`case when ${adminLoginLimits.expiresAt} <= ${now.toISOString()} then 1 else ${adminLoginLimits.attempts} + 1 end`,
            expiresAt: sql`case when ${adminLoginLimits.expiresAt} <= ${now.toISOString()} then ${expiresAt.toISOString()} else ${adminLoginLimits.expiresAt} end`,
        },
    }).returning();
    return row;
}
async function clear(key: string) { await getDb().delete(adminLoginLimits).where(eq(adminLoginLimits.key, key)); }
export const adminLoginLimitsRepository = { reserve, clear };
