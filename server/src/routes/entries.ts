import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import db from "../db.js";
import { entrySchema, entryUpdateSchema } from "../schema.js";

export async function entryRoutes(app: FastifyInstance) {
  app.get("/api/health", async () => {
    return { status: "ok" };
  });

  app.get("/api/entries", async (request) => {
    const { exercise_id, theme_id, status, limit, offset } = request.query as {
      exercise_id?: string;
      theme_id?: string;
      status?: string;
      limit?: string;
      offset?: string;
    };

    const limitNum = Math.min(parseInt(limit ?? "20", 10), 100);
    const offsetNum = parseInt(offset ?? "0", 10);

    let query = "SELECT * FROM entries WHERE 1=1";
    const params: any[] = [];

    if (exercise_id) {
      query += " AND exercise_id = ?";
      params.push(exercise_id);
    }
    if (theme_id) {
      query += " AND theme_id = ?";
      params.push(theme_id);
    }
    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limitNum, offsetNum);

    const entries = db.prepare(query).all(...params);
    return entries.map(parseEntry);
  });

  app.post("/api/entries", async (request, reply) => {
    const parsed = entrySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: {
          message: "Validation failed",
          details: parsed.error.flatten(),
        },
      });
    }

    const id = randomUUID();
    const {
      exercise_id,
      answers,
      status,
      exercise_version,
      theme_id,
      source_entry_id,
      measure_before,
      measure_after,
    } = parsed.data;

    db.prepare(
      `INSERT INTO entries (id, exercise_id, answers, status, exercise_version, theme_id, source_entry_id, measure_before, measure_after)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      exercise_id,
      JSON.stringify(answers),
      status,
      exercise_version,
      theme_id,
      source_entry_id,
      measure_before,
      measure_after
    );

    const entry = db.prepare("SELECT * FROM entries WHERE id = ?").get(id);
    return reply.status(201).send(parseEntry(entry));
  });

  app.get("/api/entries/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const entry = db.prepare("SELECT * FROM entries WHERE id = ?").get(id);

    if (!entry) {
      return reply.status(404).send({
        error: { message: "Entry not found" },
      });
    }

    return parseEntry(entry);
  });

  app.put("/api/entries/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsed = entryUpdateSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        error: {
          message: "Validation failed",
          details: parsed.error.flatten(),
        },
      });
    }

    const existing = db.prepare("SELECT * FROM entries WHERE id = ?").get(id);
    if (!existing) {
      return reply.status(404).send({
        error: { message: "Entry not found" },
      });
    }

    const {
      exercise_id,
      answers,
      status,
      exercise_version,
      theme_id,
      source_entry_id,
      measure_before,
      measure_after,
    } = parsed.data;

    db.prepare(
      `UPDATE entries SET
        exercise_id = COALESCE(?, exercise_id),
        answers = COALESCE(?, answers),
        status = COALESCE(?, status),
        exercise_version = COALESCE(?, exercise_version),
        theme_id = COALESCE(?, theme_id),
        source_entry_id = COALESCE(?, source_entry_id),
        measure_before = COALESCE(?, measure_before),
        measure_after = COALESCE(?, measure_after),
        updated_at = datetime('now'),
        completed_at = CASE WHEN ? = 'completed' THEN datetime('now') ELSE completed_at END
      WHERE id = ?`
    ).run(
      exercise_id ?? null,
      answers ? JSON.stringify(answers) : null,
      status ?? null,
      exercise_version ?? null,
      theme_id ?? null,
      source_entry_id ?? null,
      measure_before ?? null,
      measure_after ?? null,
      status ?? null,
      id
    );

    const entry = db.prepare("SELECT * FROM entries WHERE id = ?").get(id);
    return parseEntry(entry);
  });

  app.delete("/api/entries/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = db.prepare("SELECT * FROM entries WHERE id = ?").get(id);

    if (!existing) {
      return reply.status(404).send({
        error: { message: "Entry not found" },
      });
    }

    db.prepare("DELETE FROM entries WHERE id = ?").run(id);
    return reply.status(204).send();
  });
}

function parseEntry(entry: any) {
  return {
    ...entry,
    answers: JSON.parse(entry.answers),
  };
}
