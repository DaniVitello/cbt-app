import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Los specs de Playwright los corre `npm run test:e2e`, no Vitest
    // (además levantan sus propios servidores y DB temporal).
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
      "e2e/**",
    ],
  },
});
