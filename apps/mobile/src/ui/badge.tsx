import type { PropsWithChildren } from "react";
import { View } from "react-native";
import { cn } from "./cn";

type BadgeIntent = "default" | "secondary" | "accent" | "success" | "warning" | "destructive" | "info";

interface BadgeProps {
  intent?: BadgeIntent;
  className?: string;
}

const intentClass: Record<BadgeIntent, string> = {
  default:     "bg-primary text-primary-foreground",
  secondary:   "bg-secondary text-secondary-foreground",
  accent:      "bg-accent text-accent-foreground",
  success:     "bg-success text-white",
  warning:     "bg-warning text-white",
  destructive: "bg-destructive text-destructive-foreground",
  info:        "bg-info text-white"
};

/** Small status/category chip. Composition-friendly: pass any content. */
export function Badge({ children, intent = "default", className }: PropsWithChildren<BadgeProps>) {
  return (
    <View className={cn("self-start flex-row items-center gap-1 rounded-pill px-2.5 py-1", intentClass[intent], className)}>
      {children}
    </View>
  );
}
