import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { Text } from "react-native";
import { useAcademy } from "@/providers/academy-provider";
import { cn } from "@/src/ui/cn";

/**
 * Content-error feedback — deliberately minimal. One quiet caption line with
 * a single tappable link; no chips, icons, or boxes. A feedback affordance
 * should be discoverable but never compete with lesson content.
 * LIVE: Telegram (https://t.me/imma_bobby).
 * DORMANT: email — set FEEDBACK_EMAIL when a support inbox exists.
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
  const url = FEEDBACK_EMAIL
    ? `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`
    : FEEDBACK_TELEGRAM;

  return (
    <Text
      className={cn("mt-2.5 text-[10.5px] leading-[18px] text-muted-foreground")}
      style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}
    >
      {isFa ? "خطای محتوایی دیدید؟ " : "Spotted a content error? "}
      <Text
        onPress={() => {
          try {
            void Linking.openURL(url);
          } catch {
            // Linking failure is non-fatal.
          }
        }}
        suppressHighlighting
        style={{ color: "#3974A4", fontWeight: "600", textDecorationLine: "underline" }}
      >
        {isFa ? "از طریق تلگرام بگویید" : "Tell us on Telegram"}
      </Text>
    </Text>
  );
}
