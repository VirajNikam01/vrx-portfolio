ALTER TYPE "public"."recommendation_type" ADD VALUE IF NOT EXISTS 'paper';--> statement-breakpoint
ALTER TYPE "public"."recommendation_type" ADD VALUE IF NOT EXISTS 'article';--> statement-breakpoint
ALTER TYPE "public"."recommendation_type" ADD VALUE IF NOT EXISTS 'movie';--> statement-breakpoint
ALTER TYPE "public"."recommendation_type" ADD VALUE IF NOT EXISTS 'video';--> statement-breakpoint
ALTER TABLE "recommendations" ADD COLUMN IF NOT EXISTS "tags" text[] DEFAULT '{}' NOT NULL;
