import { selectUI } from "../platform";
import { normalizeVariant, type ButtonVariant, type ButtonSize } from "./types";

export interface VariantClasses {
  container: string;  // bg, border, etc.
  label: string;      // text color + weight family
  ripple: string;     // hex/ARGB for Android foreground ripple
}

export function variantClasses(variant: ButtonVariant): VariantClasses {
  switch (normalizeVariant(variant)) {
    case "default":
      return { container: "bg-primary", label: "text-primary-foreground font-medium", ripple: "#FFFFFF3D" };
    case "secondary":
      return { container: "bg-secondary", label: "text-secondary-foreground font-medium", ripple: "#0D223E1A" };
    case "outline":
      return { container: "bg-transparent border border-input", label: "text-primary font-medium", ripple: "#0D223E14" };
    case "ghost":
      return { container: "bg-transparent", label: "text-primary font-medium", ripple: "#0D223E14" };
    case "destructive":
      return { container: "bg-destructive", label: "text-white font-medium", ripple: "#FFFFFF38" };
  }
}

/**
 * Button size → literal NativeWind classes (must remain literal strings so the
 * Tailwind JIT scanner picks them up). Platform touch-target divergence lives
 * in selectUI: iOS 44pt+ / Android 48dp+.
 */
export function sizeClasses(size: ButtonSize): { container: string; label: string } {
  switch (size) {
    case "sm":
      return { container: selectUI("min-h-10 px-3 py-1.5", "min-h-11 px-3.5 py-1.5"), label: "text-button" };
    case "md":
      return { container: selectUI("min-h-11 px-4 py-2", "min-h-12 px-5 py-2.5"), label: "text-button" };
    case "lg":
      return { container: "min-h-14 px-6 py-3", label: "text-button" };
  }
}