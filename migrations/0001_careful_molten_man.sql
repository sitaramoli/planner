ALTER TABLE "scripts" DROP CONSTRAINT "scripts_id_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_id_unique";--> statement-breakpoint
ALTER TABLE "scripts" ADD CONSTRAINT "scripts_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "scripts_user_id_idx" ON "scripts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "scripts_status_idx" ON "scripts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "scripts_created_at_idx" ON "scripts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "scripts_user_status_idx" ON "scripts" USING btree ("user_id","status");