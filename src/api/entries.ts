const API_URL = "/api";

export interface Entry {
  id: string;
  exercise_id: string;
  answers: Record<string, unknown>;
  status: "draft" | "completed";
  created_at: string;
  updated_at: string;
}

export async function getEntries(exerciseId?: string): Promise<Entry[]> {
  const url = exerciseId
    ? `${API_URL}/entries?exercise_id=${exerciseId}`
    : `${API_URL}/entries`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch entries");
  return res.json();
}

export async function createEntry(data: {
  exercise_id: string;
  answers: Record<string, unknown>;
  status: "draft" | "completed";
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
