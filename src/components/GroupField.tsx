import type { GroupField as GroupFieldType } from "../types/exercise";
import { FieldRenderer } from "./FieldRenderer";

type Props = {
  field: GroupFieldType;
  value: Record<string, Record<string, unknown>> | undefined;
  onChange: (value: Record<string, Record<string, unknown>>) => void;
};

export function GroupField({ field, value, onChange }: Props) {
  const groups = value ?? {};

  const handleChange = (groupId: string, fieldId: string, fieldValue: unknown) => {
    onChange({
      ...groups,
      [groupId]: {
        ...groups[groupId],
        [fieldId]: fieldValue,
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium">{field.label}</p>
      {field.groups.map((group) => (
        <div
          key={group.id}
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col gap-3"
        >
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {group.label}
          </p>
          {group.fields.map((f) => (
            <FieldRenderer
              key={f.id}
              field={f}
              value={groups[group.id]?.[f.id]}
              onChange={(v) => handleChange(group.id, f.id, v)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
