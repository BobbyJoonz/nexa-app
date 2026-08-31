import type { ComponentProps } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";
import { ui, isIOS } from "./platform";

type NativePressableProps = ComponentProps<typeof Pressable>;

/**
 * The one touch primitive every interactive surface builds on.
 * - Android: Material foreground ripple (foreground:true clips to the view's
 *   own rounded outline — do NOT add overflow:hidden, it breaks rounded
 *   corners under the new architecture).
 * - iOS: pressed-state opacity dim per HIG (no ripple).
 *
 * NativeWind compatibility (critical): this component forwards `className`
 * to the CORE react-native Pressable, which NativeWind auto-registers.
 * We deliberately do NOT wrap it with cssInterop() — custom cssInterop
 * wrappers lost className styles at runtime (empty buttons, missing
 * backgrounds) while core components styled correctly in production.
 */
export interface PressableSurfaceProps extends Omit<NativePressableProps, "style" | "android_ripple"> {
  /** Ripple tint on Android; ignored on iOS. */
  rippleColor?: string;
  /** Forwarded to the core Pressable (NativeWind auto-resolves it). */
  className?: string;
  /** Accepts a plain style or a pressed-state style function (boolean form). */
  style?: StyleProp<ViewStyle> | ((pressed: boolean) => StyleProp<ViewStyle>);
}

export function PressableSurface({ rippleColor, style, children, ...rest }: PressableSurfaceProps) {
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

const styles = StyleSheet.create({
  dim: { opacity: ui.pressDim }
});
