import "server-only";

import { getDb } from "@/backend/db/client";
import { inquiries, type NewInquiry } from "@/backend/db/schema/inquiries";

async function createInquiry(values: NewInquiry) {
    const [inquiry] = await getDb()
        .insert(inquiries)
        .values(values)
        .returning();

    return inquiry;
}

export const inquiriesRepository = { createInquiry };
