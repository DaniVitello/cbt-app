"use client";

import { useTranslations } from "next-intl";
import { Phone, Globe, HeartHandshake } from "lucide-react";

export function CrisisView() {
  const t = useTranslations("crisis");

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex items-center gap-3">
        <HeartHandshake className="h-8 w-8 text-error" aria-hidden="true" />
        <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
      </div>
      <p className="mt-4 text-lg">{t("intro")}</p>

      <h2 className="mt-8 text-xl font-semibold">{t("immediateTitle")}</h2>
      <ul className="mt-3 flex flex-col gap-2">
        <li className="flex items-start gap-2">
          <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t("emergency")}</span>
        </li>
        <li className="flex items-start gap-2">
          <Globe className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t("findHelpline")}</span>
        </li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">{t("rememberTitle")}</h2>
      <p className="mt-3">{t("remember")}</p>
    </main>
  );
}
