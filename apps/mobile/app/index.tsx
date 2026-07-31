import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { MobileBrand } from "@/components/screen";
import { useAcademy } from "@/providers/academy-provider";
import { localizedRow, localizedTextStyle, theme } from "@/theme";

export default function LanguageScreen() {
  const { setLocale } = useAcademy();
  const choose = (locale: "fa" | "en") => {
    // Navigate immediately; persistence is best-effort and must never hold the user here.
    void setLocale(locale);
    router.replace("/models");
  };
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.visual}>
        <View style={styles.orbit} />
        <Image source={require("../assets/nexa-product-mobile.webp")} style={styles.product} contentFit="contain" />
        <View style={styles.readout}><Text style={styles.readoutLabel}>POWER</Text><Text style={styles.readoutValue}>3.5 kW</Text></View>
      </View>
      <View style={styles.copy}>
        <MobileBrand />
        <Text style={[styles.title, localizedTextStyle("fa")]}>دانش فنی، بدون پیچیدگی.</Text>
        <Text style={[styles.subtitle, localizedTextStyle("fa")]}>زبان آموزش محصول را انتخاب کنید.</Text>
        <Pressable style={[styles.button, localizedRow("fa")]} onPress={() => choose("fa")}>
          <Text style={[styles.buttonText, localizedTextStyle("fa")]}>فارسی</Text>
          <Ionicons name="arrow-back" size={19} color="white" />
        </Pressable>
        <Pressable style={[styles.button, styles.secondary]} onPress={() => choose("en")}>
          <Text style={[styles.buttonText, styles.secondaryText]}>English</Text>
          <Ionicons name="arrow-forward" size={19} color={theme.colors.brandPrimary} />
        </Pressable>
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
  subtitle: { marginBottom: 10, color: theme.colors.textSecondary, fontSize: 14, fontFamily: "Vazirmatn_400Regular" },
  button: { minHeight: 52, alignItems: "center", justifyContent: "space-between", gap: 10, paddingHorizontal: 18, borderRadius: theme.radii.control, backgroundColor: theme.colors.brandPrimary },
  secondary: { flexDirection: "row", borderWidth: 1, borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.raised },
  buttonText: { flex: 1, color: "white", fontSize: 15, fontWeight: "700", fontFamily: "Vazirmatn_500Medium" },
  secondaryText: { color: theme.colors.brandPrimary, fontFamily: undefined }
});
