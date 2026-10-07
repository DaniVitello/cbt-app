import type { Exercise, Answers } from "../types/exercise";
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
    <div className="max-w-2xl mx-auto p-8 flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold">{exercise.title}</h1>
        <p className="text-gray-600 mt-2">{exercise.description}</p>
      </header>

      {exercise.sections.map((section) => (
        <section key={section.id} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">{section.title}</h2>
          {section.fields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={answers[field.id]}
              onChange={(value) => handleChange(field.id, value)}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
