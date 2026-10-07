import { z } from "zod";

export const entrySchema = z.object({
  exercise_id: z.string().min(1),
  answers: z.record(z.unknown()),
  status: z.enum(["draft", "completed"]).default("draft"),
});

export const entryUpdateSchema = entrySchema.partial();

export type Entry = z.infer<typeof entrySchema> & {
  id: string;
  created_at: string;
  updated_at: string;
};
