"use client";

import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ContinueCardProps {
  drafts: Array<{
    id: string;
    exerciseId: string;
    exerciseTitle: string;
    updatedAt: string;
  }>;
  isLoading: boolean;
}

export function ContinueCard({ drafts, isLoading }: ContinueCardProps) {
  const t = useTranslations("home");
  const locale = useLocale();

  if (isLoading) {
    return (
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">{t("continueWhereLeft")}</h2>
        <Skeleton className="h-24" />
      </section>
    );
  }

  if (drafts.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">{t("continueWhereLeft")}</h2>
        <p className="text-sm text-muted-foreground">{t("noDrafts")}</p>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold">{t("continueWhereLeft")}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {drafts.map((draft) => (
          <Card key={draft.id}>
            <CardHeader>
              <CardTitle className="text-base">{draft.exerciseTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-muted-foreground">
                {new Date(draft.updatedAt).toLocaleString(locale)}
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/exercises/${draft.exerciseId}`}>{t("continueWhereLeft")}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
