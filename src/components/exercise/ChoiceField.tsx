"use client";

import { useTranslations } from "next-intl";
import type { ChoiceField as ChoiceFieldType } from "@/types/exercise";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Props = {
  field: ChoiceFieldType;
  value: string;
  onChange: (value: string) => void;
};

export function ChoiceField({ field, value, onChange }: Props) {
  const t = useTranslations("exercise");

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.id}>{field.label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={field.id}>
          <SelectValue placeholder={t("selectPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
