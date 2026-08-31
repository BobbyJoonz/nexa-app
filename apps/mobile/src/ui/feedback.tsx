import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { MessageCircle, Mail, Send } from "lucide-react-native";
import { Text, View } from "react-native";
import { useAcademy } from "@/providers/academy-provider";
import { cn } from "@/src/ui/cn";
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
  const isFa = locale === "fa";
  if (!FEEDBACK_EMAIL && !FEEDBACK_TELEGRAM) return null;

  const version = Constants.expoConfig?.version ?? "unknown";
  const subject = isFa ? `خطای محتوایی — Sunverter Academy v${version}` : `Content correction — Sunverter Academy v${version}`;
  const bodyLines = [
    isFa ? "صفحه/بخش:" : "Screen/section:",
    context ?? "-",
    "",
    isFa ? "مشکل پیشنهادی:" : "Reported issue:",
    "",
    isFa ? "نسخهٔ برنامه:" : "App version:",
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
    <View className={cn("mt-[18px] flex-row items-center gap-2 border-t border-border pt-4", isFa && "flex-row-reverse")}>
      <MessageCircle size={16} color="#5C6878" />
      <Text className="flex-1 text-[11px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
        {isFa ? "خطای محتوایی دیدید؟" : "Spotted a content error?"}
      </Text>
      <View className={cn("flex-row items-center gap-2", isFa && "flex-row-reverse")}>
        {FEEDBACK_EMAIL ? (
          <PressableSurface onPress={openMail} accessibilityRole="button" accessibilityLabel="Email feedback" rippleColor="#C9D3DE" className={cn("flex-row items-center gap-1.5 rounded-pill border border-border bg-card px-3", isFa && "flex-row-reverse")} style={{ borderRadius: 999, borderWidth: 1, borderColor: "#CCD5DE", backgroundColor: "#FBFCFD", minHeight: 34, overflow: "hidden" }}>
            <Mail size={14} color="#1D6F4E" />
            <Text className="text-[11px] font-bold text-primary">{isFa ? "ایمیل" : "Email"}</Text>
          </PressableSurface>
        ) : null}
        {FEEDBACK_TELEGRAM ? (
          <PressableSurface onPress={openTelegram} accessibilityRole="button" accessibilityLabel="Telegram feedback" rippleColor="#C9D3DE" className={cn("flex-row items-center gap-1.5 rounded-pill border border-border bg-card px-3", isFa && "flex-row-reverse")} style={{ borderRadius: 999, borderWidth: 1, borderColor: "#CCD5DE", backgroundColor: "#FBFCFD", minHeight: 34, overflow: "hidden" }}>
            <Send size={14} color="#1D6F4E" />
            <Text className="text-[11px] font-bold text-primary">{isFa ? "تلگرام" : "Telegram"}</Text>
          </PressableSurface>
        ) : null}
      </View>
    </View>
  );
}