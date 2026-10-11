# Spec UX: Descatastrofizar

Fuente: PDF del ejercicio (PositivePsychology.com) — referencia; todo el texto reescrito.

## 1. Propósito

Bajarle el tono al "¿y si sale todo mal?": poner el miedo en palabras precisas, mirar la probabilidad real y comprobar que, aunque pase lo peor, podrías afrontarlo.

## 2. Mecanismo cognitivo

Descatastrofizar (probabilidad vs. capacidad de afrontamiento). Espejo del anterior con otro orden: acá primero la predicción concreta y su probabilidad, después el impacto.

## 3. Cuándo lo usaría la persona

Viene de la cadena (ya nombró el evento en el ejercicio anterior) o entra directo con una catástrofe dando vueltas ("no voy a conseguir el trabajo").

## 4. Patrón de UX

Elegido: **Wizard** (5 pantallas). La secuencia es el tratamiento: precisión → probabilidad → impacto → afrontamiento → alivio. Alterar el orden rompería el mecanismo.
Descartado: atajos ("ir directo al afrontamiento") — saltear la probabilidad es saltear la terapia.

## 5. Flujo pantalla por pantalla

| # | Título | Pregunta/acción (microcopy propio) | Campo y tipo | Obligatorio | Contexto que se muestra |
|---|---|---|---|---|---|
| 1 | La catástrofe | ¿Qué imaginás que va a pasar, en una frase concreta (sin "¿y si…?")? + ¿qué tan terrible sería? (0–100%) | texto `catastrophe-description` + escala `catastrophe-rating` 0–100 | No | Si viene de la cadena: precarga del evento (editable) |
| 2 | Probabilidad | ¿Pasó antes? ¿Cada cuánto pasa en la vida real? | texto `likelihood-description` | No | Cita de la catástrofe (paso 1) |
| 3 | Impacto real | ¿Lo peor? ¿Lo mejor? ¿Qué te diría un amigo? | textos `worst-case`, `best-case`, `friend-perspective` | No | Cita de la catástrofe |
| 4 | Afrontamiento | Si pasa lo peor, ¿qué recursos tenés? ¿Qué hiciste otras veces? | texto `coping-description` | No | Cita del peor escenario |
| 5 | Alivio | ¿Qué te gustaría escuchar para sentirte mejor? + ¿qué tan terrible sería ahora? (0–100%) | texto `reassurance-description` + escala `reassurance-rating` 0–100 | No | — (cierre limpio) |

## 6. Escalas y antes/después

Triple medición coherente (todo 0–100): `measure` global (`catastrophe-likelihood`) + `catastrophe-rating` (paso 1) vs `reassurance-rating` (paso 5). Al cerrar: las tres visibles — la global y el par interno.

## 7. Estados y casos borde

Primera vez / borrador / atrás / abandonar / repetir: estándar. Ritmo suave obligatorio: el paso 1 pide formular el miedo y el 3 imaginar lo peor — campos nunca obligatorios, ayuda plegable con ejemplo concreto, y el paso 5 existe como salida amable. Si la persona entra en caliente desde la cadena, el paso 1 ya viene con texto (precarga) y puede solo leerlo.

## 7b. Datos y sesiones

Campos de estado del momento: ratings, probabilidad, impacto, afrontamiento, alivio. Nunca se precargan salvo cadena explícita.
Hacia adentro: `accepts: [{ kind: "situation", intoFieldId: "catastrophe-description" }]` — el evento del ejercicio anterior como punto de partida editable.
Hacia afuera (contenido reutilizable): `catastrophe-description` (kind `belief`: la predicción ya formulada es la creencia a poner a prueba) → `outputs: [{ fieldId: "catastrophe-description", kind: "belief" }]`, `next: ["behavioral-experiments"]`.
Qué muestra el historial de esta instancia: catástrofe, probabilidad, peor/mejor caso, afrontamiento, alivio y las tres escalas, con fecha, solo lectura.

## 8. Cierre

Resumen: tu catástrofe → su probabilidad → tus recursos → tu alivio, con escalas. Link a la cadena 3 (`next`).

## 9. Mapeo al motor

Tipos existentes usados: `text`, `rating`. Medición global existente.
Deuda del motor: ninguna nueva para este slice.

## 10. Agregados de UX (no están en el PDF)

- Precarga del evento vía cadena (explícita, editable).
- Escala de "terrible" repetida al final con el valor inicial al lado.
- Citas entre pasos y cierre con resumen.
- Ejemplo y propósito plegables (ya adoptado vía `help`).

## 11. Dudas abiertas

- La regla "predicción concreta, sin ¿y si…?" hoy es microcopy; ¿alguna vez debería validarse (detectar "¿y si" y sugerir reformular)? Riesgo de sobre-ingeniería: por ahora no.
