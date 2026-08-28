import type { ReactNode, StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import { haptics } from "./haptics";
import { ui } from "./platform";
import { PressableSurface } from "./pressable-surface";

/** Circular icon control used in headers and overlays. iOS 44pt / Android 48dp minimum target. */
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
        if (hapticFeedback) haptics.tap();
        onPress();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: Boolean(disabled) }}
      rippleColor="rgba(13,34,62,.10)"
      style={[
        styles.base,
        {
          width: dimension,
          height: dimension,
          borderRadius: Math.round(dimension / 2),
          backgroundColor: tone === "technical" ? "#E8EDF2" : "#FFFFFF"
        },
        disabled && styles.disabled,
        style
      ]}
    >
      {children}
    </PressableSurface>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center", overflow: "hidden" },
  disabled: { opacity: 0.45 }
});
