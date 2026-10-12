# CBT App — Requerimientos por MVP

Documento de referencia para construir la app paso a paso. Cada MVP tiene: objetivo, requisitos de diseño, requisitos técnicos, modelo de datos, tareas, criterio de éxito y qué queda fuera.

**Regla de oro:** no se empieza un MVP hasta cumplir el criterio de éxito del anterior.

---

## 0. Principios y requisitos transversales

### Producto
- La app es una herramienta de **autoayuda guiada**. No diagnostica, no trata, no reemplaza a un profesional. Esto se comunica en la UI y se respeta en cualquier función de IA.
- Idioma de la interfaz: **definir antes del MVP 1** (ES rioplatense / EN). Si puede haber ambos, usar `next-intl` desde el principio; migrar textos después es caro.
- Tono del micro-copy: cercano, sin culpa, sin lenguaje clínico innecesario. Nada de rachas que castigan ni mensajes tipo "¡Perdiste tu racha!".

### Stack base (ya existente)
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v3 · shadcn/ui · React Query v5 · Zod · Fastify 5 + SQLite (se redefine su rol a partir del MVP 3).

### Calidad (aplica a todos los MVP)
- **Accesibilidad:** WCAG 2.2 AA. Contraste ≥ 4.5:1 en texto, targets táctiles ≥ 44×44 px, foco visible, gestión de foco al cambiar de paso, `aria-live` en estados dinámicos, respetar `prefers-reduced-motion`, nada que dependa solo del color.
- **Testing:** Vitest para lógica pura (motor de ejercicios, encadenamiento, reglas de daily task). Playwright para 1 flujo E2E crítico por MVP.
- **TypeScript estricto:** `strict: true`, sin `any`, uniones discriminadas con `assertNever` (ya lo usás).
- **Contrato de ids:** los `id` de ejercicios y campos no se renombran nunca. Si hay que cambiar uno, se agrega una migración.
- **Versionado de datos:** cada definición de ejercicio lleva `version: number`; cada entry guarda la versión con la que se completó.
- **Commits chicos** y una rama por MVP.

### Definition of Done (por MVP)
- [ ] Criterios de aceptación cumplidos
- [ ] Tests de lógica nueva pasando
- [ ] 1 flujo E2E pasando
- [ ] Revisión de accesibilidad manual (teclado + lector de pantalla básico)
- [ ] Probado en mobile (desde MVP 3) y en modo claro y oscuro
- [ ] README actualizado con cómo correrlo

---

## Sistema de diseño (se completa en el MVP 2 y se reutiliza en los siguientes)

### Tokens
Definir como variables CSS (formato HSL de shadcn) y exponer en `tailwind.config.ts`.

| Categoría | Requisito |
|---|---|
| Color | 1 color primario calmo, 1 neutro cálido, 3 semánticos (éxito, aviso, error). Paleta completa para claro y oscuro. Evitar rojo saturado para estados no críticos. |
| Tipografía | 1 familia sans legible (ej. Inter o similar vía `next/font`). Escala: 12/14/16/18/20/24/30. Interlineado ≥ 1.5 en texto largo. Ancho máximo de línea ~65 caracteres. |
| Espaciado | Base de 4 px. Escala 4/8/12/16/24/32/48. |
| Radio y sombras | 2 radios (suave y pill), 2 niveles de sombra. Superficies más planas que cargadas. |
| Movimiento | Duraciones 150/250 ms, easing estándar. Todo animado debe tener variante sin animación. |

### Componentes base (nuevos o a revisar)
`Button`, `Card`, `Input`, `Textarea`, `Slider`, `Select` (ya existen) + **`Stepper`**, `ProgressBar`, `EmptyState`, `Skeleton`, `Toast`, `Dialog` de confirmación, `Tabs`, `Badge` (estado de tema), `BottomNav` (mobile), `CrisisBanner`.

### Estados obligatorios en cada pantalla
Carga (skeleton) · vacío (con acción sugerida) · error (con reintento) · éxito.

### Persistencia del tema
Modo claro/oscuro/sistema persistido con `next-themes`. Evitar el flash de tema incorrecto en la carga.

---

# MVP 1 — Base sólida y UI pulida

**Duración estimada:** 2–3 semanas
**Objetivo:** pasar de "15 formularios sueltos" a un recorrido con sentido, con una UI de nivel profesional.

## Diseño

### D1.1 Home por intención
- Reemplaza la lista plana de 15 ejercicios.
- Bloque superior: "¿Qué necesitás hoy?" con 3–4 accesos:
  - *Algo me está pasando ahora* → ejercicios de pensamientos / catastrofización / relajación
  - *Quiero trabajar una creencia* → Downward Arrow, Core Beliefs, Disputing, Inner Rules
  - *Quiero hacer algo concreto* → Behavioral Experiments, Problem Solving, WDEP
  - *Necesito soltar tensión* → PMR, I Will Survive
