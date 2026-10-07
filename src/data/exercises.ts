import type { Exercise } from "../types/exercise";

export const exercises: Exercise[] = [
  {
    id: "problem-solving",
    title: "Resolución de problemas",
    description:
      "Un enfoque estructurado para identificar un problema, definir un objetivo, explorar lo que ya intentaste y evaluar los resultados.",
    sections: [
      {
        id: "problem",
        title: "El problema",
        fields: [
          {
            type: "text",
            id: "problem-description",
            label: "Describí el problema que estás enfrentando",
            placeholder: "¿Qué está pasando? ¿Quién está involucrado? ¿Dónde ocurre?",
          },
        ],
      },
      {
        id: "goal",
        title: "Tu objetivo",
        fields: [
          {
            type: "text",
            id: "goal-description",
            label: "¿Qué te gustaría que pasara?",
            placeholder: "¿Cuál sería el resultado ideal?",
          },
        ],
      },
      {
        id: "attempts",
        title: "Lo que ya intentaste",
        fields: [
          {
            type: "text",
            id: "attempts-description",
            label: "¿Qué cosas probaste hasta ahora para resolver el problema?",
            placeholder: "Sé específico: pensamientos, acciones, estrategias.",
          },
        ],
      },
      {
        id: "outcome",
        title: "El resultado",
        fields: [
          {
            type: "text",
            id: "outcome-description",
            label: "¿Qué pasó cuando intentaste resolverlo?",
            placeholder: "¿Cómo te sentiste? ¿Qué aprendiste?",
          },
        ],
      },
    ],
  },
  {
    id: "decatastrophizing",
    title: "Descatastrofizar",
    description:
      "Explorar la realidad de una situación que te preocupa, en lugar de dejarte llevar por pensamientos catastróficos.",
    sections: [
      {
        id: "catastrophe",
        title: "La catástrofe",
        fields: [
          {
            type: "text",
            id: "catastrophe-description",
            label: "¿Qué es lo que más te preocupa que pueda pasar?",
            placeholder: "Escribílo con precisión, sin usar '¿y si...?'",
          },
          {
            type: "rating",
            id: "catastrophe-rating",
            label: "¿Qué tan terrible creés que sería? (0-100%)",
            min: 0,
            max: 100,
          },
        ],
      },
      {
        id: "likelihood",
        title: "La probabilidad",
        fields: [
          {
            type: "text",
            id: "likelihood-description",
            label: "¿Cuál es la probabilidad real de que esto pase?",
            placeholder: "¿Algo similar pasó antes? ¿Con qué frecuencia?",
          },
        ],
      },
      {
        id: "impact",
        title: "Qué tan terrible sería",
        fields: [
          {
            type: "text",
            id: "worst-case",
            label: "¿Cuál sería el peor escenario posible?",
            placeholder: "Si lo peor pasara, ¿qué pasaría exactamente?",
          },
          {
            type: "text",
            id: "best-case",
            label: "¿Cuál sería el mejor escenario posible?",
            placeholder: "¿Qué es lo mejor que podría pasar?",
          },
        ],
      },
      {
        id: "coping",
        title: "Cómo lo afrontarías",
        fields: [
          {
            type: "text",
            id: "coping-description",
            label: "Si lo peor pasara, ¿cómo lo manejarías?",
            placeholder: "¿Qué recursos tenés? ¿Quién te podría ayudar?",
          },
        ],
      },
      {
        id: "reassurance",
        title: "Qué te dirías a vos mismo",
        fields: [
          {
            type: "text",
            id: "reassurance-description",
            label: "¿Qué te dirías para sentirte mejor?",
            placeholder: "¿Qué le dirías a un amigo en la misma situación?",
          },
          {
            type: "rating",
            id: "reassurance-rating",
            label: "Ahora, ¿qué tan terrible creés que sería? (0-100%)",
            min: 0,
            max: 100,
          },
        ],
      },
    ],
  },
  {
    id: "rabbit-hole",
    title: "Reverse el agujero del conejo",
    description:
      "Cuando la ansiedad te lleva a imaginar escenarios negativos, intenta revertir el proceso: para cada resultado negativo, encontrá uno positivo igual de plausible.",
    sections: [
      {
        id: "outcomes",
        title: "Resultados",
        fields: [
          {
            type: "rows",
            id: "outcomes-table",
            label: "Escribí un resultado negativo y uno positivo para cada fila",
            columns: [
              {
                type: "text",
                id: "negative",
                label: "Resultado negativo",
              },
              {
                type: "text",
                id: "positive",
                label: "Resultado positivo",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "core-beliefs-suitcases",
    title: "Creencias fundamentales",
    description:
      "Identificá tres creencias fundamentales que te gustaría cuestionar y encontrá razones por las que no son necesariamente ciertas.",
    sections: [
      {
        id: "beliefs",
        title: "Tus creencias",
        fields: [
          {
            type: "group",
            id: "core-beliefs",
            label: "Escribí tres creencias y tres razones por las que cada una podría no ser cierta",
            groups: [
              {
                id: "belief-1",
                label: "Creencia 1",
                fields: [
                  {
                    type: "text",
                    id: "belief",
                    label: "La creencia",
                    placeholder: "Ej: 'No soy suficientemente bueno'",
                  },
                  {
                    type: "text",
                    id: "reason-1",
                    label: "Razón 1 por la que podría no ser cierta",
                  },
                  {
                    type: "text",
                    id: "reason-2",
                    label: "Razón 2 por la que podría no ser cierta",
                  },
                  {
                    type: "text",
                    id: "reason-3",
                    label: "Razón 3 por la que podría no ser cierta",
                  },
                ],
              },
              {
                id: "belief-2",
                label: "Creencia 2",
                fields: [
                  {
                    type: "text",
                    id: "belief",
                    label: "La creencia",
                    placeholder: "Ej: 'Siempre voy a fracasar'",
                  },
                  {
                    type: "text",
                    id: "reason-1",
                    label: "Razón 1 por la que podría no ser cierta",
                  },
                  {
                    type: "text",
                    id: "reason-2",
                    label: "Razón 2 por la que podría no ser cierta",
                  },
                  {
                    type: "text",
                    id: "reason-3",
                    label: "Razón 3 por la que podría no ser cierta",
                  },
                ],
              },
              {
                id: "belief-3",
                label: "Creencia 3",
                fields: [
                  {
                    type: "text",
                    id: "belief",
                    label: "La creencia",
                    placeholder: "Ej: 'Nadie me quiere'",
                  },
                  {
                    type: "text",
                    id: "reason-1",
                    label: "Razón 1 por la que podría no ser cierta",
                  },
                  {
                    type: "text",
                    id: "reason-2",
                    label: "Razón 2 por la que podría no ser cierta",
                  },
                  {
                    type: "text",
                    id: "reason-3",
                    label: "Razón 3 por la que podría no ser cierta",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "i-will-survive",
    title: "Voy a sobrevivir",
    description:
      "Reflexioná sobre tus habilidades para afrontar dificultades y los sistemas de apoyo social que tenés.",
    sections: [
      {
        id: "challenge",
        title: "Un desafío personal",
        fields: [
          {
            type: "text",
            id: "challenge-description",
            label: "Reflexioná sobre una experiencia muy difícil que hayas pasado. Escribí libremente sobre lo que pasó, cómo te sentiste y qué te resultó difícil.",
            placeholder: "No te preocupes por la ortografía ni la gramática.",
          },
        ],
      },
      {
        id: "coping",
        title: "Tus habilidades para afrontar",
        fields: [
          {
            type: "text",
            id: "coping-description",
            label: "¿Qué hiciste para sobrevivir a ese momento difícil? ¿Qué recursos internos y externos usaste?",
            placeholder: "Acciones, pensamientos, personas que te ayudaron.",
          },
        ],
      },
      {
        id: "supports",
        title: "Tus apoyos sociales",
        fields: [
          {
            type: "text",
            id: "supports-description",
            label: "¿Quiénes son las personas en las que podés confiar cuando las cosas se ponen difíciles?",
            placeholder: "Pensá en personas que te hayan apoyado en el pasado.",
          },
        ],
      },
    ],
  },
  {
    id: "cognitive-restructuring",
    title: "Reestructuración cognitiva",
    description:
      "Reestructurá tus pensamientos sobre un evento que ya pasó, encontrando una forma más realista de interpretarlo.",
    sections: [
      {
        id: "event",
        title: "El evento",
        fields: [
          {
            type: "text",
            id: "event-description",
            label: "¿Qué evento te gustaría reestructurar?",
            placeholder: "Un evento que ya pasó y que te sigue afectando.",
          },
        ],
      },
      {
        id: "thoughts",
        title: "Tus pensamientos",
        fields: [
          {
            type: "text",
            id: "thoughts-description",
            label: "¿Qué pensamientos tenés sobre ese evento?",
            placeholder: "¿Qué te decís a vos mismo sobre lo que pasó?",
          },
        ],
      },
      {
        id: "restructure",
        title: "Reestructuración",
        fields: [
          {
            type: "text",
            id: "restructure-description",
            label: "¿Cómo podrías reestructurar esos pensamientos de forma más realista?",
            placeholder: "Buscá una interpretación más equilibrada y compasiva.",
          },
        ],
      },
    ],
  },
  {
    id: "behavioral-experiments",
    title: "Experimentos conductuales",
    description:
      "Diseñá un experimento para poner a prueba una creencia negativa y evaluar los resultados.",
    sections: [
      {
        id: "belief",
        title: "La creencia",
        fields: [
          {
            type: "text",
            id: "original-belief",
            label: "¿Cuál es la creencia negativa que querés poner a prueba?",
            placeholder: "Ej: 'No puedo disfrutar de la vida siendo soltero'",
          },
          {
            type: "rating",
            id: "original-belief-rating",
            label: "¿Qué tan fuerte creés en esta creencia? (0-100%)",
            min: 0,
            max: 100,
          },
        ],
      },
      {
        id: "hypothesis",
        title: "La hipótesis",
        fields: [
          {
            type: "text",
            id: "alternative-belief",
            label: "¿Cuál es una creencia alternativa que querés probar?",
            placeholder: "Ej: 'Puedo disfrutar de algunas cosas siendo soltero'",
          },
          {
            type: "rating",
            id: "alternative-belief-rating",
            label: "¿Qué tan fuerte creés en esta creencia alternativa? (0-100%)",
            min: 0,
            max: 100,
          },
        ],
      },
      {
        id: "experiment",
        title: "El experimento",
        fields: [
          {
            type: "text",
            id: "experiment-description",
            label: "¿Qué experimento podrías diseñar para poner a prueba la creencia alternativa?",
            placeholder: "¿Qué harías? ¿Adónde irías? ¿Qué observarías?",
          },
        ],
      },
      {
        id: "results",
        title: "Los resultados",
        fields: [
          {
            type: "text",
            id: "results-description",
            label: "¿Cómo se sostuvo la creencia original frente a la alternativa?",
            placeholder: "¿Qué aprendiste del experimento?",
          },
          {
            type: "rating",
            id: "results-rating",
            label: "Ahora, ¿qué tan fuerte creés en la creencia original? (0-100%)",
            min: 0,
            max: 100,
          },
        ],
      },
    ],
  },
  {
    id: "thought-record",
    title: "Registro de pensamientos",
    description:
      "Identificá un pensamiento automático negativo, reconocé el estilo de pensamiento y reemplazalo por uno más realista.",
    sections: [
      {
        id: "trigger",
        title: "El disparador",
        fields: [
          {
            type: "text",
            id: "trigger-description",
            label: "¿Qué situación o evento desencadenó el pensamiento negativo?",
            placeholder: "¿Quién o qué fue? ¿Cuándo pasó? ¿Dónde?",
          },
        ],
      },
      {
        id: "thoughts",
        title: "Pensamientos automáticos",
        fields: [
          {
            type: "text",
            id: "thoughts-description",
            label: "¿Cuáles fueron tus primeros pensamientos después del disparador?",
            placeholder: "¿Qué te viniste a la cabeza automáticamente?",
          },
        ],
      },
      {
        id: "emotions",
        title: "Emociones",
        fields: [
          {
            type: "text",
            id: "emotions-description",
            label: "¿Qué emociones sentiste y qué tan intensas fueron? (1-10)",
            placeholder: "Tristeza, ansiedad, enojo, vergüenza...",
          },
          {
            type: "rating",
            id: "emotions-rating",
            label: "Intensidad emocional (1-10)",
            min: 1,
            max: 10,
          },
        ],
      },
      {
        id: "alternative",
        title: "Pensamientos alternativos",
        fields: [
          {
            type: "text",
            id: "alternative-description",
            label: "¿Cómo podrías reinterpretar lo que pasó de forma más realista?",
            placeholder: "Buscá una explicación más equilibrada.",
          },
        ],
      },
      {
        id: "rerating",
        title: "Re-evaluación",
        fields: [
          {
            type: "rating",
            id: "rerating",
            label: "Ahora, ¿qué tan intensa es tu emoción? (1-10)",
            min: 1,
            max: 10,
          },
        ],
      },
    ],
  },
  {
    id: "downward-arrow",
    title: "Flecha hacia abajo",
    description:
      "Usá la técnica de la flecha hacia abajo para identificar creencias fundamentales detrás de un pensamiento negativo.",
    sections: [
      {
        id: "situation",
        title: "La situación",
        fields: [
          {
            type: "text",
            id: "situation-description",
            label: "Identificá una situación que te genera emociones negativas",
            placeholder: "Ej: Un examen universitario que me genera ansiedad",
          },
        ],
      },
      {
        id: "thoughts",
        title: "Los pensamientos",
        fields: [
          {
            type: "text",
            id: "thoughts-description",
            label: "¿Qué pensamientos acompañan a esta situación y a tus sentimientos?",
            placeholder: "Ej: 'Definitivamente voy a reprobar este examen'",
          },
        ],
      },
      {
        id: "meaning",
        title: "El significado",
        fields: [
          {
            type: "text",
            id: "meaning-description",
            label: "¿Qué significa ese pensamiento negativo sobre vos?",
            placeholder: "Ej: 'Soy un fracaso'",
          },
        ],
      },
    ],
  },
  {
    id: "pmr",
    title: "Relajación muscular progresiva",
    description:
      "Seguí este script de relajación muscular progresiva para reducir la tensión física y mental.",
    sections: [
      {
        id: "script",
        title: "El script",
        fields: [
          {
            type: "readonly",
            id: "pmr-script",
            label: "Relajación muscular progresiva",
            content: `La relajación muscular progresiva es una técnica útil para calmar la tensión física que sentimos como respuesta al estrés.

Funciona relajando secuencialmente diferentes grupos musculares del cuerpo.

1. Buscá un lugar tranquilo, preferiblemente sentado o acostado.

2. Hacé tres respiraciones profundas y calmadas por la nariz.

3. Empezá por los pies. Sentí cómo se relajan los dedos, los talones, la planta de cada pie.

4. Subí lentamente por el cuerpo. Relajá los tobillos, las pantorrillas, las rodillas.

5. Continuá con los muslos, la espalda, el pecho, los hombros.

6. Relajá los brazos, los antebrazos, las muñecas, las manos y los dedos.

7. Terminá con el cuello, los labios, la lengua, los ojos y las sienes.

8. Si tenés tiempo, repetí el proceso en sentido inverso, desde la cabeza hasta los pies.

9. Practicá regularmente para crear un hábito. Así será más fácil usarlo cuando estés estresado o ansioso.

10. A menudo es más difícil lidiar con los problemas cuando ya estamos alterados. Relajarse primero nos ayuda a tomar mejores decisiones.`,
          },
        ],
      },
    ],
  },
  {
    id: "challenging-catastrophic",
    title: "Desafiar pensamientos catastróficos",
    description:
      "Pensar en lo peor que puede pasar y magnificar su impacto puede ser muy dañano. Aprendé a desafiar esos pensamientos.",
    sections: [
      {
        id: "event",
        title: "El evento",
        fields: [
          {
            type: "text",
            id: "event-description",
            label: "¿Qué evento te preocupa?",
            placeholder: "Nombrá el evento y qué es lo que te preocupa que pase.",
          },
          {
            type: "rating",
            id: "awfulness-rating",
            label: "¿Qué tan terrible creés que sería? (1-10)",
            min: 1,
            max: 10,
          },
        ],
      },
      {
        id: "likelihood",
        title: "La probabilidad",
        fields: [
          {
            type: "text",
            id: "likelihood-description",
            label: "¿Cuál es la probabilidad de que esto pase?",
            placeholder: "¿Algo similar pasó antes? ¿Con qué frecuencia?",
          },
        ],
      },
      {
        id: "scenarios",
        title: "Los escenarios",
        fields: [
          {
            type: "text",
            id: "best-case",
            label: "¿Cuál es el mejor escenario posible? ¿Por qué?",
          },
          {
            type: "text",
            id: "worst-case",
            label: "¿Cuál es el peor escenario posible? ¿Por qué?",
          },
        ],
      },
      {
        id: "coping",
        title: "El afrontamiento",
        fields: [
          {
            type: "text",
            id: "coping-description",
            label: "Si lo peor pasara, ¿qué harías?",
            placeholder: "¿Cómo lo afrontaste antes? ¿Quién te podría ayudar?",
          },
        ],
      },
      {
        id: "reassurance",
        title: "La tranquilidad",
        fields: [
          {
            type: "text",
            id: "reassurance-description",
            label: "¿Qué le dirías a un amigo en la misma situación?",
            placeholder: "¿Cómo tranquilizarías a alguien en una situación similar?",
          },
        ],
      },
    ],
  },
  {
    id: "dysfunctional-thought-record",
    title: "Registro de pensamientos disfuncionales",
    description:
      "Identificá pensamientos negativos automáticos, reconocé las distorsiones cognitivas y encontrá pensamientos alternativos más adaptativos.",
    sections: [
      {
        id: "record",
        title: "El registro",
        fields: [
          {
            type: "rows",
            id: "thought-record",
            label: "Completá una fila por cada pensamiento disfuncional",
            columns: [
              {
                type: "text",
                id: "date",
                label: "Fecha y hora",
              },
              {
                type: "text",
                id: "situation",
                label: "Situación",
              },
              {
                type: "text",
                id: "thought",
                label: "Pensamiento automático",
              },
              {
                type: "text",
                id: "emotion",
                label: "Emoción",
              },
              {
                type: "text",
                id: "distortion",
                label: "Distorsión cognitiva",
              },
              {
                type: "text",
                id: "alternative",
                label: "Pensamiento alternativo",
              },
              {
                type: "text",
                id: "outcome",
                label: "Resultado",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "disputing-irrational-beliefs",
    title: "Disputar creencias irracionales",
    description:
      "Identificá una creencia irracional y disputala con preguntas desafiantes desde una nueva perspectiva.",
    sections: [
      {
        id: "belief",
        title: "La creencia",
        fields: [
          {
            type: "text",
            id: "belief-description",
            label: "Escribí una creencia irracional que tengas",
            placeholder: "Ej: 'Soy tan bueno como lo que logro'",
          },
        ],
      },
      {
        id: "questions",
        title: "Preguntas desafiantes",
        fields: [
          {
            type: "text",
            id: "question-1",
            label: "¿Cuál es la evidencia a favor o en contra de esta idea?",
          },
          {
            type: "text",
            id: "question-2",
            label: "¿Estoy confundiendo un hábito con un hecho?",
          },
          {
            type: "text",
            id: "question-3",
            label: "¿Estoy pensando en términos de todo o nada?",
          },
          {
            type: "text",
            id: "question-4",
            label: "¿Estoy usando palabras extremas como siempre, nunca, debe, tengo que?",
          },
        ],
      },
    ],
  },
  {
    id: "wdep-questions",
    title: "Preguntas WDEP",
    description:
      "Usá el modelo WDEP (Want, Doing, Evaluate, Plan) para reflexionar sobre qué querés, qué estás haciendo y cómo cambiar.",
    sections: [
      {
        id: "want",
        title: "¿Qué querés?",
        fields: [
          {
            type: "text",
            id: "want-description",
            label: "¿Qué querés ser o hacer? ¿Qué querés en vez de este problema?",
            placeholder: "¿Cómo sería tu carrera, relación, etc. ideal?",
          },
        ],
      },
      {
        id: "doing",
        title: "¿Qué estás haciendo?",
        fields: [
          {
            type: "text",
            id: "doing-description",
            label: "¿Qué estás haciendo (física, mental, emocionalmente)? ¿Qué acciones intentaste?",
            placeholder: "¿Qué pensamientos tenés cuando actuás así?",
          },
        ],
      },
      {
        id: "evaluate",
        title: "¿Está funcionando?",
        fields: [
          {
            type: "text",
            id: "evaluate-description",
            label: "¿Tu comportamiento te está ayudando a conseguir lo que querés?",
            placeholder: "¿Estás yendo en la dirección que querés?",
          },
        ],
      },
      {
        id: "plan",
        title: "¿Cuál es tu plan?",
        fields: [
          {
            type: "text",
            id: "plan-description",
            label: "¿Qué plan tenés para moverte en la dirección deseada?",
            placeholder: "¿Qué cambiarás de tus pensamientos o acciones?",
          },
        ],
      },
    ],
  },
  {
    id: "cataloging-inner-rules",
    title: "Catálogo de reglas internas",
    description:
      "Identificá una regla interna cuestionable o dañina y evaluá si conviene mantenerla, tirarla o modificarla.",
    sections: [
      {
        id: "infraction",
        title: "La infracción",
        fields: [
          {
            type: "text",
            id: "infraction-description",
            label: "¿Qué hiciste que rompió una de tus reglas internas?",
          },
        ],
      },
      {
        id: "rule",
        title: "La regla",
        fields: [
          {
            type: "text",
            id: "rule-description",
            label: "¿Qué regla rompiste? ¿Por qué te sentiste mal después?",
          },
        ],
      },
      {
        id: "origins",
        title: "Los orígenes",
        fields: [
          {
            type: "text",
            id: "origins-description",
            label: "¿De dónde viene esta regla? ¿Qué te hace pensar que es correcta?",
          },
        ],
      },
      {
        id: "pros-cons",
        title: "Ventajas y desventajas",
        fields: [
          {
            type: "text",
            id: "advantages",
            label: "¿Cómo te ayuda esta regla?",
          },
          {
            type: "text",
            id: "disadvantages",
            label: "¿Cómo te perjudica esta regla?",
          },
        ],
      },
      {
        id: "decision",
        title: "La decisión",
        fields: [
          {
            type: "choice",
            id: "decision",
            label: "¿Qué vas a hacer con esta regla?",
            options: [
              { value: "keep", label: "Mantenerla" },
              { value: "trash", label: "Tirarla" },
              { value: "modify", label: "Modificarla" },
            ],
          },
        ],
      },
      {
        id: "going-forward",
        title: "La regla de ahora en adelante",
        fields: [
          {
            type: "text",
            id: "going-forward",
            label: "¿Cuál es la mejor versión posible de esta regla?",
          },
        ],
      },
    ],
  },
];
