import { getDb } from "@/lib/db/client";
import { inquiries, type NewInquiry } from "@/lib/db/schema";

export async function createInquiry(values: NewInquiry) {
    const [inquiry] = await getDb()
        .insert(inquiries)
        .values(values)
        .returning();

    return inquiry;
}
