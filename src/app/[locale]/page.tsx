"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getEntries, getThemes } from "@/lib/api";
import { IntentGrid } from "@/components/home/IntentGrid";
import { ContinueCard } from "@/components/home/ContinueCard";
import { ThemeCard } from "@/components/home/ThemeCard";
import { ExerciseCatalog } from "@/components/home/ExerciseCatalog";
import { useExercises } from "@/hooks/useExercises";

export default function Home() {
  const t = useTranslations("home");
  const exercises = useExercises();

  const { data: entries, isLoading: entriesLoading } = useQuery({
    queryKey: ["entries"],
    queryFn: () => getEntries(),
  });

  const { data: themes, isLoading: themesLoading } = useQuery({
    queryKey: ["themes"],
    queryFn: getThemes,
  });

  const drafts = (entries ?? [])
    .filter((e) => e.status === "draft")
    .map((e) => ({
      id: e.id,
      exerciseId: e.exerciseId,
      exerciseTitle: exercises.find((ex) => ex.id === e.exerciseId)?.title ?? e.exerciseId,
      updatedAt: e.updatedAt,
    }));

  const activeThemes = (themes ?? []).filter(
    (th) => th.status === "open" || th.status === "in_progress",
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 font-display text-3xl font-bold">{t("title")}</h1>
      <p className="mb-8 text-muted-foreground">{t("subtitle")}</p>

      <IntentGrid />
      <ContinueCard drafts={drafts} isLoading={entriesLoading} />
      <ThemeCard themes={activeThemes} isLoading={themesLoading} />
      <ExerciseCatalog />
    </div>
  );
}
