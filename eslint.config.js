import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import nextVitals from "eslint-config-next/core-web-vitals";
import { defineConfig, globalIgnores } from "eslint/config";

// Las configs de Next vienen sin scope: se restringen a src/ para que las
// reglas de React no alcancen al server (Node puro).
const nextScoped = nextVitals.map((entry) => ({
  ...entry,
  files: ["src/**/*.{js,jsx,ts,tsx}"],
}));

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
  ]),

  // Base: JS recomendado + TypeScript recomendado (sin type-checking).
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Frontend Next.js: browser + Core Web Vitals + hooks.
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  ...nextScoped,
  reactHooks.configs.flat.recommended,

  // Server Fastify: Node, sin reglas de React.
  {
    files: ["server/**/*.ts"],
    languageOptions: { globals: globals.node },
  },
]);
