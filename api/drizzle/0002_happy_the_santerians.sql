CREATE TABLE "sib_campus_accounts" (
	"email" varchar(100) PRIMARY KEY NOT NULL,
	"department" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "event_time_end" time;--> statement-breakpoint
ALTER TABLE "joined_events" ADD COLUMN "is_archived" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "joined_events" ADD COLUMN "event_time_end" varchar;