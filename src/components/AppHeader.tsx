"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ThemeToggle } from "./ThemeToggle";

export function AppHeader() {
  const t = useTranslations("common");
  const pathname = usePathname();

  // La landing trae su propio header: no duplicar.
  if (pathname.endsWith("/landing")) return null;

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-sm font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {t("appName")}
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
