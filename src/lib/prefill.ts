import type { Exercise, Answers, OutputKind } from "../types/exercise";

/**
 * Pure function that computes prefill answers for a target exercise
 * based on the outputs of a source exercise.
 *
 * Uses `outputs` from the source exercise and `accepts` from the target
 * to map values between fields.
 */
export function getPrefill(
  sourceExercise: Exercise,
  targetExercise: Exercise,
  sourceAnswers: Answers,
): Partial<Answers> {
  const prefill: Partial<Answers> = {};

  if (!sourceExercise.outputs || !targetExercise.accepts) {
    return prefill;
  }

  for (const output of sourceExercise.outputs) {
    const value = sourceAnswers[output.fieldId];
    if (value === undefined || value === null) continue;

    for (const accept of targetExercise.accepts) {
      if (accept.kind === output.kind) {
        prefill[accept.intoFieldId] = value;
      }
    }
  }

  return prefill;
}
