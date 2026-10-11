import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Procesos separados: cada archivo de test tiene su propio módulo
    // better-sqlite3 y su propia base temporal (aislamiento total).
    pool: "forks",
  },
});
