import { StyleSheet } from "react-native";
import { haptics } from "../haptics";
import { PressableSurface } from "../pressable-surface";
import { ButtonContent } from "./button-content";
import { variantChrome } from "./variants";
import type { ButtonProps } from "./types";

/**
 * Android / Material 3 implementation.
 * 48dp+ target · stadium (full pill) shape · label-large weight 500 ·
 * Material ripple state layer · ghost renders as an outlined button.
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
      rippleColor={chrome.ripple}
      style={[
        styles.base,
        {
          backgroundColor: chrome.background,
          overflow: "hidden"
        },
        variant === "ghost" && styles.outlined,
        block && styles.block,
        disabled && styles.disabled,
        style
      ]}
    >
      <ButtonContent
        label={label}
        contentColor={contentColor ?? chrome.content}
        fontWeight="500"
        fontSize={14}
        leading={leading}
        trailing={trailing}
      />
    </PressableSurface>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    minHeight: 50,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 11
  },
  outlined: { borderWidth: 1, borderColor: "#CCD5DE" },
  block: { width: "100%" },
  disabled: { opacity: 0.45 }
});
