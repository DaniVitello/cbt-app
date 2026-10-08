"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { exercises } from "@/data/exercises";
import { ExerciseWizard } from "@/components/exercise/ExerciseWizard";
import { getEntries, createEntry, updateEntry } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";

type SaveStatus = "idle" | "saving" | "saved" | "error";
type Measures = { before: number | null; after: number | null };

export default function ExercisePage() {
  const params = useParams<{ id: string }>();
  const exercise = exercises.find((e) => e.id === params.id);
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations("exercise");
  const tc = useTranslations("common");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const debouncedAnswers = useDebounce(answers, 500);

  // Evita el doble PUT (la invalidación de queries re- disparaba el effect)
  // y carreras entre autoguardado y guardado final.
  const completedRef = useRef(false);
  const lastSavedRef = useRef<Record<string, unknown> | null>(null);
  const savePromiseRef = useRef<Promise<unknown> | null>(null);

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
        exerciseId: params.id,
        answers: debouncedAnswers,
        status: "draft",
      });
    },
    onSuccess: () => {
      setSaveStatus("saved");
      queryClient.invalidateQueries({ queryKey: ["entries", params.id] });
    },
    onError: () => {
      lastSavedRef.current = null;
      setSaveStatus("error");
    },
  });

  useEffect(() => {
    if (completedRef.current) return;
    const existing = entries && entries.length > 0 ? entries[0] : null;
    // misma referencia ⇒ son las respuestas que ya vienen guardadas, no hay nada nuevo
    const unchanged = existing !== null && existing.answers === debouncedAnswers;
    if (
      debouncedAnswers &&
      Object.keys(debouncedAnswers).length > 0 &&
      entries !== undefined &&
      !unchanged &&
      lastSavedRef.current !== debouncedAnswers
    ) {
      setSaveStatus("saving");
      lastSavedRef.current = debouncedAnswers;
      // catch: el manejo de errores ya lo hace onError; acá solo evitamos
      // un rejection sin handler y guardamos la promesa para serializar.
      savePromiseRef.current = saveMutation.mutateAsync().catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAnswers, entries]);

  const completeMutation = useMutation({
    mutationFn: async (measures: Measures) => {
      // Esperamos cualquier autoguardado en vuelo para no duplicar la entry.
      await savePromiseRef.current;
      const fresh = await getEntries({ exerciseId: params.id, limit: 1 });
      const payload = {
        answers,
        status: "completed" as const,
        measureBefore: measures.before,
        measureAfter: measures.after,
      };
      if (fresh.length > 0) {
        return updateEntry(fresh[0].id, payload);
      }
      return createEntry({
        exerciseId: params.id,
        answers,
        status: "completed",
        measureBefore: measures.before,
        measureAfter: measures.after,
      });
    },
    onSuccess: () => {
      setSaveStatus("saved");
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
    onError: () => {
      setSaveStatus("error");
    },
  });

  const handleComplete = (measures: Measures) => {
    completedRef.current = true;
    setSaveStatus("saving");
    completeMutation.mutate(measures);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  if (!exercise) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-muted-foreground">{t("notFound")}</p>
        <Link href="/">
          <Button variant="link">{t("backToList")}</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{tc("loading")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/">
          <Button variant="link" className="p-0">
            ← {t("backToList")}
          </Button>
        </Link>
        <Link href={`/exercises/${params.id}/history`}>
          <Button variant="link" className="p-0">
            {t("history")}
          </Button>
        </Link>
      </div>

      <div aria-live="polite" className="mb-4 h-5 text-sm">
        {saveStatus === "saving" && (
          <span className="text-muted-foreground">{t("saving")}</span>
        )}
        {saveStatus === "saved" && (
          <span className="text-green-600">{t("saved")}</span>
        )}
        {saveStatus === "error" && (
          <span className="text-red-600">{t("saveError")}</span>
        )}
      </div>

      <ExerciseWizard
        exercise={exercise}
        answers={answers}
        onChange={setAnswers}
        onComplete={handleComplete}
        onBackToHome={handleBackToHome}
      />
    </div>
  );
}
