export const storageKeys = {
  locale: "nexa:locale",
  model: "nexa:model",
  completedLessons: "nexa:completed-lessons",
  lastSection: "nexa:last-section"
} as const;

export function toggleCompletedLesson(current: string[], lessonId: string): string[] {
  return current.includes(lessonId)
    ? current.filter((id) => id !== lessonId)
    : [...current, lessonId];
}

export function completionPercent(completed: string[], total: number): number {
  if (total <= 0) return 0;
  return Math.round((new Set(completed).size / total) * 100);
}

export function parseStoredList(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string")
      ? parsed
      : [];
  } catch {
    return [];
  }
}
