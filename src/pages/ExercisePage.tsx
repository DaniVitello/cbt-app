import { useParams, Link } from "react-router-dom";
import { exercises } from "../data/exercises";
import { ExerciseForm } from "../components/ExerciseForm";

export function ExercisePage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const exercise = exercises.find((e) => e.id === exerciseId);

  if (!exercise) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Ejercicio no encontrado.
        </p>
        <Link
          to="/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        ← Volver a la lista
      </Link>
      <ExerciseForm exercise={exercise} />
    </div>
  );
}
