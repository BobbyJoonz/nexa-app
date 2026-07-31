import { colors, radii, spacing } from "@nexa/design-tokens";
import type { Locale } from "@nexa/i18n";
import type { TextStyle, ViewStyle } from "react-native";

export const theme = {
  colors,
  radii,
  spacing,
  shadow: {
    shadowColor: "#0D223E",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 26,
    elevation: 5
  } satisfies ViewStyle
};

export const localizedTextStyle = (locale: Locale): TextStyle => ({
  fontFamily: locale === "fa" ? "Vazirmatn_400Regular" : undefined,
  textAlign: locale === "fa" ? "right" : "left",
  writingDirection: locale === "fa" ? "rtl" : "ltr"
});

export const localizedRow = (locale: Locale): ViewStyle => ({
  flexDirection: locale === "fa" ? "row-reverse" : "row"
});
