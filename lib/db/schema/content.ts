import {
    boolean,
    bigint,
    bigserial,
    index,
    integer,
    pgTable,
    text,
    timestamp,
    unique,
} from "drizzle-orm/pg-core";

import { jsonRecord, publishStatus } from "./shared";

export const uiPages = pgTable(
    "ui_pages",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        key: text("key").notNull(),
        path: text("path").notNull(),
        title: text("title").notNull(),
        status: publishStatus("status").default("draft").notNull(),
        seo: jsonRecord("seo").default({}).notNull(),
        metadata: jsonRecord("metadata").default({}).notNull(),
        publishedAt: timestamp("published_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("ui_pages_key_unique").on(table.key),
        unique("ui_pages_path_unique").on(table.path),
        index("ui_pages_status_idx").on(table.status),
    ],
);

export const uiSections = pgTable(
    "ui_sections",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        pageId: bigint("page_id", { mode: "number" })
            .notNull()
            .references(() => uiPages.id, { onDelete: "cascade" }),
        key: text("key").notNull(),
        componentKey: text("component_key").notNull(),
        title: text("title"),
        isEnabled: boolean("is_enabled").default(true).notNull(),
        sortOrder: integer("sort_order").default(0).notNull(),
        status: publishStatus("status").default("draft").notNull(),
        props: jsonRecord("props").default({}).notNull(),
        content: jsonRecord("content").default({}).notNull(),
        dataSource: jsonRecord("data_source").default({}).notNull(),
        visibilityRules: jsonRecord("visibility_rules").default({}).notNull(),
        designOverrides: jsonRecord("design_overrides").default({}).notNull(),
        metadata: jsonRecord("metadata").default({}).notNull(),
        publishedAt: timestamp("published_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("ui_sections_page_key_unique").on(table.pageId, table.key),
        index("ui_sections_page_status_sort_idx").on(
            table.pageId,
            table.status,
            table.sortOrder,
        ),
        index("ui_sections_component_key_idx").on(table.componentKey),
    ],
);

export type NewUiPage = typeof uiPages.$inferInsert;
export type UiPage = typeof uiPages.$inferSelect;

export type NewUiSection = typeof uiSections.$inferInsert;
export type UiSection = typeof uiSections.$inferSelect;
