import { useMemo, useState } from "react";
import { router } from "expo-router";
import { ChevronLeft, ChevronRight, CircleX, Search } from "lucide-react-native";
import { Text, TextInput, View } from "react-native";
import { faultCodes, localize, productModels, settings } from "@nexa/product-content";
import { Screen } from "@/components/screen";
import { useAcademy } from "@/providers/academy-provider";
import { cn } from "@/src/ui/cn";
import { dirIcon } from "@/src/ui/direction";
import { PressableSurface } from "@/src/ui/pressable-surface";

/**
 * Global field reference: one bar searches settings programs, fault codes
 * and lesson titles across the verified model; fault codes also render as a
 * tap-to-expand quick grid for on-site lookup without typing.
 */

type Result =
  | { kind: "lesson"; id: string; title: string; extra: string; slug: string }
  | { kind: "program"; id: string; title: string; extra: string; number: string }
  | { kind: "fault"; id: string; title: string; extra: string; code: string };

/**
 * Field users type "۰۱", "١" or "1" for a stored "01" code. Normalize all
 * digit variants to Latin and ignore leading zeros so every spelling lands.
 */
function normalizeKey(value: string): string {
  const latin = value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  return latin.replace(/^0+(?=\d)/, "").toLowerCase();
}

export default function SearchScreen() {
  const { locale } = useAcademy();
  const isFa = locale === "fa";
  const [query, setQuery] = useState("");
  const [expandedFault, setExpandedFault] = useState<string | null>(null);
  const product = productModels.find((model) => model.modelName.verificationStatus === "verified");
  const lessons = product?.lessons ?? [];

  const ChevronIcon = dirIcon(locale, ChevronRight, ChevronLeft);

  const results = useMemo<Result[]>(() => {
    const raw = query.trim();
    if (!raw || !product) return [];
    const key = normalizeKey(raw);
    const text = raw.toLowerCase();
    const found: Result[] = [];
    for (const lesson of lessons) {
      const title = localize(lesson.title, locale);
      const summary = localize(lesson.summary, locale);
      if (title.toLowerCase().includes(text) || summary.toLowerCase().includes(text)) {
        found.push({ kind: "lesson", id: `lesson-${lesson.id}`, title, extra: isFa ? "درس" : "Lesson", slug: lesson.slug });
      }
    }
    for (const program of settings) {
      const label = localize(program.label, locale);
      const summary = localize(program.summary, locale);
      if (normalizeKey(program.number) === key || label.toLowerCase().includes(text) || summary.toLowerCase().includes(text)) {
        found.push({ kind: "program", id: `program-${program.number}`, title: label, extra: `P${program.number}`, number: program.number });
      }
    }
    for (const fault of faultCodes) {
      const title = localize(fault.title, locale);
      if (normalizeKey(fault.code) === key || title.toLowerCase().includes(text)) {
        found.push({ kind: "fault", id: `fault-${fault.code}`, title, extra: fault.code, code: fault.code });
      }
    }
    return found;
  }, [locale, product, lessons, query]);

  const open = (result: Result) => {
    const model = product?.slug ?? "cm3500-24s";
    if (result.kind === "lesson") router.push(`/lesson/${result.slug}?model=${model}`);
    if (result.kind === "program") router.push(`/lesson/settings?model=${model}`);
    if (result.kind === "fault") router.push(`/lesson/faults?model=${model}`);
  };

  return (
    <Screen back title={isFa ? "جست‌وجوی همهٔ بخش‌ها" : "Global search"}>
      <View className="mt-1.5 min-h-[50px] flex-row items-center gap-[9px] rounded-control border border-border bg-card px-3.5">
        <Search size={18} color="#5C6878" />
        <TextInput
          className="flex-1 text-[13px] text-foreground"
          style={{ writingDirection: isFa ? "rtl" : "ltr" }}
          value={query}
          onChangeText={setQuery}
          placeholder={isFa ? "کد خطا، شماره برنامه یا عنوان…" : "Fault code, program number or title…"}
          placeholderTextColor="#CCD5DE"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 ? (
          <PressableSurface onPress={() => setQuery("")} accessibilityRole="button" accessibilityLabel="Clear" className="rounded-full p-[3px]" style={{ borderRadius: 999 }}>
            <CircleX size={17} color="#5C6878" />
          </PressableSurface>
        ) : null}
      </View>

      <Text className="mt-[22px] mb-2 text-[11px] font-bold text-accent" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
        {isFa ? "مرجع سریع کد خطا" : "Fault code quick reference"}
      </Text>
      <View className={cn("flex-row flex-wrap gap-2", isFa && "flex-row-reverse")}>
        {faultCodes.map((fault) => {
          const expanded = expandedFault === fault.code;
          return (
            <View key={fault.code} className="max-w-full">
              <PressableSurface
                onPress={() => setExpandedFault(expanded ? null : fault.code)}
                accessibilityRole="button"
                accessibilityLabel={fault.code}
                className={cn(
                  "min-w-[52px] min-h-[38px] items-center justify-center rounded-full border border-border bg-card px-2.5",
                  expanded && "border-primary bg-primary"
                )}
                style={{ borderRadius: 999 }}
              >
                <Text className={cn("text-[11px] font-bold text-primary", expanded && "text-white")}>{fault.code}</Text>
              </PressableSurface>
              {expanded ? (
                <View className="mt-1.5 min-w-full rounded-control border border-border bg-card p-3">
                  <Text className="text-[12px] font-bold text-primary" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
                    {localize(fault.title, locale)}
                  </Text>
                  <Text className="mt-[5px] text-[10px] leading-[17px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
                    {localize(fault.safeCheck, locale)}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {query.trim().length > 0 ? (
        <View className="mt-[22px]">
          <Text className="mb-2 text-[11px] font-bold text-accent" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
            {isFa ? `نتایج (${results.length})` : `Results (${results.length})`}
          </Text>
          {results.length === 0 ? (
            <Text className="mt-2 text-[12px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
              {isFa ? "چیزی پیدا نشد — املای فارسی یا شماره را چک کنید." : "Nothing found — check Persian spelling or the number."}
            </Text>
          ) : results.map((result) => (
            <PressableSurface
              key={result.id}
              onPress={() => open(result)}
              accessibilityRole="button"
              className="mt-2 min-h-[50px] flex-row items-center gap-2.5 rounded-control border border-border bg-card px-3"
              style={{ borderRadius: 12 }}
            >
              <View className="min-w-[44px] flex-row items-center justify-center rounded-[6px] bg-secondary px-1.5 py-1">
                <Text className="text-[9px] font-bold text-primary">{result.extra}</Text>
              </View>
              <Text className="flex-1 text-[12px] font-semibold text-foreground" numberOfLines={1} style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
                {result.title}
              </Text>
              <ChevronIcon size={16} color="#CCD5DE" />
            </PressableSurface>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}