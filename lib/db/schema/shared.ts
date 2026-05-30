import { jsonb, pgEnum } from "drizzle-orm/pg-core";

export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };

export const publishStatus = pgEnum("publish_status", [
    "draft",
    "published",
    "archived",
]);

export const featureFlagRuleType = pgEnum("feature_flag_rule_type", [
    "allow",
    "deny",
    "variant",
]);

export const jsonRecord = (columnName: string) =>
    jsonb(columnName).$type<JsonValue>();
