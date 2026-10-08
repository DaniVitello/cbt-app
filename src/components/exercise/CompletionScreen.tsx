"use client";

import { useTranslations } from "next-intl";
import type { Exercise, Answers } from "@/types/exercise";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  exercise: Exercise;
  answers: Answers;
  measureBefore: number | null;
  measureAfter: number | null;
  onBackToHome: () => void;
};

export function CompletionScreen({
  exercise,
  answers,
  measureBefore,
  measureAfter,
  onBackToHome,
}: Props) {
  const t = useTranslations("exercise");

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t("completionTitle")}</h1>
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
              {exercise.next.map((nextId) => (
                <li key={nextId}>
                  <Button variant="link" className="p-0">
                    {nextId}
                  </Button>
                </li>
              ))}
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
