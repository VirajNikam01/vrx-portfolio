import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const adminLoginLimits = pgTable("admin_login_limits", {
    key: text("key").primaryKey(), attempts: integer("attempts").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
