import { defineConfig } from "@playwright/test";
import { rmSync, mkdirSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const E2E_DIR = join(tmpdir(), "cbt-e2e");
const E2E_DB = join(E2E_DIR, "e2e.db");

// Estado inicial conocido: la DB temporal del E2E arranca vacía en cada run,
// ANTES de que el backend la abra (el modelo single-entry lo exige).
// Ojo: este módulo se evalúa en el runner Y en cada worker. Si el archivo
// está bloqueado, es porque el backend de ESTE run ya lo abrió (o es un
// zombie, que el chequeo de puertos con reuseExistingServer:false rechaza
// en voz alta) → no borrar, seguir.
try {
  rmSync(E2E_DIR, { recursive: true, force: true });
} catch {
  // EBUSY: otro proceso la tiene abierta; no es basura nuestra.
}
mkdirSync(E2E_DIR, { recursive: true });

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
