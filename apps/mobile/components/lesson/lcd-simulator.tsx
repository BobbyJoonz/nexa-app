import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { localize, settings } from "@nexa/product-content";
import { cn } from "@/src/ui/cn";
import { PressableSurface } from "@/src/ui/pressable-surface";

/**
 * Teaching LCD simulator driven by the REAL documented program table.
 * Mirrors the physical key flow: ESC, UP, DOWN, ENTER — exactly like the
 * device's "Operation and display panel" chapter (manual p.11).
 *
 * Key behaviour is a faithful simulation, NOT app UI, so the four keys stay
 * raw Pressables on purpose (see docs/PLATFORM_UI.md — LCD keys exception).
 *
 * Deliberately session-only: this is a learn-by-doing toy, it never persists
 * to device storage and is never connected to hardware.
 */

type Mode = "home" | "browse" | "edit";

const PROGRAMS = [...settings].sort((a, b) => Number(a.number) - Number(b.number));

const HOME_TILES: Array<[string, string]> = [
  ["230", "VAC"],
  ["24.8", "VDC"],
  ["560", "PV W"],
  ["35", "LOAD %"]
];

const optionIndexOfDefault = (programNumber: string) => {
  const program = settings.find((item) => item.number === programNumber);
  if (!program?.defaultValue) return 0;
  const index = program.options.findIndex(
    (option) => option.en === program.defaultValue?.en || option.fa === program.defaultValue?.fa
  );
  return index >= 0 ? index : 0;
};

const CATEGORY_LABELS: Record<string, [string, string]> = {
  power: ["Power", "توان"],
  battery: ["Battery", "باتری"],
  safety: ["Safety", "ایمنی"],
  display: ["Display", "نمایش"],
  advanced: ["Advanced", "پیش‌رفته"]
};

const categoryLabel = (category: string, fa: boolean) => {
  const pair = CATEGORY_LABELS[category];
  return pair ? (fa ? pair[1] : pair[0]) : category;
};

