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
];
