import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import db from "../db.js";
import { entrySchema, entryUpdateSchema } from "../schema.js";

export async function entryRoutes(app: FastifyInstance) {
  app.get("/api/health", async () => {
    return { status: "ok" };
  });

  app.get("/api/entries", async (request) => {
    const { exercise_id } = request.query as { exercise_id?: string };

    let entries;
    if (exercise_id) {
      entries = db
        .prepare("SELECT * FROM entries WHERE exercise_id = ? ORDER BY created_at DESC")
        .all(exercise_id);
    } else {
      entries = db.prepare("SELECT * FROM entries ORDER BY created_at DESC").all();
    }

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
    const { exercise_id, answers, status } = parsed.data;

    db.prepare(
      "INSERT INTO entries (id, exercise_id, answers, status) VALUES (?, ?, ?, ?)"
    ).run(id, exercise_id, JSON.stringify(answers), status);

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

    const { exercise_id, answers, status } = parsed.data;

    db.prepare(
      `UPDATE entries SET
        exercise_id = COALESCE(?, exercise_id),
        answers = COALESCE(?, answers),
        status = COALESCE(?, status),
        updated_at = datetime('now')
      WHERE id = ?`
    ).run(
      exercise_id ?? null,
      answers ? JSON.stringify(answers) : null,
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
