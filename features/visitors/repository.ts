import { visitors } from "@/lib/db/schema";
import { getDb } from "@/lib/db/client";
import { eq, sql } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";

type NewVisitor = InferInsertModel<typeof visitors>;
type VisitorAttributes = Omit<NewVisitor, "fingerprintHash">;

async function getByFingerprintHash(fingerprintHash: string) {
    const [visitor] = await getDb()
        .select()
        .from(visitors)
        .where(eq(visitors.fingerprintHash, fingerprintHash));

    return visitor ?? null;
}

async function upsert(visitor: NewVisitor) {
    const { fingerprintHash, ...visitorAttributes } = visitor;
    const seenAt = new Date();

    await getDb()
        .insert(visitors)
        .values(_buildNewVisitorRecord(fingerprintHash, visitorAttributes, seenAt))
        .onConflictDoUpdate({
            target: visitors.fingerprintHash,
            set: _buildVisitorRefresh(visitorAttributes, seenAt),
        });
}

function _buildNewVisitorRecord(
    fingerprintHash: string,
    visitorAttributes: VisitorAttributes,
    seenAt: Date,
) {
    return {
        fingerprintHash,
        ...visitorAttributes,
        firstSeenAt: seenAt,
        lastSeenAt: seenAt,
        visitCount: 1,
    };
}

function _buildVisitorRefresh(visitorAttributes: VisitorAttributes, seenAt: Date) {
    return {
        ...visitorAttributes,
        lastSeenAt: seenAt,
        visitCount: sql`${visitors.visitCount} + 1`,
    };
}

export const visitorsRepository = {
    getByFingerprintHash,
    upsert,
};