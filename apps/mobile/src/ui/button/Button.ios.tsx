import { StyleSheet } from "react-native";
import { haptics } from "../haptics";
import { PressableSurface } from "../pressable-surface";
import { ButtonContent } from "./button-content";
import { variantChrome } from "./variants";
import type { ButtonProps } from "./types";

/**
 * iOS / HIG implementation.
 * 44pt+ target · 12pt continuous-feel radius · semibold label · press dim
 * (no ripple) · ghost renders as a plain borderless text button.
 * Pressed-state opacity comes from PressableSurface (iOS branch).
 */
export function Button({
  label,
  onPress,
  variant = "filled",
  block,
  leading,
  trailing,
  contentColor,
  disabled,
  hapticFeedback = true,
  accessibilityLabel,
  style
}: ButtonProps) {
  const chrome = variantChrome(variant);
  return (
    <PressableSurface
      onPress={() => {
        if (hapticFeedback) haptics.tap();
        onPress();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      style={[
        styles.base,
        {
          backgroundColor: chrome.background
        },
        block && styles.block,
        disabled && styles.disabled,
        style
      ]}
    >
      <ButtonContent
        label={label}
        contentColor={contentColor ?? chrome.content}
        fontWeight="600"
        fontSize={15}
        leading={leading}
        trailing={trailing}
      />
    </PressableSurface>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    minHeight: 46,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 10
  },
  block: { width: "100%" },
  disabled: { opacity: 0.45 }
});
