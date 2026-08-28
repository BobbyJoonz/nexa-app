import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

/**
 * Shared contract for the platform Button implementations.
 * Button.tsx / Button.ios.tsx / Button.android.tsx all satisfy this exact
 * interface; Metro picks the platform file at bundle time while tsc and
 * vitest always see the neutral base.
 */
export type ButtonVariant = "filled" | "secondary" | "ghost" | "danger";

export interface ButtonProps {
  label: string;
  onPress: () => void;
  /** filled = primary action · secondary = quiet emphasis · ghost = tertiary/plain · danger = destructive. */
  variant?: ButtonVariant;
  /** Stretch to container width. */
  block?: boolean;
  /** Logical start slot — visually mirrored automatically under fa. */
  leading?: ReactNode;
  /** Logical end slot — visually mirrored automatically under fa. */
  trailing?: ReactNode;
  /** Override label/icon tint (e.g. success state). */
  contentColor?: string;
  disabled?: boolean;
  /** Play the light selection tick on press. Default true. */
  hapticFeedback?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}
