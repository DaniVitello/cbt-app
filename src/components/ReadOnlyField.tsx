import type { ReadOnlyField as ReadOnlyFieldType } from "../types/exercise";

type Props = {
  field: ReadOnlyFieldType;
};

export function ReadOnlyField({ field }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium">{field.label}</p>
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {field.content}
        </p>
      </div>
    </div>
  );
}
