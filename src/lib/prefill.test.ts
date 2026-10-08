import { describe, it, expect } from "vitest";
import { getPrefill } from "./prefill";
import type { Exercise } from "../types/exercise";

const sourceExercise: Exercise = {
  id: "downward-arrow",
  version: 1,
  title: "Downward Arrow",
  description: "Test",
  category: "thoughts",
  intents: ["belief"],
  sections: [],
  outputs: [
    { fieldId: "about-you-description", kind: "belief" },
  ],
};

const targetExercise: Exercise = {
  id: "core-beliefs-suitcases",
  version: 1,
  title: "Core Beliefs",
  description: "Test",
  category: "thoughts",
  intents: ["belief"],
  sections: [],
  accepts: [
    { kind: "belief", intoFieldId: "belief" },
  ],
};

describe("getPrefill", () => {
  it("returns empty object when source has no outputs", () => {
    const result = getPrefill(
      { ...sourceExercise, outputs: undefined },
      targetExercise,
      { "about-you-description": "Soy un fracaso" },
    );
    expect(result).toEqual({});
  });

  it("returns empty object when target has no accepts", () => {
    const result = getPrefill(
      sourceExercise,
      { ...targetExercise, accepts: undefined },
      { "about-you-description": "Soy un fracaso" },
    );
    expect(result).toEqual({});
  });

  it("maps belief output to belief accept", () => {
    const result = getPrefill(
      sourceExercise,
      targetExercise,
      { "about-you-description": "Soy un fracaso" },
    );
    expect(result).toEqual({ belief: "Soy un fracaso" });
  });

  it("skips undefined values", () => {
    const result = getPrefill(
      sourceExercise,
      targetExercise,
      {},
    );
    expect(result).toEqual({});
  });

  it("skips null values", () => {
    const result = getPrefill(
      sourceExercise,
      targetExercise,
      { "about-you-description": null },
    );
    expect(result).toEqual({});
  });

  it("does not map when kinds do not match", () => {
    const targetWithThoughtAccept: Exercise = {
      ...targetExercise,
      accepts: [{ kind: "thought", intoFieldId: "thought-field" }],
    };
    const result = getPrefill(
      sourceExercise,
      targetWithThoughtAccept,
      { "about-you-description": "Soy un fracaso" },
    );
    expect(result).toEqual({});
  });
});
