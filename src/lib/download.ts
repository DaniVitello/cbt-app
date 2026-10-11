/** Nombre de archivo del backup total: cbt-export-AAAA-MM-DD.json */
export function buildExportFilename(now: Date = new Date()): string {
  return `cbt-export-${now.toISOString().slice(0, 10)}.json`;
}

/** Descarga un objeto como JSON con formato legible (mismo patrón del export por entry). */
export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
