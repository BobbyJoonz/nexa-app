import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { useAcademy } from "@/providers/academy-provider";
import { cn } from "./cn";

/**
 * Typography variant from the design scale.
 * - display / h1 / h2 / h3 : heading hierarchy
 * - body / body-sm / caption : content sizes
 * - label / button : interactive labels
 */
type TextVariant = "display" | "h1" | "h2" | "h3" | "body" | "body-sm" | "caption" | "label" | "button";

/**
 * Semantic intent (foreground shorthand).
 * Maps to the tailwind semantic color tokens.
 */
type TextIntent =
  | "default"   // foreground
  | "muted"     // muted-foreground
  | "primary"   // primary
  | "accent"    // accent
  | "destructive" // destructive
  | "success"   // success
  | "warning"   // warning
  | "info";     // info

interface TextProps extends Omit<RNTextProps, "className"> {
  variant?: TextVariant;
  weight?: "regular" | "medium" | "bold";
  intent?: TextIntent;
  className?: string;
}

const variantClass: Record<TextVariant, string> = {
  display:   "text-display",
  h1:        "text-h1",
  h2:        "text-h2",
  h3:        "text-h3",
  body:      "text-body",
  "body-sm": "text-body-sm",
  caption:   "text-caption",
  label:     "text-label",
  button:    "text-button"
};

const weightClass: Record<string, string> = {
  regular: "font-sans",
  medium:  "font-medium",
  bold:    "font-bold"
};

const intentClass: Record<TextIntent, string> = {
  default:      "text-foreground",
  muted:        "text-muted-foreground",
  primary:      "text-primary",
  accent:       "text-accent",
  destructive:  "text-destructive",
  success:      "text-success",
  warning:      "text-warning",
  info:         "text-info"
};

/**
 * Design-system Text primitive.
 * Automatically applies RTL writing-direction and text-alignment for Persian.
 * Uses NativeWind classes for all visual properties.
 */
export function Text({
  variant = "body",
  weight,
  intent = "default",
  className,
  style,
  ...props
}: TextProps) {
  const { locale } = useAcademy();
  const isFa = locale === "fa";
  const w = weightClass[weight ?? "regular"];
  const dir = isFa ? "text-right" : "text-left";
  return (
    <RNText
      className={cn(variantClass[variant], w, intentClass[intent], dir, className)}
      style={[{ writingDirection: isFa ? "rtl" : "ltr" }, style as object]}
      {...props}
    />
  );
}
