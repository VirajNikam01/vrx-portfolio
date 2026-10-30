import "server-only";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/backend/db/client";
import { visitors } from "@/backend/db/schema/visitors";

type NewVisitor = typeof visitors.$inferInsert;

async function getByFingerprintHash(fingerprintHash: string): Promise<typeof visitors.$inferSelect | null> {
    const [visitor] = await getDb().select().from(visitors).where(eq(visitors.fingerprintHash, fingerprintHash));
    return visitor ?? null;
}

async function upsert(visitor: NewVisitor, seenAt: Date) {
    const { fingerprintHash, ...attributes } = visitor;
    await getDb().insert(visitors).values({
        fingerprintHash, ...attributes, firstSeenAt: seenAt, lastSeenAt: seenAt, visitCount: 1,
    }).onConflictDoUpdate({
        target: visitors.fingerprintHash,
        set: { ...attributes, lastSeenAt: seenAt, visitCount: sql`${visitors.visitCount} + 1` },
    });
}

export const visitorsRepository = { getByFingerprintHash, upsert };
