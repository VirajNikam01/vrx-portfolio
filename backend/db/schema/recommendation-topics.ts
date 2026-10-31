import {
    bigserial,
    boolean,
    index,
    integer,
    pgTable,
    text,
    timestamp,
    unique,
} from "drizzle-orm/pg-core";
import { recommendations } from "./recommendations";

export const recommendationTopics = pgTable(
    "recommendation_topics",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        recommendationId: bigserial("recommendation_id", { mode: "number" })
            .notNull()
            .references(() => recommendations.id, { onDelete: "cascade" }),
        slug: text("slug").notNull(),
        title: text("title").notNull(),
        sortOrder: integer("sort_order").default(0).notNull(),
        content: text("content").notNull(),
        isPublished: boolean("is_published").default(true).notNull(),
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
        unique("recommendation_topics_slug_unique").on(
            table.recommendationId,
            table.slug,
        ),
        index("recommendation_topics_recommendation_id_idx").on(
            table.recommendationId,
        ),
        index("recommendation_topics_sort_order_idx").on(table.sortOrder),
        index("recommendation_topics_published_idx").on(table.isPublished),
    ],
);

export type NewRecommendationTopic = typeof recommendationTopics.$inferInsert;
export type RecommendationTopic = typeof recommendationTopics.$inferSelect;
