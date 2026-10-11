# CBT App

App web para hacer ejercicios de terapia cognitivo-conductual (CBT) desde la computadora: wizard por pasos, medición antes/después, encadenamiento entre ejercicios, temas e historial. Bilingüe (ES rioplatense + EN) y accesible (WCAG 2.2 AA).

Herramienta de registro personal: **no reemplaza a un profesional ni da consejo clínico**. Los datos (salud mental) viven solo en tu máquina: sin cuentas, sin analytics, sin terceros.

## Stack

- **Frontend**: Next.js 15 (App Router, Turbopack) + React 19 + TypeScript estricto + Tailwind CSS v3 + shadcn/Radix + React Query 5 + next-intl + next-themes
- **Backend**: Node + TypeScript + Fastify 5 + SQLite (better-sqlite3) + Zod
- **Tests**: Vitest (lógica + API) + Playwright (E2E) + ESLint flat

## Cómo correr

```bash
npm install
cd server && npm install && cd ..
npm run dev:all
```

- Frontend en `http://localhost:3000`, backend en `http://127.0.0.1:3001` (solo local; el frontend lo alcanza por rewrite interno de Next).
- Si el puerto 3000 está ocupado, Next elige el siguiente libre (revisá la consola).
- La base vive en `server/data/cbt.db` (gitignored, se crea sola con migraciones versionadas).

## Estructura

```
cbt-app/
├── src/
│   ├── app/[locale]/      # Rutas: home, exercises/[id] (+ history), themes/[id]
│   ├── components/
│   │   ├── exercise/      # Motor: ExerciseWizard, ExerciseForm, FieldRenderer, campos, CompletionScreen
│   │   ├── home/          # Home por intención, catálogo, continuar
│   │   └── ui/            # Primitivas (button, card, dialog, slider, stepper…)
│   ├── data/              # Ejercicios como datos: exercises.es.ts / exercises.en.ts
│   ├── hooks/             # useExercises, useDebounce
│   ├── lib/               # api.ts (cliente + mapeo snake→camel), prefill.ts, download.ts
│   ├── types/             # Uniones discriminadas (Field, Exercise, Answers)
│   ├── messages/          # Traducciones next-intl (es.json, en.json)
│   └── i18n/              # routing + request (next-intl)
├── server/src/
│   ├── routes/            # entries (CRUD + export), themes
│   ├── db.ts              # createDatabase + runner de migraciones (user_version)
│   ├── migrations.ts      # Diario numerado v1…N (SQL + guardas)
│   ├── schema.ts          # Validación zod (bodies + queries)
│   ├── app.ts             # buildApp() (testeable en proceso)
│   └── index.ts           # Bootstrap (escucha en 127.0.0.1:3001)
├── server/test/           # API + migraciones con base temporal (CBT_DB_PATH)
├── e2e/                   # Playwright: cadena downward → core-beliefs → disputing
├── docs/
│   ├── ux-specs/          # Spec de UX por ejercicio (plantilla de la skill)
│   ├── audit/             # Informes de auditoría + backlog de slices
│   └── exercise-catalog.md# Objetivos centrales de los 15 ejercicios
├── .opencode/skills/      # Skills del proyecto (auditoría, UX, datos, UI, gates)
├── REQUIREMENTS.md        # Roadmap por MVPs (fuente de verdad del alcance)
└── AGENTS.md              # Reglas de colaboración + ciclo de trabajo
```

## Motor de ejercicios

Los ejercicios se definen como **datos tipados** (`src/data/exercises.es.ts` / `.en.ts`, misma estructura, test de paridad). Un renderer genérico los muestra sin código por ejercicio. Tipos de campo: `text`, `rating`, `rows`, `choice`, `group`, `readonly`.

- **Contrato de ids**: los `id` de ejercicios/campos no se renombran (las respuestas dependen de ellos). `exercise-ids.snapshot.json` lo congela; cambiar uno exige subir `version` + regenerar (`UPDATE_SNAPSHOT=1`).
- **Encadenamiento**: `outputs`/`accepts` por kind + `next`; el destino precarga con `?source=<entryId>` (`src/lib/prefill.ts`, testeado).
- **Instancias independientes**: cada ejecución es una instancia; reabrir una completada es solo lectura, con diálogo para empezar de nuevo (conservar o borrar).

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev:all` | Frontend + backend juntos |
| `npm test` | Vitest raíz (frontend + definiciones) |
| `cd server && npm test` | Vitest backend (API + migraciones, DB temporal) |
| `npm run test:e2e` | Playwright cadena 1 (levanta stack propio en :3100/:3001 con DB temporal; necesita esos puertos libres) |
| `npm run lint` | ESLint (0 errores es el gate) |
| `npx tsc --noEmit` | Typecheck (raíz y `server/`) |

## Datos y privacidad

- Todo persiste en SQLite local. Export completo versionado: `GET /api/entries/export` (botón "Exportar todo" en el historial).
- Borrar es borrar de verdad. Los logs nunca incluyen respuestas.
- Tests con base temporal vía `CBT_DB_PATH` (jamás tocan tu `cbt.db`).
