"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { Exercise, Answers } from "@/types/exercise";
import { useExercises } from "@/hooks/useExercises";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";

type Props = {
  exercise: Exercise;
  answers: Answers;
  measureBefore: number | null;
  measureAfter: number | null;
  onBackToHome: () => void;
  /** Entry completada de la que viene la cadena; null = aún no disponible o no aplica. */
  sourceEntryId: string | null;
  /** true mientras el guardado de la completion está en vuelo. */
  isSaving: boolean;
};

export function CompletionScreen({
  exercise,
  answers,
  measureBefore,
  measureAfter,
  onBackToHome,
  sourceEntryId,
  isSaving,
}: Props) {
  const t = useTranslations("exercise");
  const exercises = useExercises();
  // Links de cadena deshabilitados hasta que la entry esté guardada, así
  // ?source= nunca se pierde por un click demasiado rápido.
  const waitingForSave = isSaving && sourceEntryId === null;
  // Al montar, el botón "Finalizar" desaparece y el foco se caería al body:
  // lo movemos al título para que lectores de pantalla/teclado naveguen desde ahí.
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold outline-none">
          {t("completionTitle")}
        </h1>
        <p className="mt-2 text-muted-foreground">{exercise.title}</p>
      </div>

      {/* Measure Change */}
      {exercise.measure && measureBefore !== null && measureAfter !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("measureChange", { before: measureBefore, after: measureAfter })}</CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("completionSummary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="flex flex-col gap-2">
            {exercise.sections.map((section) => (
              <div key={section.id} className="border-b pb-2 last:border-0">
                <dt className="font-medium">{section.title}</dt>
                <dd className="text-sm text-muted-foreground">
                  {section.fields.map((field) => {
                    const value = answers[field.id];
                    return (
                      <div key={field.id}>
                        <span className="font-medium">{field.label}:</span>{" "}
                        <span>{typeof value === "string" ? value : JSON.stringify(value)}</span>
                      </div>
                    );
                  })}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* Next Suggested */}
      {exercise.next && exercise.next.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("nextSuggested")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {exercise.next.map((nextId) => {
                const title = exercises.find((e) => e.id === nextId)?.title ?? nextId;
                if (waitingForSave) {
                  return (
                    <li key={nextId} className="flex items-center gap-2">
                      <Button variant="link" className="p-0" disabled>
                        {title}
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {t("saving")}
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={nextId}>
                    <Button variant="link" className="p-0" asChild>
                      <Link
                        href={
                          sourceEntryId
                            ? `/exercises/${nextId}?source=${sourceEntryId}`
                            : `/exercises/${nextId}`
                        }
                      >
                        {title}
                      </Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      <Button onClick={onBackToHome}>
        {t("backToHome")}
      </Button>
    </div>
  );
}
