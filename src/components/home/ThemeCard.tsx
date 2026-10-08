"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Theme } from "@/lib/api";

interface ThemeCardProps {
  themes: Theme[];
  isLoading: boolean;
}

export function ThemeCard({ themes, isLoading }: ThemeCardProps) {
  const t = useTranslations("home");
  const tt = useTranslations("theme");

  if (isLoading) {
    return (
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">{t("activeThemes")}</h2>
        <Skeleton className="h-24" />
      </section>
    );
  }

  if (themes.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">{t("activeThemes")}</h2>
        <p className="text-sm text-muted-foreground">{t("noThemes")}</p>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold">{t("activeThemes")}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {themes.map((theme) => (
          <Card key={theme.id}>
            <CardHeader>
              <CardTitle className="text-base">{theme.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-muted-foreground">
                {tt(`status.${theme.status}`)}
              </p>
              <Link href={`/themes/${theme.id}`}>
                <Button variant="outline" size="sm">
                  {t("activeThemes")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
