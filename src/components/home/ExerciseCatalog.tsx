"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useExercises } from "@/hooks/useExercises";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const categories = ["thoughts", "anxiety", "action", "selfcare"] as const;

export function ExerciseCatalog() {
  const t = useTranslations("home");
  const exercises = useExercises();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <section>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          {t("allExercises")}
        </Button>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("allExercises")}</h2>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          ✕
        </Button>
      </div>
      <div className="flex flex-col gap-6">
        {categories.map((category) => {
          const categoryExercises = exercises.filter((e) => e.category === category);
          if (categoryExercises.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="mb-2 text-lg font-medium">{t(`categories.${category}`)}</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                {t(`categories.${category}Desc`)}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categoryExercises.map((exercise) => (
                  <Link key={exercise.id} href={`/exercises/${exercise.id}`}>
                    <Card className="h-full hover:border-primary">
                      <CardHeader>
                        <CardTitle className="text-base">{exercise.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-2 text-sm text-muted-foreground" title={exercise.description}>
                          {exercise.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
