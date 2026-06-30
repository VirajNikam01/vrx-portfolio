import { bigserial, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { visitors } from "./visitors";

export const inquiries = pgTable("inquiries", {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    source: text("source").notNull(),
    visitorId: text("visitor_id").references(() => visitors.fingerprintHash),
    name: text("name").notNull(),
    email: text("email").notNull(),
    reason: text("reason").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export type NewInquiry = typeof inquiries.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
