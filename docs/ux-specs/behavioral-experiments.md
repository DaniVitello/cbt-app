# Spec UX: Experimentos conductuales

Fuente: PDF del ejercicio (PositivePsychology.com) — referencia; todo el texto reescrito.

## 1. Propósito

Convertir una creencia en algo que se puede probar en la vida real: la escribís, derivás una alternativa, diseñás un experimento, lo hacés y comparás qué pasó contra lo que esperabas.

## 2. Mecanismo cognitivo

Testear (hipótesis → acción → resultado). Es el único ejercicio que sale de la pantalla a la vida: el "laboratorio" es el mundo real.

## 3. Cuándo lo usaría la persona

Viene de la cadena (ya formuló la creencia a probar) o entra con una creencia que quiere desafiar con hechos ("si pido ayuda me toman por menos capaz").

## 4. Patrón de UX

Elegido (este slice): **Wizard** (6 pantallas: creencia → alternativa → diseño → ejecución → observaciones → reflexión). Permite diseñar y registrar en una sentada, o dejar borrador y volver.
Descartado (por ahora): **Proceso en el tiempo** — el ejercicio real se completa en días (diseñás hoy, lo hacés mañana, registrás después) con estado "en curso", pausa y retomar. Es el patrón correcto a largo plazo pero pide: estado de instancia `in_progress` (hoy el server solo acepta `draft`/`completed`), UI de retomar y motor de borradores con recordatorio. Va a deuda como evolución, no bloquea la cadena 3.

## 5. Flujo pantalla por pantalla

| # | Título | Pregunta/acción (microcopy propio) | Campo y tipo | Obligatorio | Contexto que se muestra |
|---|---|---|---|---|---|
| 1 | La creencia | ¿Qué creencia querés poner a prueba? + ¿qué tan fuerte creés que va a pasar? (0–100%) | texto `original-belief` + escala `original-belief-rating` | No | Si viene de la cadena: precarga (editable) |
| 2 | La alternativa | ¿Qué creencia alternativa sale de esta? + ¿qué tan fuerte? (0–100%) | texto `alternative-belief` + escala `alternative-belief-rating` | No | Cita de la creencia original |
| 3 | El diseño | ¿Qué tendría que pasar para probarla? ¿Adónde ir, qué hacer, qué mirar? | texto `experiment-description` | No | Cita de la alternativa |
| 4 | La prueba | ¿Qué pasó cuando lo hiciste? | texto `carrying-out-description` | No | Cita del diseño (qué habías planeado) |
| 5 | Observaciones | ¿Qué notaste durante el experimento? | texto `observations-description` | No | — |
| 6 | Reflexión | ¿Cómo quedó la creencia original frente a la alternativa? + ¿qué tan fuerte creés ahora en la original? (0–100%) | texto `reflection-description` + escala `results-rating` | No | Las tres escalas juntas (ver §6) |

## 6. Escalas y antes/después

Tres % encadenados: original (paso 1) → alternativa (paso 2) → original-revisada (paso 6). Al cerrar se muestran los tres juntos: es LA devolución del ejercicio (el experimento movió o no la aguja). Sin `measure` global: las escalas internas ya cubren el antes/después.

## 7. Estados y casos borde

Primera vez: ayuda con ejemplo completo (diseño → resultado). Borrador a medias: CRÍTICO acá — el borrador es el estado natural entre "diseñé" y "lo hice" (días después); retomar muestra el diseño citado. Abandonar el experimento en la vida real: el borrador queda, sin culpa, y se puede completar igual con "no lo hice, esto aprendí" (el paso 6 lo admite). Repetir: instancia nueva en blanco.

## 7b. Datos y sesiones

Campos de estado del momento: todo (creencias, ratings, diseño, resultados). Nunca se precargan salvo cadena explícita.
Hacia adentro: `accepts: [{ kind: "belief", intoFieldId: "original-belief" }]` — la catástrofe formulada del ejercicio anterior como creencia a probar, editable.
Hacia afuera: ninguno (final de la cadena 3).
Qué muestra el historial de esta instancia: creencia, alternativa, diseño, resultado, reflexión y los tres %, con fecha, solo lectura.

## 8. Cierre

Resumen: creencia → alternativa → qué hiciste → qué pasó → dónde quedó la aguja (tres %). Cierre de cadena (sin `next` propio).

## 9. Mapeo al motor

Tipos existentes usados: `text`, `rating`.
Deuda del motor:
1. **Estado de instancia `in_progress`** (proceso en el tiempo): server (status + endpoints), cliente (retomar con el diseño citado) y regla de negocio (qué pasa con un experimento "en curso" de hace 30 días). Es la evolución natural de este ejercicio.
2. **Entradas repetibles** (varios experimentos por instancia): solo si se decide; por ahora un experimento = una instancia.

## 10. Agregados de UX (no están en el PDF)

- Precarga de la creencia vía cadena (explícita, editable).
- Las tres escalas juntas al cerrar (la devolución central).
- Citas entre pasos (diseño citado en la ejecución).
- Ejemplo y propósito plegables (ya adoptado vía `help`).

## 11. Dudas abiertas

- Cuando exista `in_progress`: ¿un experimento en curso aparece en la daily task del MVP 3 ("¿hiciste tu experimento?")? Conectar ahora sería adivinar; anotado para el MVP 3.
- ¿El paso 4 debería ofrecer "todavía no lo hice" como estado explícito (distinto de vacío)? Cambia el modelo: por ahora el vacío lo absorbe.
