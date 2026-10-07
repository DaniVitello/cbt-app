"use client";

import type { TextField as TextFieldType } from "@/types/exercise";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  field: TextFieldType;
  value: string;
  onChange: (value: string) => void;
};

export function TextField({ field, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.id}>{field.label}</Label>
      <Input
        id={field.id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
      />
    </div>
  );
}
