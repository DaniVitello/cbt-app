import { describe, it, expect, afterAll } from "vitest";
import type { Database } from "better-sqlite3";
import { makeTempDbPath } from "./helpers.js";

// El singleton se crea como efecto del import: fijar CBT_DB_PATH ANTES
// (a un archivo temporal) para no tocar jamás la base real de desarrollo.
const setupTmp = makeTempDbPath();
process.env.CBT_DB_PATH = setupTmp.path;
const { createDatabase, LATEST_VERSION, getDatabase } = await import("../src/db.js");

afterAll(() => {
  getDatabase().close();
  setupTmp.cleanup();
});

function columnNames(db: Database.Database, table: string): string[] {
  const cols = db.pragma(`table_info(${table})`) as Array<{ name: string }>;
  return cols.map((c) => c.name);
}

function userVersion(db: Database.Database): number {
  return db.pragma("user_version", { simple: true }) as number;
}

describe("migraciones", () => {
  it("crea el esquema completo desde cero y sella la versión", () => {
    const { path, cleanup } = makeTempDbPath();
    let db: Database.Database | null = null;
    try {
      db = createDatabase(path);

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
      expect(userVersion(db)).toBe(LATEST_VERSION);
      expect(LATEST_VERSION).toBe(3);
    } finally {
      db?.close();
      cleanup();
    }
  });

  it("es idempotente: abrir dos veces no falla ni duplica columnas ni avanza la versión", () => {
    const { path, cleanup } = makeTempDbPath();
    let first: Database.Database | null = null;
    let second: Database.Database | null = null;
    try {
      first = createDatabase(path);
      first.close();
      first = null;
      second = createDatabase(path);

      const cols = columnNames(second, "entries");
      expect(cols.filter((c) => c === "exercise_version")).toHaveLength(1);
      expect(userVersion(second)).toBe(LATEST_VERSION);
    } finally {
      first?.close();
      second?.close();
      cleanup();
    }
  });

  it("una base con el esquema original (v0) migra a la versión actual", async () => {
    const { path, cleanup } = makeTempDbPath();
    let legacy: Database.Database | null = null;
    let migrated: Database.Database | null = null;
    try {
      // Legacy real: tablas originales, sin columnas nuevas y sin versión
      // sellada (el código anterior a las migraciones no usaba user_version).
      const { default: SQLite } = await import("better-sqlite3");
      legacy = new SQLite(path);
      legacy.exec(`
        CREATE TABLE entries (
          id TEXT PRIMARY KEY, exercise_id TEXT NOT NULL,
          answers TEXT NOT NULL DEFAULT '{}',
          status TEXT NOT NULL DEFAULT 'draft',
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE TABLE themes (
          id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT,
          status TEXT NOT NULL DEFAULT 'open',
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
      `);
      expect(columnNames(legacy, "entries")).not.toContain("theme_id");
      expect(userVersion(legacy)).toBe(0);
      legacy.close();
      legacy = null;

      migrated = createDatabase(path);
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
      expect(userVersion(migrated)).toBe(LATEST_VERSION);
      migrated.close();
      migrated = null;
    } finally {
      legacy?.close();
      migrated?.close();
      cleanup();
    }
  });

  it("una base vieja con referencias colgantes las anula al migrar (sin perder filas)", async () => {
    const { path, cleanup } = makeTempDbPath();
    let raw: Database.Database | null = null;
    let migrated: Database.Database | null = null;
    try {
      // Base "del código viejo": tablas + columnas nuevas pero versión 0
      // (el código anterior no sellaba user_version) y refs a filas inexistentes.
      const { default: SQLite } = await import("better-sqlite3");
      raw = new SQLite(path);
      raw.exec(`
        CREATE TABLE entries (
          id TEXT PRIMARY KEY, exercise_id TEXT NOT NULL,
          answers TEXT NOT NULL DEFAULT '{}',
          status TEXT NOT NULL DEFAULT 'draft',
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
        CREATE TABLE themes (
          id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT,
          status TEXT NOT NULL DEFAULT 'open',
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
        ALTER TABLE entries ADD COLUMN exercise_version INTEGER NOT NULL DEFAULT 1;
        ALTER TABLE entries ADD COLUMN theme_id TEXT;
        ALTER TABLE entries ADD COLUMN source_entry_id TEXT;
        ALTER TABLE entries ADD COLUMN measure_before REAL;
        ALTER TABLE entries ADD COLUMN measure_after REAL;
        ALTER TABLE entries ADD COLUMN completed_at TEXT;
      `);
      raw
        .prepare(
          "INSERT INTO entries (id, exercise_id, answers, theme_id, source_entry_id) VALUES (?,?,?,?,?)",
        )
        .run("e1", "pmr", "{}", "ghost-theme", "ghost-entry");
      raw.close();
      raw = null;

      migrated = createDatabase(path);
      const row = migrated.prepare("SELECT theme_id, source_entry_id FROM entries WHERE id = ?").get("e1") as {
        theme_id: string | null;
        source_entry_id: string | null;
      };
      expect(row.theme_id).toBeNull();
      expect(row.source_entry_id).toBeNull();
      // La fila sobrevivió: solo se anuló el vínculo, no el dato.
      expect(migrated.prepare("SELECT COUNT(*) AS n FROM entries").get()).toMatchObject({ n: 1 });
      expect(userVersion(migrated)).toBe(LATEST_VERSION);
    } finally {
      raw?.close();
      migrated?.close();
      cleanup();
    }
  });

  it("las FK frenan referencias inexistentes (themes y auto-referencia)", () => {
    const { path, cleanup } = makeTempDbPath();
    let db: Database.Database | null = null;
    try {
      db = createDatabase(path);
      expect(() =>
        db?.prepare("INSERT INTO entries (id, exercise_id, answers, theme_id) VALUES (?,?,?,?)").run("x", "pmr", "{}", "ghost"),
      ).toThrow(/FOREIGN KEY/i);
      expect(() =>
        db?.prepare("INSERT INTO entries (id, exercise_id, answers, source_entry_id) VALUES (?,?,?,?)").run("y", "pmr", "{}", "ghost"),
      ).toThrow(/FOREIGN KEY/i);

      // Nulos y referencias reales sí pasan (incluida la auto-referencia tras el RENAME).
      db.prepare("INSERT INTO themes (id, title) VALUES (?,?)").run("t1", "T");
      db.prepare("INSERT INTO entries (id, exercise_id, answers, theme_id) VALUES (?,?,?,?)").run("a", "pmr", "{}", "t1");
      db.prepare("INSERT INTO entries (id, exercise_id, answers, source_entry_id) VALUES (?,?,?,?)").run("b", "pmr", "{}", "a");
    } finally {
      db?.close();
      cleanup();
    }
  });

  it("borrar referenciado pone NULL en vez de borrar en cascada", () => {
    const { path, cleanup } = makeTempDbPath();
    let db: Database.Database | null = null;
    try {
      db = createDatabase(path);
      db.prepare("INSERT INTO themes (id, title) VALUES (?,?)").run("t1", "T");
      db.prepare("INSERT INTO entries (id, exercise_id, answers, theme_id) VALUES (?,?,?,?)").run("a", "pmr", "{}", "t1");
      db.prepare("INSERT INTO entries (id, exercise_id, answers, source_entry_id) VALUES (?,?,?,?)").run("b", "pmr", "{}", "a");

      db.prepare("DELETE FROM themes WHERE id = ?").run("t1");
      expect(db.prepare("SELECT theme_id FROM entries WHERE id = 'a'").get()).toMatchObject({ theme_id: null });

      db.prepare("DELETE FROM entries WHERE id = 'a'").run();
      expect(db.prepare("SELECT source_entry_id FROM entries WHERE id = 'b'").get()).toMatchObject({
        source_entry_id: null,
      });
      // Las derivadas sobrevivieron a ambos borrados.
      expect(db.prepare("SELECT COUNT(*) AS n FROM entries").get()).toMatchObject({ n: 1 });
    } finally {
      db?.close();
      cleanup();
    }
  });

  it("abre en modo WAL con FKs activas", () => {
    const { path, cleanup } = makeTempDbPath();
    let db: Database.Database | null = null;
    try {
      db = createDatabase(path);
      expect(db.pragma("journal_mode", { simple: true })).toBe("wal");
      expect(db.pragma("foreign_keys", { simple: true })).toBe(1);
    } finally {
      db?.close();
      cleanup();
    }
  });
});
