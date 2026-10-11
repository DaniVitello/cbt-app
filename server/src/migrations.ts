import type Database from "better-sqlite3";

export interface Migration {
  version: number;
  name: string;
  up: (db: Database.Database) => void;
}

function addColumnIfMissing(
  db: Database.Database,
  table: string,
  column: string,
  definition: string,
) {
  const cols = db.pragma(`table_info(${table})`) as Array<{ name: string }>;
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`);
  }
}

const NEW_ENTRY_COLUMNS: Array<[string, string]> = [
  ["exercise_version", "INTEGER NOT NULL DEFAULT 1"],
  ["theme_id", "TEXT"],
  ["source_entry_id", "TEXT"],
  ["measure_before", "REAL"],
  ["measure_after", "REAL"],
  ["completed_at", "TEXT"],
];

const ENTRIES_FULL_COLUMNS = `
  id TEXT PRIMARY KEY,
  exercise_id TEXT NOT NULL,
  answers TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'completed')),
  exercise_version INTEGER NOT NULL DEFAULT 1,
  theme_id TEXT REFERENCES themes(id) ON DELETE SET NULL,
  source_entry_id TEXT REFERENCES entries(id) ON DELETE SET NULL,
  measure_before REAL,
  measure_after REAL,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
`;

export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    name: "init",
    up: (db) => {
      db.exec(`
        CREATE TABLE IF NOT EXISTS entries (
          id TEXT PRIMARY KEY,
          exercise_id TEXT NOT NULL,
          answers TEXT NOT NULL DEFAULT '{}',
          status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'completed')),
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS themes (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'done', 'archived')),
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
      `);
    },
  },
  {
    // SQLite no tiene ADD COLUMN IF NOT EXISTS: por eso esta migración es
    // código (con guarda) y no SQL puro. Idempotente por construcción.
    version: 2,
    name: "entry-chain-columns",
    up: (db) => {
      for (const [column, definition] of NEW_ENTRY_COLUMNS) {
        addColumnIfMissing(db, "entries", column, definition);
      }
    },
  },
  {
    // Las FK no se pueden agregar con ALTER: hay que reconstruir la tabla.
    // Antes se anulan las referencias colgantes (a temas/entries que ya no
    // existen) para que la reconstrucción no viole las FK nuevas.
    version: 3,
    name: "entry-foreign-keys",
    up: (db) => {
      db.exec(`
        UPDATE entries SET theme_id = NULL
          WHERE theme_id IS NOT NULL
            AND theme_id NOT IN (SELECT id FROM themes);
        UPDATE entries SET source_entry_id = NULL
          WHERE source_entry_id IS NOT NULL
            AND source_entry_id NOT IN (SELECT id FROM entries);
        CREATE TABLE entries_new (${ENTRIES_FULL_COLUMNS});
        INSERT INTO entries_new
          (id, exercise_id, answers, status, exercise_version, theme_id,
           source_entry_id, measure_before, measure_after, completed_at,
           created_at, updated_at)
          SELECT id, exercise_id, answers, status, exercise_version, theme_id,
            source_entry_id, measure_before, measure_after, completed_at,
            created_at, updated_at
          FROM entries;
        DROP TABLE entries;
        ALTER TABLE entries_new RENAME TO entries;
      `);
    },
  },
];

export const LATEST_VERSION = MIGRATIONS[MIGRATIONS.length - 1].version;
