"use client";

import type { Exercise, Answers } from "@/types/exercise";
import { FieldRenderer } from "./FieldRenderer";

type Props = {
  exercise: Exercise;
  answers: Answers;
  onChange: (answers: Answers) => void;
};

export function ExerciseForm({ exercise, answers, onChange }: Props) {
  const handleChange = (fieldId: string, value: unknown) => {
    onChange({ ...answers, [fieldId]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      {exercise.sections.flatMap((section) =>
        section.fields.map((field) => (
          <FieldRenderer
            key={`${section.id}.${field.id}`}
            field={field}
            value={answers[field.id]}
            onChange={(value) => handleChange(field.id, value)}
          />
        )),
      )}
    </div>
  );
}
