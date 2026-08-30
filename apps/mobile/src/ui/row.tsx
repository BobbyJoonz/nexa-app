import type { PropsWithChildren } from "react";
import { View, type ViewProps } from "react-native";
import { useAcademy } from "@/providers/academy-provider";
import { cn } from "./cn";

interface RowProps extends ViewProps {
  /** Extra classes appended after the direction classes. */
  className?: string;
}

/**
 * RTL-aware flex row. Direction follows the active locale instantly
 * (both class strings are literal in source, so NativeWind compiles both).
 * Use this instead of raw flex-row when content must mirror under fa.
 */
export function Row({ children, className, ...props }: PropsWithChildren<RowProps>) {
  const { locale } = useAcademy();
  const isFa = locale === "fa";
  return (
    <View
      className={cn("flex-row items-center", isFa ? "flex-row-reverse" : "flex-row", className)}
      {...props}
    >
      {children}
    </View>
  );
}
