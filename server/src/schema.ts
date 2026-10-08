import { z } from "zod";

export const entrySchema = z.object({
  exercise_id: z.string().min(1),
  answers: z.record(z.unknown()),
  status: z.enum(["draft", "completed"]).default("draft"),
  exercise_version: z.number().int().positive().default(1),
  theme_id: z.string().nullable().default(null),
  source_entry_id: z.string().nullable().default(null),
  measure_before: z.number().min(0).max(100).nullable().default(null),
  measure_after: z.number().min(0).max(100).nullable().default(null),
});

export const entryUpdateSchema = entrySchema.partial();

export const themeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["open", "in_progress", "done", "archived"]).default("open"),
});

export const themeUpdateSchema = themeSchema.partial();

export type Entry = z.infer<typeof entrySchema> & {
  id: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
};

export type Theme = z.infer<typeof themeSchema> & {
  id: string;
  created_at: string;
  updated_at: string;
};
