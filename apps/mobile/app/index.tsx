import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { t } from "@nexa/i18n";
import { MobileBrand } from "@/components/screen";
import { useAcademy } from "@/providers/academy-provider";
import { localizedTextStyle, theme } from "@/theme";
import { Button } from "@/src/ui/button/Button";
import { dirIconName } from "@/src/ui/direction";
import { isIOS } from "@/src/ui/platform";

export default function LanguageScreen() {
  const { locale, setLocale } = useAcademy();
  const choose = (target: "fa" | "en") => {
    // Navigate immediately; persistence is best-effort and must never hold the user here.
    void setLocale(target);
    router.replace("/models");
  };
  const forwardGlyph = (target: "fa" | "en", color: string) => (
    <Ionicons
      name={dirIconName(target, "arrow-forward", "arrow-back")}
      size={isIOS ? 20 : 19}
      color={color}
    />
  );
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.visual}>
        <View style={styles.orbit} />
        <Image source={require("../assets/nexa-product-mobile.webp")} style={styles.product} contentFit="contain" />
        <View style={styles.readout}><Text style={styles.readoutLabel}>POWER</Text><Text style={styles.readoutValue}>3.5 kW</Text></View>
      </View>
      <View style={styles.copy}>
        <MobileBrand />
        <Text style={[styles.title, localizedTextStyle(locale)]}>{t(locale, "language.title")}</Text>
        <Text style={[styles.subtitle, localizedTextStyle(locale)]}>{t(locale, "language.subtitle")}</Text>
        <Button variant="filled" block label={t(locale, "language.selfFa")} trailing={forwardGlyph("fa", "#FFFFFF")} onPress={() => choose("fa")} accessibilityLabel={t(locale, "language.ctaFa")} />
        <Button variant="secondary" block label={t(locale, "language.selfEn")} trailing={forwardGlyph("en", theme.colors.brandPrimary)} onPress={() => choose("en")} accessibilityLabel={t(locale, "language.ctaEn")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.raised },
  visual: { flex: 1.08, alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: theme.colors.brandPrimaryStrong },
  orbit: { position: "absolute", width: 340, height: 340, borderRadius: 170, borderWidth: 1, borderStyle: "dashed", borderColor: "rgba(255,255,255,.28)" },
  product: { width: "66%", height: "88%" },
  readout: { position: "absolute", right: 20, bottom: 24, minWidth: 110, padding: 12, borderWidth: 1, borderColor: "rgba(255,255,255,.22)", borderRadius: 10, backgroundColor: "rgba(13,34,62,.82)" },
  readoutLabel: { color: "rgba(255,255,255,.58)", fontSize: 8, fontWeight: "700", letterSpacing: 1.5 },
  readoutValue: { color: "white", fontSize: 18, fontWeight: "700" },
  copy: { flex: 1, justifyContent: "center", paddingHorizontal: 22, gap: 11 },
  title: { marginTop: 14, color: theme.colors.brandPrimary, fontSize: 34, lineHeight: 46, fontFamily: "Vazirmatn_700Bold" },
  subtitle: { marginBottom: 10, color: theme.colors.textSecondary, fontSize: 14, fontFamily: "Vazirmatn_400Regular" }
});
