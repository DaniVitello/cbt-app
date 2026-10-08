"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Link from "next/link";
import { exercises } from "@/data/exercises";
import { ExerciseWizard } from "@/components/exercise/ExerciseWizard";
import { getEntries, createEntry, updateEntry } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function ExercisePage() {
  const params = useParams<{ id: string }>();
  const exercise = exercises.find((e) => e.id === params.id);
  const queryClient = useQueryClient();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const debouncedAnswers = useDebounce(answers, 500);

  const { data: entries, isLoading } = useQuery({
    queryKey: ["entries", params.id],
    queryFn: () => getEntries({ exerciseId: params.id }),
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
        exercise_id: params.id,
        answers: debouncedAnswers,
        status: "draft",
      });
    },
    onSuccess: () => {
      setSaveStatus("saved");
      queryClient.invalidateQueries({ queryKey: ["entries", params.id] });
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
      <div className="py-12 text-center">
        <p className="mb-4 text-muted-foreground">Ejercicio no encontrado.</p>
        <Link href="/">
          <Button variant="link">Volver a la lista</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/">
          <Button variant="link" className="p-0">
            ← Volver a la lista
          </Button>
        </Link>
        <Link href={`/exercises/${params.id}/history`}>
          <Button variant="link" className="p-0">
            Ver historial
          </Button>
        </Link>
      </div>

      <div aria-live="polite" className="mb-4 h-5 text-sm">
        {saveStatus === "saving" && (
          <span className="text-muted-foreground">Guardando...</span>
        )}
        {saveStatus === "saved" && (
          <span className="text-green-600">Guardado</span>
        )}
        {saveStatus === "error" && (
          <span className="text-red-600">Error al guardar</span>
        )}
      </div>

      <ExerciseWizard
        exercise={exercise}
        answers={answers}
        onChange={setAnswers}
      />
    </div>
  );
}
