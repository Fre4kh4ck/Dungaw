CREATE TABLE "user_activity" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_signin_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;