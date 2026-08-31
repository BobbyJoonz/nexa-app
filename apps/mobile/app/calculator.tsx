import { useMemo, useState, type ReactNode } from "react";
import { BatteryCharging, CircleAlert, RefreshCw } from "lucide-react-native";
import { Text, TextInput, View } from "react-native";
import { evaluateCharging, evaluateLoad, evaluatePvCurrent, evaluatePvPower, evaluatePvVoltage, type SizingCheck, type SizingStatus } from "@nexa/shared-logic";
import { deviceLimits, toEngineLimits } from "@nexa/product-content";
import { Screen } from "@/components/screen";
import { useAcademy } from "@/providers/academy-provider";
import { cn } from "@/src/ui/cn";
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
  const isFa = locale === "fa";

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
      pvVoltage: evaluatePvVoltage({ vocStcV: vocStc, seriesCount, tempCoefficientPctPerC: beta, recordLowC: lowTemp }, limits),
      pvCurrent: evaluatePvCurrent(parallelStrings, panelIsc, limits),
      pvPower: evaluatePvPower(seriesCount, parallelStrings, panelWatts, limits),
      load: evaluateLoad(loadWatts, limits),
      charging: evaluateCharging({ utilityChargeA, pvChargeA }, limits)
    };
  }, [vocStc, seriesCount, betaPreset, betaCustom, lowTemp, parallelStrings, panelIsc, panelWatts, loadWatts, utilityChargeA, pvChargeA]);

  return (
    <Screen back title={isFa ? "ماشین‌حساب سازگاری" : "Sizing compatibility"}>
      <View className="py-4">
        <Text className="text-[15px] font-bold text-primary" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
          {isFa ? "آرایهٔ پنلم به این دستگاه می‌خورد؟" : "Does my array fit this unit?"}
        </Text>
        <Text className="mt-1 text-[11px] leading-[17px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
          {isFa
            ? "همهٔ حدود سمت دستگاه از جدول مشخصات تأییدشده است؛ مقادیر سمت پنل، ورودی‌های خود شماست — از دیتاشیت پنل بخوانید."
            : "Every device-side limit comes from the verified specification table. Panel-side figures are your own inputs — read them from your panel datasheet."}
        </Text>
      </View>

      {/* PV array */}
      <SectionTitle>{isFa ? "۱ · آرایهٔ خورشیدی" : "1 · PV array"}</SectionTitle>
      <Field label={isFa ? "ولتاژ مدار باز هر پنل در STC — ولت" : "Panel Voc at STC — volts"} value={vocStc} onChange={setVocStc} placeholder="41.5" />
      <Field label={isFa ? "تعداد پنل سری در یک رشته" : "Panels in series per string"} value={seriesCount} onChange={setSeriesCount} placeholder="8" keyboard="numeric" />
      <Field label={isFa ? "تعداد رشته‌های موازی" : "Parallel strings"} value={parallelStrings} onChange={setParallelStrings} placeholder="1" keyboard="numeric" />

      <Text className="mt-4 text-[11px] font-bold text-accent" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
        {isFa ? "ضریب دمای پنل (VOC) — درصد بر درجهٔ سانتی‌گراد" : "Panel temperature coefficient (Voc) — % per °C"}
      </Text>
      <View className={cn("flex-row gap-2 mt-1", isFa && "flex-row-reverse")}>
        {TEMP_PRESETS.map((preset) => (
          <PressableSurface
            key={preset.value}
            onPress={() => { setBetaPreset(preset.value); setBetaCustom(""); }}
            accessibilityRole="button"
            className={cn("flex-1 min-h-[40px] items-center justify-center rounded-control border", betaPreset === preset.value && !betaCustom.trim() ? "border-primary bg-primary" : "border-border bg-card")}
            style={{ borderRadius: 10 }}
          >
            <Text className={cn("text-[11px] font-bold", betaPreset === preset.value && !betaCustom.trim() ? "text-white" : "text-primary")}>
              {isFa ? preset.fa : preset.en}
            </Text>
          </PressableSurface>
        ))}
      </View>
      <Field
        label={isFa ? "مقدار دلخواه (جایگزین سه‌گزینهٔ بالا)" : "Custom value (overrides the presets above)"}
        value={betaCustom}
        onChange={setBetaCustom}
        placeholder={isFa ? "مثلاً 0.32-" : "e.g. -0.32"}
        keyboard="numeric"
      />
      <Field label={isFa ? "دمای کمینهٔ ثبت‌شده در محل — °C" : "Record low temp at site — °C"} value={lowTemp} onChange={setLowTemp} placeholder="-10" keyboard="numeric" />
      <Field label={isFa ? "جریان اتصال کوتاه هر پنل — آمپر" : "Panel Isc — amps"} value={panelIsc} onChange={setPanelIsc} placeholder="13.95" />
      <Field label={isFa ? "توان نامی هر پنل — وات" : "Panel rated power — watts"} value={panelWatts} onChange={setPanelWatts} placeholder="550" />

      {/* Load */}
      <SectionTitle>{isFa ? "۲ · بار AC" : "2 · AC load"}</SectionTitle>
      <Field label={isFa ? "توان بار — وات (حداکثر هم‌زمان)" : "Load power — watts (max concurrent)"} value={loadWatts} onChange={setLoadWatts} placeholder="3000" />

      {/* Charging */}
      <SectionTitle>{isFa ? "۳ · شارژ" : "3 · Charging"}</SectionTitle>
      <Field label={isFa ? "جریان شارژ AC — آمپر" : "AC charge current — amps"} value={utilityChargeA} onChange={setUtilityChargeA} placeholder="60" />
      <Field label={isFa ? "جریان شارژ خورشیدی (MPPT) — آمپر" : "Solar (MPPT) charge current — amps"} value={pvChargeA} onChange={setPvChargeA} placeholder="60" />

      {/* Results */}
      <SectionTitle>{isFa ? "نتیجه" : "Result"}</SectionTitle>
      <CheckCard check={report.pvVoltage} title={isFa ? "ولتاژ مدار باز آرایه در سرما" : "Array open-circuit voltage at record cold"} locale={locale}>
        <Text className="mt-[9px] text-[10px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
          {`${isFa ? "سقف مجاز دستگاه" : "Device ceiling"}: ${limits.maxPvVocVdc} VDC · ${isFa ? "پنجرهٔ MPPT" : "MPPT window"}: ${limits.mpptMinVdc}–${limits.mpptMaxVdc} VDC`}
        </Text>
        {report.pvVoltage.belowDeviceOperatingRange ? (
          <View className={cn("mt-2.5 flex-row items-start gap-1.5 rounded-[8px] bg-[#FFF7ED] p-2.5", isFa && "flex-row-reverse")}>
            <CircleAlert size={15} color="#B54708" />
            <Text className="flex-1 text-[10px] leading-[17px] text-warning" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
              {isFa
                ? `توجه: خود دستگاه تا ${limits.minOperatingTempC}° درجهٔ کاری است؛ دمای پایین‌تر یعنی خارج از رتبه‌بندی سازنده.`
                : `Note: the unit itself is rated down to ${limits.minOperatingTempC}°C; colder sites sit outside the manufacturer rating.`}
            </Text>
          </View>
        ) : null}
      </CheckCard>
      <CheckCard check={report.pvCurrent} title={isFa ? "جریان ورودی PV (رشته‌ها × Isc)" : "PV input current (strings × Isc)"} locale={locale} />
      <CheckCard check={report.pvPower} title={isFa ? "توان کل آرایه" : "Total array power"} locale={locale} />

      {/* Load */}
      <SectionTitle>{isFa ? "۲ · بار مصرف پیوسته" : "2 · Continuous load"}</SectionTitle>
      <Field label={isFa ? "توان بارهای هم‌زمان شما — وات" : "Simultaneous load power — W"} value={loadWatts} onChange={setLoadWatts} placeholder="2500" />
      <CheckCard check={report.load} title={isFa ? "بار پیوسته مقابل توان نامی" : "Continuous load vs rated power"} locale={locale}>
        <Text className="mt-[9px] text-[10px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
          {`${isFa ? "ظرفیت لحظه‌ای" : "Surge capacity"}: ${limits.surgeFactor}× ${isFa ? "برای" : "for"} ${limits.surgeSeconds}s`}
        </Text>
      </CheckCard>

      {/* Charging */}
      <SectionTitle>{isFa ? "۳ · تنظیمات شارژر" : "3 · Charger settings"}</SectionTitle>
      <Field label={isFa ? "جریان شارژ برنامهٔ ۱۱ — برق شهر، آمپر" : "Program 11 charge current — utility, A"} value={utilityChargeA} onChange={setUtilityChargeA} placeholder="30" keyboard="numeric" />
      <Field label={isFa ? "سهم شارژ خورشیدی مورد انتظار — آمپر" : "Expected solar charging share — A"} value={pvChargeA} onChange={setPvChargeA} placeholder="60" keyboard="numeric" />
      <CheckCard check={report.charging.total} title={isFa ? "جمع جریان شارژ" : "Combined charging current"} locale={locale} />
      <CheckCard check={report.charging.utility} title={isFa ? "سقف شارژ برق شهر" : "Utility charging ceiling"} locale={locale} />

      {/* Battery note */}
      <View className={cn("mt-4 flex-row items-center gap-2.5 rounded-control border border-dashed border-border bg-[#E8EDF2]/65 p-3.5", isFa && "flex-row-reverse")}>
        <BatteryCharging size={20} color="#617C41" />
        <Text className="flex-1 text-[12px] font-bold text-primary" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
          {`${isFa ? "سامانهٔ باتری باید" : "Battery system must be"} ${limits.batteryNominalVdc} VDC ${isFa ? "باشد." : "."}`}
        </Text>
      </View>

      <FeedbackRow context={isFa ? "ماشین‌حساب سازگاری" : "Sizing calculator"} />

      <Button
        variant="ghost"
        block
        label={isFa ? "پاک‌کردن همهٔ ورودی‌ها" : "Clear all inputs"}
        onPress={() => {
          setVocStc(""); setSeriesCount(""); setBetaPreset(-0.3); setBetaCustom(""); setLowTemp("-10");
          setParallelStrings("1"); setPanelIsc(""); setPanelWatts(""); setLoadWatts(""); setUtilityChargeA(""); setPvChargeA("");
        }}
        style={{ marginTop: 22 }}
        trailing={<RefreshCw size={16} color="#122C4F" />}
      />
    </Screen>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  const { locale } = useAcademy();
  const isFa = locale === "fa";
  return (
    <Text className="mt-6 mb-2 text-[10px] font-bold tracking-[0.5px] text-accent" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
      {children}
    </Text>
  );
}

