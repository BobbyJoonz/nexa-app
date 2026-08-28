import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState, type ReactNode } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import {
  evaluateCharging,
  evaluateLoad,
  evaluatePvCurrent,
  evaluatePvPower,
  evaluatePvVoltage,
  type SizingCheck,
  type SizingStatus
} from "@nexa/shared-logic";
import { deviceLimits, toEngineLimits } from "@nexa/product-content";
import { Screen } from "@/components/screen";
import { useAcademy } from "@/providers/academy-provider";
import { localizedRow, localizedTextStyle, theme } from "@/theme";
import { Button } from "@/src/ui/button/Button";
import { FeedbackRow } from "@/src/ui/feedback";
import { PressableSurface } from "@/src/ui/pressable-surface";

const limits = toEngineLimits(deviceLimits);

const TEMP_PRESETS = [
  { value: -0.26, fa: "پلی‌کریستال", en: "Poly" },
  { value: -0.3, fa: "مونوکریستال", en: "Mono" },
  { value: -0.34, fa: "PERC جدید", en: "Modern PERC" }
] as const;

export default function CalculatorScreen() {
  const { locale } = useAcademy();
  const fa = locale === "fa";

  const [vocStc, setVocStc] = useState("");
  const [seriesCount, setSeriesCount] = useState("");
  const [betaPreset, setBetaPreset] = useState<number | null>(-0.3);
  const [betaCustom, setBetaCustom] = useState("");
  const [lowTemp, setLowTemp] = useState("-10");
  const [parallelStrings, setParallelStrings] = useState("1");
  const [panelIsc, setPanelIsc] = useState("");
  const [panelWatts, setPanelWatts] = useState("");
  const [loadWatts, setLoadWatts] = useState("");
  const [utilityChargeA, setUtilityChargeA] = useState("");
  const [pvChargeA, setPvChargeA] = useState("");

  const report = useMemo(() => {
    const beta = betaCustom.trim().length > 0 ? betaCustom : betaPreset;
    return {
      pvVoltage: evaluatePvVoltage(
        { vocStcV: vocStc, seriesCount, tempCoefficientPctPerC: beta, recordLowC: lowTemp },
        limits
      ),
      pvCurrent: evaluatePvCurrent(parallelStrings, panelIsc, limits),
      pvPower: evaluatePvPower(seriesCount, parallelStrings, panelWatts, limits),
      load: evaluateLoad(loadWatts, limits),
      charging: evaluateCharging({ utilityChargeA, pvChargeA }, limits)
    };
  }, [vocStc, seriesCount, betaPreset, betaCustom, lowTemp, parallelStrings, panelIsc, panelWatts, loadWatts, utilityChargeA, pvChargeA]);

  return (
    <Screen back title={fa ? "ماشین‌حساب سازگاری" : "Sizing compatibility"}>
      <View style={styles.header}>
        <Text style={[styles.title, localizedTextStyle(locale)]}>
          {fa ? "آرایهٔ پنلم به این دستگاه می‌خورد؟" : "Does my array fit this unit?"}
        </Text>
        <Text style={[styles.note, localizedTextStyle(locale)]}>
          {fa
            ? "همهٔ حدود سمت دستگاه از جدول مشخصات تأییدشدهٔ دفترچه می‌آیند (صفحهٔ منبع زیر هر بررسی). مقادیر سمت پنل ورودی‌های خود شماست — از دیتاشیت پنل بخوانید."
            : "Every device-side limit comes from the verified specification table (source page under each check). Panel-side figures are your own inputs — read them from your panel datasheet."}
        </Text>
      </View>

      {/* ---------------- PV array ---------------- */}
      <SectionTitle>{fa ? "۱ · آرایهٔ خورشیدی" : "1 · PV array"}</SectionTitle>
      <Field label={fa ? "ولتاژ مدار باز هر پنل در STC — ولت" : "Panel Voc at STC — volts"} value={vocStc} onChange={setVocStc} placeholder="41.5" />
      <Field label={fa ? "تعداد پنل سری در یک رشته" : "Panels in series per string"} value={seriesCount} onChange={setSeriesCount} placeholder="8" keyboard="numeric" />
      <Field label={fa ? "تعداد رشته‌های موازی" : "Parallel strings"} value={parallelStrings} onChange={setParallelStrings} placeholder="1" keyboard="numeric" />
      <Text style={[styles.fieldLabel, localizedTextStyle(locale)]}>{fa ? "ضریب دمایی Voc پنل — درصد بر سلسیوس" : "Panel Voc temperature coefficient — %/°C"}</Text>
      <View style={[styles.presets, localizedRow(locale)]}>
        {TEMP_PRESETS.map((preset) => (
          <PressableSurface
            key={preset.value}
            onPress={() => {
              setBetaPreset(preset.value);
              setBetaCustom("");
            }}
            accessibilityRole="button"
            style={[styles.presetChip, betaPreset === preset.value && betaCustom.trim().length === 0 && styles.presetChipActive]}
          >
            <Text style={[styles.presetText, betaPreset === preset.value && betaCustom.trim().length === 0 && styles.presetTextActive]}>{`${locale === "fa" ? preset.fa : preset.en} ${preset.value}`}</Text>
          </PressableSurface>
        ))}
      </View>
      <Field label={fa ? "یا مقدار دقیق از دیتاشیت پنل" : "Or exact value from the datasheet"} value={betaCustom} onChange={(text) => setBetaCustom(text.replace(/[^\d.,-]/g, ""))} placeholder="-0.30" />
      <Field label={fa ? "سردترین دمای ثبت‌شدهٔ محل نصب — سلسیوس" : "Record-low site temperature — °C"} value={lowTemp} onChange={setLowTemp} placeholder="-10" />
      <Field label={fa ? "جریان اتصال کوتاه هر پنل Isc — آمپر" : "Panel short-circuit current Isc — amps"} value={panelIsc} onChange={setPanelIsc} placeholder="11" />
      <Field label={fa ? "توان هر پنل — وات" : "Panel wattage — W"} value={panelWatts} onChange={setPanelWatts} placeholder="550" />

      <CheckCard check={report.pvVoltage} title={fa ? "ولتاژ مدار باز آرایه در سردترین هوا" : "Array open-circuit voltage at record cold"}>
        <Text style={[styles.caption, localizedTextStyle(locale)]}>
          {`${fa ? "سقف مجاز دستگاه" : "Device ceiling"}: ${limits.maxPvVocVdc} VDC · ${fa ? "پنجرهٔ MPPT" : "MPPT window"}: ${limits.mpptMinVdc}–${limits.mpptMaxVdc} VDC`}
        </Text>
        {report.pvVoltage.belowDeviceOperatingRange ? (
          <View style={[styles.advisory, localizedRow(locale)]}>
            <Ionicons name="information-circle-outline" size={15} color={theme.colors.caution} />
            <Text style={[styles.advisoryText, localizedTextStyle(locale)]}>
              {fa
                ? `توجه: خود دستگاه تا ${limits.minOperatingTempC}° درجهٔ کاری است؛ دمای پایین‌تر یعنی خارج از رتبه‌بندی سازنده.`
                : `Note: the unit itself is rated down to ${limits.minOperatingTempC}°C; colder sites sit outside the manufacturer rating.`}
            </Text>
          </View>
        ) : null}
      </CheckCard>
      <CheckCard check={report.pvCurrent} title={fa ? "جریان ورودی PV (رشته‌ها × Isc)" : "PV input current (strings × Isc)"} />
      <CheckCard check={report.pvPower} title={fa ? "توان کل آرایه" : "Total array power"} />

      {/* ---------------- Load ---------------- */}
      <SectionTitle>{fa ? "۲ · بار مصرف پیوسته" : "2 · Continuous load"}</SectionTitle>
      <Field label={fa ? "توان بارهای همزمان شما — وات" : "Simultaneous load power — W"} value={loadWatts} onChange={setLoadWatts} placeholder="2500" />
      <CheckCard
        check={report.load}
        title={fa ? "بار پیوسته مقابل توان نامی" : "Continuous load vs rated power"}
      >
        <Text style={[styles.caption, localizedTextStyle(locale)]}>
          {`${fa ? "ظرفیت لحظه‌ای" : "Surge capacity"}: ${limits.surgeFactor}× ${fa ? "برای" : "for"} ${limits.surgeSeconds}s`}
        </Text>
      </CheckCard>

      {/* ---------------- Charging ---------------- */}
      <SectionTitle>{fa ? "۳ · تنظیمات شارژر" : "3 · Charger settings"}</SectionTitle>
      <Field label={fa ? "جریان شارژ برنامهٔ ۱۱ — برق شهر، آمپر" : "Program 11 charge current — utility, A"} value={utilityChargeA} onChange={setUtilityChargeA} placeholder="30" keyboard="numeric" />
      <Field label={fa ? "سهم شارژ خورشیدی مورد انتظار — آمپر" : "Expected solar charging share — A"} value={pvChargeA} onChange={setPvChargeA} placeholder="60" keyboard="numeric" />
      <CheckCard check={report.charging.total} title={fa ? "جمع جریان شارژ" : "Combined charging current"} />
      <CheckCard check={report.charging.utility} title={fa ? "سقف شارژ برق شهر" : "Utility charging ceiling"} />

      {/* ---------------- Battery note ---------------- */}
      <View style={[styles.batteryCard, localizedRow(locale)]}>
        <Ionicons name="battery-charging-outline" size={20} color={theme.colors.energyBattery} />
        <Text style={[styles.batteryText, localizedTextStyle(locale)]}>
          {`${fa ? "سامانهٔ باتری باید" : "Battery system must be"} ${limits.batteryNominalVdc} VDC ${fa ? "باشد." : "."}`}
        </Text>
      </View>

      <SourceFooter />

      <FeedbackRow context={fa ? "ماشین‌حساب سازگاری" : "Sizing calculator"} />

      <Button variant="ghost" block label={fa ? "پاک‌کردن همهٔ ورودی‌ها" : "Clear all inputs"} onPress={() => {
        setVocStc(""); setSeriesCount(""); setBetaPreset(-0.3); setBetaCustom(""); setLowTemp("-10");
        setParallelStrings("1"); setPanelIsc(""); setPanelWatts(""); setLoadWatts(""); setUtilityChargeA(""); setPvChargeA("");
      }} style={{ marginTop: 22 }} trailing={<Ionicons name="refresh-outline" size={16} color={theme.colors.brandPrimary} />} />
    </Screen>
  );
}

