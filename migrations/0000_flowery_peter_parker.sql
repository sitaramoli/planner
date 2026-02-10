CREATE TYPE "public"."script_status" AS ENUM('DRAFT', 'WRITING', 'REVIEW', 'READY_TO_FILM', 'FILMING', 'EDITING', 'READY_TO_PUBLISH', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."script_type" AS ENUM('TUTORIAL', 'REVIEW', 'VLOG', 'EDUCATIONAL', 'ENTERTAINMENT', 'OTHER');--> statement-breakpoint
CREATE TABLE "scripts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"status" "script_status" DEFAULT 'DRAFT' NOT NULL,
	"script_type" "script_type",
	"video_title" text,
	"description" text,
	"tags" text,
	"estimated_duration" integer,
	"target_publish_date" timestamp with time zone,
	"video_url" text,
	"thumbnail_notes" text,
	"word_count" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "scripts_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"last_activity_date" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
