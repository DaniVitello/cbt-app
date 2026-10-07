import type { RowsField as RowsFieldType } from "../types/exercise";

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
      <p className="text-sm font-medium">{field.label}</p>
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
                  <input
                    type="text"
                    value={row[col.id] ?? ""}
                    onChange={(e) => handleChange(rowIndex, col.id, e.target.value)}
                    className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={addRow}
        className="self-start px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Agregar fila
      </button>
    </div>
  );
}
