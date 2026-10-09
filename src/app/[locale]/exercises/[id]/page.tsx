"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef, Suspense } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useExercises } from "@/hooks/useExercises";
import { ExerciseWizard } from "@/components/exercise/ExerciseWizard";
import { getEntries, getEntry, createEntry, updateEntry } from "@/lib/api";
import { getPrefill } from "@/lib/prefill";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";

type SaveStatus = "idle" | "saving" | "saved" | "error";
type Measures = { before: number | null; after: number | null };

export default function ExercisePage() {
  return (
    <Suspense fallback={null}>
      <ExerciseShell />
    </Suspense>
  );
}

/**
 * Uso de useSearchParams requiere estar dentro de un Suspense (regla de Next).
 * Este shell no guarda estado: ExerciseRoot se monta de nuevo con `key` al
 * cambiar de ejercicio, evitando que answers/refs/debounce se filtren entre
 * ejercicios (el App Router reutiliza el componente al cambiar sólo [id]).
 */
function ExerciseShell() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  return (
    <ExerciseRoot
      key={params.id}
      exerciseId={params.id}
      sourceId={searchParams.get("source")}
    />
  );
}

type RootProps = {
  exerciseId: string;
  sourceId: string | null;
};

function ExerciseRoot({ exerciseId, sourceId }: RootProps) {
  const exercises = useExercises();
  const exercise = exercises.find((e) => e.id === exerciseId);
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations("exercise");
  const tc = useTranslations("common");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [prefilled, setPrefilled] = useState(false);
  const [completedEntryId, setCompletedEntryId] = useState<string | null>(null);
  const debouncedAnswers = useDebounce(answers, 500);

  // Evita el doble PUT (la invalidación de queries re- disparaba el effect)
  // y carreras entre autoguardado y guardado final.
  const completedRef = useRef(false);
  const lastSavedRef = useRef<Record<string, unknown> | null>(null);
  const savePromiseRef = useRef<Promise<unknown> | null>(null);
  // La inicialización (entry existente o prefill) ocurre una sola vez.
  const initializedRef = useRef(false);

  const { data: entries, isLoading } = useQuery({
    queryKey: ["entries", exerciseId],
    queryFn: () => getEntries({ exerciseId }),
  });

  const { data: sourceEntry, isError: sourceError } = useQuery({
    queryKey: ["entry", sourceId],
    queryFn: () => getEntry(sourceId as string),
    enabled: sourceId !== null,
  });

  // Esperamos la fuente del prefill antes de mostrar el formulario, así el
  // usuario nunca ve (ni tipea en) campos vacíos que se van a completar solos.
  const sourcePending =
    sourceId !== null && sourceEntry === undefined && !sourceError;

  // Inicialización: entry existente > prefill desde ?source > vacío.
  useEffect(() => {
    if (initializedRef.current || entries === undefined || sourcePending) return;
    if (entries.length > 0) {
      // Ya hay un intento de este ejercicio: retomarlo, sin pisarlo con prefill.
      setAnswers(entries[0].answers);
      initializedRef.current = true;
      return;
    }
    if (sourceId && sourceEntry && exercise) {
      const sourceExercise = exercises.find((e) => e.id === sourceEntry.exerciseId);
      const prefill = sourceExercise
        ? getPrefill(sourceExercise, exercise, sourceEntry.answers)
        : {};
      if (Object.keys(prefill).length > 0) {
        setAnswers(prefill);
        setPrefilled(true);
      }
    }
    initializedRef.current = true;
  }, [entries, sourceEntry, sourcePending, sourceId, exercise]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (entries && entries.length > 0) {
        return updateEntry(entries[0].id, {
          answers: debouncedAnswers,
          status: "draft",
        });
      }
      return createEntry({
        exerciseId,
        answers: debouncedAnswers,
        status: "draft",
        sourceEntryId: sourceId,
      });
    },
    onSuccess: () => {
      setSaveStatus("saved");
      queryClient.invalidateQueries({ queryKey: ["entries", exerciseId] });
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
      const fresh = await getEntries({ exerciseId, limit: 1 });
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
        exerciseId,
        answers,
        status: "completed",
        measureBefore: measures.before,
        measureAfter: measures.after,
        sourceEntryId: sourceId,
      });
    },
    onSuccess: (entry) => {
      setSaveStatus("saved");
      // Habilita el link de "siguiente paso" con ?source=<entry completada>.
      setCompletedEntryId(entry.id);
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

  if (isLoading || sourcePending) {
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
        <Link href={`/exercises/${exerciseId}/history`}>
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

      {prefilled && (
        <div className="mb-4 rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground">
          {t("prefilled")}
        </div>
      )}

      <ExerciseWizard
        exercise={exercise}
        answers={answers}
        onChange={setAnswers}
        onComplete={handleComplete}
        onBackToHome={handleBackToHome}
        completedEntryId={completedEntryId}
        isSaving={saveStatus === "saving"}
      />
    </div>
  );
}
