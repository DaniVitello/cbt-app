import { describe, expect, it } from "vitest";
import type { Exercise } from "../types/exercise";
import { exercises as exercisesEs } from "./exercises.es";
import { exercisesEn } from "./exercises.en";

/**
 * Paridad entre locales: la estructura de ejercicios (ids, tipos, órdenes,
 * números, presencia de claves opcionales como help/measure) debe ser idéntica
 * en ES y EN. Los strings visibles se ignoran acá — se verifican en la app.
 *
 * Si este test falla, alguien agregó/quitó un campo en un solo locale.
 */
function shape(node: unknown): unknown {
  if (typeof node === "string") return "__string__";
  if (Array.isArray(node)) return node.map(shape);
  if (node !== null && typeof node === "object") {
    return Object.fromEntries(
      Object.entries(node as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => [key, shape(value)]),
    );
  }
  return node;
}

function byId(list: Exercise[]): Map<string, Exercise> {
  return new Map(list.map((e) => [e.id, e]));
}

describe("exercises ES/EN parity", () => {
  it("define al menos un locale por ejercicio y comparten los mismos ids, en el mismo orden", () => {
    expect(exercisesEn.map((e) => e.id)).toEqual(exercisesEs.map((e) => e.id));
  });

  it("mantiene la misma estructura para cada ejercicio (secciones, campos, opciones, valores)", () => {
    const enById = byId(exercisesEn);

    for (const es of exercisesEs) {
      const en = enById.get(es.id);
      expect(en, `Falta el ejercicio EN "${es.id}"`).toBeDefined();
      expect(shape(en), `Drift estructural en "${es.id}"`).toEqual(shape(es));
    }
  });

  it("los ids de medición coinciden entre locales", () => {
    for (const es of exercisesEs) {
      const en = byId(exercisesEn).get(es.id)!;
      expect(en.measure?.id, `measure.id de "${es.id}"`).toBe(es.measure?.id);
      expect(en.measure?.min, `measure.min de "${es.id}"`).toBe(es.measure?.min);
      expect(en.measure?.max, `measure.max de "${es.id}"`).toBe(es.measure?.max);
    }
  });

  it("outputs, accepts y next son idénticos (contrato de encadenamiento entre ejercicios)", () => {
    for (const es of exercisesEs) {
      const en = byId(exercisesEn).get(es.id)!;
      expect(en.outputs, `outputs de "${es.id}"`).toEqual(es.outputs);
      expect(en.accepts, `accepts de "${es.id}"`).toEqual(es.accepts);
      expect(en.next, `next de "${es.id}"`).toEqual(es.next);
    }
  });
});
