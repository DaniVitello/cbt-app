# Spec UX: Registro de pensamientos

Fuente: PDF del ejercicio (PositivePsychology.com) — referencia; todo el texto reescrito.

## 1. Propósito

Frenar en un momento de reacción desproporcionada y entender qué pasó: qué lo disparó, qué pensaste en automático, cuánto te pegó emocionalmente y cómo verlo de forma más equilibrada.

## 2. Mecanismo cognitivo

Identificar (disparador, pensamiento automático, emoción) + Cuestionar (nombrar el estilo de pensamiento) + Reestructurar (alternativa + re-puntuar). Es el ejercicio "navaja suiza": el más completo y el más largo.

## 3. Cuándo lo usaría la persona

Acaba de reaccionar fuerte a algo chico (un mensaje sin responder, un comentario seco) y siente que la reacción no matchea lo que pasó. Lo abre en caliente o un rato después.

## 4. Patrón de UX

Elegido: **Wizard** (6 pantallas, una tarea cognitiva por pantalla). Cada paso depende del anterior (el pensamiento sale del disparador, la alternativa sale del pensamiento). Es el default y acá aplica de manual.
Descartado: Entradas repetibles (no hay casos paralelos; es un solo episodio).

## 5. Flujo pantalla por pantalla

| # | Título | Pregunta/acción (microcopy propio) | Campo y tipo | Obligatorio | Contexto que se muestra |
|---|---|---|---|---|---|
| 1 | Pausa | ¿Qué te hizo frenar? | texto `pause-description` | No | — |
| 2 | El disparador | ¿Quién o qué fue? ¿Cuándo, dónde, por qué? | texto `trigger-description` | No | — |
| 3 | Pensamiento automático | ¿Qué se te cruzó por la cabeza ni bien pasó? | texto `thoughts-description` | No | Cita del disparador (paso 2) |
| 4 | Tu emoción | ¿Qué sentís y del 1 al 10 cuánto? | texto `emotions-description` + escala `emotions-rating` 1–10 | No | Cita del pensamiento (paso 3) |
| 5 | Otra mirada | ¿Cómo se vería esto con ojos más tranquilos? | texto `alternative-description` | No | Cita del pensamiento original |
| 6 | Re-puntuá | ¿Y ahora, del 1 al 10? | escala `rerating` 1–10 | No | Valor inicial (paso 4) al lado |

## 6. Escalas y antes/después

`emotions-rating` (paso 4) vs `rerating` (paso 6), 1–10. Al cerrar se muestran juntas ("Antes 8 → Ahora 4", lenguaje neutral). Nota: es escala 1–10 conviviendo con el 0–100 de otros ejercicios (ver §11).

## 7. Estados y casos borde

Primera vez: ayuda plegable con ejemplo. Borrador a medias: se retoma donde quedó (autoguardado). Volver atrás: sin perder datos. Abandonar: queda borrador, sin culpa. Repetir: instancia nueva en blanco (ver §7b). Ritmo: el paso 1 (Pausa) ya es suave por diseño; ningún campo es obligatorio.

## 7b. Datos y sesiones

Campos de estado del momento: todos (`pause/trigger/thoughts/emotions/emotions-rating/alternative/rerating`). Nunca se precargan en una instancia nueva.
Campos de contenido reutilizable: `thoughts-description` (kind `thought`) → `outputs: [{ fieldId: "thoughts-description", kind: "thought" }]`, `next: ["cognitive-restructuring"]`. Se ofrece solo vía cadena explícita (link con `?source=`), nunca automático.
Qué muestra el historial de esta instancia: disparador, pensamiento, emoción antes/después y alternativa, con fecha, solo lectura.

## 8. Cierre

Resumen: tu pensamiento original → tu alternativa, con el cambio de escala. Sin felicitaciones infladas ni interpretación ("Antes 8 → Ahora 4", punto).

## 9. Mapeo al motor

Tipos existentes usados: `text`, `rating`. Nada más hace falta para este slice.
Deuda del motor: **selección de estilo de pensamiento** — el PDF lista 9 estilos (todo o nada, personalización…) y hoy ningún campo los captura. Requiere `choice` (única o múltiple con límite) + lista cerrada de estilos. No bloquear cadena 2 por esto: va como mejora con su propio slice.

## 10. Agregados de UX (no están en el PDF)

- Escala repetida al final con el valor inicial visible (antes/después).
- Citas del paso anterior arriba de cada pantalla (arrastrar contexto).
- Cierre con resumen pensamiento → alternativa.
- Ejemplo y propósito plegables (ya adoptado vía `help`).

## 11. Dudas abiertas

- ¿Unificamos 1–10 vs 0–100 en un mismo componente de escala? (Transversal: afecta a todos; decidir una vez.)
- ¿La lista de estilos de pensamiento es cerrada (la del PDF) o la persona puede escribir el suyo? Define el tipo de campo de la deuda.
