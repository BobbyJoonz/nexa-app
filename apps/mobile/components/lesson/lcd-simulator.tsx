import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { localize, settings } from "@nexa/product-content";
import { localizedRow, theme } from "@/theme";
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
  const fa = locale === "fa";
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
  // A range-type program (e.g. 02 "10-100 A") is adjusted in steps on the
  // device itself; its defaultValue is the honest current value to show.
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
    if (mode === "home") {
      setMode("browse");
      return;
    }
    if (mode === "browse") {
      setEditIndex(values[program.number] ?? 0);
      setMode("edit");
      return;
    }
    if (mode === "edit") {
      setValues((current) => ({ ...current, [program.number]: editIndex }));
      setMode("browse");
    }
  };
  const esc = () => {
    if (mode === "edit") setMode("browse");
    if (mode === "browse") setMode("home");
  };

  return (
    <View style={styles.wrap}>
      {/* device frame — the teaching simulator uses the same key layout as the unit */}
      <View style={styles.device}>
        <View style={styles.screen}>
          {mode === "home" ? (
            <View style={styles.homeGrid}>
              {HOME_TILES.map(([value, unit]) => (
                <View style={styles.homeTile} key={unit}>
                  <Text style={styles.homeValue}>{value}</Text>
                  <Text style={styles.homeUnit}>{unit}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {mode === "browse" ? (
            <View style={styles.menu}>
              <Text style={styles.programCode}>P{program.number}</Text>
              <Text style={[styles.programLabel, fa ? styles.rtl : null]} numberOfLines={2}>{localize(program.label, locale)}</Text>
              <View style={styles.valueLine}>
                <Text style={[styles.programValue, fa ? styles.rtl : null]} numberOfLines={1}>{currentValue ? localize(currentValue, locale) : "—"}</Text>
              </View>
            </View>
          ) : null}

          {mode === "edit" ? (
            <View style={styles.menu}>
              <Text style={styles.programCode}>SET P{program.number}</Text>
              {hasDiscreteOptions ? (
                <View style={styles.options}>
                  {program.options.map((option, i) => (
                    <View style={[styles.optionLine, i === editIndex && styles.optionActive]} key={`${program.number}-${i}`}>
                      <Text style={[styles.optionText, i === editIndex && styles.optionTextActive, fa ? styles.rtl : null]} numberOfLines={1}>
                        {`${i === editIndex ? (fa ? "❮ " : "▸ ") : ""}${localize(option, locale)}`}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.rangePanel}>
                  <Text style={[styles.rangeText, fa ? styles.rtl : null]} numberOfLines={2}>
                    {program.options[0] ? localize(program.options[0], locale) : "—"}
                  </Text>
                  <Text style={[styles.rangeNote, fa ? styles.rtl : null]}>
                    {fa ? "روی دستگاه با گام تنظیم می‌شود؛ اینجا فقط مرجع است." : "Adjusted in steps on the device; shown here for reference only."}
                  </Text>
                </View>
              )}
            </View>
          ) : null}

          <Text style={styles.modeHint}>
            {mode === "home" ? (fa ? "ESC/▲/▼/ENTER — منو" : "ESC/▲/▼/ENTER — menu")
              : mode === "browse" ? (fa ? "▲▼: جابه‌جایی · ENTER: ویرایش · ESC: خروج" : "▲▼ browse · ENTER edit · ESC back")
              : (fa ? "▲▼: انتخاب · ENTER: ثبت · ESC: انصراف" : "▲▼ choose · ENTER save · ESC cancel")}
          </Text>
        </View>

        <View style={styles.keys}>
          {(["ESC", "▲", "▼", "ENTER"] as const).map((key) => (
            <Pressable
              key={key}
              style={styles.key}
              onPress={key === "ESC" ? esc : key === "▲" ? up : key === "▼" ? down : enter}
              accessibilityRole="button"
              accessibilityLabel={key}
            >
              <Text style={styles.keyText}>{key}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Teaching panel — the manual's own line for the program under the cursor. */}
      <View style={styles.teach}>
        <View style={[styles.teachHead, localizedRow(locale)]}>
          <Text style={styles.teachCode}>
            P{program.number} · {program.basic ? (fa ? "پایه" : "Basic") : (fa ? "پیش‌رفته" : "Advanced")}
          </Text>
          <View style={styles.teachCategoryTag}>
            <Text style={styles.teachCategoryText}>{categoryLabel(program.category, fa)}</Text>
          </View>
        </View>
        <Text style={[styles.teachSummary, fa ? styles.rtl : null]}>{localize(program.summary, locale)}</Text>
      </View>

      <PressableSurface
        onPress={() => {
          setValues(Object.fromEntries(PROGRAMS.map((p) => [p.number, optionIndexOfDefault(p.number)])));
          setMode("home");
        }}
        accessibilityRole="button"
        style={styles.reset}
      >
        <Ionicons name="refresh-outline" size={14} color={theme.colors.brandPrimary} />
        <Text style={styles.resetText}>{fa ? "بازنشانی به پیش‌فرض" : "Reset to defaults"}</Text>
      </PressableSurface>

      <Text style={[styles.note, { writingDirection: fa ? "rtl" : "ltr" }]}>
        {fa
          ? "شبیه‌ساز آموزشی، بدون اتصال به سخت‌افزار — چیدمان منوی همان تنظیمات دستگاه."
          : "Teaching simulator, not connected to hardware — the same device settings menu layout."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12, marginTop: 8 },
  device: { overflow: "hidden", padding: 22, borderRadius: theme.radii.panel, backgroundColor: "#E4E6E8", ...theme.shadow },
  screen: { minHeight: 230, padding: 18, borderWidth: 8, borderColor: "#28323A", borderRadius: 8, backgroundColor: "#B9D6A8" },
  homeGrid: { flexDirection: "row", flexWrap: "wrap", alignContent: "center", gap: 10 },
  homeTile: { width: "47%", alignItems: "center", justifyContent: "center", paddingVertical: 10 },
  homeValue: { color: "#13231D", fontSize: 40, fontWeight: "700" },
  homeUnit: { color: "#13231D", fontSize: 11, fontWeight: "700" },
  menu: { gap: 10 },
  programCode: { color: "#13231D", fontSize: 13, fontWeight: "800", letterSpacing: 1 },
  programLabel: { color: "#13231D", fontSize: 17, fontWeight: "700", minHeight: 44 },
  rtl: { textAlign: "right", writingDirection: "rtl" },
  valueLine: { marginTop: 4, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "rgba(19,35,29,.5)" },
  programValue: { color: "#13231D", fontSize: 15, fontWeight: "600" },
  options: { gap: 4, marginTop: 2 },
  optionLine: { paddingVertical: 5, paddingHorizontal: 8, borderRadius: 4 },
  optionActive: { backgroundColor: "#13231D" },
  optionText: { color: "#13231D", fontSize: 12, fontWeight: "600" },
  optionTextActive: { color: "#B9D6A8" },
  rangePanel: { marginTop: 6, padding: 12, borderWidth: 1, borderColor: "rgba(19,35,29,.28)", borderRadius: 6, backgroundColor: "rgba(19,35,29,.06)" },
  rangeText: { color: "#13231D", fontSize: 15, fontWeight: "700" },
  rangeNote: { marginTop: 6, color: "rgba(19,35,29,.66)", fontSize: 10, lineHeight: 15 },
  modeHint: { marginTop: 10, color: "rgba(19,35,29,.72)", fontSize: 10 },
  keys: { flexDirection: "row", gap: 7, marginTop: 16 },
  key: { flex: 1, minHeight: 42, alignItems: "center", justifyContent: "center", borderRadius: 6, backgroundColor: "#273743" },
  keyText: { color: "white", fontSize: 9, fontWeight: "700" },
  teach: { padding: 14, borderWidth: 1, borderColor: theme.colors.borderSubtle, borderRadius: theme.radii.panel, backgroundColor: theme.colors.raised },
  teachHead: { alignItems: "center", justifyContent: "space-between", gap: 8 },
  teachCode: { color: theme.colors.brandAccent, fontSize: 10, fontWeight: "800", letterSpacing: 0.6 },
  teachCategoryTag: { overflow: "hidden", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, backgroundColor: theme.colors.technical },
  teachCategoryText: { color: theme.colors.brandPrimary, fontSize: 9, fontWeight: "700" },
  teachSummary: { marginTop: 9, color: theme.colors.textPrimary, fontSize: 12, lineHeight: 20 },
  reset: { overflow: "hidden", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, minHeight: 40, borderRadius: theme.radii.pill, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.raised },
  resetText: { color: theme.colors.brandPrimary, fontSize: 11, fontWeight: "700" },
  note: { color: theme.colors.textSecondary, fontSize: 9, textAlign: "center", lineHeight: 15 }
});