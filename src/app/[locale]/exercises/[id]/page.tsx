"use client";

import { useParams, useSearchParams, usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef, Suspense } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useExercises } from "@/hooks/useExercises";
import { ExerciseWizard } from "@/components/exercise/ExerciseWizard";
import { CompletionScreen } from "@/components/exercise/CompletionScreen";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getEntries, getEntry, createEntry, updateEntry, deleteEntry } from "@/lib/api";
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
      fresh={searchParams.get("fresh") === "1"}
    />
  );
}

type RootProps = {
  exerciseId: string;
  sourceId: string | null;
  fresh: boolean;
};

function ExerciseRoot({ exerciseId, sourceId, fresh }: RootProps) {
  const pathname = usePathname();
  // usePathname trae el locale (/es/...) pero el router i18n lo prefija
  // solo: se opera sin locale (igual que los <Link href="/exercises/...">).
  const basePath = pathname.replace(/^\/(es|en)(?=\/|$)/, "") || "/";
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
  // Se completó en ESTA sesión (el wizard muestra su propio cierre).
  // Distinto de "ya estaba completada al entrar" (solo lectura, D2).
  const [completedInSession, setCompletedInSession] = useState(false);
  const [redoOpen, setRedoOpen] = useState(false);
  const [redoChoice, setRedoChoice] = useState<"keep" | "delete">("keep");
  const [redoError, setRedoError] = useState(false);
  // Id de la instancia creada en un flujo ?fresh=1: los guardados siguientes
  // van a ESTA entry por id (no a entries[0], que podría ser la anterior).
  const [freshEntryId, setFreshEntryId] = useState<string | null>(null);
  // El flag ?fresh=1 se limpia de la URL tras inicializar; este estado
  // recuerda que el flujo fresco sigue en curso (si no, readOnly volvería
  // a true por la entry anterior y el wizard desaparecería).
  const [freshActive, setFreshActive] = useState(false);
  const debouncedAnswers = useDebounce(answers, 500);

  // Evita el doble PUT (la invalidación de queries re- disparaba el effect)
  // y carreras entre autoguardado y guardado final.
  const completedRef = useRef(false);
  const lastSavedRef = useRef<Record<string, unknown> | null>(null);
  const savePromiseRef = useRef<Promise<unknown> | null>(null);
  // La inicialización (entry existente o prefill) ocurre una sola vez.
  const [initialized, setInitialized] = useState(false);

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

  const existingEntry = entries !== undefined && entries.length > 0 ? entries[0] : null;
  // D2: reabrir una entry ya completada = vista de solo lectura. No pisa
  // respuestas, no revierte a draft. Completar en esta sesión sigue el
  // flujo normal del wizard (completedInSession).
  const readOnly =
    existingEntry?.status === "completed" && !completedInSession && !fresh && !freshActive;

  // Inicialización una sola vez, en fase de render (patrón "derivar estado
  // al renderizar" de React): entry existente > prefill desde ?source > vacío.
  // Sin effect con setState: el formulario nunca pinta vacío para rellenarse
  // después, y no hay renders en cascada. En solo lectura no hay nada que
  // inicializar (no hay formulario editable).
  if (!initialized && entries !== undefined && !sourcePending && !readOnly) {
    if (entries.length > 0 && !fresh) {
      // Ya hay un intento de este ejercicio: retomarlo, sin pisarlo con prefill.
      // (Con ?fresh=1 se ignora a propósito: es una instancia nueva.)
      setAnswers(entries[0].answers);
    } else if (sourceId && sourceEntry && exercise) {
      const sourceExercise = exercises.find((e) => e.id === sourceEntry.exerciseId);
      const prefill = sourceExercise
        ? getPrefill(sourceExercise, exercise, sourceEntry.answers)
        : {};
      if (Object.keys(prefill).length > 0) {
        setAnswers(prefill);
        setPrefilled(true);
      }
    }
    if (fresh) {
      setFreshActive(true);
    }
    setInitialized(true);
  }

  // El flag ?fresh=1 vale para una sola inicialización: se limpia de la URL
  // para que un refresh no ignore el borrador en curso y lo huérfane.
  useEffect(() => {
    if (initialized && fresh) {
      router.replace(sourceId ? `${basePath}?source=${sourceId}` : basePath);
    }
  }, [initialized, fresh, sourceId, basePath, router]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (freshEntryId) {
        return updateEntry(freshEntryId, {
          answers: debouncedAnswers,
          status: "draft",
        });
      }
      if (entries && entries.length > 0 && !fresh && !freshActive) {
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
    onSuccess: (entry) => {
      setSaveStatus("saved");
      // Flujo ?fresh=1: el POST crea la instancia nueva; los guardados
      // siguientes la referencian por id (ver freshEntryId).
      if ((fresh || freshActive) && !freshEntryId && entry) {
        setFreshEntryId(entry.id);
      }
      queryClient.invalidateQueries({ queryKey: ["entries", exerciseId] });
    },
    onError: () => {
      lastSavedRef.current = null;
      setSaveStatus("error");
    },
  });

  useEffect(() => {
    if (completedRef.current) return;
    // Solo lectura: jamás guardar (ni answers ni status) sobre una completada.
    if (readOnly) return;
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
      const targetId =
        freshEntryId ?? (await getEntries({ exerciseId, limit: 1 }))[0]?.id ?? null;
      const payload = {
        answers,
        status: "completed" as const,
        measureBefore: measures.before,
        measureAfter: measures.after,
      };
      if (targetId) {
        return updateEntry(targetId, payload);
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
    setCompletedInSession(true);
    setSaveStatus("saving");
    completeMutation.mutate(measures);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleRedoDelete = async () => {
    if (!existingEntry) return;
    setRedoError(false);
    try {
      await deleteEntry(existingEntry.id);
      setRedoOpen(false);
      setRedoChoice("keep");
      queryClient.invalidateQueries({ queryKey: ["entries", exerciseId] });
    } catch {
      setRedoError(true);
    }
  };

  const handleRedoKeep = () => {
    setRedoOpen(false);
    setRedoChoice("keep");
    router.push(
      sourceId ? `${basePath}?fresh=1&source=${sourceId}` : `${basePath}?fresh=1`,
    );
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
        <Button variant="link" className="p-0" asChild>
          <Link href="/">← {t("backToList")}</Link>
        </Button>
        <Button variant="link" className="p-0" asChild>
          <Link href={`/exercises/${exerciseId}/history`}>{t("history")}</Link>
        </Button>
      </div>

      <div aria-live="polite" className="mb-4 h-5 text-sm">
        {saveStatus === "saving" && (
          <span className="text-muted-foreground">{t("saving")}</span>
        )}
        {saveStatus === "saved" && (
          <span className="text-success dark:text-success-foreground">{t("saved")}</span>
        )}
        {saveStatus === "error" && (
          <span className="text-error">{t("saveError")}</span>
        )}
      </div>

      {readOnly && existingEntry ? (
        <>
          <CompletionScreen
            exercise={exercise}
            answers={existingEntry.answers}
            measureBefore={existingEntry.measures.before ?? null}
            measureAfter={existingEntry.measures.after ?? null}
            onBackToHome={handleBackToHome}
            sourceEntryId={existingEntry.id}
            isSaving={false}
          />

          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => setRedoOpen(true)}>
              {t("redoButton")}
            </Button>
          </div>

          <Dialog open={redoOpen} onOpenChange={setRedoOpen}>
            <DialogContent>
              <DialogTitle>{t("redoTitle")}</DialogTitle>
              <DialogDescription className="mt-1">
                {redoChoice === "keep" ? t("redoKeepDesc") : t("redoDeleteDesc")}
              </DialogDescription>
              <div className="mt-4 flex flex-col gap-3" role="radiogroup" aria-label={t("redoTitle")}>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3">
                  <input
                    type="radio"
                    name="redo-choice"
                    checked={redoChoice === "keep"}
                    onChange={() => setRedoChoice("keep")}
                    className="mt-1"
                  />
                  <span className="text-sm font-medium">{t("redoKeep")}</span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3">
                  <input
                    type="radio"
                    name="redo-choice"
                    checked={redoChoice === "delete"}
                    onChange={() => setRedoChoice("delete")}
                    className="mt-1"
                  />
                  <span className="text-sm font-medium">{t("redoDelete")}</span>
                </label>
              </div>
              {redoError && (
                <p role="alert" className="mt-3 text-sm text-error">
                  {t("redoError")}
                </p>
              )}
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setRedoOpen(false)}>
                  {tc("cancel")}
                </Button>
                <Button
                  onClick={() => (redoChoice === "keep" ? handleRedoKeep() : handleRedoDelete())}
                >
                  {t("redoConfirm")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <>
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
            // El gate del link (?source=) debe seguir cerrado mientras el
            // completado está en vuelo, aunque el autoguardado ya haya
            // resuelto (si no, se muestra un link sin source en el medio).
            isSaving={saveStatus === "saving" || completeMutation.isPending}
          />
        </>
      )}
    </div>
  );
}
