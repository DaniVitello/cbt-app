# Spec UX: Reestructuración cognitiva de un evento

Fuente: PDF del ejercicio (PositivePsychology.com) — referencia; todo el texto reescrito.

## 1. Propósito

Agarrar algo que ya pasó y te sigue dando vueltas, y cambiar el pensamiento más duro por una mirada más equilibrada (o por aceptar lo que fue).

## 2. Mecanismo cognitivo

Reestructurar / re-etiquetar. No se discute si el evento pasó: se trabaja la interpretación.

## 3. Cuándo lo usaría la persona

Viene de la cadena (terminó el registro de pensamientos) o entra directo con un evento puntual dando vueltas en la cabeza ("lo de la reunión de ayer").

## 4. Patrón de UX

Elegido: **Wizard** (3 pantallas: evento → pensamiento → reformulación). Cadena corta y dependiente; un evento por instancia en este slice.
Descartado: Entradas repetibles (trabajar varios eventos sin salir). Tiene sentido a futuro pero pide tipo repetible + UI de lista; va a deuda, no bloquea la cadena 2.

## 5. Flujo pantalla por pantalla

| # | Título | Pregunta/acción (microcopy propio) | Campo y tipo | Obligatorio | Contexto que se muestra |
|---|---|---|---|---|---|
| 1 | El evento | ¿Qué pasó y te sigue afectando? | texto `event-description` | No | Si viene de la cadena: nada (el evento lo escribe acá; lo que viaja es el pensamiento, ver §7b) |
| 2 | Tu pensamiento | ¿Qué te decís sobre lo que pasó? | texto `thoughts-description` | No | Cita del evento (paso 1) |
| 3 | Otra versión | ¿Cómo se vería con ojos más justos? | texto `restructure-description` | No | Cita del pensamiento (paso 2) |

## 6. Escalas y antes/después

`measure` global (`thought-strength` 0–100, antes/después). Al cerrar: antes → ahora junto al resumen.

## 7. Estados y casos borde

Primera vez / borrador / atrás / abandonar / repetir: igual que el resto (borrador retomable, nada obligatorio, instancia nueva en blanco). Sin contenido sensible que exija ritmo especial más allá del tono cálido habitual.

## 7b. Datos y sesiones

Campos de estado del momento: `event-description`, `thoughts-description` y la escala. Nunca se precargan salvo cadena explícita.
Campos de contenido reutilizable: ninguno hacia afuera (es el final de la cadena 2). Hacia adentro: `accepts: [{ kind: "thought", intoFieldId: "thoughts-description" }]` — el pensamiento automático del registro se ofrece como punto de partida del paso 2, editable. El evento (paso 1) siempre lo escribe la persona (es contexto nuevo, no viaja).
Qué muestra el historial de esta instancia: evento, pensamiento, reformulación y cambio de escala, con fecha, solo lectura.

## 8. Cierre

Resumen: evento → pensamiento → tu versión reformulada, con el cambio de escala. Sugerencia de cierre de cadena (sin `next` propio por ahora).

## 9. Mapeo al motor

Tipos existentes usados: `text`. Medición global existente.
Deuda del motor: **entradas repetibles** (varios eventos por instancia) — solo si se decide evolucionar el ejercicio; fuera de la cadena 2.

## 10. Agregados de UX (no están en el PDF)

- Precarga del pensamiento vía cadena (agregado de producto, explícito y editable).
- Citas entre pasos y cierre con resumen (mismo lenguaje que el resto).
- Ejemplo y propósito plegables (ya adoptado vía `help`).

## 11. Dudas abiertas

- Si a futuro se acepta repetir eventos: ¿cada evento es una instancia nueva o una entrada repetible dentro de la misma? Cambia el modelo de datos, no solo la UI.
