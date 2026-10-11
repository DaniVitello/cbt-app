---
name: cbt-exercise-ux-interpreter
description: Interpreta un ejercicio de terapia cognitivo-conductual (PDF o su transcripción) y lo convierte en una ESPECIFICACIÓN DE UX/UI (no en código) pensada para la mejor experiencia de la persona que lo resuelve. Usala SIEMPRE que el usuario pida analizar, interpretar, rediseñar, mejorar o agregar un ejercicio/worksheet de los PDFs, decidir cómo presentarlo en pantalla (pasos, campos, escalas, flujo), o revisar si la UI actual de un ejercicio sirve a su objetivo cognitivo, aunque no mencione la palabra "skill" ni "UX". No escribe código de implementación: eso lo hacen otras skills.
---

# Intérprete UX de ejercicios CBT

## Para qué existe esta skill

Cada PDF es un ejercicio pensado para PAPEL. Su objetivo real es guiar a la
persona a **cuestionar, reestructurar y re-etiquetar** pensamientos y
creencias que la autoboicotean. Tu trabajo es entender ese objetivo y
diseñar la mejor forma de lograrlo en pantalla. **Copiar el layout del PDF
casi nunca es la respuesta**: una tabla de 7 columnas funciona en una hoja
y es un mal formulario en un celular.

Producís una **spec de UX** (documento). No escribís componentes, rutas ni
estilos. Eso se delega a las skills de código.

## Reglas duras

1. **Spec, no código.** Salida = un archivo markdown con la plantilla de abajo.
2. **Copyright:** los PDFs son de PositivePsychology.com. Nunca copies
   párrafos ni listas largas. Todo el microcopy (títulos, preguntas, ayudas)
   se reescribe con palabras propias, más cortas y más cálidas. Podés
   mencionar la fuente en metadatos.
3. **Herramienta de registro, no clínica.** No diagnostiques, no interpretes
   clínicamente las respuestas, no prometas resultados. Si el flujo puede
   remover material difícil (recordar una situación dolorosa, imaginar el
   peor caso), diseñá con ritmo suave: pausa, saltear, volver después.
4. **Privacidad:** son datos sensibles. Nada de analytics ni envío de
   respuestas a terceros en el diseño.
5. **No inventes contenido terapéutico.** Si el PDF no dice algo, no lo
   agregues como si fuera parte del ejercicio. Las mejoras de UX (recordar
   respuestas anteriores, mostrar cambio de escala) se marcan como
   "agregado de UX", separadas del contenido del ejercicio.
6. Si algo es ambiguo y cambia el diseño, preguntá (máx. 2 preguntas).
   Si no, decidí y justificá.

## Proceso (seguilo en orden)

### Paso 1 — Leer y extraer
De la transcripción sacá: título, objetivo declarado, orden de las
secciones, cada pregunta/consigna, escalas (0-100, 1-10), ejemplos
resueltos, listas de opciones, y qué es contenido de ayuda vs. lo que la
persona tiene que completar. Si la transcripción perdió estructura
(tablas, escalas, casillas), decilo y no adivines en silencio.

### Paso 2 — Entender el mecanismo cognitivo
En 1-3 líneas: ¿qué hace la persona con su mente en este ejercicio?
Clasificá en uno o más:
- **Identificar** (detectar pensamiento, creencia, regla, distorsión)
- **Cuestionar** (evidencia a favor/en contra, probabilidad, utilidad)
- **Reestructurar / re-etiquetar** (pensamiento alternativo, nombrar la distorsión)
- **Descatastrofizar** (probabilidad vs. capacidad de afrontamiento)
- **Testear** (experimento conductual: hipótesis → acción → resultado)
- **Planificar** (objetivo, acciones, evaluación)
- **Recursos** (fortalezas, apoyos, experiencias pasadas)
- **Regulación corporal** (guion guiado, no formulario)

El mecanismo decide el flujo. Ejemplo: si el mecanismo es medir el cambio
(creencia 80% → 40%), la escala se muestra al principio y al final, juntas.

### Paso 3 — Elegir el patrón de UX
Elegí UN patrón principal y nombrá la alternativa descartada y por qué.

| Patrón | Cuándo |
|---|---|
| **Wizard** (1 idea por pantalla) | Secuencia donde cada paso depende del anterior. Default para la mayoría. |
| **Entradas repetibles** (una "tarjeta" por caso) | El PDF es una tabla: cada fila es un caso completo. En pantalla: una tarjeta o mini-wizard por fila, no una grilla ancha. |
| **Cadena dinámica** | Cada respuesta genera la siguiente pregunta (flecha descendente). |
| **Grupo de tarjetas** | Varios bloques paralelos iguales (ej. 3 creencias con 3 razones cada una). |
| **Selección + elaboración** | Primero elegir de una lista, después trabajar sobre lo elegido. |
| **Reproductor guiado** | Contenido de solo lectura que se recorre por pasos (relajación), con ritmo propio. |
| **Proceso en el tiempo** | El ejercicio se completa en días (experimento): permite pausar y retomar con estado intermedio. |

