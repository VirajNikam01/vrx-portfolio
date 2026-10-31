CREATE TABLE "admin_sessions" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"credential_version" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_login_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"attempts" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recommendations" ADD COLUMN "version" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "recommendations" ADD COLUMN "slug_locked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "recommendation_topics" ADD COLUMN "version" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "recommendation_topics" ADD COLUMN "slug_locked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "admin_sessions_expiry_idx" ON "admin_sessions" USING btree ("expires_at");
--> statement-breakpoint
UPDATE "recommendations" SET "slug_locked" = true WHERE "is_visible" = true;
--> statement-breakpoint
UPDATE "recommendation_topics" SET "slug_locked" = true WHERE "is_published" = true;
