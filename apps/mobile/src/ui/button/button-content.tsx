import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAcademy } from "@/providers/academy-provider";

/**
 * Shared label + icon-slot layout for every Button implementation.
 * Slot order mirrors automatically under fa (row-reverse), so callers pass
 * leading/trailing logically and never think about RTL.
 */
export function ButtonContent({
  label,
  contentColor,
  fontWeight,
  fontSize,
  leading,
  trailing
}: {
  label: string;
  contentColor: string;
  fontWeight: "600" | "500" | "700";
  fontSize: number;
  leading?: ReactNode;
  trailing?: ReactNode;
}) {
  const { locale } = useAcademy();
  return (
    <View style={[styles.row, locale === "fa" ? styles.rtl : null]}>
      {leading ? <View style={styles.slot}>{leading}</View> : null}
      <Text numberOfLines={1} style={{ color: contentColor, fontWeight, fontSize, flexShrink: 1 }}>
        {label}
      </Text>
      {trailing ? <View style={styles.slot}>{trailing}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%"
  },
  rtl: { flexDirection: "row-reverse" },
  slot: { alignItems: "center", justifyContent: "center" }
});
