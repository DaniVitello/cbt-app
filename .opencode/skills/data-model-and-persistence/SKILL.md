---
name: data-model-and-persistence
description: Diseña e implementa cómo se guardan, leen, versionan, exportan y borran los datos de los ejercicios CBT (esquema SQLite, API, validación, migraciones, autoguardado, caché del cliente), con la regla de que cada ejecución de un ejercicio es una instancia independiente y que el estado del momento no se reinyecta. Usala SIEMPRE que se toque el backend, la base de datos, los endpoints, el guardado automático, el historial, la exportación, el borrado o cualquier cosa que persista respuestas, y cuando una spec de UX tenga la sección "7b. Datos y sesiones", aunque el usuario solo diga "guardá", "persistí" o "historial".
---

# Modelo de datos y persistencia

## Entrada y salida
- **Entrada:** sección 7b y 9 de la spec en `docs/ux-specs/<ejercicio>.md`, el
  esquema actual y el informe de `audit-and-migrate`.
- **Salida:** cambios de datos/API en un slice chico, con migración,
  validación y tests. Si la spec no tiene 7b, **preguntá** antes de decidir
  qué es estado del momento y qué es reutilizable.

## Reglas de producto (mandan sobre las técnicas)
1. **Instancia independiente.** Cada vez que se hace un ejercicio se crea
   una instancia nueva, vacía.
2. **Estado del momento nunca se reinyecta** en una instancia nueva
   (emociones, intensidades, creencias puntuadas). Se persiste como historial
   de esa instancia, pero no se precarga ni se compara por defecto.
3. **Contenido reutilizable** solo se ofrece retomar de forma opcional y
   explícita, copiándolo a la instancia nueva (no enlazándolo: editar la
   nueva no cambia la vieja).
4. El antes/después se **calcula** dentro de la instancia; no se almacena
   como dato derivado.
5. Borrar es borrar de verdad (sin papelera ni copias ocultas) y exportar
   entrega todo lo que hay.

## Modelo base (adaptar al existente, no reescribir sin necesidad)
`entries`: `id` (uuid), `exercise_id`, `exercise_version`, `status`
(`draft` | `in_progress` | `completed`), `answers` (JSON por `id` de campo),
`version` (entero para concurrencia), `started_at`, `updated_at`,
`completed_at`.

- **Los `id` de campo son un contrato.** Las respuestas dependen de ellos.
  Cambiar un `id` o el significado de un campo exige subir
  `exercise_version` y una migración de respuestas guardadas.
- Guardá solo lo que la persona escribió o eligió. Nada de estado de UI,
  scroll ni cálculos.

## Validación (fuente única de verdad)
Derivá los validadores (zod) **desde la definición del ejercicio**, no a
mano por separado. Si la definición cambia, la validación cambia con ella.
Validá en el servidor siempre; el cliente valida para UX, no para seguridad.

## Autoguardado y concurrencia
- Guardado con debounce desde el cliente; actualización parcial e
  idempotente (`PATCH`).
- Control optimista: el cliente envía el `version` que vio; si no coincide,
  el servidor responde 409 y la UI ofrece reconciliar. Evita pisar datos
  con dos pestañas abiertas.
- La UI muestra estado: guardando / guardado / error al guardar (con
  reintento) y no pierde lo escrito si falla.

## API
- Recursos: `GET/POST /api/entries`, `GET/PATCH/DELETE /api/entries/:id`,
  `GET /api/entries/export`, `GET /api/health`.
- Formato de error único `{ error: { code, message } }`, códigos HTTP
  correctos (400 validación, 404, 409 conflicto).
- Escuchar solo en `127.0.0.1`. Sin CORS abierto.

## SQLite
- Migraciones numeradas y versionadas (archivos SQL secuenciales +
  `PRAGMA user_version`), nunca editar una migración ya aplicada.
- `PRAGMA foreign_keys = ON` y modo WAL. Consultas parametrizadas siempre.
- Archivo de base y backups en `.gitignore`. Nunca commitear datos.
- Antes de una migración destructiva: copia de seguridad automática y prueba
  de la migración sobre una copia.

## Privacidad
- **No loguear respuestas.** Los logs registran ids, rutas y códigos, no
  contenido. Redactar cualquier cuerpo de request en errores.
- Sin analytics ni servicios de terceros que reciban respuestas.
- Si algún día se despliega fuera de la máquina local: autenticación y
  cifrado en tránsito **antes**; decisión del humano, no de la skill.

## Cliente (React Query)
- Claves de caché por recurso (`['entries', exerciseId]`). Invalidar al
  mutar. Actualización optimista solo en autoguardado, con rollback.

## Listo cuando (ejecutar con `quality-gates`)
- Tests de API con base temporal: crear, leer, parchear, conflicto 409,
  borrar, exportar.
- Test de migración sobre una base de ejemplo con datos de la versión anterior.
- Test de que una instancia nueva no hereda estado del momento.
- Revisión: ningún log contiene respuestas; `.gitignore` cubre la base.
- Explicá en pocas líneas qué decidiste y por qué, y hacé 1-2 preguntas de
  chequeo antes de proponer el commit.
