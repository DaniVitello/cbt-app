import type { Answers } from "../types/exercise";

/**
 * Simple prefill: copies answers from source to target when field IDs match.
 * Returns a partial answers object for the target exercise.
 */
export function getPrefill(sourceAnswers: Answers): Partial<Answers> {
  return { ...sourceAnswers };
}
