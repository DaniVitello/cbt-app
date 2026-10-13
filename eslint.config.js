import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

// eslint-config-next v15 no expone configs flat (eso llegó en v16): se usan
// sus configs legacy vía FlatCompat, con scope a src/ para que las reglas
// de React no alcancen al server (Node puro).
const nextScoped = compat
  .extends("next/core-web-vitals", "next/typescript")
  .map((entry) => ({ ...entry, files: ["src/**/*.{js,jsx,ts,tsx}"] }));

export default defineConfig([
  globalIgnores([
    "**/node_modules",
    ".next/",
    "out/",
    "build/",
    "**/dist/",
    "server/data/",
    "next-env.d.ts",
    "test-results/",
    "playwright-report/",
    "blob-report/",
    // Skills vendoreadas: código de terceros, no nuestro para lintear.
    ".opencode/",
  ]),

  // Base: JS recomendado + TypeScript recomendado (sin type-checking).
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Frontend Next.js: Core Web Vitals + hooks.
  ...nextScoped,
  reactHooks.configs.flat.recommended,

  // Globals al final: FlatCompat resetea languageOptions y estos deben ganar.
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
  },

  // Server Fastify + tooling Node (e2e, configs): sin reglas de React.
  {
    files: ["server/**/*.ts", "e2e/**/*.ts", "playwright.config.ts", "eslint.config.js"],
    languageOptions: { globals: globals.node },
  },
]);
