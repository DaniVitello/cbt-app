import { Link } from "react-router-dom";
import { exercises } from "../data/exercises";

export function ExerciseList() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Ejercicios
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Elegí un ejercicio para comenzar. Podés volver a tus respuestas cuando
        quieras.
      </p>

      <div className="grid gap-4 sm:grid-cols-2" role="list">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            role="listitem"
            className="p-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all"
          >
            <Link
              to={`/exercises/${exercise.id}`}
              className="block"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {exercise.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {exercise.description}
              </p>
            </Link>
            <Link
              to={`/history/${exercise.id}`}
              className="inline-block mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver historial
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
