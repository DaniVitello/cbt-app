import type { Answers, Exercise, Field } from "../types/exercise";

/**
 * Prefill de cadena entre ejercicios. Combina dos mecanismos:
 *
 * 1. outputs → accepts (encadenamiento explícito): cada ejercicio declara
 *    qué produce (`outputs`, con un `kind`) y qué recibe (`accepts`, con el
 *    mismo `kind` y el campo destino). El valor de origen se escribe en el
 *    campo destino aunque los IDs no coincidan (ej: "about-you-description"
 *    → "belief") y aunque el campo destino esté anidado dentro de un group.
 * 2. Copia por ID coincidente: campos top-level que existen con el mismo ID
 *    en origen y destino se copian tal cual (los IDs de campo son contrato,
 *    así que compartir ID implica compartir significado).
 *
 * No copia nada que esté vacío: un prefill jamás debe pintar campos con "".
 */

function topLevelFields(exercise: Exercise): Field[] {
  return exercise.sections.flatMap((s) => s.fields);
}

function findTopLevelField(exercise: Exercise, fieldId: string): Field | undefined {
  return topLevelFields(exercise).find((f) => f.id === fieldId);
}

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === "";
}

/** Lee un valor (top-level o anidado en un group) desde las respuestas de origen. */
function readFieldValue(
  exercise: Exercise,
  answers: Answers,
  fieldId: string,
): unknown {
  if (findTopLevelField(exercise, fieldId)) {
    return answers[fieldId];
  }
  // Campo anidado en algún group: recorre los grupos en orden y devuelve
  // la primera aparición no vacía (ej: la primera creencia que se escribió).
  for (const field of topLevelFields(exercise)) {
    if (field.type !== "group") continue;
    const groupAnswers = (answers[field.id] ?? {}) as Record<
      string,
      Record<string, unknown>
    >;
    for (const group of field.groups) {
      if (!group.fields.some((f) => f.id === fieldId)) continue;
      const value = groupAnswers[group.id]?.[fieldId];
      if (!isEmpty(value)) return value;
    }
  }
  return undefined;
}

/** Escribe un valor en el campo destino (top-level o anidado en el primer group). */
function writeFieldValue(
  exercise: Exercise,
  answers: Answers,
  fieldId: string,
  value: unknown,
): void {
  if (findTopLevelField(exercise, fieldId)) {
    answers[fieldId] = value;
    return;
  }
  for (const field of topLevelFields(exercise)) {
    if (field.type !== "group") continue;
    if (!field.groups.some((g) => g.fields.some((f) => f.id === fieldId))) continue;
    const firstGroup = field.groups[0];
    const current = (answers[field.id] ?? {}) as Record<
      string,
      Record<string, unknown>
    >;
    answers[field.id] = {
      ...current,
      [firstGroup.id]: { ...current[firstGroup.id], [fieldId]: value },
    };
    return;
  }
  // Sin destino conocido en el ejercicio target: no escribimos a ciegas.
}

export function getPrefill(
  source: Exercise,
  target: Exercise,
  sourceAnswers: Answers,
): Partial<Answers> {
  const result: Answers = {};

  // 1) Encadenamiento explícito outputs → accepts por kind.
  for (const accept of target.accepts ?? []) {
    const output = source.outputs?.find((o) => o.kind === accept.kind);
    if (!output) continue;
    const value = readFieldValue(source, sourceAnswers, output.fieldId);
    if (isEmpty(value)) continue;
    writeFieldValue(target, result, accept.intoFieldId, value);
  }

  // 2) Copia por ID coincidente (sólo campos top-level de ambos lados).
  const targetIds = new Set(topLevelFields(target).map((f) => f.id));
  for (const [fieldId, value] of Object.entries(sourceAnswers)) {
    if (!targetIds.has(fieldId)) continue;
    if (!findTopLevelField(source, fieldId)) continue;
    if (result[fieldId] !== undefined) continue; // ya lo escribió el mecanismo 1
    if (isEmpty(value)) continue;
    result[fieldId] = value;
  }

  return result;
}