function Field({ label, value, onChange, placeholder, keyboard }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; keyboard?: "numeric" | "default" }) {
  const { locale } = useAcademy();
  const isFa = locale === "fa";
  return (
    <View className="mt-1.5">
      <Text className="text-[10px] leading-[15px] text-muted-foreground mb-0.5" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
        {label}
      </Text>
      <TextInput
        className="min-h-[44px] rounded-control border border-border bg-card px-3.5 text-[13px] font-bold text-foreground"
        style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#CCD5DE"
        keyboardType={keyboard === "numeric" ? "numeric" : "default"}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

function CheckCard({ check, title, locale, children }: { check: SizingCheck; title: string; locale: "fa" | "en"; children?: ReactNode }) {
  const isFa = locale === "fa";
  const status: SizingStatus = check.status;
  const color = status === "pass" ? "#2F6F55" : status === "fail" ? "#B42318" : "#B54708";
  const bg = status === "pass" ? "#EEF8F2" : status === "fail" ? "#FFF1F0" : "#FFF7ED";
  const icon = status === "pass" ? "✓" : status === "fail" ? "✗" : "⚠";
  const label = status === "pass" ? (isFa ? "مناسب" : "OK") : status === "marginal" ? (isFa ? "مرزی" : "Marginal") : status === "fail" ? (isFa ? "نامجاز" : "Not OK") : (isFa ? "بدون ورودی" : "No input");
  return (
    <View className="mt-2.5 rounded-control border p-2.5" style={{ borderColor: color, backgroundColor: bg }}>
      <View className={cn("flex-row items-center gap-1.5", isFa && "flex-row-reverse")}>
        <Text style={{ color, fontSize: 13, fontWeight: "800" }}>{icon}</Text>
        <Text className="flex-1 text-[13px] font-bold" style={{ color, writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
          {title}
        </Text>
        <Text style={{ color, fontSize: 10, fontWeight: "800" }}>{label}</Text>
      </View>
      <Text className="mt-[9px] text-[11px]" style={{ color, writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
        {check.measured !== null && check.limit !== null
          ? `${check.measured} ${isFa ? "از حد مجاز" : "of limit"} ${check.limit}`
          : isFa ? "برای این محاسبه ورودی کامل نشده است." : "Input incomplete for this calculation."}
      </Text>
      {children ?? null}
    </View>
  );
}