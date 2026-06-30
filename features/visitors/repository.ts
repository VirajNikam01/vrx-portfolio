import { visitors } from "@/lib/db/schema";
import db from "@/lib/db/client";
import { eq, sql } from "drizzle-orm";
import { InferInsertModel } from "drizzle-orm";

type NewVisitor = InferInsertModel<typeof visitors>;

const getByFingerprintHash = async (fingerprintHash: string) => {
    const [visitor] = await db
        .select()
        .from(visitors)
        .where(eq(visitors.fingerprintHash, fingerprintHash));

    return visitor ?? null;
};

const upsert = async (visitor: NewVisitor) => {
    const now = new Date();
    const { fingerprintHash, ...visitorValues } = visitor;

    await db
        .insert(visitors)
        .values({
            fingerprintHash,
            ...visitorValues,
            firstSeenAt: now,
            lastSeenAt: now,
            visitCount: 1,
        })
        .onConflictDoUpdate({
            target: visitors.fingerprintHash,
            set: {
                ...visitorValues,
                lastSeenAt: now,
                visitCount: sql`${visitors.visitCount} + 1`,
            },
        });
};

export const visitorsRepository = {
    getByFingerprintHash,
    upsert,
};
