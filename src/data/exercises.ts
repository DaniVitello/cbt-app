import type { Exercise } from "../types/exercise";

export const exercises: Exercise[] = [
  {
    id: "problem-solving",
    version: 1,
    category: "action",
    intents: ["action"],
    title: "Resolución de problemas: Formulario de automonitoreo",
    description:
      "Responder las siguientes preguntas le proporciona al terapeuta información necesaria sobre los enfoques y reacciones generales y específicas de resolución de problemas del cliente. Completá lo siguiente:",
    sections: [
      {
        id: "problem",
        title: "Describí el problema que estás enfrentando",
        fields: [
          {
            type: "text",
            id: "problem-description",
            label: "¿Cuál es la situación, quién está involucrado y dónde? ¿Por qué es un problema para vos?",
            placeholder: "Describí el problema con detalle.",
          },
        ],
      },
      {
        id: "goal",
        title: "¿Cuál es tu objetivo?",
        fields: [
          {
            type: "text",
            id: "goal-description",
            label: "¿Qué te gustaría que pasara?",
            placeholder: "Escribí cuál sería el resultado deseado.",
          },
        ],
      },
      {
        id: "attempts",
        title: "¿Qué intentaste hasta ahora para resolver el problema?",
        fields: [
          {
            type: "text",
            id: "attempts-description",
            label: "Sé específico y describí tus pensamientos y acciones para intentar resolver el problema.",
            placeholder: "Escribí qué cosas probaste para resolver el problema.",
          },
        ],
      },
      {
        id: "outcome",
        title: "¿Cuál fue el resultado?",
        fields: [
          {
            type: "text",
            id: "outcome-description",
            label: "¿Qué pasó cuando intentaste resolver el problema? ¿Cómo reaccionaste emocionalmente? ¿Qué tan satisfecho estuviste con el resultado?",
            placeholder: "Escribí qué pasó y cómo te sentiste con el resultado.",
          },
        ],
      },
    ],
  },
  {
    id: "decatastrophizing",
    version: 1,
    category: "anxiety",
    intents: ["now", "belief"],
    title: "Descatastrofizar",
    description:
      "Usá esta hoja de trabajo de descatastrofización para ayudarte a reestructurar cognitivamente cuando sentís que te estás abrumando con pensamientos catastróficos. 'Descatastrofizar' se trata de explorar la realidad y los hechos de una situación en lugar de dejarte llevar por pensamientos de '¿Y si...?'. Esta hoja tiene 5 cajas para completar. Empezá arriba, donde vas a encontrar un espacio para identificar claramente la catástrofe que te está molestando. Indicá exactamente qué tenés en mente, antes de calificar cuán angustiante sería el escenario hipotético en una escala del 0% (no tan malo) al 100% (absolutamente terrible).",
    sections: [
      {
        id: "catastrophe",
        title: "1. ¿Qué 'catástrofe' te está molestando?",
        fields: [
          {
            type: "text",
            id: "catastrophe-description",
            label: "Especificá qué imaginás que va a ocurrir, evitando enunciados con '¿Y si...?'. En su lugar, reformulá estos como predicciones precisas, ej: 'No voy a conseguir el trabajo'.",
            placeholder: "Escribí la catástrofe con precisión, sin usar '¿Y si...?'",
          },
          {
            type: "rating",
            id: "catastrophe-rating",
            label: "Calificá cuán terrible creés que sería del 0% al 100%",
            min: 0,
            max: 100,
          },
        ],
      },
      {
        id: "likelihood",
        title: "2. ¿Cuál es la probabilidad de que ocurra la catástrofe?",
        fields: [
          {
            type: "text",
            id: "likelihood-description",
            label: "En el pasado, ¿esto pasó antes? ¿Con qué frecuencia ocurre esto en la vida real?",
            placeholder: "Considerá objetivamente si el escenario temido ocurrió antes y con qué frecuencia ocurre en la vida real.",
          },
        ],
      },
      {
        id: "impact",
        title: "3. ¿Qué tan terrible sería si tu catástrofe realmente ocurriera?",
        fields: [
          {
            type: "text",
            id: "worst-case",
            label: "¿Cuáles serían los peores resultados posibles?",
            placeholder: "Imaginá que ya pasó. ¿Cuáles serían los peores resultados?",
          },
          {
            type: "text",
            id: "best-case",
            label: "¿Cuáles serían los mejores resultados posibles?",
            placeholder: "¿Cuáles serían los mejores resultados posibles?",
          },
          {
            type: "text",
            id: "friend-perspective",
            label: "¿Cómo te hablaría un amigo sobre tu preocupación?",
            placeholder: "Pensá en cómo un amigo te hablaría sobre tu preocupación.",
          },
        ],
      },
      {
        id: "coping",
        title: "4. Si el peor escenario posible ocurriera, ¿cómo lo afrontarías?",
        fields: [
          {
            type: "text",
            id: "coping-description",
            label: "¿Qué hiciste en situaciones pasadas similares? ¿Qué técnicas, estrategias o personas podrías consultar?",
            placeholder: "Pensá en experiencias pasadas similares y qué recursos podrías usar para lidiar con las consecuencias.",
          },
        ],
      },
      {
        id: "reassurance",
        title: "5. ¿Qué es lo más tranquilizador o positivo que te gustaría escuchar?",
        fields: [
          {
            type: "text",
            id: "reassurance-description",
            label: "¿Qué tipo de cosas te gustaría escuchar para sentirte mejor? ¿Qué te tranquilizaría y cómo sonaría?",
            placeholder: "Escribí qué te gustaría escuchar para sentirte mejor y cómo sonaría.",
          },
          {
            type: "rating",
            id: "reassurance-rating",
            label: "Ahora, ¿qué tan terrible creés que sería del 0% al 100%?",
            min: 0,
            max: 100,
          },
        ],
      },
    ],
  },
  {
    id: "rabbit-hole",
    version: 1,
    category: "anxiety",
    intents: ["now"],
    title: "Cómo lidiar con la ansiedad: Revertí el agujero del conejo",
    description:
      "Si luchás contra la ansiedad, sabés que esas dos pequeñas palabras, '¿y si...?', pueden enviar tu mente por un agujero de conejo de escenarios cada vez más negativos. Una simple pregunta puede llevarte desde preguntarte cómo va a resultar algo hasta estar seguro de que se va a convertir en el peor escenario posible. Para combatir esta tendencia hacia lo negativo, intentá revertir el agujero del conejo (es decir, considerar los resultados positivos). Para cada resultado negativo, hay uno positivo que es igual de probable. Usá esta hoja de trabajo para encontrar algunos resultados positivos potenciales. Escribí un resultado negativo que te preocupe y encontrá un resultado positivo igual de plausible.",
    sections: [
      {
        id: "outcomes",
        title: "Resultados",
        fields: [
          {
            type: "rows",
            id: "outcomes-table",
            label: "Escribí un resultado negativo que te preocupe y encontrá un resultado positivo igual de plausible",
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
    version: 1,
    category: "thoughts",
    intents: ["belief"],
    title: "Creencias fundamentales: Las valijas",
    description:
      "Las creencias fundamentales se relacionan con las representaciones más arraigadas que tenemos de nosotros mismos, de los demás, del presente y del futuro. El siguiente ejemplo muestra cómo, en cualquier escenario, nuestras creencias fundamentales pueden impactar en nuestros comportamientos. Escenario: podemos imaginarnos yendo a una entrevista de trabajo y pensando si merecés o no este rol: uno que querés mucho. Este día, necesitás elegir una valija para llevar. Cada una representa una creencia fundamental. Usá las burbujas de pensamiento para identificar tres creencias fundamentales que te gustaría desafiar. En los espacios al lado de estas, intentá encontrar tres razones por las que estas creencias no son ciertas.",
    sections: [
      {
        id: "beliefs",
        title: "Tus creencias fundamentales",
        fields: [
          {
            type: "group",
            id: "core-beliefs",
            label: "Identificá tres creencias fundamentales que te gustaría desafiar y encontrá tres razones por las que cada una podría no ser cierta",
            groups: [
              {
                id: "belief-1",
                label: "Creencia fundamental 1",
                fields: [
                  {
                    type: "text",
                    id: "belief",
                    label: "La creencia fundamental",
                    placeholder: "Ej: 'No soy talentoso'",
                  },
                  {
                    type: "text",
                    id: "reason-1",
                    label: "Esto no puede ser cierto porque... (razón 1)",
                  },
                  {
                    type: "text",
                    id: "reason-2",
                    label: "Esto no puede ser cierto porque... (razón 2)",
                  },
                  {
                    type: "text",
                    id: "reason-3",
                    label: "Esto no puede ser cierto porque... (razón 3)",
                  },
                ],
              },
              {
                id: "belief-2",
                label: "Creencia fundamental 2",
                fields: [
                  {
                    type: "text",
                    id: "belief",
                    label: "La creencia fundamental",
                    placeholder: "Ej: 'No estoy seguro de ser talentoso'",
                  },
                  {
                    type: "text",
                    id: "reason-1",
                    label: "Esto no puede ser cierto porque... (razón 1)",
                  },
                  {
                    type: "text",
                    id: "reason-2",
                    label: "Esto no puede ser cierto porque... (razón 2)",
                  },
                  {
                    type: "text",
                    id: "reason-3",
                    label: "Esto no puede ser cierto porque... (razón 3)",
                  },
                ],
              },
              {
                id: "belief-3",
                label: "Creencia fundamental 3",
                fields: [
                  {
                    type: "text",
                    id: "belief",
                    label: "La creencia fundamental",
                    placeholder: "Ej: 'No soy talentoso'",
                  },
                  {
                    type: "text",
                    id: "reason-1",
                    label: "Esto no puede ser cierto porque... (razón 1)",
                  },
                  {
                    type: "text",
                    id: "reason-2",
                    label: "Esto no puede ser cierto porque... (razón 2)",
                  },
                  {
                    type: "text",
                    id: "reason-3",
                    label: "Esto no puede ser cierto porque... (razón 3)",
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
    version: 1,
    category: "selfcare",
    intents: ["relax"],
    title: "Voy a sobrevivir",
    description:
      "Este ejercicio está diseñado para ayudarte a evaluar tus propias habilidades de afrontamiento, así como los sistemas de apoyo social en los que te apoyás para lidiar con los contratiempos y dificultades de la vida. La autocompasión y el amor propio han sido vinculados a nuestra capacidad de prosperar frente a circunstancias difíciles. Al lidiar con situaciones desafiantes, un enfoque autocompasivo a menudo sirve como un amortiguador protector, ayudándonos a lidiar con nuestro crítico interno, preparándonos para afrontar de manera más adaptativa y ayudándonos a superar. Al considerar los recursos internos y externos que te ayudan a lidiar con las luchas y los problemas, podés empezar a identificar tus propios amortiguadores protectores, desde tus rasgos personales hasta las personas a tu alrededor que podrían ayudarte. Esta hoja contiene tres preguntas para que reflexiones y respondas. Escribí tus respuestas en el espacio provisto, donde podrás volver a ellas más tarde o cuando estés experimentando un desafío.",
    sections: [
      {
        id: "challenge",
        title: "Parte 1: Un desafío personal",
        fields: [
          {
            type: "text",
            id: "challenge-description",
            label: "Reflexioná sobre una experiencia muy difícil que hayas pasado en tu vida. Escribí libremente sobre esta experiencia en el espacio provisto. Intentá contar lo que pasó, cómo te sentiste y qué te resultó difícil de manejar con todo el detalle que quieras. No te preocupes por la ortografía ni la gramática.",
            placeholder: "Escribí sobre una experiencia difícil que hayas pasado.",
          },
        ],
      },
      {
        id: "coping",
        title: "Parte 2: Tus habilidades para afrontar",
        fields: [
          {
            type: "text",
            id: "coping-description",
            label: "Considerá ahora qué hiciste para sobrevivir a ese momento desafiante. ¿Qué acciones tomaste? ¿Qué recursos internos y externos usaste? ¿Qué tipo de ayuda buscaste? ¿Qué te ayudó a sobrevivir o superar tus dificultades? ¿Qué no? ¿Qué fortalezas te ayudaron a superar ese momento? ¿Qué capacidades o rasgos personales fueron especialmente útiles? ¿Qué habilidades estás orgulloso de haber implementado? ¿Cómo te ayudaron?",
            placeholder: "Pensá en qué hiciste para sobrevivir y qué recursos usaste.",
          },
        ],
      },
      {
        id: "supports",
        title: "Parte 3: Tus apoyos sociales",
        fields: [
          {
            type: "text",
            id: "supports-description",
            label: "Considerá un objetivo, deseo o ambición significativa que tengas. Escribí sobre él en el espacio provisto. Ahora pensá en un cumplido pasado que hayas recibido relacionado con este objetivo o deseo. ¿Qué personas te lo dieron? ¿Resaltaron alguna fortaleza, rasgo o capacidad en particular? ¿Algún compañero, mentor, miembro de la familia o amigo expresó admiración por ciertas capacidades?",
            placeholder: "Pensá en personas que te hayan apoyado y cumplidos que hayas recibido.",
          },
        ],
      },
    ],
  },
  {
    id: "cognitive-restructuring",
    version: 1,
    category: "thoughts",
    intents: ["belief", "now"],
    title: "Reestructuración cognitiva de un evento",
    description:
      "Cuando las cosas ya pasaron, especialmente cuando el resultado no fue el que esperábamos, podemos quedarnos pensando lo peor sobre nosotros mismos o sobre lo que sucedió. La reestructuración cognitiva es un proceso que ayuda a remodelar la cognición. Después de todo, es la creencia o el pensamiento relacionado con el evento, y no el evento en sí, lo que más afecta a la persona. Realizá los siguientes pasos para reestructurar tus pensamientos sobre un evento, dándole un marco positivo o aceptando lo que pasó.",
    sections: [
      {
        id: "event",
        title: "¿Qué fue el evento?",
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
        title: "¿Cuáles son tus pensamientos sobre el evento?",
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
        title: "¿Cómo podés reestructurar cognitivamente esos pensamientos?",
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
    version: 1,
    category: "action",
    intents: ["action", "belief"],
    title: "Experimentos conductuales para poner a prueba creencias",
    description:
      "Un experimento conductual es una técnica de TCC que implica poner a prueba pensamientos automáticos negativos y reevaluar creencias y supuestos subyacentes. Esta técnica invita a las personas a ver los pensamientos negativos de manera objetiva en lugar de como verdades absolutas. Primero se identifica una creencia que se quiere poner a prueba. Luego se deriva una hipótesis específica de esta regla general, y se formula un experimento para poner a prueba dicha hipótesis.",
    sections: [
      {
        id: "belief",
        title: "Paso 1: La creencia disfuncional original",
        fields: [
          {
            type: "text",
            id: "original-belief",
            label: "¿Cuál es la creencia disfuncional original que querés poner a prueba?",
            placeholder: "Ej: 'No puedo disfrutar de mi vida siendo soltero'",
          },
          {
            type: "rating",
            id: "original-belief-rating",
            label: "¿Qué tan fuerte creés que esto va a pasar? (0-100%)",
            min: 0,
            max: 100,
          },
        ],
      },
      {
        id: "hypothesis",
        title: "Paso 2: La hipótesis y la creencia alternativa",
        fields: [
          {
            type: "text",
            id: "alternative-belief",
            label: "Derivá una hipótesis de esta creencia para llegar a una creencia alternativa. ¿Cuál es?",
            placeholder: "Ej: 'Puedo disfrutar de algunas cosas siendo soltero'",
          },
          {
            type: "rating",
            id: "alternative-belief-rating",
            label: "¿Qué tan fuerte creés que esto va a pasar? (0-100%)",
            min: 0,
            max: 100,
          },
        ],
      },
      {
        id: "experiment",
        title: "Paso 3: Diseñá un experimento",
        fields: [
          {
            type: "text",
            id: "experiment-description",
            label: "¿Qué circunstancias tienen que darse para poner a prueba tu hipótesis? ¿Adónde tendrías que ir? ¿Qué tendrías que hacer u observar?",
            placeholder: "Diseñá un experimento para poner a prueba la creencia alternativa.",
          },
        ],
      },
      {
        id: "carrying-out",
        title: "Paso 4: Llevá a cabo el experimento",
        fields: [
          {
            type: "text",
            id: "carrying-out-description",
            label: "¿Qué pasó cuando llevaste a cabo el experimento?",
            placeholder: "Escribí lo que pasó cuando pusiste en práctica el experimento.",
          },
        ],
      },
      {
        id: "observations",
        title: "Paso 5: Registrá tus observaciones",
        fields: [
          {
            type: "text",
            id: "observations-description",
            label: "¿Qué observaste durante el experimento?",
            placeholder: "Escribí lo que observaste cuando llevaste a cabo el experimento.",
          },
        ],
      },
      {
        id: "reflection",
        title: "Paso 6: Reflexioná sobre las observaciones",
        fields: [
          {
            type: "text",
            id: "reflection-description",
            label: "¿Cómo se sostuvo la creencia disfuncional frente a la creencia alternativa?",
            placeholder: "Reflexioná sobre cómo se sostuvo la creencia original frente a la alternativa.",
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
    version: 1,
    category: "thoughts",
    intents: ["now", "belief"],
    title: "Registro de pensamientos (Reestructuración cognitiva)",
    description:
      "Cuando adoptamos estilos de pensamiento defectuosos, puede ser útil completar un registro de pensamientos y considerar qué tipo de pensamiento se está disparando. A continuación se proporciona una lista de estilos de pensamiento defectuosos: Auto-culpa: en lugar de sentirte como la víctima, creés que sos responsable del dolor y la felicidad de todos los que te rodean. Pensamiento rígido: sabemos que tenemos la razón, pero otras personas no siempre estarán de acuerdo. Personalización: creer que todo lo que la gente dice y hace está de alguna manera relacionado con nosotros. Culpar: otras personas, organizaciones y el universo en general tienen la culpa de nuestros problemas. Generalizar lo específico: sacar una conclusión general basada en una sola ocurrencia. Lectura del pensamiento: creemos 'saber' lo que piensan los demás y por qué actúan como lo hacen, aunque no nos lo hayan dicho. Magnificación y filtrado: magnificamos las emociones negativas y filtramos todo lo que es positivo. Pensamiento polarizado: pensamos en situaciones y personas como todo o nada, ej: bueno versus malo, aprobado versus reprobado. Catastrofización: esperamos lo peor. Todo saldrá mal y tendrá el impacto más significativo. Trabajá con el cliente para completar el siguiente registro de pensamientos e identificar qué estilo de pensamiento se está aplicando.",
    sections: [
      {
        id: "pause",
        title: "1. Pausa",
        fields: [
          {
            type: "text",
            id: "pause-description",
            label: "Cuando tu pensamiento o comportamiento es desproporcionado con lo que está pasando, lo primero y más importante es detenerte. ¿Qué te diste cuenta que te hizo parar?",
            placeholder: "Escribí qué te hizo detenerte.",
          },
        ],
      },
      {
        id: "trigger",
        title: "2. Identificá y entendé el disparador",
        fields: [
          {
            type: "text",
            id: "trigger-description",
            label: "¿Quién o qué fue? ¿Cuándo pasó? ¿Dónde pasó? ¿Por qué pasó?",
            placeholder: "Puede ser tan simple como un comentario abrupto o una mirada. Algo causó una reacción desproporcionada a la situación.",
          },
        ],
      },
      {
        id: "thoughts",
        title: "3. Reconocé tus pensamientos automáticos",
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
        title: "4. Identificá tu reacción emocional",
        fields: [
          {
            type: "text",
            id: "emotions-description",
            label: "¿Qué emociones estás sintiendo y qué tan intensas son? Calificá del 1 al 10",
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
        title: "5. Reemplazá por pensamientos alternativos",
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
        title: "6. Re-calificá la intensidad de tu respuesta emocional",
        fields: [
          {
            type: "rating",
            id: "rerating",
            label: "¿Cuál es tu intensidad emocional ahora? (1-10)",
            min: 1,
            max: 10,
          },
        ],
      },
    ],
  },
  {
    id: "downward-arrow",
    version: 1,
    category: "thoughts",
    intents: ["belief"],
    title: "La técnica de la flecha hacia abajo para creencias fundamentales",
    description:
      "Las 'creencias fundamentales' son las creencias duraderas y fundamentales de una persona sobre sí misma, sobre los demás y sobre el mundo que la rodea. Las creencias fundamentales no siempre son negativas, sin embargo, las que lo son pueden ser problemáticas. Las creencias fundamentales se caracterizan por una serie de factores: a menudo se desarrollan temprano en la vida, como resultado de la experiencia infantil. Sin embargo, pueden cambiar más tarde en la vida, por ejemplo, como resultado de un trauma adulto. Pueden existir fuera de la conciencia. Pueden exhibirse a través de enunciados y supuestos absolutos como 'el mundo es un lugar malo'. Debido a que estas creencias se mantienen profundamente, en el 'núcleo' de alguien, puede no ser particularmente consciente de ellas. La técnica de la flecha hacia abajo es un método de pregunta socrática que puede ayudar a identificar creencias fundamentales problemáticas. En el paso 3, elegí una de las preguntas de abajo para hacerte a vos mismo: 1. ¿Qué significa este pensamiento negativo? 2. ¿Qué significa este pensamiento negativo sobre vos? 3. ¿Qué significa este pensamiento negativo sobre los demás? 4. ¿Qué significa este pensamiento negativo sobre el mundo? 5. Si esto es cierto, ¿por qué te molesta? 6. Si esto es cierto, ¿por qué es tan malo? 7. Si esto es cierto, ¿qué significa para tu futuro?",
    sections: [
      {
        id: "situation",
        title: "Paso 1: Identificá una situación que te genera emociones negativas",
        fields: [
          {
            type: "text",
            id: "situation-description",
            label: "¿Qué situación te está generando emociones negativas?",
            placeholder: "Ej: Un examen universitario que me genera ansiedad",
          },
        ],
      },
      {
        id: "thoughts",
        title: "Paso 2: Escribí qué pensamientos acompañan a esta situación y a tus sentimientos",
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
        title: "Paso 3: ¿Qué significa este pensamiento negativo? (O una pregunta de la lista)",
        fields: [
          {
            type: "text",
            id: "meaning-description",
            label: "¿Qué significa este pensamiento negativo? Elegí una pregunta de la lista y respondela.",
            placeholder: "Ej: 'Mis padres van a estar decepcionados conmigo otra vez, como siempre'",
          },
        ],
      },
      {
        id: "about-you",
        title: "Paso 4: ¿Qué significa este pensamiento negativo sobre vos?",
        fields: [
          {
            type: "text",
            id: "about-you-description",
            label: "¿Qué significa este pensamiento negativo sobre vos?",
            placeholder: "Ej: 'Soy un fracaso'",
          },
        ],
      },
    ],
  },
  {
    id: "pmr",
    version: 1,
    category: "selfcare",
    intents: ["relax"],
    title: "Relajación muscular progresiva: Conceptos básicos fáciles",
    description:
      "Este script describe los conceptos básicos de la Relajación Muscular Progresiva, manteniéndolo simple para audiencias más jóvenes. La Relajación Muscular Progresiva (PMR) puede ser una técnica útil para relajar la tensión física que sentimos como respuesta al estrés, y funciona apuntando secuencialmente a diferentes partes del cuerpo. Leé el script mientras trabajás en los pasos descritos juntos si querés, explicando que la PMR puede ayudarte a sentirte mejor cuando estás ansioso, tenso o enojado. Alternativamente, este puede ser un ejercicio que los niños quieran hacer por su cuenta. Al final, animá a los niños a practicar la Relajación Muscular Progresiva regularmente, para que puedan usarla cuando quieran calmarse, o incluso para dormirse.",
    sections: [
      {
        id: "script",
        title: "El script",
        fields: [
          {
            type: "readonly",
            id: "pmr-script",
            label: "Relajación muscular progresiva",
            content: `La relajación muscular progresiva es una forma útil de sentirse más tranquilo cuando estás ansioso, enojado, estresado o tenso. Es una manera de relajarse y desconectar, despejando la cabeza para poder pensar mejor. La PMR es muy útil porque es algo que podés hacer en cualquier lugar, y no es fácil que los demás se den cuenta de que lo estás haciendo. También podés hacerlo por poco tiempo, o tomarte más tiempo si querés. Esta técnica funciona mejor cuando estás en un lugar tranquilo, solo, y podés hacerlo incluso en la cama por la noche para ayudarte a dormir.

Con la espalda bien recta, acomodate en una posición cómoda de pie o sentado.

Ahora cerrá suavemente los ojos.

Empezá con tres respiraciones profundas y calmadas por la nariz. Sentí el aire entrando y saliendo. Entrando y saliendo. Entrando... y saliendo de nuevo.

Primero, llevá tu atención a tus pies. Sentí cómo se relajan los dedos de los pies... los talones... la planta de cada pie... el costado de cada pie... simplemente relajándose. Pueden sentirse como si se estuvieran volviendo más livianos, más sueltos, incluso más blandos o sin peso.

¡Relajate en eso!

Lentamente, con calma, llevá tu mente por tu cuerpo. Sentí cómo se relajan y se sueltan los tobillos. Luego hacia arriba, a las pantorrillas, con cada parte del cuerpo relajándose mientras la pensás.

Tomate todo el tiempo que quieras y movete hacia arriba, pensando y soltando la tensión en:
- Tobillos
- Pantorrillas
- Rodillas
- Muslos (frente y espalda)
- Glúteos
- Estómago
- Parte baja de la espalda
- Parte central de la espalda
- Columna vertebral
- Parte alta de la espalda
- Pecho y torso
- Hombros
- Brazos (frente y espalda)
- Codos
- Antebrazos (frente y espalda)
- Muñecas
- Manos y dedos
- Cuello
- Labios y lengua
- ojos
- Sienes

Si tenés tiempo, ¿por qué no repetir todo el proceso, moviéndote hacia abajo desde la parte superior de tu cabeza hasta las puntas de los pies?

La PMR funciona mejor si la practicás regularmente, y con un estado de ánimo tranquilo y pacífico. Esto ayuda a crear un hábito, y luego es aún más fácil de usar cuando te enojás, estás estresado o nervioso.

A menudo es más difícil lidiar adecuadamente con los desafíos cuando ya estamos alterados. Cuando nos detenemos a relajarnos y sentirnos primero mejor, tomar buenas decisiones es más fácil. ¡Acá es donde la PMR puede ser súper útil!`,
          },
        ],
      },
    ],
  },
  {
    id: "challenging-catastrophic",
    version: 1,
    category: "anxiety",
    intents: ["now", "belief"],
    title: "Desafiar pensamientos catastróficos",
    description:
      "Creer que siempre va a pasar lo peor y magnificar su impacto puede ser muy dañino para tu bienestar mental. Trabajá a través del evento completando este ejercicio para entender el miedo y encontrar tranquilidad sobre que el peor desenlace no es inevitable.",
    sections: [
      {
        id: "event",
        title: "¿Qué evento te preocupa?",
        fields: [
          {
            type: "text",
            id: "event-description",
            label: "Nombrá el evento. ¿Qué es lo que te preocupa que pase?",
            placeholder: "Escribí qué evento te tiene preocupado y qué es lo que temés que suceda.",
          },
          {
            type: "rating",
            id: "awfulness-rating",
            label: "¿Qué tan terrible creés que sería? (1-10, donde 10 es insoportable)",
            min: 1,
            max: 10,
          },
        ],
      },
      {
        id: "likelihood",
        title: "¿Cuál es la probabilidad de que esto pase?",
        fields: [
          {
            type: "text",
            id: "likelihood-description",
            label: "¿Algo similar pasó antes? ¿Sucede con frecuencia? Si no, ¿en qué te basás para pensar que podría pasar?",
            placeholder: "Considerá si algo similar ocurrió antes, si pasa seguido, o qué te hace creer que podría pasar.",
          },
        ],
      },
      {
        id: "scenarios",
        title: "Entendé los escenarios",
        fields: [
          {
            type: "text",
            id: "best-case",
            label: "¿Cuál es el mejor escenario posible? ¿Por qué?",
            placeholder: "¿Qué es lo mejor que podría pasar y por qué?",
          },
          {
            type: "text",
            id: "worst-case",
            label: "¿Cuál es el peor escenario posible? ¿Por qué?",
            placeholder: "¿Qué es lo peor que podría pasar y por qué?",
          },
        ],
      },
      {
        id: "coping",
        title: "Si lo peor pasa, ¿qué harías?",
        fields: [
          {
            type: "text",
            id: "coping-description",
            label: "¿Si pasó antes, cómo lo afrontaste? ¿Quién o qué podría ayudarte? ¿Qué podrías hacer para prepararte? ¿Qué habilidades ya tenés que te ayudarían?",
            placeholder: "Pensá en cómo lo manejaste antes, quién te podría ayudar, qué podrías hacer para prepararte, y qué habilidades ya tenés.",
          },
        ],
      },
      {
        id: "reassurance",
        title: "¿Qué le dirías a un amigo en esta situación?",
        fields: [
          {
            type: "text",
            id: "reassurance-description",
            label: "¿Cómo tranquilizarías a alguien en una situación similar? ¿Conocés a alguien que haya pasado por algo parecido?",
            placeholder: "Pensá en qué le dirías a un amigo y si conocés a alguien que haya enfrentado algo similar.",
          },
        ],
      },
      {
        id: "reflection",
        title: "¿Cómo te sentís ahora sobre el evento?",
        fields: [
          {
            type: "text",
            id: "reflection-description",
            label: "¿Qué pensás ahora, habiendo revisado el riesgo y tu capacidad de afrontarlo?",
            placeholder: "Reflexioná sobre cómo te sentís ahora de haber pensado el riesgo y tu capacidad de manejarlo.",
          },
        ],
      },
    ],
  },
  {
    id: "dysfunctional-thought-record",
    version: 1,
    category: "thoughts",
    intents: ["now", "belief"],
    title: "Registro de pensamientos disfuncionales",
    description:
      "Esta hoja de trabajo es especialmente útil para personas que luchan contra pensamientos negativos y necesitan averiguar cuándo y por qué esos pensamientos son más propensos a aparecer. Aprender más sobre qué provoca ciertos pensamientos automáticos los hace más fáciles de abordar y revertir. Esta hoja de trabajo está dividida en 7 columnas: 1. A la izquierda, hay espacio para anotar la Fecha y la Hora en que surgió un pensamiento disfuncional. 2. La segunda columna es donde se detalla la Situación. Se instruye al usuario a describir el evento que condujo al pensamiento disfuncional en detalle. 3. La tercera columna es para el Pensamiento Automático. Aquí se registra el pensamiento automático disfuncional, junto con una calificación de creencia en el pensamiento en una escala del 0% al 100%. 4. La siguiente columna es donde se detalla la Emoción o emociones provocadas por este pensamiento, también con una calificación de intensidad en una escala del 0% al 100%. 5. La quinta columna se denomina 'Distorsión Cognitiva'. En esta columna, el usuario identificará qué distorsión(es) cognitiva(s) está experimentando con respecto a este pensamiento disfuncional específico, como el pensamiento de todo o nada, el filtrado, sacar conclusiones precipitadas, etc. 6. La penúltima columna es para que el usuario anote Pensamientos Alternativos que sean más positivos y funcionales para reemplazar el negativo. 7. Finalmente, la última columna es para que el usuario anote el Resultado de este ejercicio. ¿Pudiste enfrentar el pensamiento disfuncional? ¿Escribiste un pensamiento alternativo convincente? ¿Disminuyó tu creencia en el pensamiento y/o la intensidad de tu(s) emoción(es)?",
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
                label: "Fecha y hora. ¿Cuándo ocurrió el pensamiento?",
              },
              {
                type: "text",
                id: "situation",
                label: "Situación. ¿Cuál fue el contexto? ¿Qué estaba pasando en el momento y antes del pensamiento?",
              },
              {
                type: "text",
                id: "thought",
                label: "Pensamiento automático. Describí el pensamiento. Calificá cuánto lo creíste del 0% al 100%.",
              },
              {
                type: "text",
                id: "emotion",
                label: "Emoción. ¿Qué sentimientos te surgieron en el momento? ¿Qué tan intensos fueron del 0% al 100%?",
              },
              {
                type: "text",
                id: "distortion",
                label: "Distorsión cognitiva. Ej: filtrado, personalización, catastrofización.",
              },
              {
                type: "text",
                id: "alternative",
                label: "Pensamiento alternativo. ¿Cuál es una alternativa más adaptativa? ¿Hay otra posible solución?",
              },
              {
                type: "text",
                id: "outcome",
                label: "Resultado. Ahora volvé a calificar cuánto creés en el pensamiento original y en tus emociones, del 0% al 100%.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "disputing-irrational-beliefs",
    version: 1,
    category: "thoughts",
    intents: ["belief"],
    title: "Disputar creencias irracionales",
    description:
      "Las creencias y los pensamientos tienen un impacto en cómo te sentís y cómo sentís influye en lo que elegís hacer. Si los pensamientos son irracionales, pueden desencadenar, amplificar y mantener emociones incómodas. Las creencias racionales distinguen entre 'deseos' y 'necesidades'. Están basadas en hechos, nos ayudan a protegernos de un probable daño, nos ayudan a lograr metas a corto y largo plazo, nos ayudan a evitar conflictos significativos con otras personas y nos ayudan a sentir las emociones que queremos sentir. No es el evento, sino nuestra interpretación del evento la que causa nuestra reacción emocional. El proceso de Disputar Creencias Irracionales (DIBs) consiste en desafiar una creencia haciéndote las siguientes preguntas: ¿Puedo apoyar racionalmente esta creencia? ¿Estas ideas están conectadas lógicamente? ¿Quién apoya esta idea y cuál es su autoridad? ¿Qué evidencia existe de la falsedad de esta creencia? ¿Hay excepciones? ¿Cuáles son las peores cosas que podrían pasar realmente si no consigo lo que creo que quiero? ¿Qué cosas buenas podría hacer que pasen si no consigo lo que creo que quiero?",
    sections: [
      {
        id: "belief",
        title: "La creencia",
        fields: [
          {
            type: "text",
            id: "belief-description",
            label: "Elegí una creencia irracional y escribila acá abajo.",
            placeholder: "Escribí una creencia irracional que tengas.",
          },
        ],
      },
      {
        id: "questions",
        title: "Preguntas desafiantes y respuestas",
        fields: [
          {
            type: "text",
            id: "question-1",
            label: "Pregunta 1: ¿Cuál es la evidencia a favor o en contra de esta idea? Respondé usando una nueva perspectiva.",
            placeholder: "Escribí tu respuesta usando una nueva perspectiva.",
          },
          {
            type: "text",
            id: "question-2",
            label: "Pregunta 2: ¿Estoy confundiendo un hábito con un hecho? Respondé usando una nueva perspectiva.",
            placeholder: "Escribí tu respuesta usando una nueva perspectiva.",
          },
          {
            type: "text",
            id: "question-3",
            label: "Pregunta 3: ¿Estoy pensando en términos de todo o nada? Respondé usando una nueva perspectiva.",
            placeholder: "Escribí tu respuesta usando una nueva perspectiva.",
          },
          {
            type: "text",
            id: "question-4",
            label: "Pregunta 4: ¿Estoy usando palabras extremas como siempre, nunca, debe, tengo que? Respondé usando una nueva perspectiva.",
            placeholder: "Escribí tu respuesta usando una nueva perspectiva.",
          },
        ],
      },
    ],
  },
  {
    id: "wdep-questions",
    version: 1,
    category: "action",
    intents: ["action"],
    title: "Preguntas WDEP",
    description:
      "El modelo WDEP es una técnica de la Terapia de la Realidad que ayuda a las personas a reflexionar sobre qué quieren, qué están haciendo, si está funcionando y cuál es su plan. WDEP significa: W - ¿Qué querés? D - ¿Qué estás haciendo? E - ¿Está funcionando? P - ¿Cuál es tu plan?",
    sections: [
      {
        id: "want",
        title: "W: ¿Qué querés?",
        fields: [
          {
            type: "text",
            id: "want-description",
            label: "¿Qué querés ser o hacer? ¿Qué querés en vez de este problema? ¿Cómo sería tu carrera, relación, etc. ideal? ¿Qué quieren tus seres queridos/amigos para vos? ¿Qué querés lograr de esta terapia?",
            placeholder: "Escribí qué querés ser o hacer.",
          },
        ],
      },
      {
        id: "doing",
        title: "D: ¿Qué estás haciendo?",
        fields: [
          {
            type: "text",
            id: "doing-description",
            label: "¿Qué estás haciendo (física, mental, emocionalmente)? ¿Qué acciones intentaste tomar? ¿Qué pensamientos tenés cuando actuás así? ¿Qué sentís cuando tenés estos pensamientos? ¿Cómo impactan estos pensamientos/acciones en tu bienestar?",
            placeholder: "Escribí qué estás haciendo actualmente.",
          },
        ],
      },
      {
        id: "evaluate",
        title: "E: ¿Está funcionando?",
        fields: [
          {
            type: "text",
            id: "evaluate-description",
            label: "¿Tu comportamiento está funcionando para ayudarte a conseguir lo que querés? ¿Estas acciones te están llevando en la dirección deseada? ¿Estás conforme con cómo están las cosas? ¿Lo que querés es alcanzable? ¿Ver las cosas de esta manera es útil?",
            placeholder: "Escribí si tus acciones te están ayudando.",
          },
        ],
      },
      {
        id: "plan",
        title: "P: ¿Cuál es tu plan?",
        fields: [
          {
            type: "text",
            id: "plan-description",
            label: "¿Qué plan tenés para moverte en la dirección deseada? ¿Qué cambiarás de tus pensamientos o acciones para lograr esto? ¿Cuándo? ¿Con qué frecuencia? ¿Dónde? ¿Estás claro sobre lo que vas a hacer? ¿Es realista? ¿Cómo vas a saber que lo lograste? ¿Podés empezar ahora? ¿Está bajo tu control? ¿Qué tan comprometido estás con hacerlo?",
            placeholder: "Escribí tu plan para moverte en la dirección deseada.",
          },
        ],
      },
    ],
  },
  {
    id: "cataloging-inner-rules",
    version: 1,
    category: "thoughts",
    intents: ["belief"],
    title: "Catálogo de reglas internas",
    description:
      "Todos tenemos reglas que guían nuestro comportamiento a diario. Puede que no las podamos articular claramente, pero están en nuestro subconsciente empujándonos hacia un comportamiento coherente con ellas. Muchas de estas reglas pueden ser buenas, pero algunas pueden no ser adaptativas ni útiles. Usá este ejercicio para identificar una regla cuestionable o dañina que tengas y desafiarla.",
    sections: [
      {
        id: "infraction",
        title: "La infracción",
        fields: [
          {
            type: "text",
            id: "infraction-description",
            label: "¿Qué hiciste que rompió una de tus reglas internas?",
            placeholder: "Escribí qué hiciste que fue en contra de una de tus reglas.",
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
            label: "¿Qué regla rompió tu comportamiento? ¿Por qué te sentiste mal después de actuar así?",
            placeholder: "Escribí qué regla se rompió y por qué te hizo sentir mal.",
          },
        ],
      },
      {
        id: "origins",
        title: "Los orígenes de la regla",
        fields: [
          {
            type: "text",
            id: "origins-description",
            label: "¿De dónde vino esta regla? ¿Qué te hace pensar que es correcta o una buena regla?",
            placeholder: "Pensá de dónde salió esta regla y qué te hace creer que es válida.",
          },
        ],
      },
      {
        id: "pros-cons",
        title: "Ventajas y desventajas de mantener esta regla",
        fields: [
          {
            type: "text",
            id: "advantages",
            label: "¿Cómo te ayuda esta regla?",
            placeholder: "Escribí de qué manera te beneficia mantener esta regla.",
          },
          {
            type: "text",
            id: "disadvantages",
            label: "¿Cómo te perjudica esta regla?",
            placeholder: "Escribí de qué manera te daña mantener esta regla.",
          },
        ],
      },
      {
        id: "decision",
        title: "Qué hacer con esta regla",
        fields: [
          {
            type: "choice",
            id: "decision",
            label: "¿Qué querés hacer con esta regla?",
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
            placeholder: "Escribí cómo sería la versión más adaptativa y saludable de esta regla.",
          },
        ],
      },
    ],
  },
];
