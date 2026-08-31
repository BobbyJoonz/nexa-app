import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { cn } from "./cn";
import { haptics } from "./haptics";
import { ui } from "./platform";
import { PressableSurface } from "./pressable-surface";

/**
 * Circular icon control used in headers and overlays. iOS 44pt / Android 48dp minimum target.
 * Styling is NativeWind; tones map to semantic tokens.
 */
export function IconButton({
  onPress,
  children,
  tone = "raised",
  size,
  disabled,
  accessibilityLabel,
  hapticFeedback = true,
  style
}: {
  onPress: () => void;
  children: ReactNode;
  tone?: "raised" | "technical";
  size?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
  hapticFeedback?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const dimension = size ?? ui.minTarget;
  return (
    <PressableSurface
      onPress={() => {
        // Interaction FIRST — a haptics failure must never block the action.
        onPress();
        if (hapticFeedback) haptics.tap();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: Boolean(disabled) }}
      rippleColor="rgba(13,34,62,.10)"
      style={[
        {
          width: dimension,
          height: dimension,
          borderRadius: Math.round(dimension / 2)
        },
        style
      ]}
      className={cn("items-center justify-center overflow-hidden", tone === "raised" ? "bg-card" : "bg-secondary", disabled && "opacity-45")}
    >
      {children}
    </PressableSurface>
  );
}