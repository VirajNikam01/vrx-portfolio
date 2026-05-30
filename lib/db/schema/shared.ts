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

export const experiencePositionCategory = pgEnum("experience_position_category", [
    "professional",
    "education",
    "learning",
]);

export const experiencePositionIcon = pgEnum("experience_position_icon", [
    "code",
    "design",
    "business",
    "education",
]);

export const introductionStatementEmphasis = pgEnum(
    "introduction_statement_emphasis",
    ["solid", "accent", "duration"],
);

export const introductionActionKind = pgEnum("introduction_action_kind", [
    "connect",
    "resume",
]);

export const jsonRecord = (columnName: string) =>
    jsonb(columnName).$type<JsonValue>();
