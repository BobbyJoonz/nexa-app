/**
 * Minimal class-name combiner for NativeWind.
 * Joins truthy values and de-duplicates with a Set — no external dependency.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return [...new Set(parts.filter(Boolean))].join(" ");
}
