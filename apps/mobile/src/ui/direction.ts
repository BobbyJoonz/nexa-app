import type { Locale } from "@nexa/i18n";
import { localizedRow } from "@/theme";

export { localizedRow as dirRow };

/**
 * RTL-aware icon selection. Ionicons never auto-mirror, so every directional
 * glyph must be resolved through this helper; the generic keeps literal types
 * so results stay assignable to `Ionicons["name"]`.
 *
 * Example (back affordance): dirIconName(locale, "chevron-back", "chevron-forward")
 * Example (forward CTA):    dirIconName(locale, "arrow-forward", "arrow-back")
 */
export const dirIconName = <T extends string>(locale: Locale, ltr: T, rtl: T): T =>
  locale === "fa" ? rtl : ltr;

/** True when the active locale flows right-to-left. */
export const isRTL = (locale: Locale): boolean => locale === "fa";
