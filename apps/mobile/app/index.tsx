import { Image } from "expo-image";
import { router } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { t } from "@nexa/i18n";
import { MobileBrand } from "@/components/screen";
import { useAcademy } from "@/providers/academy-provider";
import { Button } from "@/src/ui/button/Button";
import { dirIcon } from "@/src/ui/direction";
import { isIOS } from "@/src/ui/platform";

export default function LanguageScreen() {
  const { locale, setLocale } = useAcademy();
  const isFa = locale === "fa";
  const choose = (target: "fa" | "en") => {
    try {
      void setLocale(target);
    } catch {
      // Never let a storage hiccup block navigation.
    }
    router.push("/models");
  };

  const ForwardIcon = dirIcon(locale, ArrowRight, ArrowLeft);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-[1.08] items-center justify-center overflow-hidden bg-primary-strong">
        <View className="absolute h-[340px] w-[340px] rounded-full border border-dashed border-white/28" />
        <Image source={require("../assets/nexa-product-mobile.webp")} className="w-[66%] h-[88%]" contentFit="contain" />
        <View className="absolute bottom-6 right-5 min-w-[110px] rounded-[10px] border border-white/22 bg-primary-strong/82 p-3">
          <Text className="text-[8px] font-bold tracking-[1.5px] text-white/58">POWER</Text>
          <Text className="text-[18px] font-bold text-white">3.5 kW</Text>
        </View>
      </View>
      <View className="flex-1 justify-center gap-[11px] px-[22px]">
        <MobileBrand />
        <Text
          className="mt-3.5 text-[34px] leading-[46px] text-primary"
          style={{ fontFamily: "Vazirmatn_700Bold", writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}
        >
          {t(locale, "language.title")}
        </Text>
        <Text
          className="mb-2.5 text-[14px] text-muted-foreground"
          style={{ fontFamily: "Vazirmatn_400Regular", writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}
        >
          {t(locale, "language.subtitle")}
        </Text>
        <Button variant="filled" block label={t(locale, "language.selfFa")} trailing={<ForwardIcon size={isIOS ? 20 : 19} color="#FFFFFF" />} onPress={() => choose("fa")} accessibilityLabel={t(locale, "language.ctaFa")} />
        <Button variant="secondary" block label={t(locale, "language.selfEn")} trailing={<ForwardIcon size={isIOS ? 20 : 19} color="#122C4F" />} onPress={() => choose("en")} accessibilityLabel={t(locale, "language.ctaEn")} />
      </View>
    </SafeAreaView>
  );
}