import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";

export const adminSessions = pgTable("admin_sessions", {
    tokenHash: text("token_hash").primaryKey(),
    credentialVersion: text("credential_version").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
}, table => [index("admin_sessions_expiry_idx").on(table.expiresAt)]);
