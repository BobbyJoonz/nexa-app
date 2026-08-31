import { ActivityIndicator } from "react-native";
import { cn } from "../cn";
import { haptics } from "../haptics";
import { selectUI } from "../platform";
import { PressableSurface } from "../pressable-surface";
import { ButtonContent } from "./button-content";
import { sizeClasses, variantClasses } from "./variants";
import type { ButtonProps } from "./types";

/**
 * Unified Button (single implementation across platforms).
 *
 * Visual contract (shadcn-inspired, brand-mapped):
 *   default · secondary · outline · ghost · destructive  ×  sm · md · lg
 * Touch-target metrics follow each platform's guidance via selectUI
 * (iOS 44pt+ / 12pt radius · Android 48dp+ / stadium pill).
 * All styling is NativeWind; platform divergence is confined to selectUI.
 */
export function Button({
  label,
  onPress,
  variant = "default",
  size = "md",
  block,
  leading,
  trailing,
  contentColor,
  loading = false,
  disabled = false,
  hapticFeedback = true,
  accessibilityLabel,
  style
}: ButtonProps) {
  const chrome = variantClasses(variant);
  const sizing = sizeClasses(size);
  const pressed = disabled || loading;

  return (
    <PressableSurface
      onPress={() => {
        // Interaction FIRST — a haptics failure must never block the action.
        onPress();
        if (hapticFeedback) haptics.tap();
      }}
      disabled={pressed}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: pressed, busy: loading }}
      rippleColor={chrome.ripple}
      style={[
        {
          borderRadius: selectUI(12, 999),
          overflow: "hidden"
        },
        style
      ]}
      className={cn(
        "flex-row items-center justify-center",
        chrome.container,
        sizing.container,
        block && "w-full",
        pressed && "opacity-45"
      )}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={contentColor ?? (variant === "default" || variant === "destructive" ? "#FFFFFF" : undefined)}
        />
      ) : (
        <ButtonContent
          label={label}
          labelClass={cn(sizing.label, contentColor ? undefined : chrome.label, "text-center")}
          leading={leading}
          trailing={trailing}
        />
      )}
    </PressableSurface>
  );
}