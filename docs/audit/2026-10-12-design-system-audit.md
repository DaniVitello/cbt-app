# Auditoría de sistema de diseño 2026-10-12

**Método:** solo lectura (grep de tokens/clases, archivos de config, skill `ui-ux-pro-max` instalada y verificada). Contra lineamientos: REQUIREMENTS (MVP 2 + sistema de diseño), `quality-gates`, orden de conflictos del AGENTS.

**Skill instalada:** `uipro init --ai opencode` OK (7 skills en `.opencode/skills/`, CLI 2.15.0). `search.py` responde vía `py` (en esta máquina Python es `py` 3.14.7, no `python3`). Las skills nuevas no se publicitan en sesiones ya abiertas (requiere restart); se leen por archivo hasta entonces.

## Resumen (5 líneas máx.)

1. Base sana: cero colores hardcodeados en `src/`, todo por tokens HSL; layout con `max-w` + grids `sm:/lg:`; dark-mode por variables; `prefers-reduced-motion` global; Inter por `next/font`.
2. Paleta actual = azul default de shadcn, no "calmo/cálido" del roadmap; semánticos (success/warning/error) existen en CSS pero sin cablear al config.
3. Bugs reales: `--popover` sin definir (dropdown del Select sin fondo), badges con colores fijos sin variante dark, inputs a 14px (iOS hace zoom al enfocar), `text-3xl` fuera de la escala 12–30.
4. Faltan Tabs, Badge, BottomNav, CrisisBanner; Toast existe pero sin usar; la tabla `RowsField` no tiene estrategia mobile.
5. Backlog: 8 slices (MASTER primero, tokens, bugs, componentes, verificación) + 3 decisiones del dueño.

## Inventario

### Tokens hoy (`globals.css` + `tailwind.config.ts`)
- Colores: shadcn default (primary azul 221, neutros azul-grisados) claro/oscuro. `--radius: 0.5rem`. Semánticos solo en CSS.
- `tailwind.config`: mapea border/input/ring/background/foreground/primary/secondary/muted/accent/card + radius. Sin: semánticos, `popover`, `fontFamily`, animaciones.
- Tipografía: Inter (`latin`) vía `next/font` en el layout, sin token de familia; escala Tailwind default en uso (12/14/16/18/20/24 + **36 fuera de escala** en el h1 de la home).
- Movimiento: `transition-colors` (botones/slider/stepper), `duration-300` (progress-bar, fuera de 150/250), `animate-pulse` (skeleton) + regla global `reduced-motion` ✓.
- Sombras/radios: defaults de Tailwind (`shadow-md/lg`, `rounded-md/lg/full`); sin tokens propios.

