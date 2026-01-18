import {
  pgEnum,
  pgTable,
  text,
  varchar,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const TASK_STATUS_ENUM = pgEnum("task_status", [
  "NEW",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  lastActivityDate: timestamp("last_activity_date", { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: TASK_STATUS_ENUM("status").notNull().default("NEW"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export const taskStatus = TASK_STATUS_ENUM.enumValues;
export type TaskStatus = (typeof taskStatus)[number];
