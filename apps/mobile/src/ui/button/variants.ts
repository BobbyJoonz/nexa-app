import { theme } from "@/theme";
import type { ButtonVariant } from "./types";

/** Brand colors are shared across platforms; only shape/type/feedback diverge per OS. */
export interface VariantChrome {
  background: string;
  content: string;
  ripple: string;
}

export function variantChrome(variant: ButtonVariant): VariantChrome {
  switch (variant) {
    case "filled":
      return { background: theme.colors.brandPrimary, content: "#FFFFFF", ripple: "rgba(255,255,255,.24)" };
    case "secondary":
      return { background: theme.colors.technical, content: theme.colors.brandPrimary, ripple: "rgba(13,34,62,.10)" };
    case "ghost":
      return { background: "transparent", content: theme.colors.brandPrimary, ripple: "rgba(13,34,62,.08)" };
    case "danger":
      return { background: theme.colors.danger, content: "#FFFFFF", ripple: "rgba(255,255,255,.22)" };
  }
}
