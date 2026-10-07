"use client";

import type { RowsField as RowsFieldType } from "@/types/exercise";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  field: RowsFieldType;
  value: Record<string, string>[] | undefined;
  onChange: (value: Record<string, string>[]) => void;
};

export function RowsField({ field, value, onChange }: Props) {
  const rows = value ?? [{}];

  const addRow = () => {
    onChange([...rows, {}]);
  };

  const handleChange = (rowIndex: number, columnId: string, cellValue: string) => {
    const newRows = rows.map((row, i) =>
      i === rowIndex ? { ...row, [columnId]: cellValue } : row,
    );
    onChange(newRows);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{field.label}</Label>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {field.columns.map((col) => (
              <th key={col.id} className="border p-2 text-left text-sm">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {field.columns.map((col) => (
                <td key={col.id} className="border p-2">
                  <Input
                    value={row[col.id] ?? ""}
                    onChange={(e) => handleChange(rowIndex, col.id, e.target.value)}
                    className="w-full"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={addRow} variant="outline" size="sm" className="self-start">
        Agregar fila
      </Button>
    </div>
  );
}
