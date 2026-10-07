import type { ReadOnlyField as ReadOnlyFieldType } from "@/types/exercise";

type Props = {
  field: ReadOnlyFieldType;
};

export function ReadOnlyField({ field }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">{field.label}</p>
      <div className="rounded-lg border bg-muted p-4">
        <p className="whitespace-pre-line text-sm text-muted-foreground">
          {field.content}
        </p>
      </div>
    </div>
  );
}
