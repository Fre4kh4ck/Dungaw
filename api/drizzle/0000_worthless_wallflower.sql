CREATE TYPE "public"."event_status" AS ENUM('submitted', 'approved', 'denied');--> statement-breakpoint
CREATE TABLE "accounts" (
	"account_id" serial PRIMARY KEY NOT NULL,
	"account_name" varchar(50),
	"account_username" varchar(50),
	"account_password" varchar(50),
	"account_type" varchar(50),
	"account_creation" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"message_id" serial PRIMARY KEY NOT NULL,
	"chatroom_id" integer NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"message_content" text NOT NULL,
	"sent_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "events" (
	"event_id" serial PRIMARY KEY NOT NULL,
	"event_name" varchar(50) NOT NULL,
	"event_time" time,
	"event_start_date" date NOT NULL,
	"event_end_date" date,
	"event_venue" char(50),
	"event_description" text,
	"event_photo" text,
	"event_dept" varchar(255),
	"event_status" "event_status" DEFAULT 'submitted',
	"event_denial_reason" text,
	"event_qr_code" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "joined_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"event_id" integer NOT NULL,
	"ticket_id" varchar(255),
	"last_read_at" timestamp,
	"joined_at" timestamp DEFAULT now(),
	"attended" boolean DEFAULT false,
	"time_in" timestamp,
	"time_out" timestamp,
	CONSTRAINT "joined_events_ticket_id_unique" UNIQUE("ticket_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"google_id" varchar(50),
	"name" varchar(100),
	"email" varchar(150),
	"picture" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