### Paso 4 — Aplicar los principios de UX
- **Una tarea cognitiva por pantalla.** Pensar y llenar campos son cosas distintas; no pidas ambas a la vez.
- **Arrastrar contexto:** si en el paso 1 escribió un pensamiento, mostralo (citado, arriba) en los pasos siguientes. Nadie debería releer ni copiar a mano.
- **Antes/después visible:** si hay escala, guardá el valor inicial y mostrá el cambio al final. Es la devolución más valiosa del ejercicio.
- **Ejemplos y ayudas plegables,** nunca bloqueando el campo. Un buen ejemplo reduce la hoja en blanco.
- **Divulgación progresiva:** consignas largas del PDF → pregunta corta + "¿Necesitás una pista?".
- **Tono:** cálido, concreto, sin juicio ni jerga clínica. Preguntas, no órdenes. Evitar "deberías", "error", "irracional" dirigido a la persona (hablar de "pensamiento", no de "vos").
- **Control:** volver atrás sin perder datos, guardar borrador automático, terminar después, saltear lo no obligatorio, nunca castigar con validaciones duras un campo emocional.
- **Cierre con sentido:** al terminar, mostrar un resumen de lo que escribió (su pensamiento original → su alternativa) y el cambio de escala. Sin felicitaciones infladas ni interpretación.
- **Cada vez que se hace un ejercicio es una instancia nueva e independiente.**
  Empieza en blanco. Clasificá cada campo en una de dos categorías:
  - *Estado del momento* (emociones, escalas de creencia o intensidad,
    "cómo me siento"): nunca se precarga en una instancia nueva ni se
    compara por defecto con instancias anteriores.
  - *Contenido reutilizable* (una creencia en la que sigue trabajando,
    una regla interna): se puede ofrecer retomarlo, siempre opcional y
    explícito.
  El antes/después se calcula solo dentro de la misma instancia. Las
  instancias anteriores se ven en el historial, con fecha y en solo
  lectura. Comparar evolución entre instancias es una vista que la persona
  elige abrir, sin interpretación. Se puede borrar una instancia completa.
- **Carga cognitiva:** si un ejercicio tiene más de ~6-7 pantallas, agrupar o aclarar el progreso ("paso 3 de 6").
- **Accesibilidad:** una pregunta = un `label`; escalas operables por teclado y con texto, no solo color; no depender de arrastrar; mensajes de estado anunciables; respetar reducción de movimiento.

### Paso 5 — Mapear al motor del proyecto
Antes de proponer campos, **leé los tipos reales del proyecto** (carpeta de
tipos/datos del motor de ejercicios) y usá los tipos de campo que ya
existen. Si el diseño necesita algo que el motor no tiene (selección
múltiple con límite, cadena dinámica, grupo, contenido de solo lectura,
estado "en curso"), **no lo implementes ni lo asumas**: listalo en la
sección "Deuda del motor" de la spec, con por qué hace falta.

### Paso 6 — Escribir la spec
Un archivo por ejercicio en `docs/ux-specs/<id-del-ejercicio>.md` (o la
carpeta que el proyecto indique) con esta plantilla exacta:

```
# Spec UX: <nombre del ejercicio>
Fuente: <PDF> (referencia, texto reescrito)

## 1. Propósito
<1-2 líneas, palabras propias: qué le permite lograr a la persona>

## 2. Mecanismo cognitivo
<categorías del Paso 2 + una línea de por qué>

## 3. Cuándo lo usaría la persona
<situación disparadora, en lenguaje cotidiano>

## 4. Patrón de UX
Elegido: <patrón> — por qué.
Descartado: <patrón> — por qué no.

## 5. Flujo pantalla por pantalla
| # | Título | Pregunta/acción (microcopy propio) | Campo y tipo | Obligatorio | Contexto que se muestra |

## 6. Escalas y antes/después
<qué se mide, cuándo, cómo se muestra el cambio>

## 7. Estados y casos borde
<primera vez, borrador a medias, volver atrás, abandonar, repetir el ejercicio>

## 7b. Datos y sesiones
Campos de estado del momento: ...
Campos de contenido reutilizable (y cómo se ofrece retomarlos): ...
Qué muestra el historial de esta instancia: ...

## 8. Cierre
<qué ve la persona al terminar>

## 9. Mapeo al motor
Tipos existentes usados: ...
Deuda del motor (tipos/comportamientos nuevos): ...

## 10. Agregados de UX (no están en el PDF)
<lista corta, para que la persona/el equipo los apruebe>

## 11. Dudas abiertas
```

### Paso 7 — Autochequeo antes de entregar
- ¿Alguien que no vio el PDF entiende qué está haciendo y por qué?
- ¿Cada pantalla pide UNA cosa?
- ¿El flujo se puede hacer en celular sin una grilla ancha?
- ¿Hay texto copiado del PDF? (reescribir)
- ¿Separé lo que es del ejercicio de lo que agregué yo?
- ¿Marqué la deuda del motor en vez de asumirla?

## Referencias
- `references/pdf-catalog.md`: clasificación de los 15 ejercicios (mecanismo y patrón sugerido). Leela cuando el ejercicio sea uno de esos, como punto de partida, no como verdad: confirmá contra la transcripción.

## Después de esta skill
Entregá la spec y frená. El que implementa es otro paso: `data-model-and-persistence` toma la sección 7b y `frontend-architecture-and-ui` toma las secciones 4-6 y 9. No empieces a codear.
