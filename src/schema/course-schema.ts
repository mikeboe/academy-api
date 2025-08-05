import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./auth-schema";
import z from "zod";

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }),
  level: uuid("level").references(() => levels.id, { onDelete: "set null" }),
  category: uuid("category").references(() => categories.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  authorId: uuid("author_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  thumbnail: text("thumbnail"),
  instructor: uuid("instructor").references(() => users.id, {
    onDelete: "set null",
  }),
});

export const levels = pgTable("levels", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
});

export const chapters = pgTable("chapters", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  authorId: uuid("author_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  thumbnail: text("thumbnail"),
  content: text("content").notNull(),
  duration: integer("duration").notNull(),
});

export const createCourseSchema = z.object({
  title: z.string().min(2).max(255),
  description: z.string().max(1000).optional(),
  level: z.string().uuid().optional(),
  category: z.string().uuid().optional(),
  published: z.boolean().default(false),
  authorId: z.string().uuid(),
  thumbnail: z.string().url().optional(),
  instructor: z.string().uuid().optional(),
});

export const updateCourseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2).max(255).optional(),
  description: z.string().max(1000).optional(),
  level: z.string().uuid().optional(),
  category: z.string().uuid().optional(),
  published: z.boolean().optional(),
  thumbnail: z.string().url().optional(),
  instructor: z.string().uuid().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
});

export const updateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const createLevelSchema = z.object({
  name: z.string().min(2).max(100),
});

export const updateLevelSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100).optional(),
});

export const createChapterSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(2).max(255),
  description: z.string().max(1000).optional(),
  position: z.number().int().min(0),
  published: z.boolean().default(false),
  authorId: z.string().uuid(),
  thumbnail: z.string().url().optional(),
  content: z.string().min(1),
  duration: z.number().int().min(1),
});

export const updateChapterSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string().uuid(),
  title: z.string().min(2).max(255).optional(),
  description: z.string().max(1000).optional(),
  position: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
  thumbnail: z.string().url().optional(),
  content: z.string().min(1).optional(),
  duration: z.number().int().min(1).optional(),
});

export const courseSearchSchema = z.object({
  query: z.string().min(1).max(255).optional(),
  category: z.string().uuid().optional(),
  level: z.string().uuid().optional(),
  authorId: z.string().uuid().optional(),
  published: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;
      return val === "true" || val === "1";
    }),
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1)),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(100)),
});
