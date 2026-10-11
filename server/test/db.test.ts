import { describe, it, expect } from "vitest";
import type { Database } from "better-sqlite3";
import { makeTempDbPath } from "./helpers.js";

const { createDatabase } = await import("../src/db.js");

function columnNames(db: Database.Database, table: string): string[] {
  const cols = db.pragma(`table_info(${table})`) as Array<{ name: string }>;
  return cols.map((c) => c.name);
}

describe("migraciones", () => {
  it("crea el esquema completo desde cero", () => {
    const { path, cleanup } = makeTempDbPath();
    try {
      const db = createDatabase(path);

      const tables = (
        db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all() as Array<{
          name: string;
        }>
      ).map((t) => t.name);
      expect(tables).toContain("entries");
      expect(tables).toContain("themes");

      expect(columnNames(db, "entries")).toEqual(
        expect.arrayContaining([
          "id",
          "exercise_id",
          "answers",
          "status",
          "created_at",
          "updated_at",
          "exercise_version",
          "theme_id",
          "source_entry_id",
          "measure_before",
          "measure_after",
          "completed_at",
        ]),
      );
      expect(columnNames(db, "themes")).toEqual(
        expect.arrayContaining(["id", "title", "description", "status", "created_at", "updated_at"]),
      );
      db.close();
    } finally {
      cleanup();
    }
  });

  it("es idempotente: abrir dos veces no falla ni duplica columnas", () => {
    const { path, cleanup } = makeTempDbPath();
    try {
      const first = createDatabase(path);
      first.close();
      const second = createDatabase(path);

      const cols = columnNames(second, "entries");
      expect(cols.filter((c) => c === "exercise_version")).toHaveLength(1);
      second.close();
    } finally {
      cleanup();
    }
  });

  it("una base con el esquema viejo gana las columnas nuevas", () => {
    const { path, cleanup } = makeTempDbPath();
    try {
      // Simula una base creada antes de las migraciones (solo columnas originales).
      const legacy = createDatabase(path);
      legacy.exec("ALTER TABLE entries DROP COLUMN exercise_version;");
      legacy.exec("ALTER TABLE entries DROP COLUMN theme_id;");
      legacy.exec("ALTER TABLE entries DROP COLUMN source_entry_id;");
      legacy.exec("ALTER TABLE entries DROP COLUMN measure_before;");
      legacy.exec("ALTER TABLE entries DROP COLUMN measure_after;");
      legacy.exec("ALTER TABLE entries DROP COLUMN completed_at;");
      expect(columnNames(legacy, "entries")).not.toContain("theme_id");
      legacy.close();

      const migrated = createDatabase(path);
      expect(columnNames(migrated, "entries")).toEqual(
        expect.arrayContaining([
          "exercise_version",
          "theme_id",
          "source_entry_id",
          "measure_before",
          "measure_after",
          "completed_at",
        ]),
      );
      migrated.close();
    } finally {
      cleanup();
    }
  });
});