export function LcdSimulator({ locale }: { locale: "fa" | "en" }) {
  const isFa = locale === "fa";
  const [mode, setMode] = useState<Mode>("home");
  const [index, setIndex] = useState(0);
  const [editIndex, setEditIndex] = useState(0);
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(PROGRAMS.map((program) => [program.number, optionIndexOfDefault(program.number)]))
  );

  const program = PROGRAMS[index];
  if (!program) return null;
  const optionIndex = values[program.number] ?? 0;
  const hasDiscreteOptions = program.options.length > 1;
  const currentValue = hasDiscreteOptions
    ? program.options[optionIndex] ?? program.defaultValue
    : program.defaultValue ?? program.options[0] ?? null;

  const up = () => {
    if (mode === "browse") setIndex((i) => (i + 1) % PROGRAMS.length);
    if (mode === "edit") setEditIndex((i) => (i + 1) % program.options.length);
  };
  const down = () => {
    if (mode === "browse") setIndex((i) => (i - 1 + PROGRAMS.length) % PROGRAMS.length);
    if (mode === "edit") setEditIndex((i) => (i - 1 + program.options.length) % program.options.length);
  };
  const enter = () => {
    if (mode === "home") { setMode("browse"); return; }
    if (mode === "browse") { setEditIndex(values[program.number] ?? 0); setMode("edit"); return; }
    if (mode === "edit") { setValues((current) => ({ ...current, [program.number]: editIndex })); setMode("browse"); }
  };
  const esc = () => {
    if (mode === "edit") setMode("browse");
    if (mode === "browse") setMode("home");
  };

  return (
    <View className="gap-3 mt-2">
      {/* device frame — the teaching simulator uses the same key layout as the unit */}
      <View className="overflow-hidden rounded-panel bg-[#E4E6E8] p-[22px] shadow-card">
        <View className="min-h-[230px] rounded-[8px] border-[8px] border-[#28323A] bg-[#B9D6A8] p-[18px]">
          {mode === "home" ? (
            <View className="flex-row flex-wrap content-center gap-2.5">
              {HOME_TILES.map(([value, unit]) => (
                <View key={unit} className="w-[47%] items-center justify-center py-2.5">
                  <Text className="text-[40px] font-bold text-[#13231D]">{value}</Text>
                  <Text className="text-[11px] font-bold text-[#13231D]">{unit}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {mode === "browse" ? (
            <View className="gap-2.5">
              <Text className="text-[13px] font-bold tracking-[1px] text-[#13231D]">P{program.number}</Text>
              <Text className="min-h-[44px] text-[17px] font-bold text-[#13231D]" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }} numberOfLines={2}>
                {localize(program.label, locale)}
              </Text>
              <View className="mt-1 pt-2 border-t border-[#13231D]/50">
                <Text className="text-[15px] font-semibold text-[#13231D]" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }} numberOfLines={1}>
                  {currentValue ? localize(currentValue, locale) : "—"}
                </Text>
              </View>
            </View>
          ) : null}

          {mode === "edit" ? (
            <View className="gap-2.5">
              <Text className="text-[13px] font-bold tracking-[1px] text-[#13231D]">SET P{program.number}</Text>
              {hasDiscreteOptions ? (
                <View className="gap-1 mt-0.5">
                  {program.options.map((option, i) => (
                    <View key={`${program.number}-${i}`} className={cn("py-[5px] px-2 rounded-[4px]", i === editIndex && "bg-[#13231D]")}>
                      <Text className={cn("text-[12px] font-semibold text-[#13231D]", i === editIndex && "text-[#B9D6A8]")} style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }} numberOfLines={1}>
                        {`${i === editIndex ? (isFa ? "❮ " : "▸ ") : ""}${localize(option, locale)}`}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="mt-1.5 p-3 rounded-[6px] border border-[#13231D]/28 bg-[#13231D]/6">
                  <Text className="text-[15px] font-bold text-[#13231D]" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }} numberOfLines={2}>
                    {program.options[0] ? localize(program.options[0], locale) : "—"}
                  </Text>
                  <Text className="mt-1.5 text-[10px] leading-[15px] text-[#13231D]/66" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
                    {isFa ? "روی دستگاه با گام تنظیم می‌شود؛ اینجا فقط مرجع است." : "Adjusted in steps on the device; shown here for reference only."}
                  </Text>
                </View>
              )}
            </View>
          ) : null}

          <Text className="mt-2.5 text-[10px] text-[#13231D]/72">
            {mode === "home" ? (isFa ? "ESC/▲/▼/ENTER — منو" : "ESC/▲/▼/ENTER — menu")
              : mode === "browse" ? (isFa ? "▲▼: جابه‌جایی · ENTER: ویرایش · ESC: خروج" : "▲▼ browse · ENTER edit · ESC back")
              : (isFa ? "▲▼: انتخاب · ENTER: ثبت · ESC: انصراف" : "▲▼ choose · ENTER save · ESC cancel")}
          </Text>
        </View>

        <View className="flex-row gap-[7px] mt-4">
          {(["ESC", "▲", "▼", "ENTER"] as const).map((key) => (
            <Pressable
              key={key}
              className="flex-1 min-h-[42px] items-center justify-center rounded-[6px] bg-[#273743]"
              onPress={key === "ESC" ? esc : key === "▲" ? up : key === "▼" ? down : enter}
              accessibilityRole="button"
              accessibilityLabel={key}
            >
              <Text className="text-[9px] font-bold text-white">{key}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Teaching panel — the manual's own line for the program under the cursor. */}
      <View className="rounded-panel border border-border bg-card p-3.5">
        <View className={cn("flex-row items-center justify-between gap-2", isFa && "flex-row-reverse")}>
          <Text className="text-[10px] font-bold tracking-[0.6px] text-accent">
            P{program.number} · {program.basic ? (isFa ? "پایه" : "Basic") : (isFa ? "پیش‌رفته" : "Advanced")}
          </Text>
          <View className="overflow-hidden rounded-full bg-secondary px-2 py-[3px]">
            <Text className="text-[9px] font-bold text-primary">{categoryLabel(program.category, isFa)}</Text>
          </View>
        </View>
        <Text className="mt-[9px] text-[12px] leading-5 text-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
          {localize(program.summary, locale)}
        </Text>
      </View>

      <PressableSurface
        onPress={() => {
          setValues(Object.fromEntries(PROGRAMS.map((p) => [p.number, optionIndexOfDefault(p.number)])));
          setMode("home");
        }}
        accessibilityRole="button"
        className="flex-row items-center justify-center gap-[7px] min-h-[40px] rounded-pill border border-border bg-card"
        style={{ borderRadius: 999 }}
      >
        <Text className="text-[11px] font-bold text-primary">{isFa ? "بازنشانی به پیش‌فرض" : "Reset to defaults"}</Text>
      </PressableSurface>

      <Text className="text-[9px] text-center leading-[15px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr" }}>
        {isFa
          ? "شبیه‌ساز آموزشی، بدون اتصال به سخت‌افزار — چیدمان منوی همان تنظیمات دستگاه."
          : "Teaching simulator, not connected to hardware — the same device settings menu layout."}
      </Text>
    </View>
  );
}