const API_URL = "/api";

export interface Entry {
  id: string;
  exerciseId: string;
  exerciseVersion: number;
  themeId: string | null;
  sourceEntryId: string | null;
  answers: Record<string, unknown>;
  measures: { before?: number; after?: number };
  status: "draft" | "completed";
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Theme {
  id: string;
  title: string;
  description?: string;
  status: "open" | "in_progress" | "done" | "archived";
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------
 * Capa de traducción de casing: la API Fastify devuelve snake_case,
 * el frontend usa camelCase. Todo pasa por acá (un solo punto de mapeo).
 * ---------------------------------------------------------------------- */

interface RawEntry {
  id: string;
  exercise_id: string;
  exercise_version: number;
  theme_id: string | null;
  source_entry_id: string | null;
  answers: Record<string, unknown>;
  measure_before: number | null;
  measure_after: number | null;
  status: "draft" | "completed";
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

interface RawTheme {
  id: string;
  title: string;
  description?: string | null;
  status: Theme["status"];
  created_at: string;
  updated_at: string;
}

function mapEntry(raw: RawEntry): Entry {
  return {
    id: raw.id,
    exerciseId: raw.exercise_id,
    exerciseVersion: raw.exercise_version,
    themeId: raw.theme_id,
    sourceEntryId: raw.source_entry_id,
    answers: raw.answers ?? {},
    measures: {
      before: raw.measure_before ?? undefined,
      after: raw.measure_after ?? undefined,
    },
    status: raw.status,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    completedAt: raw.completed_at ?? undefined,
  };
}

function mapTheme(raw: RawTheme): Theme {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? undefined,
    status: raw.status,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

/* ------------------------------- Entries --------------------------------- */

export async function getEntries(filter?: {
  exerciseId?: string;
  themeId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<Entry[]> {
  const params = new URLSearchParams();
  if (filter?.exerciseId) params.set("exercise_id", filter.exerciseId);
  if (filter?.themeId) params.set("theme_id", filter.themeId);
  if (filter?.status) params.set("status", filter.status);
  if (filter?.limit) params.set("limit", filter.limit.toString());
  if (filter?.offset) params.set("offset", filter.offset.toString());

  const url = `${API_URL}/entries${params.toString() ? `?${params}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch entries");
  const data: RawEntry[] = await res.json();
  return data.map(mapEntry);
}

export async function getEntry(id: string): Promise<Entry> {
  const res = await fetch(`${API_URL}/entries/${id}`);
  if (!res.ok) throw new Error("Failed to fetch entry");
  const raw: RawEntry = await res.json();
  return mapEntry(raw);
}

export async function createEntry(data: {
  exerciseId: string;
  answers: Record<string, unknown>;
  status: "draft" | "completed";
  exerciseVersion?: number;
  themeId?: string | null;
  sourceEntryId?: string | null;
  measureBefore?: number | null;
  measureAfter?: number | null;
}): Promise<Entry> {
  const body = {
    exercise_id: data.exerciseId,
    answers: data.answers,
    status: data.status,
    exercise_version: data.exerciseVersion,
    theme_id: data.themeId,
    source_entry_id: data.sourceEntryId,
    measure_before: data.measureBefore,
    measure_after: data.measureAfter,
  };
  const res = await fetch(`${API_URL}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create entry");
  const raw: RawEntry = await res.json();
  return mapEntry(raw);
}

export async function updateEntry(
  id: string,
  data: Partial<{
    exerciseId: string;
    answers: Record<string, unknown>;
    status: "draft" | "completed";
    exerciseVersion: number;
    themeId: string | null;
    sourceEntryId: string | null;
    measureBefore: number | null;
    measureAfter: number | null;
  }>,
): Promise<Entry> {
  const body: Record<string, unknown> = {};
  if (data.exerciseId !== undefined) body.exercise_id = data.exerciseId;
  if (data.answers !== undefined) body.answers = data.answers;
  if (data.status !== undefined) body.status = data.status;
  if (data.exerciseVersion !== undefined) body.exercise_version = data.exerciseVersion;
  if (data.themeId !== undefined) body.theme_id = data.themeId;
  if (data.sourceEntryId !== undefined) body.source_entry_id = data.sourceEntryId;
  if (data.measureBefore !== undefined) body.measure_before = data.measureBefore;
  if (data.measureAfter !== undefined) body.measure_after = data.measureAfter;

  const res = await fetch(`${API_URL}/entries/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update entry");
  const raw: RawEntry = await res.json();
  return mapEntry(raw);
}

export async function deleteEntry(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/entries/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete entry");
}

/* ------------------------------- Themes ---------------------------------- */

export async function getThemes(): Promise<Theme[]> {
  const res = await fetch(`${API_URL}/themes`);
  if (!res.ok) throw new Error("Failed to fetch themes");
  const data: RawTheme[] = await res.json();
  return data.map(mapTheme);
}

export async function getTheme(id: string): Promise<Theme> {
  const res = await fetch(`${API_URL}/themes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch theme");
  const raw: RawTheme = await res.json();
  return mapTheme(raw);
}

export async function createTheme(data: {
  title: string;
  description?: string;
  status?: "open" | "in_progress" | "done" | "archived";
}): Promise<Theme> {
  const res = await fetch(`${API_URL}/themes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create theme");
  const raw: RawTheme = await res.json();
  return mapTheme(raw);
}

export async function updateTheme(
  id: string,
  data: Partial<{
    title: string;
    description?: string;
    status: "open" | "in_progress" | "done" | "archived";
  }>,
): Promise<Theme> {
  const res = await fetch(`${API_URL}/themes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update theme");
  const raw: RawTheme = await res.json();
  return mapTheme(raw);
}

export async function deleteTheme(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/themes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete theme");
}

export async function getThemeEntries(themeId: string): Promise<Entry[]> {
  const res = await fetch(`${API_URL}/themes/${themeId}/entries`);
  if (!res.ok) throw new Error("Failed to fetch theme entries");
  const data: RawEntry[] = await res.json();
  return data.map(mapEntry);
}

/* --------------------------- Export completo ----------------------------- */

export interface FullExport {
  schemaVersion: number;
  exportedAt: string;
  themes: Theme[];
  entries: Entry[];
}

/** Backup total: todo lo que hay (mismo formato que el futuro import entiende). */
export async function exportAll(): Promise<FullExport> {
  const res = await fetch(`${API_URL}/entries/export`);
  if (!res.ok) throw new Error("Failed to export data");
  const raw: {
    schemaVersion: number;
    exportedAt: string;
    themes: RawTheme[];
    entries: RawEntry[];
  } = await res.json();
  return {
    schemaVersion: raw.schemaVersion,
    exportedAt: raw.exportedAt,
    themes: raw.themes.map(mapTheme),
    entries: raw.entries.map(mapEntry),
  };
}
