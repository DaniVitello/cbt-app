import { describe, it, expect } from "vitest";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { exercises } from "./exercises";
import type { Exercise, Field } from "../types/exercise";

/**
 * Contrato de ids: las respuestas guardadas dependen de los `id` de
 * ejercicios y campos. Renombrar uno en silencio deja respuestas huérfanas.
 *
 * Este test congela { versión + ids } por ejercicio en
 * exercise-ids.snapshot.json. Si falla:
 *  1. ¿El cambio fue intencional? Subí `version` en exercises.es.ts
 *     (y su espejo en exercises.en.ts).
 *  2. Regenerá el snapshot: UPDATE_SNAPSHOT=1 npx vitest run src/data/exercise-ids.snapshot.test.ts
 *  3. Revisá el diff del snapshot en el commit: es la prueba visible del cambio.
 */
interface ExerciseSnapshot {
  version: number;
  measure: string | null;
  fields: string[];
}

type Snapshot = Record<string, ExerciseSnapshot>;

const SNAPSHOT_PATH = join(dirname(fileURLToPath(import.meta.url)), "exercise-ids.snapshot.json");

function collectFieldPaths(field: Field, prefix: string): string[] {
  const path = prefix ? `${prefix}.${field.id}` : field.id;
  const out = [path];
  if (field.type === "group") {
    for (const g of field.groups) {
      const gPath = `${path}.${g.id}`;
      out.push(gPath);
      for (const f of g.fields) out.push(...collectFieldPaths(f, gPath));
    }
  } else if (field.type === "rows") {
    for (const c of field.columns) out.push(...collectFieldPaths(c, path));
  }
  return out;
}

function buildSnapshot(list: Exercise[]): Snapshot {
  const snap: Snapshot = {};
  for (const ex of list) {
    const fields = ex.sections.flatMap((s) => s.fields.flatMap((f) => collectFieldPaths(f, "")));
    snap[ex.id] = {
      version: ex.version,
      measure: ex.measure?.id ?? null,
      // Orden-insensible: el contrato son los ids, no el orden en pantalla.
      fields: [...new Set(fields)].sort(),
    };
  }
  return snap;
}

function duplicates(list: string[]): string[] {
  return [...new Set(list.filter((x, i) => list.indexOf(x) !== i))];
}

describe("contrato de ids", () => {
  it("el snapshot coincide con las definiciones (o explica cómo actualizarlo)", () => {
    if (process.env.UPDATE_SNAPSHOT === "1") {
      writeFileSync(SNAPSHOT_PATH, JSON.stringify(buildSnapshot(exercises), null, 2) + "\n");
      return;
    }

    let snapshot: Snapshot;
    try {
      snapshot = JSON.parse(readFileSync(SNAPSHOT_PATH, "utf-8")) as Snapshot;
    } catch {
      throw new Error(
        "Falta exercise-ids.snapshot.json. Generarlo con: UPDATE_SNAPSHOT=1 npx vitest run src/data/exercise-ids.snapshot.test.ts",
      );
    }

    const currentIds = exercises.map((e) => e.id).sort();
    const snapshotIds = Object.keys(snapshot).sort();
    expect(
      { onlyInCode: currentIds.filter((id) => !snapshotIds.includes(id)), onlyInSnapshot: snapshotIds.filter((id) => !currentIds.includes(id)) },
      "Ejercicios agregados/eliminados: si fue intencional, regenerá el snapshot",
    ).toEqual({ onlyInCode: [], onlyInSnapshot: [] });

    for (const ex of exercises) {
      const snap = snapshot[ex.id];
      expect(ex.version, `${ex.id}: la versión cambió sin regenerar el snapshot`).toBe(snap.version);
      const fields = ex.sections.flatMap((s) => s.fields.flatMap((f) => collectFieldPaths(f, "")));
      expect(
        duplicates(fields),
        `${ex.id}: ids de campo duplicados (colisionan en las respuestas guardadas)`,
      ).toEqual([]);
      expect(
        [...new Set(fields)].sort(),
        `${ex.id}: cambiaron ids de campo. Si fue intencional: subí version y regenerá el snapshot`,
      ).toEqual(snap.fields);
    }
  });
});
