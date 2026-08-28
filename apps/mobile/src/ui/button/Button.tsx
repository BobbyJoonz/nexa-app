import { StyleSheet } from "react-native";
import { haptics } from "../haptics";
import { selectUI, ui } from "../platform";
import { PressableSurface } from "../pressable-surface";
import { ButtonContent } from "./button-content";
import { variantChrome } from "./variants";
import type { ButtonProps } from "./types";

/**
 * NEUTRAL DEFAULT implementation.
 * Metro resolves Button.ios.tsx / Button.android.tsx ahead of this file at
 * bundle time; TypeScript and vitest always see this one. Metrics follow the
 * active platform via selectUI so a resolution miss still renders correctly.
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
          minHeight: ui.buttonHeight,
          borderRadius: ui.buttonRadius,
          overflow: "hidden"
        },
        variant === "ghost" && styles.ghostOutline,
        block && styles.block,
        disabled && styles.disabled,
        style
      ]}
    >
      <ButtonContent
        label={label}
        contentColor={contentColor ?? chrome.content}
        fontWeight={ui.labelWeight}
        fontSize={selectUI(15, 14)}
        leading={leading}
        trailing={trailing}
      />
    </PressableSurface>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", paddingHorizontal: 22, paddingVertical: 10 },
  ghostOutline: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCD5DE"
  },
  block: { width: "100%" },
  disabled: { opacity: 0.45 }
});
