import { Platform } from "react-native";

/**
 * Single source of truth for OS-aware UI metrics.
 * Brand tokens (colors/spacing/typography scale) stay shared in
 * @nexa/design-tokens; only interaction chrome diverges here.
 */
export const isIOS = Platform.OS === "ios";

/** Pick a value per platform. Every Platform branch of the app lives here or in *.ios/*.android files — never inside screens. */
export const selectUI = <T>(ios: T, android: T): T => (isIOS ? ios : android);

/**
 * Control metrics, grounded in each platform's guidance:
 * - iOS/HIG: 44pt minimum target, ~12pt continuous-feel corner radius,
 *   semibold labels, feedback via dimming (no ripple).
 * - Android/M3: 48dp minimum target, full "stadium" shape for buttons,
 *   label-large weight 500, Material ripple state layer.
 */
export const ui = {
  minTarget: selectUI(44, 48),
  buttonHeight: selectUI(46, 50),
  buttonRadius: selectUI(12, 999),
  iconButtonRadius: selectUI(22, 24),
  controlPaddingH: selectUI(20, 22),
  labelWeight: selectUI<"600" | "500">("600", "500"),
  /** Pressed-state opacity on iOS (HIG-style dim). */
  pressDim: 0.65,
  /** Default ripple for surfaces that do not declare one (dark-alpha works on light backgrounds). */
  defaultRipple: "rgba(13,34,62,.12)"
} as const;
