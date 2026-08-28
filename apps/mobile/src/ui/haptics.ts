import * as Haptics from "expo-haptics";

/**
 * Haptic feedback wrapper. Every call is fail-safe: if the engine is missing
 * or throws (web preview, exotic devices), interaction MUST still succeed.
 * iOS carries most of the tactile identity (HIG); on Android we keep it to
 * selection ticks and notifications so vibration stays purposeful.
 */
const run = (action: () => Promise<void>) => {
  void action().catch(() => undefined);
};

export const haptics = {
  /** Light tick for ordinary taps (buttons, icon buttons). */
  tap: (): void => run(() => Haptics.selectionAsync()),
  /** Task succeeded (lesson completed, share opened). */
  success: (): void => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  /** Safety-critical caution. */
  warning: (): void => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning))
};
