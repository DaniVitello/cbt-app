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

describe("themes", () => {
  it("POST crea un tema (201) con estado open por defecto", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/themes",
      payload: { title: "Mi tema", description: "desc" },
    });
    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.id).toEqual(expect.any(String));
    expect(body.title).toBe("Mi tema");
    expect(body.status).toBe("open");
  });

  it("POST sin título da 400", async () => {
    const res = await app.inject({ method: "POST", url: "/api/themes", payload: {} });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.message).toBe("Validation failed");
  });

  it("GET lista y por id; id inexistente da 404", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/api/themes",
      payload: { title: "Tema lista" },
    });
    const id = created.json().id;

    const list = await app.inject({ method: "GET", url: "/api/themes" });
    expect(list.statusCode).toBe(200);
    expect(list.json().some((t: { id: string }) => t.id === id)).toBe(true);

    const found = await app.inject({ method: "GET", url: `/api/themes/${id}` });
    expect(found.statusCode).toBe(200);

    const missing = await app.inject({ method: "GET", url: "/api/themes/no-existe" });
    expect(missing.statusCode).toBe(404);
    expect(missing.json().error.message).toBe("Theme not found");
  });

  it("PUT actualiza parcial; id inexistente da 404", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/api/themes",
      payload: { title: "Tema put" },
    });
    const id = created.json().id;

    const updated = await app.inject({
      method: "PUT",
      url: `/api/themes/${id}`,
      payload: { status: "in_progress" },
    });
    expect(updated.statusCode).toBe(200);
    expect(updated.json().status).toBe("in_progress");
    expect(updated.json().title).toBe("Tema put");

    const missing = await app.inject({
      method: "PUT",
      url: "/api/themes/no-existe",
      payload: { status: "done" },
    });
    expect(missing.statusCode).toBe(404);
  });

  it("GET /api/themes/:id/entries devuelve las entries del tema con answers parseadas", async () => {
    const theme = await app.inject({
      method: "POST",
      url: "/api/themes",
      payload: { title: "Tema timeline" },
    });
    const themeId = theme.json().id;

    await app.inject({
      method: "POST",
      url: "/api/entries",
      payload: { exercise_id: "pmr", answers: { paso: "respirar" }, theme_id: themeId },
    });
    await app.inject({
      method: "POST",
      url: "/api/entries",
      payload: { exercise_id: "pmr", answers: {} },
    });

    const res = await app.inject({ method: "GET", url: `/api/themes/${themeId}/entries` });
    expect(res.statusCode).toBe(200);
    const entries = res.json();
    expect(entries).toHaveLength(1);
    expect(entries[0].theme_id).toBe(themeId);
    expect(entries[0].answers).toEqual({ paso: "respirar" });
  });

  it("DELETE de un tema con entries deja las entries con theme_id en null (ON DELETE SET NULL)", async () => {
    const theme = await app.inject({
      method: "POST",
      url: "/api/themes",
      payload: { title: "Tema con entries" },
    });
    const themeId = theme.json().id;

    const entry = await app.inject({
      method: "POST",
      url: "/api/entries",
      payload: { exercise_id: "pmr", answers: { paso: 1 }, theme_id: themeId },
    });
    const entryId = entry.json().id;

    const deleted = await app.inject({ method: "DELETE", url: `/api/themes/${themeId}` });
    expect(deleted.statusCode).toBe(204);

    const survivor = await app.inject({ method: "GET", url: `/api/entries/${entryId}` });
    expect(survivor.statusCode).toBe(200);
    expect(survivor.json().theme_id).toBeNull();
    expect(survivor.json().answers).toEqual({ paso: 1 });
  });

  it("DELETE borra (204) y después es 404", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/api/themes",
      payload: { title: "Tema delete" },
    });
    const id = created.json().id;

    const deleted = await app.inject({ method: "DELETE", url: `/api/themes/${id}` });
    expect(deleted.statusCode).toBe(204);

    const gone = await app.inject({ method: "GET", url: `/api/themes/${id}` });
    expect(gone.statusCode).toBe(404);

    const missing = await app.inject({ method: "DELETE", url: "/api/themes/no-existe" });
    expect(missing.statusCode).toBe(404);
  });
});
