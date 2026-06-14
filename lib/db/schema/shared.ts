import { jsonb, pgEnum } from "drizzle-orm/pg-core";

export const featureFlagRuleType = pgEnum("feature_flag_rule_type", [
    "allow",
    "deny",
    "variant",
]);

export function jsonRecord(name: string) {
    return jsonb(name).$type<Record<string, unknown>>();
}
