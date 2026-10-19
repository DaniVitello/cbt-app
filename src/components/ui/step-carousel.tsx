"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
};

/**
 * Carrusel de pasos (coverflow sobrio): el paso actual nítido al centro,
 * hasta 2 vecinos por lado progresivamente borroneados, el resto oculto.
 * Los laterales son decorativos (aria-hidden, no enfocables): la navegación
 * real es Siguiente/Atrás + las flechas (±1). El estado vive en el wizard;
 * el carrusel solo refleja `currentStep` y reporta movimientos.
 */
export function StepCarousel({ steps, currentStep, onStepClick, className }: Props) {
  const t = useTranslations("exercise");
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    duration: reducedMotion ? 0 : 25,
  });
  const [selected, setSelected] = useState(currentStep);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  // Derivado en render (sin loop: el carrusel no hace loop).
  const canPrev = selected > 0;
  const canNext = selected < steps.length - 1;

  // El wizard manda (Siguiente/Atrás): el carrusel lo sigue.
  useEffect(() => {
    if (emblaApi && emblaApi.selectedScrollSnap() !== currentStep) {
      emblaApi.scrollTo(currentStep);
    }
  }, [emblaApi, currentStep]);

  // El drag mueve el paso (informa al asentarse; el closure se re-suscribe
  // en cada render así que siempre ve el currentStep vigente).
  useEffect(() => {
    if (!emblaApi || !onStepClick) return;
    const onSettle = () => {
      const snap = emblaApi.selectedScrollSnap();
      onStepClick(snap);
    };
    emblaApi.on("settle", onSettle);
    return () => {
      emblaApi.off("settle", onSettle);
    };
  });

  const go = (dir: 1 | -1) => {
    const next = currentStep + dir;
    if (next >= 0 && next < steps.length) onStepClick?.(next);
  };

  // Las flechas anuncian su destino (distinto del "Siguiente" del wizard).
  const prevLabel = t("goToStep", { n: currentStep });
  const nextLabel = t("goToStep", { n: currentStep + 2 });

  return (
    <div className={cn("flex items-center gap-1", className)}>      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-11 w-11 shrink-0 rounded-full"
        disabled={!canPrev}
        onClick={() => go(-1)}
        aria-label={prevLabel}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </Button>

      <div
        ref={emblaRef}
        className="overflow-hidden"
        role="region"
        aria-roledescription="carrusel de pasos"
        aria-label={t("progressNav")}
      >
        <div className="flex">
          {steps.map((step, index) => {
            const d = Math.abs(index - selected);
            const isActive = index === selected;
            return (
              <div
                key={index}
                aria-hidden={!isActive}
                className={cn(
                  "flex min-w-0 shrink-0 grow-0 basis-[72%] flex-col items-center px-2 text-center transition-all duration-300",
                  d === 0 && "opacity-100 blur-0",
                  d === 1 && "opacity-60 blur-[2px]",
                  d === 2 && "opacity-35 blur-[3px]",
                  d > 2 && "invisible",
                )}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {index + 1}
                </span>
                <span className="mt-1 text-sm text-muted-foreground">{step}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-11 w-11 shrink-0 rounded-full"
        disabled={!canNext}
        onClick={() => go(1)}
        aria-label={nextLabel}
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
  );
}
