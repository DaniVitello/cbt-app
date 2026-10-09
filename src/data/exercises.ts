import type { Exercise } from "../types/exercise";
import { exercises as exercisesEs } from "./exercises.es";
import { exercisesEn } from "./exercises.en";

export type ExerciseLocale = "es" | "en";

/**
 * Índice de ejercicios por locale. Los ids, sections, fields y values son
 * idénticos entre locales (garantizado por exercises.parity.test.ts); solo
 * cambian los strings visibles.
 */
const byLocale: Record<ExerciseLocale, Exercise[]> = {
  es: exercisesEs,
  en: exercisesEn,
};

/** Devuelve los ejercicios para un locale; fallback a español si no existe. */
export function getExercises(locale: string): Exercise[] {
  return byLocale[locale as ExerciseLocale] ?? exercisesEs;
}

/**
 * Contenido en español. Solo para código sin acceso al locale (tests).
 * En componentes usar `useExercises()`.
 */
export const exercises: Exercise[] = exercisesEs;