- Debajo: **Continuar donde quedé** (borradores) y **Temas activos**.
- El catálogo completo por categoría queda accesible en una pestaña "Todos los ejercicios".

### D1.2 Runner en modo wizard
- Una sección o pregunta principal por pantalla.
- Barra de progreso + "paso X de N".
- Botones Atrás / Siguiente fijos y visibles; Siguiente no bloquea si el campo es opcional.
- Bloque colapsable "¿Para qué sirve este paso?" y "Ver ejemplo" (contenido tomado del PDF).
- Salir en cualquier momento: "Guardar y salir" sin culpa ni confirmaciones innecesarias (el autoguardado ya lo cubre).
- Pantalla de cierre: resumen de respuestas, cambio en el slider antes/después, siguiente paso sugerido, botón para volver a la home.

### D1.3 Medición antes/después
- Al **inicio** del ejercicio: slider 0–100 (ej. "¿Cuánto creés en este pensamiento?" o "¿Qué intensidad tiene la emoción?"), con etiqueta definida por ejercicio.
- Al **final**: el mismo slider.
- En el cierre se muestra la diferencia con lenguaje neutral ("Antes 80 → Ahora 55"), sin juzgar si "mejoró" o no.

### D1.4 Vista de Tema
- Cada tema muestra: título, estado, línea de tiempo de ejercicios hechos (con fecha y cambio en slider) y botón "Siguiente paso sugerido".
- Estados: `open` · `in_progress` · `done` · `archived`.

### D1.5 Pulido visual
- Aplicar el sistema de diseño completo.
- Estados vacíos, skeletons y errores en todas las pantallas.
- Layout responsive desde 360 px (aunque el foco mobile sea el MVP 3).

## Técnico

### T1.1 Modelo de datos

