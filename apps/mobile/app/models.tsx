import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { productModels } from "@nexa/product-content";
import { StyleSheet, Text, View } from "react-native";
import { MobileBrand, Screen } from "@/components/screen";
import { useAcademy } from "@/providers/academy-provider";
import { localizedRow, localizedTextStyle, theme } from "@/theme";
import { Button } from "@/src/ui/button/Button";
import { dirIconName } from "@/src/ui/direction";
import { PressableSurface } from "@/src/ui/pressable-surface";

export default function ModelsScreen() {
  const { locale } = useAcademy();
  const verified = productModels[0];
  if (!verified) return null;

  return (
    <Screen>
      <View style={styles.top}><MobileBrand /></View>
      <Text style={[styles.eyebrow, localizedTextStyle(locale)]}>MODEL / 02</Text>
      <Text style={[styles.title, localizedTextStyle(locale)]}>{locale === "fa" ? "سانورتر خود را انتخاب کنید" : "Choose your Sunverter"}</Text>
      <Text style={[styles.subtitle, localizedTextStyle(locale)]}>{locale === "fa" ? "فقط مدل دارای منبع معتبر قابل انتخاب است." : "Only a model with a verified source is selectable."}</Text>

      <PressableSurface style={styles.featured} onPress={() => router.push(`/academy/${verified.slug}`)} accessibilityRole="button" accessibilityLabel={verified.modelName.value}>
        <View style={styles.imageStage}>
          <Image source={require("../assets/nexa-product-mobile.webp")} style={styles.product} contentFit="contain" />
          <View style={styles.verifiedBadge}><Ionicons name="shield-checkmark" size={14} color={theme.colors.success} /><Text style={styles.verifiedText}>{locale === "fa" ? "تأییدشده" : "Verified"}</Text></View>
        </View>
        <View style={styles.cardCopy}>
          <Text style={styles.kicker}>NEXA HYBRID SOLAR INVERTER</Text>
          <Text style={[styles.model, localizedTextStyle(locale)]}>{verified.modelName.value}</Text>
          <View style={[styles.facts, localizedRow(locale)]}>
            <Text style={styles.fact}><Text style={styles.factStrong}>{verified.ratedPowerKw.value}</Text> kW</Text>
            <Text style={styles.fact}><Text style={styles.factStrong}>{verified.batteryVoltageVdc.value}</Text> VDC</Text>
          </View>
          <Button
            variant="filled"
            block
            label={locale === "fa" ? "مشاهده این مدل" : "Explore this model"}
            trailing={<Ionicons name={dirIconName(locale, "arrow-forward", "arrow-back")} size={18} color="#FFFFFF" />}
            onPress={() => router.push(`/academy/${verified.slug}`)}
            style={{ marginTop: 22 }}
          />
        </View>
      </PressableSurface>

      <Button
        variant="ghost"
        block
        label={locale === "fa" ? "ماشین‌حساب سازگاری دستگاه" : "Device sizing calculator"}
        leading={<Ionicons name="calculator-outline" size={17} color={theme.colors.brandPrimary} />}
        trailing={<Ionicons name={dirIconName(locale, "chevron-forward", "chevron-back")} size={16} color={theme.colors.borderSubtle} />}
        onPress={() => router.push("/calculator")}
        style={{ marginTop: 12 }}
      />
      <Button
        variant="ghost"
        block
        label={locale === "fa" ? "جست‌وجو و مرجع کد خطا" : "Search & fault reference"}
        leading={<Ionicons name="search-outline" size={17} color={theme.colors.brandPrimary} />}
        trailing={<Ionicons name={dirIconName(locale, "chevron-forward", "chevron-back")} size={16} color={theme.colors.borderSubtle} />}
        onPress={() => router.push("/search")}
        style={{ marginTop: 8 }}
      />
      <Button
        variant="ghost"
        block
        label={locale === "fa" ? "چک‌لیست راه‌اندازی" : "Commissioning checklist"}
        leading={<Ionicons name="checkbox-outline" size={17} color={theme.colors.brandPrimary} />}
        trailing={<Ionicons name={dirIconName(locale, "chevron-forward", "chevron-back")} size={16} color={theme.colors.borderSubtle} />}
        onPress={() => router.push("/checklist")}
        style={{ marginTop: 8 }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: "flex-start", paddingTop: 20, marginBottom: 46 },
  eyebrow: { color: theme.colors.brandAccent, fontSize: 10, fontWeight: "700", letterSpacing: 1.3 },
  title: { color: theme.colors.brandPrimary, fontSize: 38, lineHeight: 50, fontWeight: "800", fontFamily: "Vazirmatn_700Bold" },
  subtitle: { marginTop: 6, marginBottom: 26, color: theme.colors.textSecondary, fontSize: 13, lineHeight: 23 },
  featured: { overflow: "hidden", borderWidth: 1, borderColor: theme.colors.borderSubtle, borderRadius: theme.radii.panel, backgroundColor: theme.colors.raised, ...theme.shadow },
  imageStage: { height: 360, alignItems: "center", justifyContent: "flex-end", backgroundColor: theme.colors.technical },
  product: { width: "75%", height: "94%" },
  verifiedBadge: { position: "absolute", top: 16, left: 16, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 100, backgroundColor: "#EEF8F2" },
  verifiedText: { color: theme.colors.success, fontSize: 10, fontWeight: "700" },
  cardCopy: { padding: 22 },
  kicker: { color: theme.colors.textSecondary, fontSize: 8, fontWeight: "700", letterSpacing: 1.2 },
  model: { marginTop: 8, color: theme.colors.brandPrimary, fontSize: 29, fontWeight: "800" },
  facts: { gap: 12, marginTop: 10 },
  fact: { color: theme.colors.textSecondary, fontSize: 12 },
  factStrong: { color: theme.colors.brandPrimary, fontSize: 17, fontWeight: "800" }
});
