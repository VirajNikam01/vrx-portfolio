CREATE TYPE "public"."feature_flag_rule_type" AS ENUM('allow', 'deny', 'variant');--> statement-breakpoint
CREATE TYPE "public"."publish_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "ui_pages" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"path" text NOT NULL,
	"title" text NOT NULL,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"seo" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ui_pages_key_unique" UNIQUE("key"),
	CONSTRAINT "ui_pages_path_unique" UNIQUE("path")
);
--> statement-breakpoint
CREATE TABLE "ui_sections" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"page_id" bigint NOT NULL,
	"key" text NOT NULL,
	"component_key" text NOT NULL,
	"title" text,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"props" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"data_source" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"visibility_rules" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"design_overrides" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ui_sections_page_key_unique" UNIQUE("page_id","key")
);
--> statement-breakpoint
CREATE TABLE "design_configs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"scope" text DEFAULT 'global' NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"tokens" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"component_variants" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "design_configs_scope_key_unique" UNIQUE("scope","key"),
	CONSTRAINT "design_configs_schema_version_check" CHECK ("design_configs"."schema_version" >= 1)
);
--> statement-breakpoint
CREATE TABLE "feature_flag_rules" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"flag_id" bigint NOT NULL,
	"key" text NOT NULL,
	"environment" text DEFAULT 'production' NOT NULL,
	"rule_type" "feature_flag_rule_type" DEFAULT 'variant' NOT NULL,
	"variant_key" text,
	"priority" integer DEFAULT 0 NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"rollout_percentage" integer DEFAULT 100 NOT NULL,
	"conditions" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "feature_flag_rules_flag_key_unique" UNIQUE("flag_id","key"),
	CONSTRAINT "feature_flag_rules_rollout_percentage_check" CHECK ("feature_flag_rules"."rollout_percentage" >= 0 AND "feature_flag_rules"."rollout_percentage" <= 100),
	CONSTRAINT "feature_flag_rules_schedule_check" CHECK ("feature_flag_rules"."starts_at" IS NULL OR "feature_flag_rules"."ends_at" IS NULL OR "feature_flag_rules"."starts_at" < "feature_flag_rules"."ends_at")
);
--> statement-breakpoint
CREATE TABLE "feature_flag_variants" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"flag_id" bigint NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"weight" integer DEFAULT 0 NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "feature_flag_variants_flag_key_unique" UNIQUE("flag_id","key"),
	CONSTRAINT "feature_flag_variants_weight_check" CHECK ("feature_flag_variants"."weight" >= 0)
);
--> statement-breakpoint
CREATE TABLE "feature_flags" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_enabled" boolean DEFAULT false NOT NULL,
	"default_variant_key" text DEFAULT 'off' NOT NULL,
	"owner" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "feature_flags_key_unique" UNIQUE("key"),
	CONSTRAINT "feature_flags_schedule_check" CHECK ("feature_flags"."starts_at" IS NULL OR "feature_flags"."ends_at" IS NULL OR "feature_flags"."starts_at" < "feature_flags"."ends_at")
);
--> statement-breakpoint
CREATE SEQUENCE "inquiries_id_seq" AS bigint START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "id" SET DATA TYPE bigint USING nextval('"inquiries_id_seq"');--> statement-breakpoint
ALTER SEQUENCE "inquiries_id_seq" OWNED BY "inquiries"."id";--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "id" SET DEFAULT nextval('"inquiries_id_seq"');--> statement-breakpoint
SELECT setval('"inquiries_id_seq"', COALESCE((SELECT MAX("id") FROM "inquiries"), 1), (SELECT COUNT(*) > 0 FROM "inquiries"));--> statement-breakpoint
ALTER TABLE "ui_sections" ADD CONSTRAINT "ui_sections_page_id_ui_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."ui_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feature_flag_rules" ADD CONSTRAINT "feature_flag_rules_flag_id_feature_flags_id_fk" FOREIGN KEY ("flag_id") REFERENCES "public"."feature_flags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feature_flag_variants" ADD CONSTRAINT "feature_flag_variants_flag_id_feature_flags_id_fk" FOREIGN KEY ("flag_id") REFERENCES "public"."feature_flags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ui_pages_status_idx" ON "ui_pages" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ui_sections_page_status_sort_idx" ON "ui_sections" USING btree ("page_id","status","sort_order");--> statement-breakpoint
CREATE INDEX "ui_sections_component_key_idx" ON "ui_sections" USING btree ("component_key");--> statement-breakpoint
CREATE INDEX "design_configs_scope_active_idx" ON "design_configs" USING btree ("scope","is_active");--> statement-breakpoint
CREATE INDEX "feature_flag_rules_lookup_idx" ON "feature_flag_rules" USING btree ("flag_id","environment","is_enabled","priority");--> statement-breakpoint
CREATE INDEX "feature_flag_variants_flag_enabled_idx" ON "feature_flag_variants" USING btree ("flag_id","is_enabled");--> statement-breakpoint
CREATE INDEX "feature_flags_enabled_idx" ON "feature_flags" USING btree ("is_enabled");
