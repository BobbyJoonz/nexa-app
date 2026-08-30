import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, ChevronRight, CircleCheck, CircleAlert, Scan, ShieldCheck, Wrench, Zap, Power, Calculator, SlidersHorizontal, ArrowLeftRight, BatteryCharging, TriangleAlert, Hammer, List, BookOpen, Network } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { completionPercent } from "@nexa/shared-logic";
import { getProduct, localize } from "@nexa/product-content";
import { Screen } from "@/components/screen";
import { useAcademy } from "@/providers/academy-provider";
import { cn } from "@/src/ui/cn";
import { dirIcon } from "@/src/ui/direction";

const lessonIcons: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  overview: Network,
  anatomy: Scan,
  safety: ShieldCheck,
  installation: Wrench,
  connections: Zap,
  "power-on": Power,
  lcd: Calculator,
  settings: SlidersHorizontal,
  modes: ArrowLeftRight,
  battery: BatteryCharging,
  faults: TriangleAlert,
  troubleshooting: Hammer,
  specifications: List,
  manuals: BookOpen,
  quiz: CircleCheck
};

export default function AcademyScreen() {
  const { model } = useLocalSearchParams<{ model: string }>();
  const product = getProduct(model);
  const { locale, completed } = useAcademy();
  const isFa = locale === "fa";
  const ChevronIcon = dirIcon(locale, ChevronRight, ChevronLeft);

  if (!product || product.modelName.verificationStatus !== "verified") {
    return (
      <Screen back>
        <View className="items-center gap-2 pt-24 px-7">
          <CircleAlert size={34} color="#5C6878" />
          <Text className="text-[17px] font-bold text-primary" style={{ fontFamily: "Vazirmatn_700Bold", writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
            {isFa ? "این مدل پیدا نشد" : "Model not found"}
          </Text>
          <Text className="text-[12px] leading-5 text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
            {isFa ? "از فهرست مدل‌ها انتخاب کنید." : "Choose from the model list."}
          </Text>
        </View>
      </Screen>
    );
  }
  const percent = completionPercent(completed, product.lessons.length);

  return (
    <Screen title={`${product.brand} ${product.modelName.value}`} back>
      <View className="rounded-panel bg-primary-strong">
        <View className="flex-row">
          <View className="flex-1 pt-5 pl-4 pr-4">
            <Text className="text-[9px] font-bold tracking-[1.5px] text-white/58">PRODUCT ACADEMY</Text>
            <Text className="mt-1 text-[22px] font-bold leading-7 text-white" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
              {isFa ? "سانورترت را بشناس." : "Know your Sunverter."}
            </Text>
            <Text className="mt-1 text-[11px] leading-[17px] text-white/65" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
              {isFa ? "۱۵ درس مستند، از مسیر انرژی تا خطاها." : "15 sourced lessons, from energy flow to faults."}
            </Text>
          </View>
          <Image source={require("../../assets/nexa-product-mobile.webp")} className="w-[45%] h-[180px]" contentFit="contain" />
        </View>
        <View className={cn("flex-row items-center justify-between px-4 pb-1", isFa && "flex-row-reverse")}>
          <Text className="text-[11px] text-white/65" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
            {isFa ? "پیشرفت یادگیری" : "Learning progress"}
          </Text>
          <Text className="text-[13px] font-bold text-white">{percent}%</Text>
        </View>
        <View className="mx-4 mb-4 h-[5px] overflow-hidden rounded-full bg-white/20">
          <View className="h-full rounded-full bg-success" style={{ width: `${percent}%` }} />
        </View>
      </View>

      <View className={cn("mt-4 flex-row", isFa && "flex-row-reverse")}>
        <Pressable
          className="flex-1 items-center py-3 rounded-control bg-secondary mr-1"
          onPress={() => router.push(`/lesson/anatomy?model=${product.slug}`)}
        >
          <Scan size={21} color="#122C4F" />
          <Text className="mt-1 text-[11px] text-primary" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
            {isFa ? "آناتومی" : "Anatomy"}
          </Text>
        </Pressable>
        <Pressable
          className="flex-1 items-center py-3 rounded-control bg-secondary mx-1"
          onPress={() => router.push(`/lesson/troubleshooting?model=${product.slug}`)}
        >
          <Hammer size={21} color="#122C4F" />
          <Text className="mt-1 text-[11px] text-primary" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
            {isFa ? "رفع خطا" : "Troubleshoot"}
          </Text>
        </Pressable>
        <Pressable
          className="flex-1 items-center py-3 rounded-control bg-secondary ml-1"
          onPress={() => router.push(`/lesson/quiz?model=${product.slug}`)}
        >
          <CircleCheck size={21} color="#122C4F" />
          <Text className="mt-1 text-[11px] text-primary" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
            {isFa ? "مرور" : "Review"}
          </Text>
        </Pressable>
      </View>

      <View className="mt-6">
        {product.lessons.map((item, index) => {
          const done = completed.includes(item.id);
          const LessonIcon = lessonIcons[item.slug] ?? BookOpen;
          return (
            <Pressable
              key={item.id}
              onPress={() => router.push(`/lesson/${item.slug}?model=${product.slug}`)}
              className={cn(
                "flex-row items-center gap-3 py-3.5 border-b border-border",
                isFa && "flex-row-reverse"
              )}
            >
              <View className={cn("h-[42px] w-[42px] items-center justify-center rounded-[12px]", done ? "bg-success" : "bg-secondary")}>
                <LessonIcon size={20} color={done ? "#FFFFFF" : "#122C4F"} />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-primary" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
                  {localize(item.title, locale)}
                </Text>
                <Text className="mt-0.5 text-[10px] leading-4 text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
                  {localize(item.summary, locale)}
                </Text>
              </View>
              {item.safetyCritical ? <View className="h-[7px] w-[7px] rounded-full bg-warning" /> : null}
              <Text className="text-[9px] font-bold text-[#9BA6B2]">{String(index + 1).padStart(2, "0")}</Text>
              <ChevronIcon size={16} color="#CCD5DE" />
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}