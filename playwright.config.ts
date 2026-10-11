import { defineConfig } from "@playwright/test";
import { rmSync, mkdirSync, readdirSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join, basename } from "path";

const E2E_DIR = join(tmpdir(), "cbt-e2e");
// DB única por run: dos runs nunca comparten archivo, y un backend zombie
// no puede contaminar en silencio al siguiente.
const RUN_ID = `${Date.now().toString(36)}-${process.pid.toString(36)}`;
const E2E_DB = join(E2E_DIR, `e2e-${RUN_ID}.db`);

function isStaleDbFile(name: string): boolean {
  return name === "e2e.db" || name.startsWith("e2e.db-") || name.startsWith("e2e-");
}

// Limpieza de runs muertos. OJO: este módulo se evalúa en el runner Y en
// cada worker. REGLA: solo el .db principal decide (con backoff). Si se
// puede borrar, el set está muerto y se llevan sus sidecars; si está
// bloqueado, NO SE TOCA NADA del set (ni -wal ni -shm: borrarle los
// sidecars a un backend vivo deja sus lecturas vacías). Si hay un backend
// zombie vivo, el chequeo de puertos (reuseExistingServer: false) falla
// en voz alta.
function rmWithBackoff(target: string): boolean {
  for (let i = 0; i < 10; i++) {
    try {
      rmSync(target, { recursive: true, force: true });
      return true;
    } catch {
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 50);
    }
  }
  return false;
}

function mainOf(sidecar: string): string {
  return sidecar.replace(/-(wal|shm|journal)$/, "");
}

mkdirSync(E2E_DIR, { recursive: true });
for (const f of readdirSync(E2E_DIR)) {
  if (f === basename(E2E_DB) || !isStaleDbFile(f)) continue;
  if (f.endsWith(".db")) {
    if (rmWithBackoff(join(E2E_DIR, f))) {
      rmSync(join(E2E_DIR, f + "-wal"), { force: true });
      rmSync(join(E2E_DIR, f + "-shm"), { force: true });
      rmSync(join(E2E_DIR, f + "-journal"), { force: true });
    }
  } else if (!existsSync(join(E2E_DIR, mainOf(f)))) {
    // Sidecar huérfano (su .db ya no existe): nadie lo puede tener abierto.
    rmSync(join(E2E_DIR, f), { force: true });
  }
}

export default defineConfig({
  testDir: "./e2e",
  // Servidor de dev (Turbopack) + autoguardados: generoso a propósito.
  timeout: 180_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3100",
    locale: "es-ES",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "npm run dev:server",
      port: 3001,
      // Si tu dev:all está abierto, fallar en voz alta en vez de correr
      // contra tu DB real (contaminación silenciosa).
      reuseExistingServer: false,
      env: { CBT_DB_PATH: E2E_DB },
    },
    {
      command: "npm run dev",
      port: 3100,
      reuseExistingServer: false,
      env: { PORT: "3100" },
    },
  ],
});
