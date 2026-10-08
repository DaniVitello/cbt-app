"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { getEntries, deleteEntry } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useQuery({
    queryKey: ["entries", params.id],
    queryFn: () => getEntries({ exerciseId: params.id }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", params.id] });
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
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href={`/exercises/${params.id}`}>
        <Button variant="link" className="mb-6 p-0">
          ← Volver al ejercicio
        </Button>
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Historial</h1>

      {!entries || entries.length === 0 ? (
        <p className="text-muted-foreground">
          Todavía no hay entradas guardadas.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="text-sm text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleString("es-AR")}
                </p>
                <span
                  className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${
                    entry.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {entry.status === "completed" ? "Completado" : "Borrador"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleExport(entry)}
                >
                  Exportar
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="text-red-600"
                  onClick={() => handleDelete(entry.id)}
                >
                  Borrar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
