import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { completionPercent } from "@nexa/shared-logic";
import { getProduct, localize } from "@nexa/product-content";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/screen";
import { useAcademy } from "@/providers/academy-provider";
import { localizedRow, localizedTextStyle, theme } from "@/theme";

const lessonIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  overview: "git-network-outline",
  anatomy: "scan-outline",
  safety: "shield-checkmark-outline",
  installation: "construct-outline",
  connections: "flash-outline",
  "power-on": "power-outline",
  lcd: "calculator-outline",
  settings: "options-outline",
  modes: "swap-horizontal-outline",
  battery: "battery-charging-outline",
  faults: "warning-outline",
  troubleshooting: "build-outline",
  specifications: "list-outline",
  manuals: "book-outline",
  quiz: "checkmark-circle-outline"
};

export default function AcademyScreen() {
  const { model } = useLocalSearchParams<{ model: string }>();
  const product = getProduct(model);
  const { locale, completed } = useAcademy();
  if (!product || product.modelName.verificationStatus !== "verified") return null;
  const percent = completionPercent(completed, product.lessons.length);

  return (
    <Screen title={`${product.brand} ${product.modelName.value}`} back>
      <View style={styles.hero}>
        <View style={styles.heroGrid}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>PRODUCT ACADEMY</Text>
            <Text style={[styles.heroTitle, localizedTextStyle(locale)]}>{locale === "fa" ? "سانورترت را بشناس." : "Know your Sunverter."}</Text>
            <Text style={[styles.heroSubtitle, localizedTextStyle(locale)]}>{locale === "fa" ? "۱۵ درس مستند، از مسیر انرژی تا خطاها." : "15 sourced lessons, from energy flow to faults."}</Text>
          </View>
          <Image source={require("../../assets/nexa-product-mobile.webp")} style={styles.product} contentFit="contain" />
        </View>
        <View style={[styles.progressHead, localizedRow(locale)]}><Text style={[styles.progressLabel, localizedTextStyle(locale)]}>{locale === "fa" ? "پیشرفت یادگیری" : "Learning progress"}</Text><Text style={styles.progressValue}>{percent}%</Text></View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${percent}%` }]} /></View>
      </View>

      <View style={[styles.quickActions, localizedRow(locale)]}>
        <Pressable style={styles.quickAction} onPress={() => router.push(`/lesson/anatomy?model=${product.slug}`)}>
          <Ionicons name="scan-outline" size={21} color={theme.colors.brandPrimary} />
          <Text style={[styles.quickText, localizedTextStyle(locale)]}>{locale === "fa" ? "آناتومی" : "Anatomy"}</Text>
        </Pressable>
        <Pressable style={styles.quickAction} onPress={() => router.push(`/lesson/troubleshooting?model=${product.slug}`)}>
          <Ionicons name="build-outline" size={21} color={theme.colors.brandPrimary} />
          <Text style={[styles.quickText, localizedTextStyle(locale)]}>{locale === "fa" ? "عیب‌یابی" : "Troubleshoot"}</Text>
        </Pressable>
      </View>

      <Text style={[styles.sectionTitle, localizedTextStyle(locale)]}>{locale === "fa" ? "مسیر یادگیری" : "Learning path"}</Text>
      <View style={styles.lessonList}>
        {product.lessons.map((lesson, index) => {
          const done = completed.includes(lesson.id);
          return (
            <Pressable style={[styles.lesson, localizedRow(locale)]} onPress={() => router.push(`/lesson/${lesson.slug}?model=${product.slug}`)} key={lesson.id}>
              <View style={[styles.lessonIcon, done && styles.lessonIconDone]}><Ionicons name={done ? "checkmark" : lessonIcons[lesson.id] ?? "book-outline"} size={19} color={done ? "white" : theme.colors.brandPrimary} /></View>
              <View style={styles.lessonCopy}>
                <Text style={[styles.lessonTitle, localizedTextStyle(locale)]}>{localize(lesson.title, locale)}</Text>
                <Text style={[styles.lessonSummary, localizedTextStyle(locale)]} numberOfLines={2}>{localize(lesson.summary, locale)}</Text>
              </View>
              {lesson.safetyCritical ? <View style={styles.safetyDot} /> : null}
              <Text style={styles.index}>{String(index + 1).padStart(2, "0")}</Text>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { overflow: "hidden", marginHorizontal: -18, paddingHorizontal: 20, paddingBottom: 25, backgroundColor: theme.colors.brandPrimary },
  heroGrid: { flexDirection: "row", minHeight: 300, alignItems: "center" },
  heroCopy: { zIndex: 2, width: "61%" },
  eyebrow: { marginBottom: 14, color: "#D9A2AB", fontSize: 9, fontWeight: "700", letterSpacing: 1.3 },
  heroTitle: { color: "white", fontSize: 39, lineHeight: 52, fontWeight: "800", fontFamily: "Vazirmatn_700Bold" },
  heroSubtitle: { marginTop: 8, color: "rgba(255,255,255,.68)", fontSize: 12, lineHeight: 20 },
  product: { position: "absolute", right: -12, bottom: 0, width: "53%", height: "98%" },
  progressHead: { justifyContent: "space-between", marginBottom: 8 },
  progressLabel: { color: "rgba(255,255,255,.72)", fontSize: 10 },
  progressValue: { color: "white", fontSize: 11, fontWeight: "700" },
  progressTrack: { height: 5, overflow: "hidden", borderRadius: 10, backgroundColor: "rgba(255,255,255,.18)" },
  progressFill: { height: "100%", borderRadius: 10, backgroundColor: theme.colors.brandAccent },
  quickActions: { gap: 10, marginTop: 16 },
  quickAction: { flex: 1, minHeight: 70, alignItems: "center", justifyContent: "center", gap: 7, borderWidth: 1, borderColor: theme.colors.borderSubtle, borderRadius: theme.radii.control, backgroundColor: theme.colors.raised },
  quickText: { color: theme.colors.brandPrimary, fontSize: 11, fontWeight: "700" },
  sectionTitle: { marginTop: 34, marginBottom: 14, color: theme.colors.brandPrimary, fontSize: 25, fontWeight: "800" },
  lessonList: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.borderSubtle },
  lesson: { alignItems: "center", gap: 11, minHeight: 88, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.borderSubtle },
  lessonIcon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: theme.colors.technical },
  lessonIconDone: { backgroundColor: theme.colors.success },
  lessonCopy: { flex: 1 },
  lessonTitle: { color: theme.colors.brandPrimary, fontSize: 14, fontWeight: "700" },
  lessonSummary: { marginTop: 2, color: theme.colors.textSecondary, fontSize: 10, lineHeight: 16 },
  safetyDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.colors.warning },
  index: { color: "#9BA6B2", fontSize: 9, fontWeight: "700" }
});
