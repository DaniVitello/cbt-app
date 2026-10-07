import type { Field } from "../types/exercise";
import { TextField } from "./TextField";
import { RatingField } from "./RatingField";
import { RowsField } from "./RowsField";
import { ChoiceField } from "./ChoiceField";
import { GroupField } from "./GroupField";
import { ReadOnlyField } from "./ReadOnlyField";

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
    case "choice":
      return (
        <ChoiceField
          field={field}
          value={value as string}
          onChange={onChange}
        />
      );
    case "group":
      return (
        <GroupField
          field={field}
          value={value as Record<string, Record<string, unknown>> | undefined}
          onChange={onChange}
        />
      );
    case "readonly":
      return <ReadOnlyField field={field} />;
    default:
      return assertNever(field);
  }
}

function assertNever(x: never): never {
  throw new Error(`Unexpected field type: ${JSON.stringify(x)}`);
}
