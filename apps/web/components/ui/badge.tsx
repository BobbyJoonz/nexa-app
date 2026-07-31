import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "verified" | "missing" | "warning" | "neutral";
}) {
  return <span className={cn("badge", `badge-${tone}`, className)} {...props} />;
}
