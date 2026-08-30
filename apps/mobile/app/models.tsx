import { Image } from "expo-image";
import { router } from "expo-router";
import { ArrowLeft, ArrowRight, Calculator, ChevronLeft, ChevronRight, ListChecks, Search, ShieldCheck } from "lucide-react-native";
import { Text, View } from "react-native";
import { productModels } from "@nexa/product-content";
import { MobileBrand, Screen } from "@/components/screen";
import { useAcademy } from "@/providers/academy-provider";
import { Button } from "@/src/ui/button/Button";
import { cn } from "@/src/ui/cn";
import { dirIcon } from "@/src/ui/direction";
import { PressableSurface } from "@/src/ui/pressable-surface";

export default function ModelsScreen() {
  const { locale } = useAcademy();
  const isFa = locale === "fa";
  const verified = productModels[0];
  if (!verified) return null;

  const ExploreIcon = dirIcon(locale, ArrowRight, ArrowLeft);
  const ChevronIcon = dirIcon(locale, ChevronRight, ChevronLeft);

  return (
    <Screen>
      <View className="items-start pt-5 mb-[46px]">
        <MobileBrand />
      </View>
      <Text className="text-[10px] font-bold tracking-[1.3px] text-accent" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
        MODEL / 02
      </Text>
      <Text className="mt-1.5 text-[38px] leading-[50px] text-primary font-bold" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
        {isFa ? "سانورتر خود را انتخاب کنید" : "Choose your Sunverter"}
      </Text>
      <Text className="mt-1.5 mb-[26px] text-[13px] leading-[23px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
        {isFa ? "فقط مدل‌های تأییدشده قابل انتخاب هستند." : "Only verified models are selectable."}
      </Text>

      <PressableSurface
        onPress={() => router.push(`/academy/${verified.slug}`)}
        accessibilityRole="button"
        accessibilityLabel={verified.modelName.value ?? undefined}
        className="overflow-hidden rounded-panel border border-border bg-card shadow-card"
      >
        <View className="h-[360px] items-center justify-end bg-secondary">
          <Image source={require("../assets/nexa-product-mobile.webp")} className="w-[75%] h-[94%]" contentFit="contain" />
          <View className="absolute left-4 top-4 flex-row items-center gap-[5px] rounded-full bg-[#EEF8F2] px-[9px] py-[5px]">
            <ShieldCheck size={14} color="#2F6F55" />
            <Text className="text-[10px] font-bold text-success">{isFa ? "تأییدشده" : "Verified"}</Text>
          </View>
        </View>
        <View className="p-[22px]">
          <Text className="text-[8px] font-bold tracking-[1.2px] text-muted-foreground">NEXA HYBRID SOLAR INVERTER</Text>
          <Text className="mt-2 text-[29px] font-bold text-primary" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
            {verified.modelName.value}
          </Text>
          <View className={cn("mt-2.5 flex-row gap-3", isFa && "flex-row-reverse")}>
            <Text className="text-[12px] text-muted-foreground"><Text className="text-[17px] font-bold text-primary">{verified.ratedPowerKw.value}</Text> kW</Text>
            <Text className="text-[12px] text-muted-foreground"><Text className="text-[17px] font-bold text-primary">{verified.batteryVoltageVdc.value}</Text> VDC</Text>
          </View>
          <Button
            variant="filled"
            block
            label={isFa ? "مشاهده این مدل" : "Explore this model"}
            trailing={<ExploreIcon size={18} color="#FFFFFF" />}
            onPress={() => router.push(`/academy/${verified.slug}`)}
            style={{ marginTop: 22 }}
          />
        </View>
      </PressableSurface>

      <Button
        variant="ghost"
        block
        label={isFa ? "ماشین‌حساب سازگاری دستگاه" : "Device sizing calculator"}
        leading={<Calculator size={17} color="#122C4F" />}
        trailing={<ChevronIcon size={16} color="#CCD5DE" />}
        onPress={() => router.push("/calculator")}
        style={{ marginTop: 12 }}
      />
      <Button
        variant="ghost"
        block
        label={isFa ? "جست‌وجو و مرجع کد خطا" : "Search & fault reference"}
        leading={<Search size={17} color="#122C4F" />}
        trailing={<ChevronIcon size={16} color="#CCD5DE" />}
        onPress={() => router.push("/search")}
        style={{ marginTop: 8 }}
      />
      <Button
        variant="ghost"
        block
        label={isFa ? "چک‌لیست راه‌اندازی" : "Commissioning checklist"}
        leading={<ListChecks size={17} color="#122C4F" />}
        trailing={<ChevronIcon size={16} color="#CCD5DE" />}
        onPress={() => router.push("/checklist")}
        style={{ marginTop: 8 }}
      />
    </Screen>
  );
}