/* ------------------------------------------------------------------ */

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboard
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  keyboard?: "numeric";
}) {
  const { locale } = useAcademy();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, localizedTextStyle(locale)]}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.borderSubtle}
        keyboardType={keyboard === "numeric" ? "numeric" : "default"}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

function verdictMeta(status: SizingStatus, fa: boolean): { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap; label: string } {
  switch (status) {
    case "pass":
      return { color: theme.colors.success, bg: "#EEF8F2", icon: "checkmark-circle-outline", label: fa ? "مناسب" : "OK" };
    case "marginal":
      return { color: theme.colors.warning, bg: "#FFF7ED", icon: "alert-circle-outline", label: fa ? "مرزی" : "Marginal" };
    case "fail":
      return { color: theme.colors.danger, bg: "#FFF1F0", icon: "close-circle-outline", label: fa ? "خارج از محدوده" : "Out of range" };
    default:
      return { color: theme.colors.textSecondary, bg: theme.colors.technical, icon: "ellipse-outline", label: fa ? "—" : "—" };
  }
}

function CheckCard({ check, title, children }: { check: SizingCheck; title: string; children?: ReactNode }) {
  const { locale } = useAcademy();
  const meta = verdictMeta(check.status, locale === "fa");
  const ratioText = check.ratio === null ? null : `${Math.round(check.ratio * 100)}%`;
  return (
    <View style={[styles.checkCard, { borderColor: meta.color }]}>
      <View style={[styles.checkHead, localizedRow(locale)]}>
        <Text style={[styles.checkTitle, localizedTextStyle(locale)]}>{title}</Text>
        <View style={[styles.verdict, { backgroundColor: meta.bg }]}>
          <Ionicons name={meta.icon} size={14} color={meta.color} />
          <Text style={[styles.verdictText, { color: meta.color }]}>{meta.label}</Text>
        </View>
      </View>
      {ratioText !== null && check.status !== "skipped" ? (
        <Text style={styles.measure}>{`${locale === "fa" ? "ظرفیت مصرف‌شده" : "Utilization"}: ${ratioText}${check.measured !== null ? ` · ${check.measured}` : ""}${check.limit !== null ? ` / ${check.limit}` : ""}`}</Text>
      ) : null}
      {children}
    </View>
  );
}