### Componentes (`src/components/ui/`, 13 archivos)
button, card, dialog (slice #16, verificado en browser), empty-state, input, label, progress-bar, select, skeleton, slider, stepper, textarea, toast.
Faltan del roadmap: Tabs, Badge, BottomNav (shell MVP 3), CrisisBanner (shell MVP 5). Toast sin ningún uso (cero imports).

### Layout responsive
`max-w-2xl/5xl` + `px-4`, `w-full` sistemático, grids `sm:/lg:` en home, dialog con `calc(100%-2rem)`. Excepción: `<table>` en `RowsField` (ver G-07).

## Brechas

| ID | Dimensión | Hallazgo | Evidencia | Sev |
|---|---|---|---|---|
| G-01 | Tokens | Paleta = azul default shadcn, no "1 primario calmo + neutro cálido" del roadmap | `globals.css:11` (`--primary: 221.2 83.2% 53.3%`) | S2 |
| G-02 | Tokens | Semánticos sin cablear: `success/warning/error` en CSS pero no en `tailwind.config` | `globals.css:24-30` vs `tailwind.config.ts:8-34` | S2 |
| G-03 | Bug visual | `--popover` sin definir: `bg-popover` del Select no resuelve (dropdown sin fondo) | `select.tsx:36`, sin `--popover` en CSS ni config | S1 |
| G-04 | Dark mode | Badges con colores fijos (`bg-green-100`, `bg-yellow-100`, `text-red-600` en errores) sin variante dark | `themes/[id]/page.tsx:62`, `history:105`, `exercises/[id]:364` | S2 |
| G-05 | Mobile | Inputs a 14px: iOS hace zoom automático al enfocar (umbral 16px) | `input.tsx:12`, `textarea.tsx:11` (`text-sm`) | S2 |
| G-06 | Escala | ~~`text-3xl` (36px) fuera de la escala 12–30~~ ERRATA: `text-3xl` = 30px, SÍ está en escala. Sin cambio necesario. | — | — |
| G-07 | Responsive | Tabla `RowsField` sin estrategia a 360px (overflow potencial) | `RowsField.tsx:31` (`<table class w-full`) | S2 |
| G-08 | Componentes | Faltan Tabs, Badge, BottomNav, CrisisBanner; Toast existe sin uso | `ui/` (13 archivos), grep `toast(` = 0 | S2 |
| G-09 | Pulido | Emoji 📝 como ícono + `line-clamp-2` sin ruta accesible al texto completo | `empty-state.tsx:19`, `ExerciseCatalog.tsx:54` | S3 |
| G-10 | Tokens | Sin tokens de familia tipográfica, sombras, ni duraciones (150/250); `duration-300` suelto | config + `progress-bar.tsx:31` | S3 |

## Backlog de slices (MVP 2)

| # | Slice | Skill | Depende de | Listo cuando | Reversión |
|---|---|---|---|---|---|
| DS-1 | Generar y revisar `design-system/cbt-app/MASTER.md` con la skill (2–3 opciones de paleta, el dueño elige) | ui-ux-pro-max | — | MASTER existe, cada decisión con motivo, sin contradicciones con a11y | borrar carpeta |
| DS-2 | Tokens core en CSS + config (paleta elegida, semánticos cableados, `popover`, familia Inter, radios/sombras/motion) | ui-ux-pro-max + frontend | DS-1 | grep: cero hardcodeados; contraste medido por token | git revert |
| DS-3 | Bugs visuales: fondo del Select, badges dark, inputs a 16px, h1 a escala | frontend | DS-2 | verificar en browser claro/oscuro + emulación 360px | git revert |
| DS-4 | Componentes faltantes (Tabs, Badge, BottomNav shell, CrisisBanner shell) + decisión Toast | frontend | DS-2 | render aislado en 360px claro/oscuro con teclado | git revert |
| DS-5 | Tabla `RowsField` responsive (apilar o scroll contenido a 360px) | frontend | — | sin overflow horizontal en 360px,Вопрос headers asociados | git revert |
| DS-6 | Pulido: emoji→Lucide, `line-clamp` con ruta accesible, `duration-300`→token | frontend | DS-2 | Lighthouse + revisión visual | git revert |
| DS-7 | Verificación responsive + regresión (capturas 360/768/1280 × claro/oscuro, checklist de la skill, E2E + tests verdes) | quality-gates | DS-2..DS-6 | checklist firmado, 0 regresiones | n/a |

## Decisiones que necesitan al humano

- **D1 — Dirección de paleta:** RESUELTA por el dueño (2026-10-12): cálida, sin colores eléctricos, tonos pastel, consistencia y calma durante los ejercicios. Restricción dura para DS-1 (el brief a la skill debe excluir neones/eléctricos).
- **D2 — Toast:** RESUELTA por el dueño (2026-10-12): cablear solo si la lógica lo pide → ningún flujo actual lo necesita (feedback inline existente) → **se borra** `ui/toast.tsx`. Se reintroduce si un MVP futuro trae el caso.
- **D3 — Tipografía:** RESUELTA por el dueño (2026-10-12): Inter queda.

## No verificado

- Contraste medido por token (muted en ambos modos, badges actuales): medir en DS-2, no asumir.
- El dropdown del Select abierto en browser (se infiere roto por el token ausente; confirmar visual en DS-3).
- Comportamiento real en un teléfono (solo emulación 360px en DS-7).
- Lector de pantalla sobre componentes nuevos (sin lector en el entorno).
- `search.py --design-system` aún no corrido (Tarea 1 del MVP: respondía el dominio `style`; el generador completo se corre en DS-1).
