"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

type ThemeName = "light" | "dark" | "system";

const NEXT_THEME: Record<ThemeName, ThemeName> = {
  light: "dark",
  dark: "system",
  system: "light",
};

/**
 * Verdadero solo en el cliente (patrón isomorphic sin effects: el servidor
 * siempre ve `false`, así no hay mismatch de hidratación).
 */
function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const t = useTranslations("common");
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  // Evita mismatch de hidratación: next-themes solo sabe el tema en el cliente.
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-11 w-11"
        aria-hidden="true"
        tabIndex={-1}
        disabled
      />
    );
  }

  const current: ThemeName = theme === "dark" || theme === "system" ? theme : "light";
  const label =
    current === "dark" ? t("darkMode") : current === "light" ? t("lightMode") : t("systemMode");

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-11 w-11"
      onClick={() => setTheme(NEXT_THEME[current])}
      aria-label={label}
      title={label}
    >
      {current === "dark" ? (
        <Moon className="h-5 w-5" aria-hidden="true" />
      ) : current === "light" ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Monitor className="h-5 w-5" aria-hidden="true" />
      )}
    </Button>
  );
}
