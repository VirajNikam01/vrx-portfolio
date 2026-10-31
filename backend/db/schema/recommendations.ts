import {
    bigserial,
    boolean,
    index,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    unique,
} from "drizzle-orm/pg-core";

export const recommendationType = pgEnum("recommendation_type", [
    "book",
    "course",
    "paper",
    "article",
    "note",
    "movie",
    "video",
]);

export const recommendationCategory = pgEnum("recommendation_category", [
    "tech",
    "philosophy",
    "other",
]);

export const recommendations = pgTable(
    "recommendations",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        slug: text("slug").notNull(),
        type: recommendationType("type").notNull(),
        category: recommendationCategory("category").notNull(),
        title: text("title").notNull(),
        author: text("author").notNull(),
        description: text("description").notNull(),
        coverImageUrl: text("cover_image_url"),
        externalUrl: text("external_url"),
        notes: text("notes"),
        tags: text("tags").array().default([]).notNull(),
        isFeatured: boolean("is_featured").default(false).notNull(),
        isVisible: boolean("is_visible").default(true).notNull(),
        sortOrder: integer("sort_order").default(0).notNull(),
        version: integer("version").default(0).notNull(),
        slugLocked: boolean("slug_locked").default(false).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("recommendations_slug_unique").on(table.slug),
        index("recommendations_type_idx").on(table.type),
        index("recommendations_category_idx").on(table.category),
        index("recommendations_featured_idx").on(table.isFeatured),
        index("recommendations_visible_idx").on(table.isVisible),
    ],
);

export type NewRecommendation = typeof recommendations.$inferInsert;
export type Recommendation = typeof recommendations.$inferSelect;
