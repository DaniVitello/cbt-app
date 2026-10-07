import type { RatingField as RatingFieldType } from "../types/exercise";

type Props = {
  field: RatingFieldType;
  value: number;
  onChange: (value: number) => void;
};

export function RatingField({ field, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={field.id} className="text-sm font-medium">
        {field.label}
      </label>
      <div className="flex items-center gap-3">
        <input
          id={field.id}
          type="range"
          min={field.min}
          max={field.max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm font-mono w-12 text-right">{value}</span>
      </div>
    </div>
  );
}
