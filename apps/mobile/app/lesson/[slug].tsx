import { Asset } from "expo-asset";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useMemo, useState } from "react";
import {
  BatteryCharging,
  BookOpen,
  Building2,
  Check,
  CircleHelp,
  House,
  Maximize2,
  Search,
  Share2,
  ShieldCheck,
  Sun,
  X,
  Zap
} from "lucide-react-native";
import {
  anatomy,
  connectionFacts,
  documents,
  faultCodes,
  getProduct,
  localize,
  settings,
  specifications
} from "@nexa/product-content";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import { Screen } from "@/components/screen";
import { LcdSimulator } from "@/components/lesson/lcd-simulator";
import { QuizLesson } from "@/components/lesson/quiz-lesson";
import { TroubleshootingFlow } from "@/components/lesson/troubleshooting-flow";
import { useAcademy } from "@/providers/academy-provider";
import { cn } from "@/src/ui/cn";
import { Button } from "@/src/ui/button/Button";
import { haptics } from "@/src/ui/haptics";
import { IconButton } from "@/src/ui/icon-button";
import { PressableSurface } from "@/src/ui/pressable-surface";

function EnergyFlow({ locale }: { locale: "fa" | "en" }) {
  const isFa = locale === "fa";
  const nodes = [
    { Icon: Sun, label: isFa ? "خورشید" : "Solar", color: "#D99100" },
    { Icon: Building2, label: isFa ? "شبکه" : "Grid", color: "#3974A4" },
    { Icon: BatteryCharging, label: isFa ? "باتری" : "Battery", color: "#617C41" },
    { Icon: House, label: isFa ? "بار" : "Load", color: "#891525" }
  ] as const;
  return (
    <View className="rounded-panel bg-primary-strong p-6">
      <View className="h-[140px] w-[140px] items-center justify-center self-center rounded-full border border-white/25 bg-primary">
        <Text className="text-[24px] font-bold tracking-[3px] text-white">NEXA</Text>
        <Text className="text-[9px] text-white/65">CM3500-24S</Text>
      </View>
      <View className="mt-6 flex-row flex-wrap">
        {nodes.map(({ Icon, label, color }) => (
          <View className="w-1/2 items-center p-2.5" key={label}>
            <View className="h-12 w-12 items-center justify-center rounded-full border border-white/7" style={{ borderColor: color }}>
              <Icon size={22} color={color} />
            </View>
            <Text className="mt-1.5 text-[11px] text-white" style={{ writingDirection: isFa ? "rtl" : "ltr" }}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function SettingsList({ locale }: { locale: "fa" | "en" }) {
  const isFa = locale === "fa";
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => settings.filter((item) => `${item.number} ${item.label.en} ${item.label.fa}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <View>
      <View className={cn("min-h-12 flex-row items-center gap-[9px] rounded-control border border-border bg-card px-3.5", isFa && "flex-row-reverse")}>
        <Search size={18} color="#5C6878" />
        <TextInput
          className="flex-1 text-[12px] text-foreground"
          style={{ writingDirection: isFa ? "rtl" : "ltr" }}
          value={query}
          onChangeText={setQuery}
          placeholder={isFa ? "جست‌وجوی ۳۱ برنامه" : "Search 31 programs"}
          placeholderTextColor="#CCD5DE"
        />
      </View>
      {filtered.map((item) => (
        <View className={cn("flex-row items-start gap-3 border-b border-border py-3.5", isFa && "flex-row-reverse")} key={item.number}>
          <Text className="w-[42px] border border-primary pt-[11px] pb-[10px] text-center text-[11px] font-bold text-primary" style={{ borderRadius: 21 }}>{item.number}</Text>
          <View className="flex-1">
            <Text className="text-[13px] font-bold text-primary" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>{localize(item.label, locale)}</Text>
            <Text className="mt-[3px] text-[10px] leading-[17px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>{localize(item.summary, locale)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function FaultList({ locale }: { locale: "fa" | "en" }) {
  const isFa = locale === "fa";
  const [query, setQuery] = useState("");
  const filtered = faultCodes.filter((item) => `${item.code} ${item.title.en} ${item.title.fa}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <View>
      <View className={cn("min-h-12 flex-row items-center gap-[9px] rounded-control border border-border bg-card px-3.5", isFa && "flex-row-reverse")}>
        <Search size={18} color="#5C6878" />
        <TextInput
          className="flex-1 text-[12px] text-foreground"
          style={{ writingDirection: isFa ? "rtl" : "ltr" }}
          value={query}
          onChangeText={setQuery}
          placeholder={isFa ? "کد یا عنوان خطا" : "Fault code or title"}
          placeholderTextColor="#CCD5DE"
        />
      </View>
      <View className="flex-row flex-wrap gap-2.5">
        {filtered.map((item) => (
          <View className="w-[48.5%] min-h-[155px] border-l-[3px] border-l-accent bg-card p-3.5 shadow-card" key={item.code}>
            <Text className="text-[22px] font-bold text-accent">{item.code}</Text>
            <Text className="mt-3.5 text-[11px] font-bold text-primary" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>{localize(item.title, locale)}</Text>
            <Text className="mt-[5px] text-[8px] leading-[13px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>{isFa ? "توقف و ارجاع به سرویس مجاز" : "Stop and escalate to authorized service"}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Specs({ locale }: { locale: "fa" | "en" }) {
  const isFa = locale === "fa";
  return (
    <View>
      {specifications.map((item) => (
        <View className={cn("min-h-[52px] flex-row items-center justify-between gap-3 border-b border-border", isFa && "flex-row-reverse")} key={item.id}>
          <Text className="flex-1 text-[11px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>{localize(item.label, locale)}</Text>
          <Text className="text-[11px] font-bold text-primary">{item.value} {item.unit}</Text>
        </View>
      ))}
    </View>
  );
}

function Manuals({ locale }: { locale: "fa" | "en" }) {
  const isFa = locale === "fa";
  const manualAssets = [
    { document: documents.persianQuickStart, module: require("../../assets/documents/CM3500-24S Persian Quick Start.pdf") },
    { document: documents.persianManual, module: require("../../assets/documents/CM3500-24S Persian User Manual.pdf") },
    { document: documents.nexaEnglish, module: require("../../assets/documents/manual-sunverteracm35kw(2).pdf") },
    { document: documents.astarEnglish, module: require("../../assets/documents/manual-sunverteracm35kw(3).pdf") }
  ];
  const openManual = async (module: number) => {
    const asset = Asset.fromModule(module);
    await asset.downloadAsync();
    if (asset.localUri && await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(asset.localUri, { mimeType: "application/pdf", UTI: "com.adobe.pdf" });
    }
  };
  return (
    <View className="gap-[9px]">
      {manualAssets.map(({ document, module }) => (
        <PressableSurface
          key={document.id}
          onPress={() => void openManual(module)}
          accessibilityRole="button"
          accessibilityLabel={document.title}
          className={cn("min-h-[72px] flex-row items-center gap-[11px] overflow-hidden rounded-control border border-border bg-card p-3", isFa && "flex-row-reverse")}
        >
          <View className="h-[42px] w-[42px] items-center justify-center rounded-[10px] bg-[#F9EAEC]">
            <BookOpen size={20} color="#891525" />
          </View>
          <View className="flex-1">
            <Text className="text-[13px] font-bold text-primary" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>{document.title}</Text>
            <Text className="mt-[3px] text-[10px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
              {document.language.toUpperCase()} · {isFa ? "بازکردن / اشتراک‌گذاری" : "Open / share"}
            </Text>
          </View>
          <Share2 size={18} color="#5C6878" />
        </PressableSurface>
      ))}
    </View>
  );
}

function AnatomyList({ locale }: { locale: "fa" | "en" }) {
  const isFa = locale === "fa";
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = anatomy.find((item) => item.id === activeId);
  return (
    <>
      <View className="flex-row flex-wrap gap-2.5">
        {anatomy.map((item, index) => (
          <PressableSurface
            key={item.id}
            onPress={() => setActiveId(item.id)}
            accessibilityRole="button"
            accessibilityLabel={localize(item.label, locale)}
            className="w-[48.5%] min-h-[115px] justify-between border-t-2 border-t-primary bg-card p-3.5"
          >
            <Text className="text-[10px] font-bold text-accent">{String(index + 1).padStart(2, "0")}</Text>
            <Text className="text-[13px] font-bold text-primary" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>{localize(item.label, locale)}</Text>
            <Maximize2 size={16} color="#5C6878" />
          </PressableSurface>
        ))}
      </View>
      <Modal visible={Boolean(active)} transparent animationType="slide" onRequestClose={() => setActiveId(null)}>
        <Pressable className="flex-1 justify-end bg-primary-strong/58" onPress={() => setActiveId(null)}>
          <Pressable className="min-h-[330px] rounded-t-[24px] bg-background p-[22px] pb-[38px]" onPress={(event) => event.stopPropagation()}>
            <View className="mb-5 h-1 w-[46px] self-center rounded bg-border" />
            <View className={cn("flex-row items-center justify-between gap-3", isFa && "flex-row-reverse")}>
              <Text className="flex-1 text-[23px] font-bold text-primary" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
                {active ? localize(active.label, locale) : ""}
              </Text>
              <IconButton tone="technical" accessibilityLabel="Close" onPress={() => setActiveId(null)}>
                <X size={20} color="#122C4F" />
              </IconButton>
            </View>
            <Text className="mt-[22px] text-[13px] leading-[23px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
              {isFa
                ? "این بخش از نمای محصول در دفترچه شناسایی شده است. پیش از لمس هر ترمینال، همه منابع باید توسط نصاب متخصص ایزوله شوند."
                : "This part is identified from the manual product view. A qualified installer must isolate every source before any terminal is touched."}
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function ConnectionFacts({ locale }: { locale: "fa" | "en" }) {
  const isFa = locale === "fa";
  return (
    <View>
      {connectionFacts.map((item) => (
        <View className={cn("min-h-[52px] flex-row items-center justify-between gap-3 border-b border-border", isFa && "flex-row-reverse")} key={item.id}>
          <Text className="flex-1 text-[11px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>{localize(item.label, locale)}</Text>
          <Text className="text-[11px] font-bold text-primary">{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

function GenericLesson({ slug, locale }: { slug: string; locale: "fa" | "en" }) {
  const isFa = locale === "fa";
  const copy: Record<string, { fa: string[]; en: string[] }> = {
    safety: { fa: ["همه منابع انرژی را پیش از اتصال ایزوله کنید.", "محفظه را باز نکنید.", "سیم‌کشی ثابت فقط توسط نصاب متخصص انجام شود.", "دستگاه را روی سطح غیرقابل‌اشتعال نصب کنید."], en: ["Isolate every source before connecting.", "Do not open the enclosure.", "Fixed wiring is for qualified installers only.", "Mount on a non-combustible surface."] },
    installation: { fa: ["بسته‌بندی و بدنه را بررسی کنید.", "سطح عمودی و محکم انتخاب کنید.", "فضای تهویه را باز نگه دارید.", "مسیر کابل‌ها را پیش از نصب کنترل کنید."], en: ["Inspect packaging and enclosure.", "Choose a solid vertical surface.", "Keep ventilation clearance open.", "Check cable routes before mounting."] },
    "power-on": { fa: ["زمین حفاظتی تأیید شده باشد.", "قطبیت باتری کنترل شده باشد.", "Voc پنل در محدوده مجاز باشد.", "ورودی و خروجی AC جابه‌جا نشده باشند."], en: ["Verify protective earth.", "Confirm battery polarity.", "Keep array Voc within limits.", "Do not reverse AC input and output."] },
    modes: { fa: ["Utility first", "Solar first", "SBU priority", "SUB priority", "SUF priority"], en: ["Utility first", "Solar first", "SBU priority", "SUB priority", "SUF priority"] },
    battery: { fa: ["سامانه باتری: ۲۴ ولت DC", "حداکثر جریان کل شارژ: ۱۰۰ آمپر", "حداکثر شارژ AC: ۶۰ آمپر", "متعادل‌سازی فقط با دستور سازنده باتری"], en: ["Battery system: 24 VDC", "Maximum total charge: 100 A", "Maximum AC charge: 60 A", "Equalize only per battery manufacturer"] },
    quiz: { fa: ["پاسخ ایمن: پیش از بررسی هر اتصال، همه منابع باید توسط فرد واجد صلاحیت ایزوله شوند."], en: ["Safe answer: every source must be isolated by a qualified person before a connection is checked."] }
  };
  const items = copy[slug]?.[locale] ?? [];
  return (
    <View className="border-t border-border">
      {items.map((item, index) => (
        <View className={cn("min-h-[74px] flex-row items-center gap-3 border-b border-border", isFa && "flex-row-reverse")} key={item}>
          <View className="h-9 w-9 items-center justify-center rounded-full border border-border">
            <Text className="text-[9px] font-bold text-accent">{String(index + 1).padStart(2, "0")}</Text>
          </View>
          <Text className="flex-1 text-[12px] leading-[21px] text-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function LessonContent({ slug, locale }: { slug: string; locale: "fa" | "en" }) {
  switch (slug) {
    case "overview": return <EnergyFlow locale={locale} />;
    case "anatomy": return <AnatomyList locale={locale} />;
    case "connections": return <ConnectionFacts locale={locale} />;
    case "lcd": return <LcdSimulator locale={locale} />;
    case "quiz": return <QuizLesson locale={locale} />;
    case "settings": return <SettingsList locale={locale} />;
    case "faults": return <FaultList locale={locale} />;
    case "troubleshooting": return <TroubleshootingFlow locale={locale} />;
    case "specifications": return <Specs locale={locale} />;
    case "manuals": return <Manuals locale={locale} />;
    default: return <GenericLesson slug={slug} locale={locale} />;
  }
}

export default function LessonScreen() {
  const { slug, model = "cm3500-24s" } = useLocalSearchParams<{ slug: string; model?: string }>();
  const product = getProduct(model);
  const { locale, completed, toggleLesson } = useAcademy();
  const isFa = locale === "fa";
  const lesson = product?.lessons.find((item) => item.slug === slug);
  if (!product || !lesson) {
    return (
      <Screen back title={isFa ? "درس" : "Lesson"}>
        <View className="items-center gap-3 mt-12 p-6">
          <CircleHelp size={26} color="#B54708" />
          <Text className="text-[13px] leading-[22px] text-center text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr" }}>
            {isFa ? "این درس پیدا نشد — از فهرست آکادمی انتخاب کنید." : "This lesson was not found — choose it from the academy list."}
          </Text>
        </View>
      </Screen>
    );
  }
  const done = completed.includes(lesson.id);
  return (
    <Screen title={localize(lesson.title, locale)} back>
      <View className="py-[22px]">
        <Text className="text-[9px] font-bold tracking-[1.3px] text-accent">
          {String(product.lessons.findIndex((item) => item.id === lesson.id) + 1).padStart(2, "0")} / {product.lessons.length}
        </Text>
        <Text className="mt-[9px] text-[34px] leading-[46px] font-bold text-primary" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
          {localize(lesson.title, locale)}
        </Text>
        <Text className="mt-[7px] text-[13px] leading-[22px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
          {localize(lesson.summary, locale)}
        </Text>
        {lesson.safetyCritical ? (
          <View className={cn("mt-3.5 self-start flex-row items-center gap-[5px] rounded-full bg-[#FFF7ED] px-[9px] py-[5px]", isFa && "flex-row-reverse")}>
            <ShieldCheck size={15} color="#B54708" />
            <Text className="text-[10px] font-bold text-warning">{isFa ? "ایمنی‌حیاتی" : "Safety critical"}</Text>
          </View>
        ) : null}
      </View>
      <LessonContent slug={slug} locale={locale} />
      <Button
        variant={done ? "secondary" : "filled"}
        block
        label={done ? (isFa ? "مرور شد" : "Understood") : (isFa ? "به‌عنوان مرورشده ثبت کن" : "Mark as understood")}
        contentColor={done ? "#2F6F55" : undefined}
        trailing={done ? <Check size={18} color="#2F6F55" /> : undefined}
        onPress={() => {
          haptics.success();
          void toggleLesson(lesson.id);
        }}
        style={[{ marginTop: 28 }, done && { borderWidth: 1, borderColor: "#2F6F55" }]}
      />
    </Screen>
  );
}