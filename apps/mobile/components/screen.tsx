import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAcademy } from "@/providers/academy-provider";
import { localizedRow, localizedTextStyle, theme } from "@/theme";

export function Screen({
  children,
  title,
  scroll = true,
  back = false
}: {
  children: ReactNode;
  title?: string;
  scroll?: boolean;
  back?: boolean;
}) {
  const { locale, setLocale } = useAcademy();
  const content = (
    <View style={styles.content}>
      {(title || back) && (
        <View style={[styles.header, localizedRow(locale)]}>
          {back ? (
            <Pressable style={styles.iconButton} onPress={() => router.back()} accessibilityLabel="Back">
              <Ionicons name={locale === "fa" ? "arrow-forward" : "arrow-back"} size={20} color={theme.colors.brandPrimary} />
            </Pressable>
          ) : <View style={styles.iconButton} />}
          <Text style={[styles.headerTitle, localizedTextStyle(locale)]} numberOfLines={1}>{title}</Text>
          <Pressable style={styles.localeButton} onPress={() => void setLocale(locale === "fa" ? "en" : "fa")}>
            <Text style={styles.localeButtonText}>{locale === "fa" ? "EN" : "فا"}</Text>
          </Pressable>
        </View>
      )}
      {children}
      <View style={[styles.disclaimer, localizedRow(locale)]}>
        <Ionicons name="shield-checkmark-outline" size={17} color={theme.colors.textSecondary} />
        <Text style={[styles.disclaimerText, localizedTextStyle(locale)]}>
          {locale === "fa" ? "راهنمای آموزشی است و جایگزین دفترچه رسمی یا نصاب متخصص نیست." : "Educational companion only. It does not replace the official manual or a qualified installer."}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

export function MobileBrand() {
  return (
    <View style={styles.brand}>
      <Image source={require("../assets/nexa-logo.png")} style={styles.logo} contentFit="contain" />
      <Text style={styles.brandText}>SUNVERTER ACADEMY</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas },
  scroll: { flexGrow: 1 },
  content: { flex: 1, paddingHorizontal: 18, paddingBottom: 28 },
  header: { alignItems: "center", justifyContent: "space-between", minHeight: 64, gap: 10 },
  headerTitle: { flex: 1, color: theme.colors.brandPrimary, fontSize: 16, fontWeight: "700", textAlign: "center" },
  iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: theme.colors.raised },
  localeButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: theme.colors.technical },
  localeButtonText: { color: theme.colors.brandPrimary, fontWeight: "700", fontSize: 12 },
  disclaimer: { gap: 8, alignItems: "flex-start", marginTop: 36, paddingTop: 18, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.borderSubtle },
  disclaimerText: { flex: 1, color: theme.colors.textSecondary, fontSize: 10, lineHeight: 17 },
  brand: { alignItems: "center", gap: 7 },
  logo: { width: 126, height: 48 },
  brandText: { color: theme.colors.textSecondary, fontSize: 9, fontWeight: "700", letterSpacing: 1.7 }
});
