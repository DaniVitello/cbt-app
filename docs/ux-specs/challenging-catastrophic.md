# Spec UX: Desafiar pensamientos catastróficos

Fuente: PDF del ejercicio (PositivePsychology.com) — referencia; todo el texto reescrito.

## 1. Propósito

Desarmar la profecía de "siempre pasa lo peor": mirar la probabilidad real, los escenarios posibles y tu capacidad de afrontarlo, para llegar a una mirada más tranquila.

## 2. Mecanismo cognitivo

Descatastrofizar (probabilidad vs. capacidad de afrontamiento). Gemelo de "Descatastrofizar", con otro orden: acá primero el evento y su gravedad, después la probabilidad.

## 3. Cuándo lo usaría la persona

Hay algo concreto en el futuro que la tiene preocupada (una entrega, un estudio médico, una charla difícil) y la cabeza va directo al peor escenario.

## 4. Patrón de UX

Elegido: **Wizard** (6 pantallas). Secuencia dependiente: el escenario se entiende después de nombrar el evento, el afrontamiento después del peor caso.
Descartado: formulario largo de una pantalla (el PDF tiene 6 cajas; en celular sería un scroll ansioso).

## 5. Flujo pantalla por pantalla

| # | Título | Pregunta/acción (microcopy propio) | Campo y tipo | Obligatorio | Contexto que se muestra |
|---|---|---|---|---|---|
| 1 | El evento | ¿Qué te preocupa que pase? + ¿qué tan terrible sería? (1–10) | texto `event-description` + escala `awfulness-rating` 1–10 | No | — |
| 2 | Probabilidad | ¿Pasó antes? ¿Pasa seguido? ¿En qué te basás? | texto `likelihood-description` | No | Cita del evento |
| 3 | Escenarios | ¿Lo mejor que podría pasar? ¿Lo peor? | textos `best-case`, `worst-case` | No | Cita del evento |
| 4 | Afrontamiento | Si pasa lo peor, ¿cómo lo manejarías? ¿Quién te ayudaría? | texto `coping-description` | No | Cita del peor escenario |
| 5 | Voz amiga | ¿Qué le dirías a un amigo en esta situación? | texto `reassurance-description` | No | — (cambio de perspectiva a propósito) |
| 6 | Ahora | ¿Qué pensás habiendo visto el riesgo y tus recursos? | texto `reflection-description` | No | — (mirada fresca, sin anclas) |

## 6. Escalas y antes/después

`measure` global (`fear-likelihood` 0–100, antes/después). Convive con `awfulness-rating` 1–10 del paso 1 (ver §11: unificación de escalas).

## 7. Estados y casos borde

Primera vez / borrador / atrás / abandonar / repetir: estándar (nada obligatorio, borrador retomable). Ritmo: imaginar el peor escenario (paso 3) puede mover material difícil — el paso 5 (voz amiga) ya funciona como descompresión; no forzar orden ni obligar el paso 3 para avanzar.

## 7b. Datos y sesiones

Campos de estado del momento: ratings, probabilidad, escenarios, afrontamiento, reflexión. Nunca se precargan.
Campos de contenido reutilizable: `event-description` (kind `situation`) → `outputs: [{ fieldId: "event-description", kind: "situation" }]`, `next: ["decatastrophizing"]`. Es lo que viaja a la cadena 3 (allá se trabaja como "la catástrofe").
Qué muestra el historial de esta instancia: evento, probabilidad considerada, peor/mejor escenario, reflexión final y cambio de escala, con fecha, solo lectura.

## 8. Cierre

Resumen: tu miedo inicial → lo que viste (probabilidad + recursos) → tu mirada actual, con el cambio de escala. Link a la cadena 3 (`next`).

## 9. Mapeo al motor

Tipos existentes usados: `text`, `rating`. Medición global existente.
Deuda del motor: ninguna nueva para este slice.

## 10. Agregados de UX (no están en el PDF)

- Citas entre pasos (arrastrar contexto), salvo pasos 5–6 a propósito (cambio de aire).
- Cierre con resumen + escala antes/después.
- Ejemplo y propósito plegables (ya adoptado vía `help`).

## 11. Dudas abiertas

- Unificación 1–10 vs 0–100 (transversal, ver spec de thought-record).
- ¿El paso 3 (peor escenario) debería tener opción explícita de "saltear por ahora"? Hoy se puede dejar vacío y seguir; ¿alcanza o hay que mostrarlo?
