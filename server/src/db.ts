import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";
import { MIGRATIONS, LATEST_VERSION } from "./migrations.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Ruta de la base. Los tests la redirigen con CBT_DB_PATH a un archivo temporal. */
export function resolveDbPath(): string {
  if (process.env.CBT_DB_PATH) return process.env.CBT_DB_PATH;
  const dataDir = join(__dirname, "..", "data");
  mkdirSync(dataDir, { recursive: true });
  return join(dataDir, "cbt.db");
}

function currentVersion(db: Database.Database): number {
  return (db.pragma("user_version", { simple: true }) as number) ?? 0;
}

/**
 * Aplica las migraciones pendientes en una sola transacción (el DDL de
 * SQLite es transaccional: si algo falla a mitad, rollback total y la
 * versión no avanza, así el próximo arranque reintenta limpio).
 */
function applyMigrations(db: Database.Database): void {
  const pending = MIGRATIONS.filter((m) => m.version > currentVersion(db));
  if (pending.length === 0) return;
  const run = db.transaction(() => {
    for (const m of pending) {
      m.up(db);
      db.pragma(`user_version = ${m.version}`);
    }
  });
  run();
}

/** Crea (o abre) la base y la lleva a LATEST_VERSION. Pura respecto de la ruta: testeable con un archivo temporal. */
export function createDatabase(dbPath: string): Database.Database {
  const db = new Database(dbPath);
  // Configuración por conexión (no versionada): WAL para lectura/escritura
  // concurrente, FKs para integridad referencial.
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  applyMigrations(db);
  return db;
}

const db = createDatabase(resolveDbPath());

/** Singleton de producción. Los tests lo cierran vía closeTestApp tras app.close(). */
export function getDatabase(): Database.Database {
  return db;
}

export { LATEST_VERSION };

export default db;
