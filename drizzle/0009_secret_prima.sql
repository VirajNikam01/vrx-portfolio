CREATE TABLE "recommendation_topics" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"recommendation_id" bigserial NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"content" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "recommendation_topics_slug_unique" UNIQUE("recommendation_id","slug")
);
--> statement-breakpoint
ALTER TABLE "recommendation_topics" ADD CONSTRAINT "recommendation_topics_recommendation_id_recommendations_id_fk" FOREIGN KEY ("recommendation_id") REFERENCES "public"."recommendations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recommendation_topics_recommendation_id_idx" ON "recommendation_topics" USING btree ("recommendation_id");--> statement-breakpoint
CREATE INDEX "recommendation_topics_sort_order_idx" ON "recommendation_topics" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "recommendation_topics_published_idx" ON "recommendation_topics" USING btree ("is_published");