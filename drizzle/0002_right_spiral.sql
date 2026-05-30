CREATE TYPE "public"."experience_position_category" AS ENUM('professional', 'education', 'learning');--> statement-breakpoint
CREATE TYPE "public"."experience_position_icon" AS ENUM('code', 'design', 'business', 'education');--> statement-breakpoint
CREATE TYPE "public"."introduction_action_kind" AS ENUM('connect', 'resume');--> statement-breakpoint
CREATE TYPE "public"."introduction_statement_emphasis" AS ENUM('solid', 'accent', 'duration');--> statement-breakpoint
CREATE TABLE "introduction_actions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"introduction_id" bigint NOT NULL,
	"kind" "introduction_action_kind" NOT NULL,
	"label" text NOT NULL,
	"href" text,
	"file_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "introduction_actions_intro_kind_unique" UNIQUE("introduction_id","kind")
);
--> statement-breakpoint
CREATE TABLE "introduction_statement_segments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"introduction_id" bigint NOT NULL,
	"text" text NOT NULL,
	"emphasis" "introduction_statement_emphasis",
	"sort_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "introduction_statement_intro_sort_unique" UNIQUE("introduction_id","sort_order")
);
--> statement-breakpoint
CREATE TABLE "introductions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"eyebrow" text NOT NULL,
	"headline" text NOT NULL,
	"intro" text NOT NULL,
	"image_src" text NOT NULL,
	"image_alt" text NOT NULL,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "introductions_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "work_experience_companies" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"company_name" text NOT NULL,
	"company_logo" text,
	"is_current_employer" boolean DEFAULT false NOT NULL,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "work_experience_companies_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "work_experience_position_descriptions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"position_id" bigint NOT NULL,
	"body" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "work_experience_descriptions_position_sort_unique" UNIQUE("position_id","sort_order")
);
--> statement-breakpoint
CREATE TABLE "work_experience_position_skills" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"position_id" bigint NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "work_experience_skills_position_name_unique" UNIQUE("position_id","name")
);
--> statement-breakpoint
CREATE TABLE "work_experience_positions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"company_id" bigint NOT NULL,
	"key" text NOT NULL,
	"title" text NOT NULL,
	"category" "experience_position_category" NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"employment_type" text,
	"icon" "experience_position_icon",
	"is_expanded" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "work_experience_positions_company_key_unique" UNIQUE("company_id","key")
);
--> statement-breakpoint
ALTER TABLE "introduction_actions" ADD CONSTRAINT "introduction_actions_introduction_id_introductions_id_fk" FOREIGN KEY ("introduction_id") REFERENCES "public"."introductions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "introduction_statement_segments" ADD CONSTRAINT "introduction_statement_segments_introduction_id_introductions_id_fk" FOREIGN KEY ("introduction_id") REFERENCES "public"."introductions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_experience_position_descriptions" ADD CONSTRAINT "work_experience_position_descriptions_position_id_work_experience_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."work_experience_positions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_experience_position_skills" ADD CONSTRAINT "work_experience_position_skills_position_id_work_experience_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."work_experience_positions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_experience_positions" ADD CONSTRAINT "work_experience_positions_company_id_work_experience_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."work_experience_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "introduction_actions_intro_sort_idx" ON "introduction_actions" USING btree ("introduction_id","sort_order");--> statement-breakpoint
CREATE INDEX "introduction_statement_intro_sort_idx" ON "introduction_statement_segments" USING btree ("introduction_id","sort_order");--> statement-breakpoint
CREATE INDEX "introductions_status_idx" ON "introductions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "work_experience_companies_status_sort_idx" ON "work_experience_companies" USING btree ("status","sort_order");--> statement-breakpoint
CREATE INDEX "work_experience_descriptions_position_sort_idx" ON "work_experience_position_descriptions" USING btree ("position_id","sort_order");--> statement-breakpoint
CREATE INDEX "work_experience_skills_position_sort_idx" ON "work_experience_position_skills" USING btree ("position_id","sort_order");--> statement-breakpoint
CREATE INDEX "work_experience_positions_company_sort_idx" ON "work_experience_positions" USING btree ("company_id","sort_order");