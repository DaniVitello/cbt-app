import type { Field } from "../types/exercise";
import { TextField } from "./TextField";
import { RatingField } from "./RatingField";
import { RowsField } from "./RowsField";

type Props = {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
};

export function FieldRenderer({ field, value, onChange }: Props) {
  switch (field.type) {
    case "text":
      return (
        <TextField field={field} value={value as string} onChange={onChange} />
      );
    case "rating":
      return (
        <RatingField
          field={field}
          value={value as number}
          onChange={onChange}
        />
      );
    case "rows":
      return (
        <RowsField
          field={field}
          value={value as Record<string, string>[] | undefined}
          onChange={onChange}
        />
      );
    default:
      return assertNever(field);
  }
}

function assertNever(x: never): never {
  throw new Error(`Unexpected field type: ${JSON.stringify(x)}`);
}
