import type { TextField as TextFieldType } from "../types/exercise";

type Props = {
  field: TextFieldType;
  value: string;
  onChange: (value: string) => void;
};

export function TextField({ field, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={field.id} className="text-sm font-medium">
        {field.label}
      </label>
      <input
        id={field.id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
