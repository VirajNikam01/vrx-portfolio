import { bigserial, boolean, index, jsonb, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";

export const contentConfigs = pgTable(
    "content_configs",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        key: text("key").notNull(),
        content: jsonb("content").$type<Record<string, unknown>>().default({}).notNull(),
        config: jsonb("config").$type<Record<string, unknown>>().default({}).notNull(),
        isActive: boolean("is_active").default(true).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("content_configs_key_unique").on(table.key),
        index("content_configs_active_idx").on(table.isActive),
    ],
);

export type NewContentConfig = typeof contentConfigs.$inferInsert;
export type ContentConfig = typeof contentConfigs.$inferSelect;
