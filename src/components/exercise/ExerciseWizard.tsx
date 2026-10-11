"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Exercise, Answers } from "@/types/exercise";
import { ExerciseForm } from "./ExerciseForm";
import { CompletionScreen } from "./CompletionScreen";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  exercise: Exercise;
  answers: Answers;
  onChange: (answers: Answers) => void;
  onComplete?: (measures: { before: number | null; after: number | null }) => void;
  onBackToHome?: () => void;
  /** Entry recién completada; habilita el prefill del paso siguiente (?source=). */
  completedEntryId?: string | null;
  /** true mientras la completion sigue guardando (links de cadena deshabilitados). */
  isSaving?: boolean;
};

export function ExerciseWizard({
  exercise,
  answers,
  onChange,
  onComplete,
  onBackToHome,
  completedEntryId = null,
  isSaving = false,
}: Props) {
  const t = useTranslations("exercise");
  const tc = useTranslations("common");
  const [currentStep, setCurrentStep] = useState(0);
  const [measureBefore, setMeasureBefore] = useState<number | null>(null);
  const [measureAfter, setMeasureAfter] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);

  const totalSteps = exercise.sections.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const currentSection = exercise.sections[currentStep];

  useEffect(() => {
    stepRef.current?.focus();
  }, [currentStep]);

  const handleNext = () => {
    if (isLastStep) {
      setIsComplete(true);
      onComplete?.({ before: measureBefore, after: measureAfter });
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  if (isComplete) {
    return (
      <CompletionScreen
        exercise={exercise}
        answers={answers}
        measureBefore={measureBefore}
        measureAfter={measureAfter}
        onBackToHome={onBackToHome ?? (() => {})}
        sourceEntryId={completedEntryId}
        isSaving={isSaving}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="flex flex-col gap-2">
        <Stepper
          steps={exercise.sections.map((s) => s.title)}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
        <ProgressBar value={currentStep + 1} max={totalSteps} label={t("progressNav")} />
      </div>

      {/* Measure Before (first step) */}
      {exercise.measure && isFirstStep && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{exercise.measure.labelBefore}</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              min={exercise.measure.min}
              max={exercise.measure.max}
              value={[measureBefore ?? exercise.measure.min]}
              onValueChange={([v]) => setMeasureBefore(v)}
              thumbLabel={exercise.measure.labelBefore}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              {measureBefore ?? exercise.measure.min}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Measure After (last step) */}
      {exercise.measure && isLastStep && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{exercise.measure.labelAfter}</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              min={exercise.measure.min}
              max={exercise.measure.max}
              value={[measureAfter ?? exercise.measure.min]}
              onValueChange={([v]) => setMeasureAfter(v)}
              thumbLabel={exercise.measure.labelAfter}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              {measureAfter ?? exercise.measure.min}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Current Step */}
      <div
        ref={stepRef}
        tabIndex={-1}
        aria-live="polite"
        className="flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{currentSection.title}</h2>
          <span className="text-sm text-muted-foreground">
            {tc("step", { current: currentStep + 1, total: totalSteps })}
          </span>
        </div>

        {/* Help and Example toggles */}
        {exercise.help && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
            >
              {t("purpose")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExample(!showExample)}
            >
              {t("example")}
            </Button>
          </div>
        )}

        {showHelp && exercise.help?.purpose && (
          <div className="rounded-lg border bg-muted p-4">
            <p className="text-sm">{exercise.help.purpose}</p>
          </div>
        )}

        {showExample && exercise.help?.example && (
          <div className="rounded-lg border bg-muted p-4">
            <p className="text-sm">{exercise.help.example}</p>
          </div>
        )}

        {/* Current section fields */}
        {currentSection.fields.map((field) => (
          <ExerciseForm
            key={field.id}
            exercise={{
              ...exercise,
              sections: [{ ...currentSection, fields: [field] }],
            }}
            answers={answers}
            onChange={onChange}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isFirstStep}
        >
          {tc("back")}
        </Button>
        <Button onClick={handleNext}>
          {isLastStep ? tc("finish") : tc("next")}
        </Button>
      </div>
    </div>
  );
}
