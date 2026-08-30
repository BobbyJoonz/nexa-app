import type { ComponentProps } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";
import { cssInterop } from "nativewind";
import { ui, isIOS } from "./platform";

type NativePressableProps = ComponentProps<typeof Pressable>;

/**
 * The one touch primitive every interactive surface builds on.
 * - Android: Material foreground ripple (drawn over children, so opaque
 *   backgrounds cannot hide it) — callers add `overflow: "hidden"` when rounded.
 * - iOS: pressed-state opacity dim per HIG (no ripple).
 *
 * NativeWind-compatible: `className` is accepted and forwarded to the inner
 * Pressable (via cssInterop) alongside the `style` prop.
 */
export interface PressableSurfaceProps extends Omit<NativePressableProps, "style" | "android_ripple"> {
  /** Ripple tint on Android; ignored on iOS. */
  rippleColor?: string;
  /** Accepts a plain style or a pressed-state style function (boolean form). */
  style?: StyleProp<ViewStyle> | ((pressed: boolean) => StyleProp<ViewStyle>);
}

function PressableSurfaceBase({ rippleColor, style, children, ...rest }: PressableSurfaceProps) {
  return (
    <Pressable
      {...rest}
      android_ripple={isIOS ? undefined : { color: rippleColor ?? ui.defaultRipple, foreground: true }}
      style={({ pressed }) => {
        const base = typeof style === "function" ? style(pressed) : style;
        const dimmed = pressed && isIOS && !rest.disabled ? styles.dim : null;
        return [base, dimmed];
      }}
    >
      {children}
    </Pressable>
  );
}

/** Maps className → style so callers can style this surface with NativeWind. */
export const PressableSurface = cssInterop(PressableSurfaceBase, { className: "style" });

const styles = StyleSheet.create({
  dim: { opacity: ui.pressDim }
});