function SourceFooter() {
  const { locale } = useAcademy();
  const sources = [
    deviceLimits.maxPvVocVdc.source,
    deviceLimits.mpptRangeVdc.source,
    deviceLimits.maxPvCurrentA.source,
    deviceLimits.maxPvPowerW.source,
    deviceLimits.maxTotalChargeA.source,
    deviceLimits.maxUtilityChargeA.source,
    deviceLimits.ratedPowerKw.source,
    deviceLimits.surgeFactor.source,
    deviceLimits.minOperatingTempC.source,
    deviceLimits.batteryNominalVdc.source
  ];
  const seen = new Set<string>();
  const rows = sources.filter((s) => {
    const key = `${s.fileName}#${s.page}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return (
    <View style={styles.sources}>
      {rows.map((s) => (
        <View style={[styles.sourceRow, localizedRow(locale)]} key={`${s.documentId}-${s.page}`}>
          <Ionicons name="document-text-outline" size={13} color={theme.colors.textSecondary} />
          <Text style={styles.sourceText}>
            {locale === "fa" ? `${s.fileName}، ص ${s.page}${s.section ? ` — ${s.section}` : ""}` : `${s.fileName}, p.${s.page}${s.section ? ` — ${s.section}` : ""}`}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingVertical: 18 },
  title: { color: theme.colors.brandPrimary, fontSize: 26, lineHeight: 38, fontWeight: "800", fontFamily: "Vazirmatn_700Bold" },
  note: { marginTop: 8, color: theme.colors.textSecondary, fontSize: 12, lineHeight: 21 },
  sectionTitle: { marginTop: 26, marginBottom: 4, color: theme.colors.brandAccent, fontSize: 12, fontWeight: "800", letterSpacing: 0.6 },
  fieldWrap: { marginTop: 10 },
  fieldLabel: { marginBottom: 6, color: theme.colors.textSecondary, fontSize: 11 },
  input: { minHeight: 46, paddingHorizontal: 14, borderWidth: 1, borderColor: theme.colors.borderSubtle, borderRadius: theme.radii.control, backgroundColor: theme.colors.raised, color: theme.colors.textPrimary, fontSize: 14 },
  presets: { flexWrap: "wrap", gap: 8, marginTop: 8 },
  presetChip: { overflow: "hidden", minHeight: 36, paddingHorizontal: 12, borderRadius: theme.radii.pill, borderWidth: 1, borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.raised, alignItems: "center", justifyContent: "center" },
  presetChipActive: { borderColor: theme.colors.brandPrimary, backgroundColor: theme.colors.brandPrimary },
  presetText: { color: theme.colors.brandPrimary, fontSize: 11, fontWeight: "700" },
  presetTextActive: { color: "white" },
  checkCard: { marginTop: 14, padding: 14, borderRadius: theme.radii.panel, borderWidth: 1, backgroundColor: theme.colors.raised, ...theme.shadow },
  checkHead: { alignItems: "center", justifyContent: "space-between", gap: 8 },
  checkTitle: { flex: 1, color: theme.colors.brandPrimary, fontSize: 13, fontWeight: "700" },
  verdict: { overflow: "hidden", flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 100 },
  verdictText: { fontSize: 10, fontWeight: "800" },
  measure: { marginTop: 9, color: theme.colors.textSecondary, fontSize: 11 },
  caption: { marginTop: 9, color: theme.colors.textSecondary, fontSize: 10 },
  advisory: { alignItems: "flex-start", gap: 6, marginTop: 10, padding: 10, borderRadius: 8, backgroundColor: "#FFF7ED" },
  advisoryText: { flex: 1, color: theme.colors.caution, fontSize: 10, lineHeight: 17 },
  batteryCard: { alignItems: "center", gap: 10, marginTop: 16, padding: 14, borderRadius: theme.radii.control, borderStyle: "dashed", borderWidth: 1, borderColor: theme.colors.borderSubtle, backgroundColor: "rgba(232,237,242,.65)" },
  batteryText: { flex: 1, color: theme.colors.brandPrimary, fontSize: 12, fontWeight: "700" },
  sources: { marginTop: 24, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.borderSubtle, gap: 7 },
  sourceRow: { alignItems: "center", gap: 7 },
  sourceText: { flex: 1, color: theme.colors.textSecondary, fontSize: 9 }
});
