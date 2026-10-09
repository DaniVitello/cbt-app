"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { getTheme, getThemeEntries } from "@/lib/api";
import { useExercises } from "@/hooks/useExercises";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ThemePage() {
  const params = useParams<{ id: string }>();
  const t = useTranslations("exercise");
  const tt = useTranslations("theme");
  const locale = useLocale();
  const exercises = useExercises();

  const { data: theme, isLoading: themeLoading } = useQuery({
    queryKey: ["theme", params.id],
    queryFn: () => getTheme(params.id),
  });

  const { data: entries, isLoading: entriesLoading } = useQuery({
    queryKey: ["themeEntries", params.id],
    queryFn: () => getThemeEntries(params.id),
  });

  if (themeLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-4 h-24" />
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-muted-foreground">{tt("notFound")}</p>
        <Link href="/">
          <Button variant="link">{tt("backToHome")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/">
        <Button variant="link" className="mb-6 p-0">
          ← {tt("backToHome")}
        </Button>
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{theme.title}</h1>
        {theme.description && (
          <p className="mt-2 text-muted-foreground">{theme.description}</p>
        )}
        <span
          className={`mt-2 inline-block rounded px-2 py-0.5 text-xs ${
            theme.status === "in_progress"
              ? "bg-blue-100 text-blue-800"
              : theme.status === "done"
                ? "bg-green-100 text-green-800"
                : theme.status === "archived"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {tt(`status.${theme.status}`)}
        </span>
      </div>

      <h2 className="mb-4 text-lg font-semibold">{tt("timeline")}</h2>

      {entriesLoading ? (
        <Skeleton className="h-32" />
      ) : !entries || entries.length === 0 ? (
        <p className="text-muted-foreground">{tt("noEntries")}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => {
            const exercise = exercises.find((e) => e.id === entry.exerciseId);
            return (
              <Card key={entry.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {exercise?.title ?? entry.exerciseId}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString(locale)}
                  </p>
                  {entry.measures?.before != null && entry.measures?.after != null && (
                    <p className="mt-1 text-sm">
                      {t("measureChange", {
                        before: entry.measures.before,
                        after: entry.measures.after,
                      })}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
