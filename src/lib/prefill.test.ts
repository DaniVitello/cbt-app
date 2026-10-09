import { describe, it, expect } from "vitest";
import { getPrefill } from "./prefill";
import { exercises } from "../data/exercises";
import type { Answers, Exercise } from "../types/exercise";

const downward = exercises.find((e) => e.id === "downward-arrow");
const coreBeliefs = exercises.find((e) => e.id === "core-beliefs-suitcases");
const disputing = exercises.find((e) => e.id === "disputing-irrational-beliefs");

function makeExercise(fields: { id: string }[], accepts?: Exercise["accepts"]): Exercise {
  return {
    id: "synthetic",
    version: 1,
    title: "",
    description: "",
    category: "",
    intents: [],
    sections: [
      {
        id: "s",
        title: "",
        fields: fields.map((f) => ({ type: "text", ...f, label: "" })),
      },
    ],
    accepts,
  };
}

describe("getPrefill — cadena outputs → accepts", () => {
  it("downward-arrow → core-beliefs: escribe la creencia anidada en el primer group", () => {
    expect(downward && coreBeliefs).toBeTruthy();
    const source: Answers = { "about-you-description": "Soy un fracaso" };

    const result = getPrefill(downward!, coreBeliefs!, source);

    expect(result).toEqual({
      "core-beliefs": { "belief-1": { belief: "Soy un fracaso" } },
    });
  });

  it("core-beliefs → disputing: toma la primera creencia no vacía", () => {
    const source: Answers = {
      "core-beliefs": {
        "belief-1": { belief: "", "reason-1": "" },
        "belief-2": { belief: "Nunca voy a lograr nada" },
        "belief-3": { belief: "No sirvo para nada" },
      },
    };

    const result = getPrefill(coreBeliefs!, disputing!, source);

    expect(result).toEqual({ "belief-description": "Nunca voy a lograr nada" });
  });

  it("omite el mapeo cuando el valor de origen está vacío", () => {
    const result = getPrefill(downward!, coreBeliefs!, {
      "about-you-description": "",
    });

    expect(result).toEqual({});
  });

  it("no escribe nada cuando el destino no declara accepts", () => {
    const pmr = exercises.find((e) => e.id === "pmr");

    const result = getPrefill(downward!, pmr!, {
      "about-you-description": "Soy un fracaso",
    });

    expect(result).toEqual({});
  });
});

describe("getPrefill — copia por ID coincidente", () => {
  it("copia campos top-level que existen en ambos ejercicios", () => {
    const source = makeExercise([{ id: "shared" }, { id: "only-source" }]);
    const target = makeExercise([{ id: "shared" }]);

    const result = getPrefill(source, target, {
      shared: "valor",
      "only-source": "no debería copiarse",
    });

    expect(result).toEqual({ shared: "valor" });
  });

  it("copia campos group completos cuando el ID coincide en ambos lados", () => {
    const source = makeExercise([{ id: "grp" }]);
    const target = makeExercise([{ id: "grp" }]);

    const result = getPrefill(source, target, { grp: { "g-1": { inner: "x" } } });

    expect(result).toEqual({ grp: { "g-1": { inner: "x" } } });
  });

  it("con origen vacío devuelve vacío", () => {
    const target = makeExercise([{ id: "a" }]);

    expect(getPrefill(target, target, {})).toEqual({});
  });
});