```ts
// types/theme.ts
type ThemeStatus = 'open' | 'in_progress' | 'done' | 'archived';

interface Theme {
  id: string;            // UUID
  title: string;
  description?: string;
  status: ThemeStatus;
  createdAt: string;     // ISO
  updatedAt: string;
}

// Cambios sobre Entry (existente)
interface Entry {
  id: string;
  exerciseId: string;
  exerciseVersion: number;
  themeId: string | null;
  sourceEntryId: string | null;      // entry que originó esta (encadenamiento)
  answers: Answers;
  measures: { before?: number; after?: number };
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

### T1.2 Extensión del tipo `Exercise`

```ts
interface Exercise {
  id: string;
  version: number;
  title: string;
  category: Category;
  intents: Intent[];                 // para la home por intención
  measure?: {                        // slider antes/después
    id: string;
    labelBefore: string;
    labelAfter: string;
    min: 0; max: 100;
  };
  sections: Section[];               // cada sección = un paso del wizard
  outputs?: Array<{                  // qué campo produce un dato reutilizable
    fieldId: string;
    kind: 'belief' | 'thought' | 'situation' | 'emotion' | 'action';
  }>;
  accepts?: Array<{                  // qué dato entrante precarga un campo
    kind: 'belief' | 'thought' | 'situation' | 'emotion' | 'action';
    intoFieldId: string;
  }>;
  next?: string[];                   // ids de ejercicios sugeridos a continuación
  help?: { purpose?: string; example?: string };
}
```

### T1.3 Encadenamiento
- Función pura `getPrefill(exercise, sourceEntry): Partial<Answers>` que usa `outputs` del origen y `accepts` del destino. Testeable sin UI.
- Al completar un ejercicio: mostrar `next` (máximo 2 sugerencias) y, si se acepta, crear una nueva entry con `sourceEntryId` y `themeId` heredados y los campos precargados (editables).
- Cadenas iniciales a implementar y validar con los PDFs reales:
  1. Downward Arrow → Core Beliefs → Disputing Irrational Beliefs
  2. Thought Record → Cognitive Restructuring
  3. Challenging Catastrophic Thinking → Decatastrophizing → Behavioral Experiments

### T1.4 Backend (todavía Fastify + SQLite en este MVP)
- Migración: tabla `themes`; columnas nuevas en `entries` (`theme_id`, `source_entry_id`, `exercise_version`, `measure_before`, `measure_after`, `completed_at`).
- Endpoints nuevos: `GET/POST /api/themes`, `GET/PUT/DELETE /api/themes/:id`, `GET /api/themes/:id/entries`.
- `GET /api/entries` con filtros `themeId`, `status`.
- Validación Zod en todos los bodies; mismo formato de error `{ error: { message, details? } }`.
- Paginación en historial: `limit` + `cursor`.

### T1.4b Wizard
- `ExerciseWizard` reemplaza o envuelve `ExerciseForm`: recibe `exercise.sections`, mantiene el índice de paso, usa el autoguardado existente (debounce 500 ms).
- Al cambiar de paso: mover el foco al título del paso y anunciarlo por `aria-live`.
- Validación por paso con Zod (campos obligatorios solo donde el PDF lo requiere).

### T1.5 Persistir modo oscuro
`next-themes` con `attribute="class"`, `defaultTheme="system"`.

## Tareas (orden sugerido)
1. Definir tokens y componentes base nuevos (`Stepper`, `ProgressBar`, `EmptyState`, `Skeleton`, `Toast`).
2. Modelo `Theme` + migración + endpoints.
3. Extender `Exercise` y `Entry`; actualizar los 15 ejercicios con `intents`, `measure`, `outputs`/`accepts`/`next` (empezar por los 3 de la primera cadena).
4. `ExerciseWizard` con progreso, ayuda y ejemplo.
5. Slider antes/después y pantalla de cierre.
6. `getPrefill` + flujo "siguiente paso sugerido" con tests.
7. Home por intención + Continuar + Temas activos.
8. Vista de Tema (línea de tiempo).
9. Paginación del historial, persistencia del tema oscuro, estados vacíos/error.
10. E2E: completar cadena de 3 ejercicios.

## Criterios de aceptación
- [ ] Completás Downward Arrow → Core Beliefs → Disputing con datos precargados entre pasos.
- [ ] Cualquier ejercicio se completa en wizard sin pérdida de datos al cerrar la pestaña a mitad.
- [ ] El slider antes/después queda guardado y se ve en la línea de tiempo del tema.
- [ ] La home no muestra los 15 ejercicios a la vez como primer plano.
- [ ] Navegación completa por teclado.

## Fuera de alcance
IA, mobile/PWA, check-in de ánimo, daily task, auth.

---

# MVP 2 — Sistema de diseño mobile-first (con ui-ux-pro-max)

**Duración estimada:** 1 semana
**Objetivo:** que el sistema visual nazca responsive: tokens, tipografía y componentes base que refluven desde 360 px, generados con la skill ui-ux-pro-max y pasados por nuestros gates. Las pantallas se pulen después del mobile (MVP 3); lo que se define acá sobrevive al rediseño.

## Decisión de alcance (cerrada)

Sistema y tokens ahora; pulido de pantallas después del MVP 3. Pulir el desktop hoy es trabajo que el rediseño mobile-first tiraría. La skill se usa con filtro: sirve su sistema visual (paleta, tipografía, componentes que refluven, checklist responsive), no sus patrones de marketing (heroes, conversión, CTAs agresivos) que contradicen el tono de la app.

## Diseño

### D2.1 Alcance visual
- Paleta calmada claro/oscuro (1 primario calmo, neutro cálido, 3 semánticos), tipografía legible en ES (probar diacríticos y voseo), escala 12/14/16/18/20/24/30, espaciado base 4 px, 2 radios, 2 sombras, movimiento 150/250 ms con variante sin animación.
- Todo tokenizado en variables CSS + `tailwind.config.ts`. Nada hardcodeado en componentes (se verifica con grep).

### D2.2 Componentes base que faltan
`Dialog`, `Tabs`, `Badge` (estado), `BottomNav` (shell para el MVP 3), `CrisisBanner` (shell para el MVP 5). Los existentes (Button, Card, Slider, Select, Stepper, ProgressBar, EmptyState, Skeleton…) se alinean a los tokens.

### D2.3 Mobile-first desde el token
- Nada de anchos fijos; todo refluve (texto resiliente: sin clipping, chips con `+n` operable).
- Targets ≥ 44 px, inputs ≥ 16 px (evita el zoom automático de iOS), foco visible, `prefers-reduced-motion` respetado.
- Contraste ≥ 4.5:1 verificado por token, no por pantalla.

## Técnico

### T2.1 Instalar la skill (prerequisito humano, una vez)
`npm install -g ui-ux-pro-max-cli` + `uipro init --ai opencode` (queda en `.opencode/skills/`, versionada con el repo) + Python 3 para su buscador (`search.py`).

### T2.2 Generar el sistema con la skill
`search.py` con el brief de la app → patrón + estilo + paleta + tipografía + efectos + anti-patrones. Salida a `design-system/cbt-app/MASTER.md` (fuente de verdad versionada, se revisa con criterio: tono sobrio, ES rioplatense).

### T2.3 Aplicar con guardarraíles (el orden de conflictos manda)
1. Privacidad y seguridad. 2. Accesibilidad (gates automáticos + checklist). 3. Specs UX existentes. 4. Arquitectura. 5. Sugerencias de la skill. Lo que choque con 1–4 se descarta con el motivo anotado.

### T2.4 Componentes + verificación responsive
- Implementar/ajustar componentes contra `MASTER.md`.
- Gate nuevo: capturas 360/768/1280 en claro y oscuro + checklist responsive de la skill (sin clipping, sin scroll horizontal en 360, chips operables).

## Tareas
1. Instalar la skill (CLI + Python) y verificar que `search.py` responde.
2. Generar `design-system/cbt-app/MASTER.md` y revisarlo (tono, ES, sobriedad).
3. Tokens en CSS + `tailwind.config.ts` (paleta, tipo, espaciado, radios, movimiento).
4. Componentes faltantes + alineación de los existentes a tokens.
5. Verificación responsive + a11y de componentes aislados (antes de las pantallas).
6. Tests, lint y typecheck en verde; E2E cadena 1 sigue pasando.

## Criterios de aceptación
- [ ] `MASTER.md` existe y cada token tiene motivo (no "porque la skill lo dijo").
- [ ] Cero colores/medidas hardcodeadas fuera de tokens.
- [ ] Componentes base bien en 360 px claro/oscuro, con teclado.
- [ ] Nada contradice accesibilidad (contraste medido, motion respetado).

## Fuera de alcance
Pulido de pantallas (después del MVP 3), PWA/Dexie (MVP 3), ejercicios nuevos.

---

# MVP 3 — Mobile y local-first

**Duración estimada:** 1–2 semanas
**Objetivo:** poder usar y probar la app desde el celular, con datos propios en el dispositivo.

## Decisión de arquitectura (cerrar al empezar)

| | A — Local-first (recomendado) | B — Backend con sync |
|---|---|---|
| Datos | IndexedDB en el dispositivo | SQLite/Postgres en servidor |
| Auth | No necesaria | Necesaria |
| Privacidad | Máxima (los datos no salen del dispositivo) | Requiere cifrado, política y cuidado |
| Multi-dispositivo | No | Sí |
| Costo/complejidad | Bajo | Alto |

**Se asume A.** Si más adelante hace falta B, el repositorio de datos (T3.2) permite cambiar la implementación sin tocar la UI.

## Diseño

### D3.1 Mobile-first
- Rediseñar para 360–430 px como caso principal; desktop como adaptación.
- **Navegación inferior** (`BottomNav`): Inicio · Ejercicios · Temas · Historial/Progreso.
- Wizard a pantalla completa, botones de acción en zona de pulgar (parte inferior), teclado virtual sin tapar el campo activo.
- Safe areas (`env(safe-area-inset-*)`) para notch y barras del sistema.
- Targets ≥ 44 px, tipografía mínima 16 px en inputs (evita zoom automático en iOS).

### D3.2 Experiencia de instalación
- Pantalla "Instalar en tu celular" con instrucciones cortas para Android e iOS (en iOS: Compartir → Agregar a inicio).
- Ícono propio (192, 512 y maskable), splash y `theme-color` coherentes con la paleta.

### D3.3 Offline
- La app funciona sin conexión para todo lo que no sea IA. Indicador discreto de estado de conexión.

## Técnico

### T3.1 PWA
- `manifest.webmanifest`: `name`, `short_name`, `display: standalone`, `start_url`, `theme_color`, `background_color`, íconos (incl. maskable).
- Service worker con precache de app shell y estrategia stale-while-revalidate para assets. Opciones: **Serwist** (`@serwist/next`) o SW manual mínimo. **Verificar compatibilidad con Turbopack** en la versión de Next que uses; si hay conflicto, usar webpack solo para el build de producción.
- **HTTPS obligatorio** para el service worker (excepto `localhost`). Para probar en el celular durante desarrollo: túnel (ej. `cloudflared`) o deploy en Vercel/Cloudflare Pages.

### T3.2 Capa de datos local
- IndexedDB con **Dexie**.
- Patrón **Repository**: interfaz `ThemeRepo`, `EntryRepo` con implementación `DexieRepo` (ahora) y `ApiRepo` (futura). La UI y React Query hablan solo con la interfaz.

```ts
interface EntryRepo {
  list(filter?: { themeId?: string; status?: EntryStatus; exerciseId?: string }): Promise<Entry[]>;
  get(id: string): Promise<Entry | null>;
  upsert(entry: Entry): Promise<void>;
  remove(id: string): Promise<void>;
}
```

- Tablas: `themes`, `entries`, `settings` (índices por `themeId`, `exerciseId`, `status`, `updatedAt`).
- Versionado de esquema con `db.version(n).stores(...)` y migraciones.
- Migración inicial: botón "Importar desde la versión anterior" que lee el JSON exportado o consulta una vez a la API local.
- Pedir **almacenamiento persistente** (`navigator.storage.persist()`) para reducir el riesgo de que el navegador borre datos.

### T3.3 Export / Import / Borrado
- Exportar **todo** a un único JSON versionado (`{ schemaVersion, exportedAt, themes, entries, ... }`).
- Importar con validación Zod y modo "fusionar" vs "reemplazar".
- "Borrar todos mis datos" con confirmación en dos pasos.
- Aviso claro: *si se borran los datos del navegador, se pierden; exportá copias de seguridad.*

### T3.4 Qué pasa con Fastify
- Se mantiene en el repo pero **no es necesario** para uso normal.
- Se reactivará en el MVP 5 con un único rol: proxy de IA (sin almacenar datos).

### T3.5 Cifrado en reposo (opcional, evaluar)
- Passphrase del usuario → clave con PBKDF2/Argon2 → AES-GCM con Web Crypto para cifrar `answers`. Costo: si olvida la passphrase, no hay recuperación. Decidir con criterio de riesgo/beneficio; no bloquear el MVP.

## Tareas
1. Decidir A vs B y dejarlo escrito en el README.
2. Definir interfaces `Repo` y refactorizar la UI para usarlas.
3. Implementar `DexieRepo` + migración desde datos existentes.
4. Export/import/borrado total.
5. Manifest, íconos, service worker, estrategia de caché.
6. Rediseño mobile-first: `BottomNav`, wizard a pantalla completa, safe areas.
7. Pantalla de instalación + indicador offline.
8. Probar en un Android y/o iPhone real vía HTTPS.
9. Tests de repos (con `fake-indexeddb`) y E2E en viewport móvil.

## Criterios de aceptación
- [ ] La app se instala en tu celular y abre en modo standalone.
- [ ] Completás un ejercicio completo en modo avión.
- [ ] Exportás, borrás todo, importás y recuperás los mismos datos.
- [ ] La usás desde el celular durante una semana real.

## Fuera de alcance
APK nativa (Capacitor/TWA), notificaciones push, IA, sync entre dispositivos.

> **Nota sobre "APK":** una PWA instalada cubre la prueba. Si más adelante necesitás Play Store o APIs nativas, envolver la misma web con **Capacitor** o una **TWA** (Trusted Web Activity) sin reescribir nada.

---

# MVP 4 — Hábito: check-in de ánimo y daily task

**Duración estimada:** 2 semanas
**Objetivo:** que haya una razón para volver todos los días, sin presión ni culpa.

## Diseño

### D4.1 Check-in de ánimo (≤ 10 segundos)
- Pantalla mínima: escala 1–5 con iconos + etiqueta de texto (nunca solo color/emoji), selección opcional de 1–3 emociones de una lista fija, nota opcional de una línea.
- Accesible desde la home en un solo toque. Se puede registrar más de una vez por día.
- Al guardar: confirmación breve y neutra. Sin diagnósticos ni interpretaciones.

### D4.2 Daily task
- Tarjeta destacada en la home: **una sola tarea**, de 2–5 minutos, con título, motivo ("Porque ayer armaste un experimento…") y botones *Hacer ahora* / *Después* / *Hoy no*.
- "Hoy no" es una respuesta válida y no genera penalización.
- Tipos: seguimiento de experimento, retomar un tema, práctica corta (respiración/PMR breve), reflexión de una pregunta.

### D4.3 Progreso
- Vista simple: tendencia de ánimo (línea de 14/30 días), ejercicios completados por tema, cambio en los sliders por tema.
- Sin puntajes totales, sin "nivel", sin comparaciones.
- Lenguaje descriptivo, no evaluativo ("Esta semana hiciste 3 ejercicios").

### D4.4 Recordatorio
- Configuración opcional de un recordatorio diario (hora elegida por el usuario).
- Si no se activa, la app funciona igual.

## Técnico

### T4.1 Modelo de datos

```ts
interface MoodCheckin {
  id: string;
  valence: 1 | 2 | 3 | 4 | 5;
  emotions: EmotionId[];          // lista cerrada, definida en data/emotions.ts
  note?: string;
  createdAt: string;              // ISO
  localDate: string;              // 'YYYY-MM-DD' en zona local, para agrupar por día
}

