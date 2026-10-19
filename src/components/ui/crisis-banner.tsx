"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Banner de crisis (shell para el MVP 5). Mensaje empático breve + acceso
 * a recursos. Nunca se oculta por defecto: algunos momentos necesitan más
 * que una app.
 */
export function CrisisBanner() {
  const t = useTranslations("crisis");

  return (
    <div
      role="region"
      aria-label={t("title")}
      className="fixed inset-x-0 top-0 z-50 border-b bg-error/10 backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2">
        <p className="flex items-center gap-2 text-sm">
          <HeartHandshake className="h-4 w-4 shrink-0 text-error" aria-hidden="true" />
          <span>{t("message")}</span>
        </p>
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link href="/crisis">{t("cta")}</Link>
        </Button>
      </div>
    </div>
  );
}
