# Reporte de QA — CBT App

**Fecha:** 2026-10-08
**Método:** recorrido manual de la lista de pruebas, app corriendo en `localhost:3000` (Next.js) + `localhost:3001` (Fastify), verificación vía browser headless (DOM real post-hidratación) y API directa.

---

## Errores encontrados

### 🔴 Críticos (rompen flujos completos)

#### B1 — Slider antes/después nunca aparece (puntos 4.1–4.5)
- **Síntoma:** ningún ejercicio muestra el slider "Antes"/"Después"; toda la sección 4 falla.
- **Causa:** ningún ejercicio define el campo `measure` en `src/data/exercises.ts`. El componente `ExerciseWizard` solo renderiza el slider si `exercise.measure` existe.
- **Nota:** la lista de pruebas asumía que `decatastrophizing` tenía `measure`, pero no lo tiene.
- **Fix sugerido:** agregar `measure` a los ejercicios correspondientes (definir cuáles lo ameritan según los PDFs).

#### B2 — Clic en borrador navega a `/exercises/undefined` (punto 7.3)
- **Síntoma:** al hacer clic en "Continuar donde quedé", la URL resultante es `/exercises/undefined` y no se precargan las respuestas.
- **Causa:** mismatch snake_case/camelCase. La API Fastify devuelve `exercise_id`; el frontend lee `e.exerciseId` (`src/app/[locale]/page.tsx` línea ~30, y `ContinueCard`).
- **Fix sugerido:** mapear snake_case → camelCase en la capa `src/lib/api.ts` (recomendado, un solo lugar) o transformar en cada componente (más propenso a errores).

#### B3 — "Volver a la home" no navega (punto 5.5)
- **Síntoma:** el botón en la pantalla de cierre no hace nada; el usuario queda trabado.
- **Causa:** `ExercisePage` no pasa `onComplete` al `ExerciseWizard`. `CompletionScreen` recibe `onBackToHome={onComplete || (() => {})}`, o sea una función vacía.
- **Fix sugerido:** pasar un `onComplete` desde `src/app/[locale]/exercises/[id]/page.tsx` que navegue a `/` (y también dispare el guardado como completed, ver B4).

#### B4 — La entry nunca pasa a `completed` (punto 6.1)
- **Síntoma:** después de completar un ejercicio, el estado en el historial sigue siendo `Borrador` (`status: "draft"`), `completed_at` queda `null`.
- **Causa:** misma que B3. Nadie llama a `updateEntry(..., { status: "completed" })` al finalizar. El `onComplete` del wizard no está conectado a ninguna mutación.
- **Fix sugerido:** en `ExercisePage`, crear un handler `onComplete` que ejecute `updateEntry(id, { status: "completed", completed_at, measure_before, measure_after })`.

#### B5 — No existe botón de tema / modo oscuro (puntos 9.1–9.3)
- **Síntoma:** no hay forma de cambiar claro/oscuro en toda la app.
- **Causa:** `next-themes` está configurado (`ThemeProvider attribute="class" defaultTheme="system"` en `src/components/providers.tsx`) pero no existe ningún componente `ThemeToggle`. Búsqueda de `useTheme|setTheme|ThemeToggle` en `src/` → 0 resultados.
- **Fix sugerido:** crear `components/ThemeToggle.tsx` con `useTheme()` de next-themes y renderizarlo en el layout.

---

### 🟠 Funcionales

#### B6 — Fecha "Invalid Date" en historial (punto 6.3)
- **Síntoma:** la fecha de cada entry en `/exercises/[id]/history` muestra `Invalid Date`.
- **Causa:** mismo mismatch que B2. La API devuelve `created_at`/`updated_at`; el componente hace `new Date(entry.createdAt)` → `undefined`.
- **Fix sugerido:** resolver junto con B2 (mapeo centralizado en `src/lib/api.ts`).

#### B7 — Tarjeta de borrador sin título (punto 7.2)
- **Síntoma:** "Continuar donde quedé" muestra la tarjeta pero el título del ejercicio aparece vacío.
- **Causa:** mismo mismatch que B2 (`e.exerciseId` → `undefined` → `exercises.find(...)?.title ?? undefined`).
- **Fix sugerido:** resolver junto con B2.

#### B8 — "Siguiente paso sugerido" muestra el ID crudo (punto 5.4)
- **Síntoma:** en la pantalla de cierre, el link dice `core-beliefs-suitcases` en vez de "Creencias fundamentales: Las valijas".
- **Causa:** `src/components/exercise/CompletionScreen.tsx` renderiza `{nextId}` directamente en vez de resolver el título.
- **Fix sugerido:** `exercises.find(e => e.id === nextId)?.title ?? nextId`.

#### B9 — Categorías del catálogo muestran claves crudas (punto 2.6)
- **Síntoma:** "Todos los ejercicios" muestra `home.categories.thoughts`, `home.categories.anxiety`, etc., en vez de los textos traducidos.
- **Causa:** en `src/components/home/ExerciseCatalog.tsx` se usa `useTranslations("home")` + `t("categories.thoughts")`, pero en `messages/es.json` y `en.json` las claves `categories.*` están en la raíz, no bajo `home`.
- **Fix sugerido (elegir uno):**
  a) Mover `categories` bajo `home` en ambos JSON de mensajes, o
  b) Usar un segundo hook `useTranslations()` (sin namespace) para `t("categories.*")`.

