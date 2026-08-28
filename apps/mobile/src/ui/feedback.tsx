import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { StyleSheet, Text, View } from "react-native";
import { useAcademy } from "@/providers/academy-provider";
import { localizedRow, theme } from "@/theme";
import { PressableSurface } from "./pressable-surface";

/**
 * Content-error feedback strip.
 * LIVE: Telegram (https://t.me/imma_bobby).
 * DORMANT: email — set FEEDBACK_EMAIL when a support inbox exists; until then
 * the email chip simply does not render.
 */

const FEEDBACK_EMAIL = "";
const FEEDBACK_TELEGRAM = "https://t.me/imma_bobby";

export function FeedbackRow({ context }: { context?: string }) {
  const { locale } = useAcademy();
  if (!FEEDBACK_EMAIL && !FEEDBACK_TELEGRAM) return null;

  const version = Constants.expoConfig?.version ?? "unknown";
  const subject = locale === "fa" ? `خطای محتوایی — Sunverter Academy v${version}` : `Content correction — Sunverter Academy v${version}`;
  const bodyLines = [
    locale === "fa" ? "صفحه/بخش:" : "Screen/section:",
    context ?? "-",
    "",
    locale === "fa" ? "مشکل پیشنهادی:" : "Reported issue:",
    "",
    locale === "fa" ? "نسخهٔ برنامه:" : "App version:",
    version
  ];
  const body = encodeURIComponent(bodyLines.join("\n"));
  const subjectEncoded = encodeURIComponent(subject);

  const openMail = () => {
    void Linking.openURL(`mailto:${FEEDBACK_EMAIL}?subject=${subjectEncoded}&body=${body}`);
  };
  const openTelegram = () => {
    void Linking.openURL(FEEDBACK_TELEGRAM);
  };

  return (
    <View style={[styles.row, localizedRow(locale)]}>
      <Ionicons name="chatbubble-ellipses-outline" size={16} color={theme.colors.textSecondary} />
      <Text style={[styles.label, locale === "fa" ? styles.rtlText : null]}>
        {locale === "fa" ? "خطای محتوایی دیدید؟" : "Spotted a content error?"}
      </Text>
      <View style={[styles.buttons, localizedRow(locale)]}>
        {FEEDBACK_EMAIL ? (
          <PressableSurface onPress={openMail} accessibilityRole="button" accessibilityLabel="Email feedback" rippleColor={theme.colors.borderSubtle} style={styles.chip}>
            <Ionicons name="mail-outline" size={14} color={theme.colors.brandPrimary} />
            <Text style={styles.chipText}>{locale === "fa" ? "ایمیل" : "Email"}</Text>
          </PressableSurface>
        ) : null}
        {FEEDBACK_TELEGRAM ? (
          <PressableSurface onPress={openTelegram} accessibilityRole="button" accessibilityLabel="Telegram feedback" rippleColor={theme.colors.borderSubtle} style={styles.chip}>
            <Ionicons name="paper-plane-outline" size={14} color={theme.colors.brandPrimary} />
            <Text style={styles.chipText}>{locale === "fa" ? "تلگرام" : "Telegram"}</Text>
          </PressableSurface>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: "center", gap: 8, marginTop: 18, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.borderSubtle },
  label: { flex: 1, color: theme.colors.textSecondary, fontSize: 11 },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
  buttons: { flexDirection: "row", gap: 8 },
  chip: { overflow: "hidden", flexDirection: "row", alignItems: "center", gap: 6, minHeight: 34, paddingHorizontal: 12, borderRadius: theme.radii.pill, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.raised },
  chipText: { color: theme.colors.brandPrimary, fontSize: 11, fontWeight: "700" }
});
