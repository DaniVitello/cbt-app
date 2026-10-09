"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  const t = useTranslations("exercise");

  return (
    <nav aria-label={t("progressNav")} className={cn("flex items-center gap-2", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onStepClick?.(index)}
              disabled={!onStepClick}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                isCompleted && "bg-primary text-primary-foreground",
                isCurrent && "bg-primary/20 text-primary ring-2 ring-primary",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground",
                onStepClick && "cursor-pointer hover:bg-primary/10",
              )}
            >
              {isCompleted ? "✓" : index + 1}
            </button>
            <span
              className={cn(
                "text-sm",
                isCurrent ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-8",
                  isCompleted ? "bg-primary" : "bg-muted",
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
