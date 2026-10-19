"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type Props = {
  items: NavItem[];
  currentHref: string;
  className?: string;
};

/**
 * Navegación inferior (shell para el MVP 3 mobile-first). Hoy es primitiva
 * verificada: se renderiza con iconos Lucide, pill activa con aria-current
 * y labels siempre visibles (nunca solo icono).
 */
export function BottomNav({ items, currentHref, className }: Props) {
  return (
    <nav
      aria-label="Navegación principal"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 backdrop-blur",
        className,
      )}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const active = currentHref === item.href;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-xs transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