interface DailyTask {
  id: string;
  localDate: string;
  kind: 'follow_up' | 'resume_theme' | 'short_practice' | 'reflection';
  title: string;
  reason: string;
  refEntryId?: string;
  refThemeId?: string;
  practiceId?: string;
  status: 'pending' | 'done' | 'skipped';
  createdAt: string;
  resolvedAt?: string;
}
```

### T4.2 Generador de daily task (basado en reglas, sin IA)
Función pura `pickDailyTask(state, today): DailyTask | null`. Reglas en orden de prioridad:
1. Existe un `Behavioral Experiment` completado hace ≥ 1 día sin seguimiento → `follow_up`.
2. Hay un tema `in_progress` sin actividad ≥ 3 días → `resume_theme`.
3. Ánimo promedio de los últimos 3 check-ins ≤ 2 → `short_practice` (PMR breve o respiración).
4. Por defecto → `reflection` (una pregunta corta).
- Máximo 1 tarea por día; si hay una `pending` del día, se mantiene.
- Cada regla se testea de forma unitaria con estados fabricados.

### T4.3 Progreso
- Consultas agregadas sobre Dexie (por `localDate`).
- Gráficos livianos (Recharts o SVG propio). Alternativa textual accesible para cada gráfico (tabla o resumen).

### T4.4 Notificaciones
- Primero **recordatorio sin push**: al abrir la app, mostrar la tarjeta del día.
- Web Push es opcional y limitado: en iOS solo funciona con la PWA instalada (iOS 16.4+) y requiere servidor + VAPID. No lo metas en este MVP salvo que el hábito lo justifique.

### T4.5 Zonas horarias
- Usar siempre `localDate` calculada en el dispositivo. No agrupar por UTC.

## Tareas
1. Modelo y repos para `MoodCheckin` y `DailyTask`.
2. Lista cerrada de emociones y componente de check-in.
3. `pickDailyTask` con tests por regla.
4. Tarjeta de daily task en la home y flujo hacer/después/hoy no.
5. Vista de progreso con alternativa textual.
6. Configuración de recordatorio (inicio: solo al abrir la app).
7. E2E: check-in → daily task → completar.

## Criterios de aceptación
- [ ] El check-in se hace en menos de 10 segundos.
- [ ] La daily task cambia según el estado real (temas abiertos, experimentos, ánimo).
- [ ] "Hoy no" no deja ninguna marca negativa.
- [ ] **Validación de hábito:** abrís la app varios días seguidos sin forzarte. Si no pasa, revisar la idea de hábito *antes* de sumar IA.

## Fuera de alcance
Detección automática de ánimo, IA, push notifications obligatorias, gamificación.

---

# MVP 5 — IA acotada y con guardarraíles

**Duración estimada:** 2–3 semanas
**Objetivo:** que la IA ayude a elegir y a entender, sin hacer de terapeuta.

## Alcance de la IA (qué sí y qué no)

| Sí | No |
|---|---|
| Onboarding: recomendar ejercicios según lo que la persona cuenta | Diagnosticar |
| Resumir un ejercicio completado | Dar tratamiento o consejos clínicos |
| Sugerir el próximo paso dentro de los ejercicios existentes | Responder en crisis como si fuera ayuda profesional |
| Reflejar patrones como *observaciones opcionales* | Presentarse como terapeuta o persona |
| Explicar qué es un paso o término del ejercicio | Chat abierto sin límites (no en este MVP) |

> **Contexto regulatorio:** varios estados de EE. UU. restringieron las apps de IA que ofrecen terapia o tratamiento, y exigen que quede claro que se trata de IA. Para uso personal no aplica de forma directa, pero este diseño ya cumple el espíritu: IA asistiva, transparente y sin pretensión clínica. Si abrís la app a otras personas, revisá la normativa de cada jurisdicción antes.

## Diseño

### D5.1 Etiquetado claro
- Todo contenido generado lleva una etiqueta visible ("Sugerencia de IA") y un texto fijo: *"Esto no reemplaza a un profesional."*
- Estilo visual distinto al contenido propio de los ejercicios.

### D5.2 Onboarding guiado
- Pantalla inicial opcional: "Contame en pocas palabras qué te gustaría trabajar" (textarea, máx. 500 caracteres).
- Resultado: 1–3 ejercicios recomendados con una línea de motivo cada uno + botón *Empezar*. Opción de saltar y elegir manualmente.

### D5.3 Ayuda con resultados
- En el cierre de un ejercicio: bloque colapsable "Resumen y siguiente paso" con (a) resumen breve, (b) 1–3 observaciones formuladas como preguntas o hipótesis ("¿Notás que…?"), (c) siguiente ejercicio sugerido.
- Cada observación se puede **aceptar, editar o descartar**. Solo lo aceptado se guarda.

### D5.4 Control del usuario
- La IA está **desactivada por defecto**; se activa en Ajustes con un consentimiento explícito.
- Antes del primer envío: pantalla que explica *qué datos se envían, a qué servicio y cómo se tratan*.
- Botón visible "Enviar a la IA" en cada uso (nada se envía automáticamente).
- Indicador de carga y de error con alternativa manual siempre disponible.

### D5.5 Pantalla de crisis
- Componente `CrisisBanner` / pantalla dedicada: mensaje empático breve, recursos de ayuda y botón para volver.
- Siempre accesible desde la barra de navegación o ajustes, no solo cuando se detecta.

## Técnico

### T5.1 Rol de Fastify
- Se reactiva **solo como proxy de IA**: guarda la API key en el servidor, aplica rate limit y no persiste contenido de usuarios.
- Debe ser alcanzable desde la PWA por HTTPS (desplegado, p. ej., en Fly.io/Render/Cloudflare Workers). CORS restringido al origen de la app.
- Sin logs del contenido de los prompts ni de las respuestas.

### T5.2 Endpoints

| Endpoint | Entrada | Salida (validada con Zod) |
|---|---|---|
| `POST /api/ai/onboarding` | `{ text }` | `{ recommended: [{ exerciseId, why }] }` (`exerciseId` limitado al enum de ids existentes) |
| `POST /api/ai/summary` | `{ exerciseId, answers, measures }` | `{ summary, observations: string[], nextExerciseId? }` |
| `POST /api/ai/explain` | `{ exerciseId, fieldId }` | `{ explanation }` |

### T5.3 Salida estructurada
- Pedir JSON al modelo con esquema explícito, validar con Zod, reintentar una vez y, si falla, mostrar el estado de error con alternativa manual.
- Los ids de ejercicio se validan contra el catálogo real; descartar ids inventados.

### T5.4 System prompt (requisitos mínimos)
- Rol: asistente de apoyo para ejercicios de autoayuda; **no** terapeuta.
- Prohibido: diagnosticar, nombrar trastornos como conclusión, indicar medicación, dar instrucciones clínicas, afirmar que "esto cura/trata".
- Formular observaciones como hipótesis y preguntas, en el idioma de la interfaz, tono cercano y breve.
- Si detecta riesgo (autolesión, suicidio, daño a terceros), **no continuar el análisis**: devolver una bandera `crisis: true`.

### T5.5 Detección de crisis (defensa en capas)
1. **Cliente**, antes de enviar: lista de patrones de lenguaje de riesgo (ES/EN). Si coincide, no se llama a la IA; se muestra la pantalla de crisis.
2. **Servidor**, antes de generar: clasificación rápida del texto (regex + llamada de clasificación). Si es positivo, devolver `crisis: true` sin generar contenido.
3. **Modelo**: instrucción de devolver `crisis: true` ante riesgo.
- Los recursos de ayuda viven en `data/crisis-resources.ts`, por país, con **verificación manual de números vigentes** antes de cada release (para Argentina, confirmar las líneas actuales, p. ej. la 135 del Centro de Asistencia al Suicida).
- La app nunca debe seguir "conversando" tras una detección.

### T5.6 Privacidad
- Enviar solo lo mínimo necesario (no todo el historial).
- Opción de redacción previa: avisar que no incluyan nombres propios o datos identificables; evaluar redacción automática simple de emails/teléfonos.
- Elegir el proveedor y su configuración de retención de datos de forma consciente, y documentarla en la pantalla de consentimiento.
- Interruptor para apagar la IA y borrar sugerencias guardadas.

### T5.7 Evaluación (evals)
- Conjunto fijo de ~30–50 casos en un archivo (`evals/cases.json`): casos normales, ambiguos, intentos de que diagnostique, y casos de crisis explícitos e implícitos.
- Script que corre los casos y verifica: esquema válido, no diagnostica, `crisis` marcada cuando corresponde, ids válidos.
- Se ejecuta antes de cada cambio de prompt o de modelo.

### T5.8 Control de costos
- Límite de longitud de entrada, `max_tokens` bajo, rate limit por IP/dispositivo, timeout y cacheo del último resultado por entry.

## Tareas
1. Pantalla de consentimiento y ajustes de IA (apagada por defecto).
2. Proxy Fastify con rate limit, CORS y esquemas Zod.
3. `crisis-resources.ts` + `CrisisBanner` + detección en cliente.
4. Endpoint de onboarding + UI de onboarding.
5. Endpoint de summary + bloque aceptar/editar/descartar.
6. Detección de crisis en servidor y flag en el modelo.
7. Suite de evals y primera corrida.
8. Despliegue del proxy por HTTPS y prueba desde el celular.

## Criterios de aceptación
- [ ] Con la IA apagada, la app funciona igual que en el MVP 4.
- [ ] Ningún texto se envía sin una acción explícita.
- [ ] Los casos de crisis de la suite de evals siempre disparan la pantalla de crisis, sin generación.
- [ ] Las sugerencias te resultan útiles y específicas, no genéricas (juicio tuyo tras 1–2 semanas).
- [ ] No hay contenido de usuarios en logs del servidor.

## Fuera de alcance
Chat abierto, memoria de largo plazo de la IA, voz, detección automática de ánimo, análisis de sentimiento continuo.

---

# MVP 6 — Bienestar y profundización

**Duración estimada:** 2 semanas
**Objetivo:** sumar prácticas y contenido de bienestar **conectados a lo que la persona está haciendo**.

## Diseño

### D6.1 Prácticas guiadas
- Biblioteca corta (empezar con 5–8): respiración, PMR breve, grounding, escritura de una línea, reencuadre rápido, gratitud específica.
- Cada práctica: duración (1–5 min), para qué sirve, paso a paso. Reproductor simple con temporizador, pausa y opción de salir.
- Animaciones suaves (p. ej. respiración) con variante estática por `prefers-reduced-motion`.

### D6.2 Contenido contextual
- Frases e ideas **aparecen en contexto**: al cierre de un ejercicio, junto al check-in, o dentro de la daily task. No hay un feed independiente.
- Selección por etiqueta (ejercicio completado, ánimo del día, tema).
- Botón "guardar" para crear una colección personal de lo que resonó.

### D6.3 Tono
- Sin frases de póster ni positividad forzada. Texto concreto, breve y accionable.
- Evitar lenguaje que invalide lo que la persona siente.

## Técnico

### T6.1 Contenido como datos

```ts
interface WellbeingItem {
  id: string;
  kind: 'phrase' | 'practice' | 'reflection';
  title?: string;
  body: string;
  durationMin?: number;           // solo prácticas
  steps?: string[];               // solo prácticas
  tags: { exerciseIds?: string[]; valence?: Array<1|2|3|4|5>; themeKinds?: string[] };
  version: number;
}
```

- Archivo `data/wellbeing.ts` validado con Zod; mismo patrón que los ejercicios.

### T6.2 Selección
- Función pura `pickWellbeingItem(context)` con reglas por etiquetas y sin repetir lo visto recientemente (tabla `seen`).
- Integración con `pickDailyTask` para el tipo `short_practice`.

### T6.3 Reproductor de práctica
- Componente `PracticePlayer` con temporizador basado en timestamps (no en `setInterval` acumulado) para que no se desfase al pausar o con la pantalla bloqueada.
- Cuidar `Wake Lock API` (opcional) para que la pantalla no se apague durante la práctica.

### T6.4 Personalización con IA (opcional, solo si el MVP 5 funcionó)
- Sugerir cuál práctica encaja mejor, dentro del catálogo existente; no generar prácticas nuevas.

### T6.5 Revisión de contenido
- Todo el contenido lo redactás o revisás vos. Evitar afirmaciones clínicas ("esto reduce la depresión"). Idealmente validar las prácticas con un profesional si la app se comparte.

## Tareas
1. Esquema `WellbeingItem` y 8–10 ítems iniciales.
2. `PracticePlayer` accesible.
3. `pickWellbeingItem` + integración en cierre de ejercicio, check-in y daily task.
4. Colección de guardados.
5. Tests de selección y de no repetición.

## Criterios de aceptación
- [ ] Cada ítem que aparece tiene un motivo visible (ejercicio, ánimo o tema).
- [ ] Una práctica completa se hace con el temporizador sin desfases, incluso si se bloquea la pantalla un momento.
- [ ] Podés quitar el contenido de bienestar desde Ajustes sin afectar el resto.

## Fuera de alcance
Feed social, comunidad, contenido generado libremente por IA, audio/voz propia.

---

# Transversales a planificar

| Tema | Cuándo | Nota |
|---|---|---|
| **Tests y CI** | Desde MVP 1 | GitHub Actions: lint, typecheck, Vitest, Playwright. |
| **Observabilidad** | Desde MVP 5 | Solo métricas del proxy (errores, latencia). Nunca contenido. |
| **Seguridad** | MVP 3 y 5 | CSP estricta, sin dependencias innecesarias, secrets solo en servidor. |
| **Export a PDF** | Tras MVP 4 | Resumen de un tema para llevar a una sesión con un profesional. |
| **APK / tiendas** | Después de MVP 6 | Capacitor o TWA envolviendo la misma web. |
| **Auth y sync (opción B)** | Solo si hay otros usuarios | Implica política de privacidad, cifrado y revisión legal. |

# Decisiones abiertas (resolver antes de cada MVP)

1. **Antes del MVP 1:** idioma de la interfaz (ES / EN / ambos).
2. **Antes del MVP 3:** local-first (A) confirmado; ¿cifrado con passphrase sí o no?
3. **Antes del MVP 5:** proveedor de IA y su política de retención; dónde se despliega el proxy.
4. **Antes de abrir la app a otras personas:** revisión legal por jurisdicción, términos, política de privacidad y validación de contenido con un profesional.

# Resumen del pipeline

| MVP | Foco | Duración | Criterio de éxito |
|---|---|---|---|
| 1 | Temas, wizard, medición, UI | 2–3 sem | Cadena de 3 ejercicios fluida |
| 2 | Sistema de diseño mobile-first | 1 sem | Tokens/componentes responden en 360 px |
| 3 | PWA y local-first | 1–2 sem | Una semana de uso real en el celular |
| 4 | Check-in y daily task | 2 sem | Volvés varios días seguidos sin forzarte |
| 5 | IA acotada con guardarraíles | 2–3 sem | Sugerencias útiles y evals de crisis en verde |
| 6 | Bienestar contextual | 2 sem | Cada ítem tiene motivo visible y es removible |
