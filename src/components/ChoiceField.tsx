import type { ChoiceField as ChoiceFieldType } from "../types/exercise";

type Props = {
  field: ChoiceFieldType;
  value: string;
  onChange: (value: string) => void;
};

export function ChoiceField({ field, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={field.id} className="text-sm font-medium">
        {field.label}
      </label>
      <select
        id={field.id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
      >
        <option value="">Seleccioná una opción</option>
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
