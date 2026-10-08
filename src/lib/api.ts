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
  return res.json();
}

export async function createEntry(data: {
  exercise_id: string;
  answers: Record<string, unknown>;
  status: "draft" | "completed";
  exercise_version?: number;
  theme_id?: string | null;
  source_entry_id?: string | null;
  measure_before?: number | null;
  measure_after?: number | null;
}): Promise<Entry> {
  const res = await fetch(`${API_URL}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create entry");
  return res.json();
}

export async function updateEntry(
  id: string,
  data: Partial<{
    exercise_id: string;
    answers: Record<string, unknown>;
    status: "draft" | "completed";
    exercise_version: number;
    theme_id: string | null;
    source_entry_id: string | null;
    measure_before: number | null;
    measure_after: number | null;
  }>,
): Promise<Entry> {
  const res = await fetch(`${API_URL}/entries/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update entry");
  return res.json();
}

export async function deleteEntry(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/entries/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete entry");
}

export async function getThemes(): Promise<Theme[]> {
  const res = await fetch(`${API_URL}/themes`);
  if (!res.ok) throw new Error("Failed to fetch themes");
  return res.json();
}

export async function getTheme(id: string): Promise<Theme> {
  const res = await fetch(`${API_URL}/themes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch theme");
  return res.json();
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
  return res.json();
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
  return res.json();
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
  return res.json();
}
