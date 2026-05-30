import { sql } from "drizzle-orm";
import {
    boolean,
    bigint,
    bigserial,
    check,
    index,
    integer,
    pgTable,
    text,
    timestamp,
    unique,
} from "drizzle-orm/pg-core";

import { featureFlagRuleType, jsonRecord } from "./shared";

export const featureFlags = pgTable(
    "feature_flags",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        key: text("key").notNull(),
        name: text("name").notNull(),
        description: text("description"),
        isEnabled: boolean("is_enabled").default(false).notNull(),
        defaultVariantKey: text("default_variant_key").default("off").notNull(),
        owner: text("owner"),
        metadata: jsonRecord("metadata").default({}).notNull(),
        startsAt: timestamp("starts_at", { withTimezone: true }),
        endsAt: timestamp("ends_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("feature_flags_key_unique").on(table.key),
        index("feature_flags_enabled_idx").on(table.isEnabled),
        check(
            "feature_flags_schedule_check",
            sql`${table.startsAt} IS NULL OR ${table.endsAt} IS NULL OR ${table.startsAt} < ${table.endsAt}`,
        ),
    ],
);

export const featureFlagVariants = pgTable(
    "feature_flag_variants",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        flagId: bigint("flag_id", { mode: "number" })
            .notNull()
            .references(() => featureFlags.id, { onDelete: "cascade" }),
        key: text("key").notNull(),
        name: text("name").notNull(),
        isEnabled: boolean("is_enabled").default(true).notNull(),
        weight: integer("weight").default(0).notNull(),
        payload: jsonRecord("payload").default({}).notNull(),
        sortOrder: integer("sort_order").default(0).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("feature_flag_variants_flag_key_unique").on(
            table.flagId,
            table.key,
        ),
        check("feature_flag_variants_weight_check", sql`${table.weight} >= 0`),
        index("feature_flag_variants_flag_enabled_idx").on(
            table.flagId,
            table.isEnabled,
        ),
    ],
);

export const featureFlagRules = pgTable(
    "feature_flag_rules",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),
        flagId: bigint("flag_id", { mode: "number" })
            .notNull()
            .references(() => featureFlags.id, { onDelete: "cascade" }),
        key: text("key").notNull(),
        environment: text("environment").default("production").notNull(),
        ruleType: featureFlagRuleType("rule_type").default("variant").notNull(),
        variantKey: text("variant_key"),
        priority: integer("priority").default(0).notNull(),
        isEnabled: boolean("is_enabled").default(true).notNull(),
        rolloutPercentage: integer("rollout_percentage").default(100).notNull(),
        conditions: jsonRecord("conditions").default({}).notNull(),
        metadata: jsonRecord("metadata").default({}).notNull(),
        startsAt: timestamp("starts_at", { withTimezone: true }),
        endsAt: timestamp("ends_at", { withTimezone: true }),
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("feature_flag_rules_flag_key_unique").on(table.flagId, table.key),
        index("feature_flag_rules_lookup_idx").on(
            table.flagId,
            table.environment,
            table.isEnabled,
            table.priority,
        ),
        check(
            "feature_flag_rules_rollout_percentage_check",
            sql`${table.rolloutPercentage} >= 0 AND ${table.rolloutPercentage} <= 100`,
        ),
        check(
            "feature_flag_rules_schedule_check",
            sql`${table.startsAt} IS NULL OR ${table.endsAt} IS NULL OR ${table.startsAt} < ${table.endsAt}`,
        ),
    ],
);

export type NewFeatureFlag = typeof featureFlags.$inferInsert;
export type FeatureFlag = typeof featureFlags.$inferSelect;

export type NewFeatureFlagVariant = typeof featureFlagVariants.$inferInsert;
export type FeatureFlagVariant = typeof featureFlagVariants.$inferSelect;

export type NewFeatureFlagRule = typeof featureFlagRules.$inferInsert;
export type FeatureFlagRule = typeof featureFlagRules.$inferSelect;
