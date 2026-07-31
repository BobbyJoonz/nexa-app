import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { productModels } from "@nexa/product-content";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MobileBrand, Screen } from "@/components/screen";
import { useAcademy } from "@/providers/academy-provider";
import { localizedRow, localizedTextStyle, theme } from "@/theme";

export default function ModelsScreen() {
  const { locale } = useAcademy();
  const verified = productModels[0];
  const missing = productModels[1];
  if (!verified || !missing) return null;

  return (
    <Screen>
      <View style={styles.top}><MobileBrand /></View>
      <Text style={[styles.eyebrow, localizedTextStyle(locale)]}>MODEL / 02</Text>
      <Text style={[styles.title, localizedTextStyle(locale)]}>{locale === "fa" ? "سانورتر خود را انتخاب کنید" : "Choose your Sunverter"}</Text>
      <Text style={[styles.subtitle, localizedTextStyle(locale)]}>{locale === "fa" ? "فقط مدل دارای منبع معتبر قابل انتخاب است." : "Only a model with a verified source is selectable."}</Text>

      <Pressable style={styles.featured} onPress={() => router.push(`/academy/${verified.slug}`)}>
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
          <View style={[styles.explore, localizedRow(locale)]}>
            <Text style={[styles.exploreText, localizedTextStyle(locale)]}>{locale === "fa" ? "مشاهده این مدل" : "Explore this model"}</Text>
            <Ionicons name={locale === "fa" ? "arrow-back" : "arrow-forward"} size={18} color="white" />
          </View>
        </View>
      </Pressable>

      <View style={[styles.missing, localizedRow(locale)]}>
        <View style={styles.missingIcon}><Ionicons name="document-outline" size={22} color={theme.colors.warning} /></View>
        <View style={styles.missingCopy}>
          <Text style={[styles.missingTitle, localizedTextStyle(locale)]}>{locale === "fa" ? "منبع مدل دوم لازم است" : "Second-model source required"}</Text>
          <Text style={[styles.missingText, localizedTextStyle(locale)]}>{locale === "fa" ? "تصویر، دفترچه و دیتاشیت ارائه نشده است." : "No image, manual or datasheet was supplied."}</Text>
        </View>
      </View>
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
  factStrong: { color: theme.colors.brandPrimary, fontSize: 17, fontWeight: "800" },
  explore: { minHeight: 50, alignItems: "center", justifyContent: "space-between", marginTop: 22, paddingHorizontal: 16, borderRadius: theme.radii.control, backgroundColor: theme.colors.brandPrimary },
  exploreText: { color: "white", fontSize: 13, fontWeight: "700" },
  missing: { alignItems: "center", gap: 13, marginTop: 18, padding: 18, borderWidth: 1, borderStyle: "dashed", borderColor: theme.colors.borderSubtle, borderRadius: theme.radii.panel, backgroundColor: "rgba(232,237,242,.65)" },
  missingIcon: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: "#FFF7ED" },
  missingCopy: { flex: 1 },
  missingTitle: { color: theme.colors.brandPrimary, fontSize: 14, fontWeight: "700" },
  missingText: { marginTop: 3, color: theme.colors.textSecondary, fontSize: 11, lineHeight: 18 }
});
