import { Image } from "expo-image";
import { router } from "expo-router";
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, ShieldCheck, Info } from "lucide-react-native";
import type { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAcademy } from "@/providers/academy-provider";
import { isIOS } from "@/src/ui/platform";
import { IconButton } from "@/src/ui/icon-button";
import { FeedbackRow } from "@/src/ui/feedback";
import { cn } from "@/src/ui/cn";

/**
 * Reusable screen shell — the single layout every routed page uses.
 * Header with back arrow + language toggle, content area, disclaimer, feedback.
 * Fully NativeWind + Lucide; RTL handled via locale-driven class switching.
 */
export function Screen({ children, title, scroll = true, back = false }: { children: ReactNode; title?: string; scroll?: boolean; back?: boolean }) {
  const { locale, setLocale } = useAcademy();
  const isFa = locale === "fa";
  const insets = useSafeAreaInsets();

  const BackIcon = isFa ? (isIOS ? ChevronRight : ArrowRight) : (isIOS ? ChevronLeft : ArrowLeft);

  const content = (
    <View
      className="flex-1 px-[18px] pb-7"
      // Explicit native insets — never rely on interop/safe-area wrappers
      // for the status-bar gap (header must never sit under the clock).
      style={{ paddingTop: insets.top + 8 }}
    >
      {(title || back) && (
        <View className={cn("flex-row items-center justify-between gap-2.5 mb-1", isFa && "flex-row-reverse")}>
          {back ? (
            <IconButton onPress={() => router.back()} accessibilityLabel="Back">
              <BackIcon size={isIOS ? 23 : 20} color="#122C4F" />
            </IconButton>
          ) : (
            <View style={{ width: 40, height: 40 }} />
          )}
          <Text
            className="flex-1 text-center text-[16px] font-bold text-primary"
            numberOfLines={1}
            style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}
          >
            {title}
          </Text>
          <IconButton tone="technical" accessibilityLabel="Toggle language" onPress={() => void setLocale(isFa ? "en" : "fa")}>
            <Text className="text-[12px] font-bold text-primary">{isFa ? "EN" : "فا"}</Text>
          </IconButton>
        </View>
      )}
      {children}
      <View className={cn("mt-9 flex-row items-start gap-2 border-t border-border pt-[18px]", isFa && "flex-row-reverse")}>
        <ShieldCheck size={17} color="#5C6878" />
        <Text className="flex-1 text-[10px] leading-[17px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
          {isFa ? "راهنمای آموزشی است و جایگزین دفترچه رسمی یا نصاب متخصص نیست." : "Educational companion only. It does not replace the official manual or a qualified installer."}
        </Text>
      </View>
      <FeedbackRow context={typeof title === "string" ? title : undefined} />
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      {scroll ? <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{content}</ScrollView> : content}
    </View>
  );
}

export function MobileBrand() {
  return (
    <View className="items-center gap-[7px]">
      <Image source={require("../assets/nexa-logo.png")} style={{ width: 126, height: 48 }} contentFit="contain" />
      <Text className="text-[9px] font-bold tracking-[1.7px] text-muted-foreground">SUNVERTER ACADEMY</Text>
    </View>
  );
}