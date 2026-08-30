import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { cn } from "../cn";
import { Row } from "../row";

/**
 * Shared label + icon-slot layout for every Button implementation.
 * Slot order mirrors automatically under fa (via Row), so callers pass
 * leading/trailing logically and never think about RTL.
 * Label styling is driven by the variant/size class strings from the caller.
 */
export function ButtonContent({
  label,
  labelClass,
  leading,
  trailing
}: {
  label: string;
  labelClass: string;
  leading?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <Row className="w-full gap-2">
      {leading ? <View className="items-center justify-center">{leading}</View> : null}
      <Text className={cn("flex-shrink", labelClass)} numberOfLines={1}>
        {label}
      </Text>
      {trailing ? <View className="items-center justify-center">{trailing}</View> : null}
    </Row>
  );
}