#### B10 — Badge de estado del tema en crudo (punto 8.5)
- **Síntoma:** en `/themes/[id]` el badge muestra literalmente `in_progress`.
- **Causa:** `src/app/[locale]/themes/[id]/page.tsx` renderiza `{theme.status}` sin traducir ni mapear.
- **Fix sugerido:** mapear a etiqueta legible ("En progreso", "Completado", "Archivado", "Abierto") vía i18n.

#### B11 — "¿Para qué sirve este paso?" y "Ver ejemplo" nunca aparecen (puntos 3.7–3.8)
- **Síntoma:** los botones de ayuda no se renderizan en ningún ejercicio.
- **Causa:** el `ExerciseWizard` solo los muestra si `exercise.help` existe (`{exercise.help && ...}`), pero ningún ejercicio de `src/data/exercises.ts` define el campo `help`.
- **Fix sugerido:** poblar `help: { purpose, example }` en las definiciones de ejercicio (contenido propio, no copiar de los PDFs de PositivePsychology.com — ver regla de copyright).

---

### 🟡 Infraestructura (bloqueaba el arranque)

#### B12 — Servidor Fastify no arrancaba — ✅ YA RESUELTO EN ESTA SESIÓN
- **Síntoma:** `SqliteError: duplicate column name: exercise_version` al correr `npm run dev:server`.
- **Causa:** `server/src/db.ts` ejecutaba `ALTER TABLE ... ADD COLUMN` sin verificar si la columna ya existía. SQLite no soporta `ADD COLUMN IF NOT EXISTS`, y en un entorno con `tsx watch` las migraciones se re-ejecutan en cada reinicio.
- **Fix aplicado:** función `addColumnIfExists()` que consulta `PRAGMA table_info(table)` antes de cada ALTER. Ver `server/src/db.ts`.

---

## ✅ Lo que funciona (verificado)

| Punto | Resultado |
|---|---|
| 1.1–1.4 i18n | `/` redirige a `/es`; `/en` en inglés; `/fr` da 404; vuelve a `/es` |
| 2.1–2.5 Home | 4 tarjetas de intención con sus ejercicios; estados vacíos correctos |
| 2.7 Catálogo | Abrir con "Todos los ejercicios" y cerrar con "✕" funciona |
| 3.1–3.6 Wizard | Stepper con pasos, ProgressBar, Atrás/Siguiente, salto directo por stepper |
| 3.9–3.10 Autoguardado | Ciclo verificado: `556ms: Guardando... → 657ms: Guardado` (debounce 500ms) |
| 5.1–5.2 Cierre | "¡Ejercicio completado!" + resumen con respuestas reales |
| 6.2 Historial | Lista entries con estado |
| 6.4 Exportar | Descarga `entry-<id>.json` correctamente |
| 6.5 Borrar | Pide confirmación (`window.confirm`) antes de borrar |
| 6.6 Paginación | "Cargar más" no aparece con <20 entries (correcto) |
| 8.1–8.4 Temas | Crear tema vía API, home, línea de tiempo en `/themes/[id]` |
| 10.1 Foco | Foco visible con `focus-visible:ring-2` en botones |
| 10.3 Foco en wizard | Al cambiar de paso, el foco va al contenedor del título con `aria-live="polite"` |

---

## ⚠️ No testeado / limitaciones

- **1.2 textos sin traducir (parcial):** la UI chrome se traduce, pero el **contenido de los ejercicios** (títulos, descripciones, labels de campos) está solo en español. Definir si es intencional.
- **10.4 lector de pantalla:** no hay lector disponible en el entorno de pruebas. Se verificó que `aria-live` y `labels` existen en el DOM, pero la experiencia real no se validó.
- **10.2 Enter en botones:** no se simuló teclado real; los elementos son `<button>` nativos (comportamiento por defecto OK).
- **Tema persistente (9.2–9.3):** no testeable porque falta el botón (B5).

---

## 🎯 Orden de fix sugerido

1. **B12** — ya resuelto ✅ (desbloquea el entorno)
2. **B2 + B6 + B7** — misma causa raíz: mapeo snake_case → camelCase centralizado en `src/lib/api.ts`
3. **B3 + B4** — mismo fix: conectar `onComplete` en `ExercisePage` (navega a home + marca `completed`)
4. **B9** — namespace de traducciones en `ExerciseCatalog` (arreglo de 2 líneas)
5. **B5** — crear `ThemeToggle`
6. **B8 + B10** — arreglos de display (título del next, badge del tema)
7. **B1 + B11** — requieren decisión de contenido: definir `measure` y `help` en los ejercicios

---

## ❓ Preguntas para el dueño del proyecto

1. ¿Los ejercicios deben traducirse al inglés o solo la UI?
2. ¿`measure` y `help` estaban planificados y se perdieron, o la lista de pruebas quedó adelantada al código?
3. Para el mismatch de casing: ¿mapear en la API (devolver camelCase) o en el frontend (`api.ts`)? Recomendación: **en `api.ts`**, un solo punto de transformación.
