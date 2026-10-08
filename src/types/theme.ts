export type ThemeStatus = "open" | "in_progress" | "done" | "archived";

export interface Theme {
  id: string;
  title: string;
  description?: string;
  status: ThemeStatus;
  createdAt: string;
  updatedAt: string;
}
