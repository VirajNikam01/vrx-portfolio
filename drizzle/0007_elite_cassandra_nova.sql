CREATE TABLE "content_configs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_configs_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "visitors" (
	"fingerprint_hash" text PRIMARY KEY NOT NULL,
	"screen" text,
	"platform" text,
	"device_pixel_ratio" text,
	"color_depth" smallint,
	"max_touch_points" smallint,
	"hardware_concurrency" smallint,
	"language" text,
	"timezone" text,
	"cookies_enabled" boolean,
	"ip" text,
	"country" text,
	"region" text,
	"city" text,
	"user_agent" text,
	"first_seen_at" timestamp DEFAULT now() NOT NULL,
	"last_seen_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "introduction_actions" CASCADE;--> statement-breakpoint
DROP TABLE "introduction_statement_segments" CASCADE;--> statement-breakpoint
DROP TABLE "introductions" CASCADE;--> statement-breakpoint
DROP TABLE "ui_pages" CASCADE;--> statement-breakpoint
DROP TABLE "ui_sections" CASCADE;--> statement-breakpoint
DROP TABLE "work_experience_companies" CASCADE;--> statement-breakpoint
DROP TABLE "work_experience_position_descriptions" CASCADE;--> statement-breakpoint
DROP TABLE "work_experience_position_skills" CASCADE;--> statement-breakpoint
DROP TABLE "work_experience_positions" CASCADE;--> statement-breakpoint
DROP TABLE "design_configs" CASCADE;--> statement-breakpoint
DROP TABLE "feature_flag_rules" CASCADE;--> statement-breakpoint
DROP TABLE "feature_flag_variants" CASCADE;--> statement-breakpoint
DROP TABLE "feature_flags" CASCADE;--> statement-breakpoint
CREATE INDEX "content_configs_active_idx" ON "content_configs" USING btree ("is_active");--> statement-breakpoint
DROP TYPE "public"."experience_position_category";--> statement-breakpoint
DROP TYPE "public"."experience_position_icon";--> statement-breakpoint
DROP TYPE "public"."feature_flag_rule_type";--> statement-breakpoint
DROP TYPE "public"."introduction_action_kind";--> statement-breakpoint
DROP TYPE "public"."introduction_statement_emphasis";--> statement-breakpoint
DROP TYPE "public"."publish_status";