export * from "./sizing";

export const storageKeys = {
  locale: "nexa:locale",
  model: "nexa:model",
  completedLessons: "nexa:completed-lessons",
  lastSection: "nexa:last-section",
  commissioningChecklist: "nexa:checklist-cm3500-24s"
} as const;

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/**
 * Transcribes Latin digits (ASCII 0-9) inside a string/number to Persian
 * digits, leaving all other characters untouched. Arabic-Indic and existing
 * Persian digits pass through unchanged; decimals, signs and units keep their
 * original separators (the formatter is a digit transcribe, not a locale
 * number formatter).
 */
export function toFaDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => FA_DIGITS.charAt(Number(digit)));
}

export function toggleCompletedLesson(current: string[], lessonId: string): string[] {
  return current.includes(lessonId)
    ? current.filter((id) => id !== lessonId)
    : [...current, lessonId];
}

export function completionPercent(completed: string[], total: number): number {
  if (total <= 0) return 0;
  // Clamp defensively: a completed list that exceeds the lesson set (e.g.
  // leftovers from another model) must never render >100% progress.
  return Math.min(100, Math.max(0, Math.round((new Set(completed).size / total) * 100)));
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
