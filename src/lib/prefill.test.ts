import { describe, it, expect } from "vitest";
import { getPrefill } from "./prefill";

describe("getPrefill", () => {
  it("copies all answers from source", () => {
    const source = { field1: "value1", field2: "value2" };
    const result = getPrefill(source);
    expect(result).toEqual(source);
  });

  it("returns empty object when source is empty", () => {
    const result = getPrefill({});
    expect(result).toEqual({});
  });
});
