"use client";

import type { RatingField as RatingFieldType } from "@/types/exercise";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type Props = {
  field: RatingFieldType;
  value: number;
  onChange: (value: number) => void;
};

export function RatingField({ field, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.id}>{field.label}</Label>
      <div className="flex items-center gap-4">
        <Slider
          id={field.id}
          min={field.min}
          max={field.max}
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          className="flex-1"
        />
        <span className="w-12 text-right font-mono text-sm">{value}</span>
      </div>
    </div>
  );
}
