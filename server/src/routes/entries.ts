import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import db from "../db.js";
import { entrySchema, entryUpdateSchema, entriesQuerySchema } from "../schema.js";

export async function entryRoutes(app: FastifyInstance) {
  app.get("/api/health", async () => {
    return { status: "ok" };
  });

  app.get("/api/entries", async (request, reply) => {
    const parsed = entriesQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({
        error: {
          message: "Validation failed",
          details: parsed.error.flatten(),
        },
      });
    }
    const { exercise_id, theme_id, status, limit, offset } = parsed.data;

    let query = "SELECT * FROM entries WHERE 1=1";
    const params: unknown[] = [];

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
    params.push(limit, offset);

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
      `INSERT INTO entries (id, exercise_id, answers, status, exercise_version, theme_id, source_entry_id, measure_before, measure_after, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? = 'completed' THEN datetime('now') ELSE NULL END)`
    ).run(
      id,
      exercise_id,
      JSON.stringify(answers),
      status,
      exercise_version,
      theme_id,
      source_entry_id,
      measure_before,
      measure_after,
      status
    );

    const entry = db.prepare("SELECT * FROM entries WHERE id = ?").get(id);
    return reply.status(201).send(parseEntry(entry));
  });

  app.get("/api/entries/export", async () => {
    // Backup total en el formato versionado que el futuro import entiende:
    // { schemaVersion, exportedAt, themes, entries }. Ruta estática: Fastify
    // la prioriza sobre /api/entries/:id aunque se registre después.
    const entries = db.prepare("SELECT * FROM entries ORDER BY created_at DESC").all();
    const themes = db.prepare("SELECT * FROM themes ORDER BY created_at DESC").all();
    return {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      themes,
      entries: entries.map(parseEntry),
    };
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

/** Fila cruda de la tabla entries (answers viaja como TEXT JSON). */
interface EntryRow {
  id: string;
  exercise_id: string;
  answers: string;
  status: string;
  exercise_version: number;
  theme_id: string | null;
  source_entry_id: string | null;
  measure_before: number | null;
  measure_after: number | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

function parseEntry(entry: unknown) {
  // Borde DB→API: la fila la escribimos nosotros con este esquema; el cast
  // vive solo acá en vez de un `any` desparramado.
  const row = entry as EntryRow;
  return {
    ...row,
    answers: JSON.parse(row.answers) as Record<string, unknown>,
  };
}
