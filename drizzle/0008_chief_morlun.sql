CREATE TYPE "public"."recommendation_category" AS ENUM('tech', 'philosophy', 'other');--> statement-breakpoint
CREATE TYPE "public"."recommendation_type" AS ENUM('book', 'course');--> statement-breakpoint
CREATE TABLE "recommendations" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"type" "recommendation_type" NOT NULL,
	"category" "recommendation_category" NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"description" text NOT NULL,
	"cover_image_url" text,
	"external_url" text,
	"notes" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "recommendations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "visitors" ALTER COLUMN "device_pixel_ratio" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "visitor_id" text;--> statement-breakpoint
ALTER TABLE "visitors" ADD COLUMN "label" text;--> statement-breakpoint
ALTER TABLE "visitors" ADD COLUMN "visit_count" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
CREATE INDEX "recommendations_type_idx" ON "recommendations" USING btree ("type");--> statement-breakpoint
CREATE INDEX "recommendations_category_idx" ON "recommendations" USING btree ("category");--> statement-breakpoint
CREATE INDEX "recommendations_featured_idx" ON "recommendations" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "recommendations_visible_idx" ON "recommendations" USING btree ("is_visible");--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_visitor_id_visitors_fingerprint_hash_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."visitors"("fingerprint_hash") ON DELETE no action ON UPDATE no action;