import { pgTable, text, timestamp, smallint, real, boolean } from "drizzle-orm/pg-core";

export const visitors = pgTable("visitors", {
    fingerprintHash: text("fingerprint_hash").primaryKey(),
    label: text("label"),
    // device
    screen: text("screen"),
    platform: text("platform"),
    devicePixelRatio: real("device_pixel_ratio"),
    colorDepth: smallint("color_depth"),
    maxTouchPoints: smallint("max_touch_points"),   // 0 = desktop
    hardwareConcurrency: smallint("hardware_concurrency"),
    // browser
    language: text("language"),
    timezone: text("timezone"),
    cookiesEnabled: boolean("cookies_enabled"),
    // network (server-side)
    ip: text("ip"),
    country: text("country"),
    region: text("region"),
    city: text("city"),
    userAgent: text("user_agent"),
    // timestamps
    firstSeenAt: timestamp("first_seen_at").defaultNow().notNull(),
    lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
});