import type { PropsWithChildren } from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "./cn";

interface CardProps extends ViewProps {
  /** Raise the card with a stronger shadow (default: subtle). */
  raised?: boolean;
  className?: string;
}

/**
 * Design-system Card: raised surface with the panel radius and a soft shadow.
 * Composition-friendly — no content-specific props; use inside freely.
 */
export function Card({ children, raised = false, className, ...props }: PropsWithChildren<CardProps>) {
  return (
    <View
      className={cn(
        "rounded-panel bg-card p-4",
        raised ? "shadow-pop" : "shadow-card",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
