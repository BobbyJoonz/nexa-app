import { View } from "react-native";
import { cn } from "./cn";

interface SeparatorProps {
  /** Vertical divider (use inside a Row). */
  vertical?: boolean;
  className?: string;
}

/** Hairline divider using the border token. */
export function Separator({ vertical = false, className }: SeparatorProps) {
  return (
    <View
      className={cn(
        "bg-border",
        vertical ? "w-px self-stretch" : "h-px w-full",
        className
      )}
    />
  );
}
