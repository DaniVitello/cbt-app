import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { exercises } from "../data/exercises";
import { ExerciseForm } from "../components/ExerciseForm";
import { getEntries, createEntry, updateEntry } from "../api/entries";
import { useDebounce } from "../hooks/useDebounce";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function ExercisePage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const exercise = exercises.find((e) => e.id === exerciseId);
  const queryClient = useQueryClient();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const debouncedAnswers = useDebounce(answers, 500);

  const { data: entries, isLoading } = useQuery({
    queryKey: ["entries", exerciseId],
    queryFn: () => getEntries(exerciseId),
  });

  useEffect(() => {
    if (entries && entries.length > 0) {
      setAnswers(entries[0].answers);
    }
  }, [entries]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (entries && entries.length > 0) {
        return updateEntry(entries[0].id, {
          answers: debouncedAnswers,
          status: "draft",
        });
      }
      return createEntry({
        exercise_id: exerciseId!,
        answers: debouncedAnswers,
        status: "draft",
      });
    },
    onSuccess: () => {
      setSaveStatus("saved");
      queryClient.invalidateQueries({ queryKey: ["entries", exerciseId] });
    },
    onError: () => {
      setSaveStatus("error");
    },
  });

  useEffect(() => {
    if (
      debouncedAnswers &&
      Object.keys(debouncedAnswers).length > 0 &&
      entries !== undefined
    ) {
      setSaveStatus("saving");
      saveMutation.mutate();
    }
  }, [debouncedAnswers, entries]);

  if (!exercise) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Ejercicio no encontrado.
        </p>
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Volver a la lista
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Volver a la lista
        </Link>
        <Link
          to={`/history/${exerciseId}`}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Ver historial
        </Link>
      </div>

      <div aria-live="polite" className="text-sm mb-4 h-5">
        {saveStatus === "saving" && (
          <span className="text-gray-500 dark:text-gray-400">Guardando...</span>
        )}
        {saveStatus === "saved" && (
          <span className="text-green-600 dark:text-green-400">Guardado</span>
        )}
        {saveStatus === "error" && (
          <span className="text-red-600 dark:text-red-400">
            Error al guardar
          </span>
        )}
      </div>

      <ExerciseForm exercise={exercise} answers={answers} onChange={setAnswers} />
    </div>
  );
}
