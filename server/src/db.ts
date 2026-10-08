import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");
mkdirSync(dataDir, { recursive: true });
const dbPath = join(dataDir, "cbt.db");

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

  ALTER TABLE entries ADD COLUMN exercise_version INTEGER NOT NULL DEFAULT 1;
  ALTER TABLE entries ADD COLUMN theme_id TEXT;
  ALTER TABLE entries ADD COLUMN source_entry_id TEXT;
  ALTER TABLE entries ADD COLUMN measure_before REAL;
  ALTER TABLE entries ADD COLUMN measure_after REAL;
  ALTER TABLE entries ADD COLUMN completed_at TEXT;
`);

export default db;
