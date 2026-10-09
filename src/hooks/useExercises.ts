"use client";

import { useLocale } from "next-intl";
import { getExercises } from "@/data/exercises";
import type { Exercise } from "@/types/exercise";

/**
 * Ejercicios localizados según el locale activo de next-intl (es/en).
 * Reemplaza al import estático `exercises` en componentes cliente.
 */
export function useExercises(): Exercise[] {
  const locale = useLocale();
  return getExercises(locale);
}
