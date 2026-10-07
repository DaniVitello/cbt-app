import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEntries, deleteEntry } from "../api/entries";

export function HistoryPage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useQuery({
    queryKey: ["entries", exerciseId],
    queryFn: () => getEntries(exerciseId),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", exerciseId] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de que querés borrar esta entrada?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleExport = (entry: any) => {
    const blob = new Blob([JSON.stringify(entry, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `entry-${entry.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div>
      <Link
        to={`/exercises/${exerciseId}`}
        className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        ← Volver al ejercicio
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Historial
      </h1>

      {!entries || entries.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Todavía no hay entradas guardadas.
        </p>
      ) : (
        <ul className="flex flex-col gap-3" role="list">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(entry.created_at).toLocaleString("es-AR")}
                </p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${
                    entry.status === "completed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {entry.status === "completed" ? "Completado" : "Borrador"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleExport(entry)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Exportar
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
