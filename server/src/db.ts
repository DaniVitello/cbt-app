import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Ruta de la base. Los tests la redirigen con CBT_DB_PATH a un archivo temporal. */
export function resolveDbPath(): string {
  if (process.env.CBT_DB_PATH) return process.env.CBT_DB_PATH;
  const dataDir = join(__dirname, "..", "data");
  mkdirSync(dataDir, { recursive: true });
  return join(dataDir, "cbt.db");
}

// Idempotent migrations: check if column exists before adding
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

/** Crea (o abre) la base y aplica esquema + migraciones. Pura respecto de la ruta: testeable con un archivo temporal. */
export function createDatabase(dbPath: string): Database.Database {
  const db = new Database(dbPath);

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

  addColumnIfMissing(db, "entries", "exercise_version", "INTEGER NOT NULL DEFAULT 1");
  addColumnIfMissing(db, "entries", "theme_id", "TEXT");
  addColumnIfMissing(db, "entries", "source_entry_id", "TEXT");
  addColumnIfMissing(db, "entries", "measure_before", "REAL");
  addColumnIfMissing(db, "entries", "measure_after", "REAL");
  addColumnIfMissing(db, "entries", "completed_at", "TEXT");

  return db;
}

const db = createDatabase(resolveDbPath());

/** Singleton de producción. Los tests lo cierran vía closeTestApp tras app.close(). */
export function getDatabase(): Database.Database {
  return db;
}

export default db;
