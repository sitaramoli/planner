import {
  pgEnum,
  pgTable,
  text,
  varchar,
  timestamp,
  uuid,
  integer,
  index,
  foreignKey,
} from "drizzle-orm/pg-core";

export const SCRIPT_STATUS_ENUM = pgEnum("script_status", [
  "DRAFT",
  "WRITING",
  "REVIEW",
  "READY_TO_FILM",
  "FILMING",
  "EDITING",
  "READY_TO_PUBLISH",
  "PUBLISHED",
  "ARCHIVED",
]);

export const SCRIPT_TYPE_ENUM = pgEnum("script_type", [
  "TUTORIAL",
  "REVIEW",
  "VLOG",
  "EDUCATIONAL",
  "ENTERTAINMENT",
  "OTHER",
]);

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
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

export const scripts = pgTable(
  "scripts",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    status: SCRIPT_STATUS_ENUM("status").notNull().default("DRAFT"),
    scriptType: SCRIPT_TYPE_ENUM("script_type"),
    videoTitle: text("video_title"),
    description: text("description"),
    tags: text("tags"),
    estimatedDuration: integer("estimated_duration"),
    targetPublishDate: timestamp("target_publish_date", { withTimezone: true }),
    videoUrl: text("video_url"),
    thumbnailNotes: text("thumbnail_notes"),
    wordCount: integer("word_count"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // Foreign key with cascade delete for referential integrity
    userReference: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "scripts_user_id_fk",
    }).onDelete("cascade"),
    // Index on userId for efficient user-script queries
    userIdIdx: index("scripts_user_id_idx").on(table.userId),
    // Index on status for filtering scripts by status
    statusIdx: index("scripts_status_idx").on(table.status),
    // Index on createdAt for sorting/pagination
    createdAtIdx: index("scripts_created_at_idx").on(table.createdAt),
    // Composite index for user + status queries (common filter combination)
    userStatusIdx: index("scripts_user_status_idx").on(
      table.userId,
      table.status
    ),
  })
);

export type User = typeof users.$inferSelect;
export type Script = typeof scripts.$inferSelect;
export type NewScript = typeof scripts.$inferInsert;
export const scriptStatus = SCRIPT_STATUS_ENUM.enumValues;
export type ScriptStatus = (typeof scriptStatus)[number];
export const scriptType = SCRIPT_TYPE_ENUM.enumValues;
export type ScriptType = (typeof scriptType)[number];

// Keep Task type alias for backward compatibility during migration
export type Task = Script;
