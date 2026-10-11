import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { makeTempDbPath, buildTestApp } from "./helpers.js";

let app: FastifyInstance;
let closeApp: () => Promise<void>;
let cleanup: () => void;

beforeAll(async () => {
  const tmp = makeTempDbPath();
  cleanup = tmp.cleanup;
  const built = await buildTestApp(tmp.path);
  app = built.app;
  closeApp = built.close;
});

afterAll(async () => {
  await closeApp();
  cleanup();
});

const baseEntry = {
  exercise_id: "downward-arrow",
  answers: { "about-you-description": "Soy un fracaso" },
};

describe("entries", () => {
  it("GET /api/health responde ok", async () => {
    const res = await app.inject({ method: "GET", url: "/api/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });

  it("POST crea una entry (201) con defaults y respuestas intactas", async () => {
    const res = await app.inject({ method: "POST", url: "/api/entries", payload: baseEntry });
    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.id).toEqual(expect.any(String));
    expect(body.exercise_id).toBe("downward-arrow");
    expect(body.answers).toEqual({ "about-you-description": "Soy un fracaso" });
    expect(body.status).toBe("draft");
    expect(body.exercise_version).toBe(1);
    expect(body.theme_id).toBeNull();
    expect(body.completed_at).toBeNull();
  });

  it("POST rechaza cuerpos inválidos (400) sin crear nada", async () => {
    const missing = await app.inject({ method: "POST", url: "/api/entries", payload: { answers: {} } });
    expect(missing.statusCode).toBe(400);
    expect(missing.json().error.message).toBe("Validation failed");

    const badStatus = await app.inject({
      method: "POST",
      url: "/api/entries",
      payload: { ...baseEntry, status: "nope" },
    });
    expect(badStatus.statusCode).toBe(400);
  });

  it("GET por id devuelve la entry; id inexistente da 404", async () => {
    const created = await app.inject({ method: "POST", url: "/api/entries", payload: baseEntry });
    const id = created.json().id;

    const found = await app.inject({ method: "GET", url: `/api/entries/${id}` });
    expect(found.statusCode).toBe(200);
    expect(found.json().id).toBe(id);

    const missing = await app.inject({ method: "GET", url: "/api/entries/no-existe" });
    expect(missing.statusCode).toBe(404);
    expect(missing.json().error.message).toBe("Entry not found");
  });

  it("GET lista con filtros exercise_id / status y paginación", async () => {
    await app.inject({
      method: "POST",
      url: "/api/entries",
      payload: { exercise_id: "thought-record", answers: {}, status: "completed" },
    });
    await app.inject({
      method: "POST",
      url: "/api/entries",
      payload: { exercise_id: "thought-record", answers: {} },
    });

    const byExercise = await app.inject({
      method: "GET",
      url: "/api/entries?exercise_id=thought-record",
    });
    expect(byExercise.statusCode).toBe(200);
    expect(byExercise.json().length).toBeGreaterThanOrEqual(2);
    expect(byExercise.json().every((e: { exercise_id: string }) => e.exercise_id === "thought-record")).toBe(true);

    const completed = await app.inject({ method: "GET", url: "/api/entries?status=completed" });
    expect(completed.json().every((e: { status: string }) => e.status === "completed")).toBe(true);

    const paged = await app.inject({ method: "GET", url: "/api/entries?limit=1&offset=0" });
    expect(paged.json()).toHaveLength(1);
  });

  it("PUT actualiza parcial y marca completed_at al completar", async () => {
    const created = await app.inject({ method: "POST", url: "/api/entries", payload: baseEntry });
    const id = created.json().id;

    const updated = await app.inject({
      method: "PUT",
      url: `/api/entries/${id}`,
      payload: { answers: { a: 1 }, measure_before: 80, status: "completed" },
    });
    expect(updated.statusCode).toBe(200);
    const body = updated.json();
    expect(body.answers).toEqual({ a: 1 });
    expect(body.measure_before).toBe(80);
    expect(body.status).toBe("completed");
    expect(body.completed_at).toEqual(expect.any(String));

    const badUpdate = await app.inject({
      method: "PUT",
      url: `/api/entries/${id}`,
      payload: { status: "nope" },
    });
    expect(badUpdate.statusCode).toBe(400);

    const missing = await app.inject({
      method: "PUT",
      url: "/api/entries/no-existe",
      payload: { status: "completed" },
    });
    expect(missing.statusCode).toBe(404);
  });

  it("DELETE de una entry origen deja source_entry_id en null en las derivadas", async () => {
    const source = await app.inject({ method: "POST", url: "/api/entries", payload: baseEntry });
    const sourceId = source.json().id;

    const child = await app.inject({
      method: "POST",
      url: "/api/entries",
      payload: { exercise_id: "core-beliefs-suitcases", answers: {}, source_entry_id: sourceId },
    });
    const childId = child.json().id;

    const deleted = await app.inject({ method: "DELETE", url: `/api/entries/${sourceId}` });
    expect(deleted.statusCode).toBe(204);

    const survivor = await app.inject({ method: "GET", url: `/api/entries/${childId}` });
    expect(survivor.statusCode).toBe(200);
    expect(survivor.json().source_entry_id).toBeNull();
  });

  it("GET /api/entries/export devuelve todo (themes + entries con answers parseadas)", async () => {
    const theme = await app.inject({
      method: "POST",
      url: "/api/themes",
      payload: { title: "Tema export" },
    });
    const themeId = theme.json().id;
    await app.inject({
      method: "POST",
      url: "/api/entries",
      payload: { exercise_id: "pmr", answers: { paso: "respirar" }, theme_id: themeId },
    });

    const res = await app.inject({ method: "GET", url: "/api/entries/export" });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.schemaVersion).toBe(1);
    expect(new Date(body.exportedAt).toString()).not.toBe("Invalid Date");
    expect(body.themes.some((t: { id: string }) => t.id === themeId)).toBe(true);
    const exported = body.entries.find(
      (e: { answers: unknown }) => JSON.stringify(e.answers).includes("respirar"),
    );
    expect(exported).toBeDefined();
    // answers viene parseado como objeto, no como string JSON.
    expect(exported.answers).toEqual({ paso: "respirar" });
    expect(exported.theme_id).toBe(themeId);
  });

  it("DELETE borra (204) y después es 404", async () => {
    const created = await app.inject({ method: "POST", url: "/api/entries", payload: baseEntry });
    const id = created.json().id;

    const deleted = await app.inject({ method: "DELETE", url: `/api/entries/${id}` });
    expect(deleted.statusCode).toBe(204);

    const gone = await app.inject({ method: "GET", url: `/api/entries/${id}` });
    expect(gone.statusCode).toBe(404);

    const missing = await app.inject({ method: "DELETE", url: "/api/entries/no-existe" });
    expect(missing.statusCode).toBe(404);
  });
});
