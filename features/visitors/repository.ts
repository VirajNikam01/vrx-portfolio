import { visitors } from "@/lib/db/schema";
import db from "@/lib/db/client";
import { eq } from "drizzle-orm";
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
    await db
        .insert(visitors)
        .values({ ...visitor, firstSeenAt: new Date(), lastSeenAt: new Date() })
        .onConflictDoUpdate({
            target: visitors.fingerprintHash,
            set: { ...visitor, lastSeenAt: new Date() },
        });
};

export const visitorsRepository = {
    getByFingerprintHash,
    upsert,
};