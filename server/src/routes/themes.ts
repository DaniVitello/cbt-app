import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import db from "../db.js";
import { themeSchema, themeUpdateSchema } from "../schema.js";

export async function themeRoutes(app: FastifyInstance) {
  app.get("/api/themes", async () => {
    const themes = db
      .prepare("SELECT * FROM themes ORDER BY created_at DESC")
      .all();
    return themes;
  });

  app.post("/api/themes", async (request, reply) => {
    const parsed = themeSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: {
          message: "Validation failed",
          details: parsed.error.flatten(),
        },
      });
    }

    const id = randomUUID();
    const { title, description, status } = parsed.data;

    db.prepare(
      "INSERT INTO themes (id, title, description, status) VALUES (?, ?, ?, ?)"
    ).run(id, title, description ?? null, status);

    const theme = db.prepare("SELECT * FROM themes WHERE id = ?").get(id);
    return reply.status(201).send(theme);
  });

  app.get("/api/themes/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const theme = db.prepare("SELECT * FROM themes WHERE id = ?").get(id);

    if (!theme) {
      return reply.status(404).send({
        error: { message: "Theme not found" },
      });
    }

    return theme;
  });

  app.put("/api/themes/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsed = themeUpdateSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        error: {
          message: "Validation failed",
          details: parsed.error.flatten(),
        },
      });
    }

    const existing = db.prepare("SELECT * FROM themes WHERE id = ?").get(id);
    if (!existing) {
      return reply.status(404).send({
        error: { message: "Theme not found" },
      });
    }

    const { title, description, status } = parsed.data;

    db.prepare(
      `UPDATE themes SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        updated_at = datetime('now')
      WHERE id = ?`
    ).run(title ?? null, description ?? null, status ?? null, id);

    const theme = db.prepare("SELECT * FROM themes WHERE id = ?").get(id);
    return theme;
  });

  app.delete("/api/themes/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = db.prepare("SELECT * FROM themes WHERE id = ?").get(id);

    if (!existing) {
      return reply.status(404).send({
        error: { message: "Theme not found" },
      });
    }

    db.prepare("DELETE FROM themes WHERE id = ?").run(id);
    return reply.status(204).send();
  });

  app.get("/api/themes/:id/entries", async (request, reply) => {
    const { id } = request.params as { id: string };
    const entries = db
      .prepare("SELECT * FROM entries WHERE theme_id = ? ORDER BY created_at DESC")
      .all(id);

    return entries.map(parseEntry);
  });
}

function parseEntry(entry: any) {
  return {
    ...entry,
    answers: JSON.parse(entry.answers),
  };
}
