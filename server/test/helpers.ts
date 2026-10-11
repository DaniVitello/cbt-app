import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import type { FastifyInstance } from "fastify";

/**
 * Base temporal por archivo de test. Los tests NUNCA tocan server/data/cbt.db:
 * cada archivo crea su propio archivo en el temp del SO y lo borra al cerrar.
 *
 * Regla: ningún test importa ../src/* de forma estática (el singleton db se
 * crearía al importar). Primero se setea CBT_DB_PATH, después import dinámico.
 */
export function makeTempDbPath(): { path: string; cleanup: () => void } {
  const dir = mkdtempSync(join(tmpdir(), "cbt-test-"));
  return {
    path: join(dir, "test.db"),
    cleanup: () => {
      // Windows puede retener el lock del archivo unos ms después de close()
      // (SO/antivirus), sobre todo tras mucho churn de DDL. Reintentos con
      // backoff: si tras 10 intentos sigue bloqueado, es un leak real y debe fallar.
      let lastError: unknown;
      for (let i = 0; i < 10; i++) {
        try {
          rmSync(dir, { recursive: true, force: true });
          return;
        } catch (e) {
          lastError = e;
          Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 50);
        }
      }
      throw lastError;
    },
  };
}

export async function buildTestApp(dbPath: string): Promise<{
  app: FastifyInstance;
  close: () => Promise<void>;
}> {
  process.env.CBT_DB_PATH = dbPath;
  const { buildApp } = await import("../src/app.js");
  const { getDatabase } = await import("../src/db.js");
  const app = await buildApp();
  return {
    app,
    // SQLite mantiene lock sobre el archivo: sin cerrar la conexión,
    // Windows no deja borrar la base temporal (EBUSY).
    close: async () => {
      await app.close();
      getDatabase().close();
    },
  };
}
