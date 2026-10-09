"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useExercises } from "@/hooks/useExercises";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const intentMap = {
  now: ["decatastrophizing", "rabbit-hole", "challenging-catastrophic", "thought-record", "dysfunctional-thought-record"],
  belief: ["downward-arrow", "core-beliefs-suitcases", "disputing-irrational-beliefs", "cataloging-inner-rules"],
  action: ["behavioral-experiments", "problem-solving", "wdep-questions"],
  relax: ["pmr", "i-will-survive"],
};

const intentIcons = {
  now: "💭",
  belief: "🎯",
  action: "⚡",
  relax: "🌿",
};

export function IntentGrid() {
  const t = useTranslations("home");
  const exercises = useExercises();

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold">{t("whatDoYouNeed")}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(intentMap).map(([intent, exerciseIds]) => (
          <Card key={intent} className="hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span>{intentIcons[intent as keyof typeof intentIcons]}</span>
                {t(`intent${intent.charAt(0).toUpperCase() + intent.slice(1)}`)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-1">
                {exerciseIds.map((id) => {
                  const exercise = exercises.find((e) => e.id === id);
                  if (!exercise) return null;
                  return (
                    <li key={id}>
                      <Link
                        href={`/exercises/${id}`}
                        className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                      >
                        {exercise.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
