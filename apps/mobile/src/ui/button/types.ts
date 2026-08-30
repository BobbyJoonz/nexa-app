import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

/**
 * Button visual variants (shadcn-inspired naming, brand-mapped):
 * - default      → primary filled (brand navy, white text)
 * - secondary    → quiet emphasis (technical grey)
 * - outline      → bordered, transparent fill
 * - ghost        → borderless text button
 * - destructive  → danger filled
 *
 * Legacy aliases are preserved so existing callers keep working:
 * - "filled" → default
 * - "danger" → destructive
 */
export type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "destructive" | "filled" | "danger";

export type ButtonSize = "sm" | "md" | "lg";

/** Normalizes legacy variant names onto the semantic set. */
export function normalizeVariant(variant: ButtonVariant): "default" | "secondary" | "outline" | "ghost" | "destructive" {
  switch (variant) {
    case "filled":
      return "default";
    case "danger":
      return "destructive";
    default:
      return variant;
  }
}

export interface ButtonProps {
  label: string;
  onPress: () => void;
  /** Visual variant (default: primary action). */
  variant?: ButtonVariant;
  /** Size scale (default: md). */
  size?: ButtonSize;
  /** Stretch to container width. */
  block?: boolean;
  /** Logical start slot — visually mirrored automatically under fa. */
  leading?: ReactNode;
  /** Logical end slot — visually mirrored automatically under fa. */
  trailing?: ReactNode;
  /** Override label/icon tint (e.g. success state). */
  contentColor?: string;
  /** Show a spinner in place of the label (async actions). */
  loading?: boolean;
  disabled?: boolean;
  /** Play the light selection tick on press. Default true. */
  hapticFeedback?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}
