---
name: audit-and-migrate
description: Audita la app CBT existente contra los lineamientos del proyecto (specs de UX, datos, arquitectura, accesibilidad, calidad) y produce un informe de brechas priorizado más un backlog de slices chicos y ordenados. Usala SIEMPRE antes de una mejora grande, cuando el usuario diga "actualizá/mejorá/migrá la app", "qué le falta", "en qué estado está", "planificá los cambios" o "por dónde empezamos", y también al terminar un bloque de slices para re-auditar. Solo analiza y planifica: no modifica código.
---

# Auditoría y migración incremental

## Para qué existe
La app ya existe. Mejorarla "toda de una vez" produce cambios enormes,
imposibles de revisar y fáciles de romper. Esta skill convierte "mejorar la
app" en una lista corta de **slices** verificables, ordenados por riesgo.

## Reglas duras
1. **No modifiques código ni datos.** Solo leés y escribís el informe.
2. **Leé por tandas, no todo el repo.** Inventariá primero (árbol, scripts,
   tipos), después profundizá solo en lo que cada dimensión necesita.
3. **Evidencia o no existe.** Cada hallazgo cita archivo/línea o comando que
   lo muestra. Si no pudiste verificar algo, marcalo "no verificado".
4. **No inventes lineamientos.** Se audita contra: las specs en
   `docs/ux-specs/`, las skills `data-model-and-persistence`,
   `frontend-architecture-and-ui`, `quality-gates` y `AGENTS.md`.

## Proceso

### Paso 1 — Inventario (solo lectura)
Registrá: stack y versiones (`package.json` de raíz y de `server/`),
scripts disponibles, estructura de carpetas, tipos del motor de ejercicios,
cómo están definidos los ejercicios, endpoints del backend, esquema de base
de datos, herramientas de test/lint presentes.

### Paso 2 — Evaluar por dimensión
Para cada una: estado (ok / parcial / falta), evidencia, riesgo.

| Dimensión | Preguntas clave |
|---|---|
| **Privacidad y datos** | ¿El backend escucha solo en local? ¿DB fuera de git? ¿Se loguean respuestas? ¿Se puede exportar y borrar de verdad? |
| **Modelo de datos** | ¿Cada ejercicio es una instancia independiente? ¿Se reinyecta estado del momento? ¿Hay versionado de ejercicios y migraciones? ¿Los `id` de campo son estables? |
| **Motor de ejercicios** | ¿Todo se define como datos? ¿Tipos con exhaustividad? ¿Qué ejercicios necesitan tipos que no existen? |
| **UX por ejercicio** | ¿Existe spec? ¿La UI la respeta? ¿Se copió el layout de papel (tablas anchas) donde no sirve? |
| **Accesibilidad** | Labels, foco entre pasos, teclado, escalas operables sin mouse, `aria-live`, contraste, tamaño de objetivos táctiles. |
| **Arquitectura frontend** | Estructura, límites cliente/servidor, estado, duplicación, tamaño de componentes. |
| **Rendimiento y robustez** | Navegación lenta en dev, errores cuando el backend está caído, script para levantar todo junto, estados de carga/error. |
| **Calidad** | Qué gates existen y pasan hoy (`quality-gates`). |

### Paso 3 — Priorizar
- **S1:** pérdida o filtración de datos, bloqueos de accesibilidad, app que se rompe.
- **S2:** el ejercicio no cumple su objetivo cognitivo o la UX es mala.
- **S3:** deuda técnica y pulido.

### Paso 4 — Armar el backlog de slices
Orden fijo: **1) privacidad y datos → 2) base del motor y arquitectura →
3) UX por ejercicio, agrupados por patrón (ver catálogo) → 4) pulido.**

Un slice válido:
- se completa en **un commit**, con cambios revisables (orientativo: ≤ 300 líneas),
- tiene **una skill responsable**,
- deja la app funcionando,
- tiene una definición de listo ejecutable (comandos de `quality-gates`),
- dice cómo revertirlo.

Si un ejercicio no tiene spec, el primer slice es generarla con
`cbt-exercise-ux-interpreter`. Las migraciones de datos son siempre
compatibles hacia atrás y van en su propio slice.

### Paso 5 — Escribir el informe
Archivo `docs/audit/<AAAA-MM-DD>-audit.md`:

```
# Auditoría <fecha>
## Resumen (5 líneas máx.)
## Inventario
## Brechas
| ID | Dimensión | Hallazgo | Evidencia | Sev | 
## Backlog de slices
| # | Slice | Skill | Depende de | Listo cuando | Reversión |
## Decisiones que necesitan al humano
## No verificado
```

### Paso 6 — Frenar
Entregá el informe y esperá. No empieces ningún slice sin aprobación.
Explicá en pocas líneas qué encontraste y por qué ese orden, y hacé 1-2
preguntas para chequear que la persona entendió la priorización.
