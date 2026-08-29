import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useMemo, useState } from "react";
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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Screen } from "@/components/screen";
import { LcdSimulator } from "@/components/lesson/lcd-simulator";
import { QuizLesson } from "@/components/lesson/quiz-lesson";
import { TroubleshootingFlow } from "@/components/lesson/triage-flow";
import { useAcademy } from "@/providers/academy-provider";
import { localizedRow, localizedTextStyle, theme } from "@/theme";
import { toFaDigits } from "@nexa/shared-logic";
import { Button } from "@/src/ui/button/Button";
import { haptics } from "@/src/ui/haptics";
import { dirIconName } from "@/src/ui/direction";
import { IconButton } from "@/src/ui/icon-button";
import { PressableSurface } from "@/src/ui/pressable-surface";

const anatomyIcons = {
  lcd: "calculator-outline",
  status: "ellipse-outline",
  charge: "battery-charging-outline",
  fault: "warning-outline",
  buttons: "keypad-outline",
  earth: "shield-checkmark-outline",
  "ac-in": "flash-outline",
  "ac-out": "flash-outline",
  battery: "battery-half-outline",
  pv: "sunny-outline",
  wifi: "wifi-outline",
  power: "power-outline"
} as const;

function EnergyFlow({ locale }: { locale: "fa" | "en" }) {
  const nodes = [
    ["sunny-outline", locale === "fa" ? "خورشید" : "Solar", theme.colors.energySolar],
    ["business-outline", locale === "fa" ? "شبکه" : "Grid", theme.colors.energyGrid],
    ["battery-charging-outline", locale === "fa" ? "باتری" : "Battery", theme.colors.energyBattery],
    ["home-outline", locale === "fa" ? "بار" : "Load", theme.colors.energyLoad]
  ] as const;
  return (
    <View style={styles.flow}>
      <View style={styles.inverterNode}><Text style={styles.inverterTitle}>NEXA</Text><Text style={styles.inverterSubtitle}>CM3500-24S</Text></View>
      <View style={styles.flowGrid}>{nodes.map(([icon, label, color]) => <View style={styles.flowNode} key={label}><View style={[styles.flowIcon, { borderColor: color }]}><Ionicons name={icon} size={22} color={color} /></View><Text style={[styles.flowText, localizedTextStyle(locale)]}>{label}</Text></View>)}</View>
    </View>
  );
}

function SettingsList({ locale }: { locale: "fa" | "en" }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => settings.filter((item) => `${item.number} ${item.label.en} ${item.label.fa}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <View>
      <View style={[styles.search, localizedRow(locale)]}><Ionicons name="search" size={18} color={theme.colors.textSecondary} /><TextInput style={[styles.searchInput, localizedTextStyle(locale)]} value={query} onChangeText={setQuery} placeholder={locale === "fa" ? "جست‌وجوی ۳۱ برنامه" : "Search 31 programs"} /></View>
      {filtered.map((item) => <View style={[styles.dataRow, localizedRow(locale)]} key={item.number}><Text style={styles.code}>{item.number}</Text><View style={styles.dataCopy}><Text style={[styles.dataTitle, localizedTextStyle(locale)]}>{localize(item.label, locale)}</Text><Text style={[styles.dataText, localizedTextStyle(locale)]}>{localize(item.summary, locale)}</Text></View></View>)}
    </View>
  );
}

function FaultList({ locale }: { locale: "fa" | "en" }) {
  const [query, setQuery] = useState("");
  const filtered = faultCodes.filter((item) => `${item.code} ${item.title.en} ${item.title.fa}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <View>
      <View style={[styles.search, localizedRow(locale)]}><Ionicons name="search" size={18} color={theme.colors.textSecondary} /><TextInput style={[styles.searchInput, localizedTextStyle(locale)]} value={query} onChangeText={setQuery} placeholder={locale === "fa" ? "کد یا عنوان خطا" : "Fault code or title"} /></View>
      <View style={[styles.twoCol, localizedRow(locale)]}>{filtered.map((item) => <View style={[styles.faultCard, locale === "fa" && styles.faultCardRtl]} key={item.code}><Text style={styles.faultCode}>{item.code}</Text><Text style={[styles.faultTitle, localizedTextStyle(locale)]}>{localize(item.title, locale)}</Text><Text style={[styles.faultText, localizedTextStyle(locale)]}>{locale === "fa" ? "توقف و ارجاع به سرویس مجاز" : "Stop and escalate to authorized service"}</Text></View>)}</View>
    </View>
  );
}

function Specs({ locale }: { locale: "fa" | "en" }) {
  return <View>{specifications.map((item) => <View style={[styles.specRow, localizedRow(locale)]} key={item.id}><Text style={[styles.specLabel, localizedTextStyle(locale)]}>{localize(item.label, locale)}</Text><Text style={styles.specValue}>{item.value} {item.unit}</Text></View>)}</View>;
}

function Manuals({ locale }: { locale: "fa" | "en" }) {
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
  return <View style={styles.manuals}>{manualAssets.map(({ document, module }) => <PressableSurface style={[styles.manual, localizedRow(locale)]} key={document.id} onPress={() => void openManual(module)} accessibilityRole="button" accessibilityLabel={document.title}><View style={styles.manualIcon}><Ionicons name="book-outline" size={20} color={theme.colors.brandAccent} /></View><View style={styles.dataCopy}><Text style={[styles.dataTitle, localizedTextStyle(locale)]}>{document.title}</Text><Text style={styles.dataText}>{document.language.toUpperCase()} · {document.pages} pages · {locale === "fa" ? "بازکردن / اشتراک‌گذاری" : "Open / share"}</Text></View><Ionicons name="share-outline" size={18} color={theme.colors.textSecondary} /></PressableSurface>)}</View>;
}

function AnatomyList({ locale, model }: { locale: "fa" | "en"; model: string }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = anatomy.find((item) => item.id === activeId);
  const openRelated = () => {
    if (!active) return;
    const id = active.id;
    setActiveId(null);
    router.push(`/lesson/${active.relatedLesson}?model=${model}`);
  };
  return (
    <>
      <View style={[styles.twoCol, localizedRow(locale)]}>
        {anatomy.map((item, index) => (
          <PressableSurface style={styles.anatomyCard} onPress={() => setActiveId(item.id)} key={item.id} accessibilityRole="button" accessibilityLabel={`${index + 1}. ${localize(item.label, locale)}`}>
            <View style={[styles.partCardHead, localizedRow(locale)]}>
              <Text style={styles.anatomyNumber}>{locale === "fa" ? toFaDigits(String(index + 1).padStart(2, "0")) : String(index + 1).padStart(2, "0")}</Text>
              <Ionicons name={anatomyIcons[item.icon] ?? "information-circle-outline"} size={18} color={theme.colors.brandAccent} />
            </View>
            <Text style={[styles.dataTitle, localizedTextStyle(locale)]}>{localize(item.label, locale)}</Text>
            <Text style={[styles.partCardTip, localizedTextStyle(locale)]} numberOfLines={2}>{localize(item.role, locale)}</Text>
            <Ionicons name="expand-outline" size={16} color={theme.colors.textSecondary} />
          </PressableSurface>
        ))}
      </View>
      <Modal visible={Boolean(active)} transparent animationType="slide" onRequestClose={() => setActiveId(null)}>
        <Pressable style={styles.drawerOverlay} onPress={() => setActiveId(null)}>
          <Pressable style={styles.drawer} onPress={(event) => event.stopPropagation()}>
            <View style={styles.drawerHandle} />
            <ScrollView style={styles.drawerScroll} contentContainerStyle={styles.drawerContent} showsVerticalScrollIndicator={false}>
              <View style={[styles.drawerHead, localizedRow(locale)]}>
                <Text style={[styles.drawerTitle, localizedTextStyle(locale)]} numberOfLines={1}>{active ? localize(active.label, locale) : ""}</Text>
                <IconButton tone="technical" accessibilityLabel="Close" onPress={() => setActiveId(null)}><Ionicons name="close" size={20} color={theme.colors.brandPrimary} /></IconButton>
              </View>
              {active ? (
                <>
                  <View style={[styles.partHead, localizedRow(locale)]}>
                    <View style={styles.partIcon}><Ionicons name={anatomyIcons[active.icon] ?? "information-circle-outline"} size={24} color="white" /></View>
                    <Text style={[styles.partSpec, localizedTextStyle(locale)]}>{localize(active.stat, locale)}</Text>
                  </View>
                  <Text style={[styles.partRole, localizedTextStyle(locale)]}>{localize(active.role, locale)}</Text>
                  <View style={[styles.partGuide, localizedRow(locale), locale === "fa" && styles.partGuideRtl]}>
                    <Ionicons name="bulb-outline" size={17} color={theme.colors.warning} />
                    <Text style={[styles.partGuideText, localizedTextStyle(locale)]}>{localize(active.guide, locale)}</Text>
                  </View>
                  <Button
                    variant="filled"
                    block
                    label={localize(active.relatedLabel, locale)}
                    trailing={<Ionicons name={dirIconName(locale, "chevron-forward", "chevron-back")} size={17} color="white" />}
                    onPress={openRelated}
                    style={{ marginTop: 18 }}
                  />
                </>
              ) : null}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function ConnectionFacts({ locale }: { locale: "fa" | "en" }) {
  return <View>{connectionFacts.map((item) => <View style={[styles.specRow, localizedRow(locale)]} key={item.id}><Text style={[styles.specLabel, localizedTextStyle(locale)]}>{localize(item.label, locale)}</Text><Text style={styles.specValue}>{item.value}</Text></View>)}</View>;
}

function GenericLesson({ slug, locale }: { slug: string; locale: "fa" | "en" }) {
  const copy: Record<string, { fa: string[]; en: string[] }> = {
    safety: { fa: ["همه منابع انرژی را پیش از اتصال ایزوله کنید.", "محفظه را باز نکنید.", "سیم‌کشی ثابت فقط توسط نصاب متخصص انجام شود.", "دستگاه را روی سطح غیرقابل‌اشتعال نصب کنید."], en: ["Isolate every source before connecting.", "Do not open the enclosure.", "Fixed wiring is for qualified installers only.", "Mount on a non-combustible surface."] },
    installation: { fa: ["بسته‌بندی و بدنه را بررسی کنید.", "سطح عمودی و محکم انتخاب کنید.", "فضای تهویه را باز نگه دارید.", "مسیر کابل‌ها را پیش از نصب کنترل کنید."], en: ["Inspect packaging and enclosure.", "Choose a solid vertical surface.", "Keep ventilation clearance open.", "Check cable routes before mounting."] },
    "power-on": { fa: ["زمین حفاظتی تأیید شده باشد.", "قطبیت باتری کنترل شده باشد.", "Voc پنل در محدوده مجاز باشد.", "ورودی و خروجی AC جابه‌جا نشده باشند."], en: ["Verify protective earth.", "Confirm battery polarity.", "Keep array Voc within limits.", "Do not reverse AC input and output."] },
    modes: { fa: ["Utility first", "Solar first", "SBU priority", "SUB priority", "SUF priority"], en: ["Utility first", "Solar first", "SBU priority", "SUB priority", "SUF priority"] },
    battery: { fa: ["سامانه باتری: ۲۴ ولت DC", "حداکثر جریان کل شارژ: ۱۰۰ آمپر", "حداکثر شارژ AC: ۶۰ آمپر", "متعادل‌سازی فقط با دستور سازنده باتری"], en: ["Battery system: 24 VDC", "Maximum total charge: 100 A", "Maximum AC charge: 60 A", "Equalize only per battery manufacturer"] },
    quiz: { fa: ["پاسخ ایمن: پیش از بررسی هر اتصال، همه منابع باید توسط فرد واجد صلاحیت ایزوله شوند."], en: ["Safe answer: every source must be isolated by a qualified person before a connection is checked."] }
  };
  const items = copy[slug]?.[locale] ?? [];
  return <View style={styles.checks}>{items.map((item, index) => <View style={[styles.check, localizedRow(locale)]} key={item}><View style={styles.checkNumber}><Text style={styles.checkNumberText}>{locale === "fa" ? toFaDigits(String(index + 1).padStart(2, "0")) : String(index + 1).padStart(2, "0")}</Text></View><Text style={[styles.checkText, localizedTextStyle(locale)]}>{item}</Text></View>)}</View>;
}

function LessonContent({ slug, locale, model }: { slug: string; locale: "fa" | "en"; model: string }) {
  switch (slug) {
    case "overview": return <EnergyFlow locale={locale} />;
    case "anatomy": return <AnatomyList locale={locale} model={model} />;
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
  const lesson = product?.lessons.find((item) => item.slug === slug);
  if (!product || !lesson) {
    // A stale deep link must never dead-end on a blank screen without back.
    return (
      <Screen back title={locale === "fa" ? "درس" : "Lesson"}>
        <View style={styles.notFound}>
          <Ionicons name="help-circle-outline" size={26} color={theme.colors.warning} />
          <Text style={[styles.notFoundText, localizedTextStyle(locale)]}>
            {locale === "fa" ? "این درس پیدا نشد — از فهرست آکادمی انتخاب کنید." : "This lesson was not found — choose it from the academy list."}
          </Text>
        </View>
      </Screen>
    );
  }
  const done = completed.includes(lesson.id);
  const lessonIndex = product.lessons.findIndex((item) => item.id === lesson.id);
  const previous = lessonIndex > 0 ? product.lessons[lessonIndex - 1] : undefined;
  const next = lessonIndex >= 0 && lessonIndex < product.lessons.length - 1 ? product.lessons[lessonIndex + 1] : undefined;
  const reviewedCount = completed.length;
  const totalCount = product.lessons.length;
  const progressPercent = totalCount > 0 ? Math.min(100, Math.max(0, Math.round((reviewedCount / totalCount) * 100))) : 0;
  return (
    <Screen title={localize(lesson.title, locale)} back>
      <View style={styles.lessonHeader}>
        <Text style={styles.eyebrow}>{locale === "fa" ? `${toFaDigits(String(lessonIndex + 1).padStart(2, "0"))} / ${toFaDigits(product.lessons.length)}` : `${String(lessonIndex + 1).padStart(2, "0")} / ${product.lessons.length}`}</Text>
        <Text style={[styles.lessonTitle, localizedTextStyle(locale)]}>{localize(lesson.title, locale)}</Text>
        <Text style={[styles.lessonSummary, localizedTextStyle(locale)]}>{localize(lesson.summary, locale)}</Text>
        {lesson.safetyCritical ? <View style={[styles.safetyBadge, localizedRow(locale)]}><Ionicons name="shield-checkmark-outline" size={15} color={theme.colors.warning} /><Text style={styles.safetyText}>{locale === "fa" ? "ایمنی‌حیاتی" : "Safety critical"}</Text></View> : null}
      </View>
      <LessonContent slug={slug} locale={locale} model={product.slug} />
      {done ? (
        <View style={[styles.doneBanner, localizedRow(locale)]}>
          <View style={styles.doneBannerIcon}><Ionicons name="trophy-outline" size={24} color={theme.colors.success} /></View>
          <View style={styles.doneBannerCopy}>
            <Text style={[styles.doneBannerTitle, localizedTextStyle(locale)]}>{locale === "fa" ? "این درس را کامل کردی!" : "Lesson complete!"}</Text>
            <Text style={[styles.doneBannerText, localizedTextStyle(locale)]}>{locale === "fa" ? `${toFaDigits(reviewedCount)} از ${toFaDigits(totalCount)} درس مرور شد` : `${reviewedCount} of ${totalCount} lessons reviewed`}</Text>
            <View style={styles.doneTrack}><View style={[styles.doneFill, { width: `${Math.max(progressPercent, 3)}%` }]} /></View>
          </View>
        </View>
      ) : null}
      <Button
        variant={done ? "secondary" : "filled"}
        block
        label={done ? (locale === "fa" ? "مرور شد" : "Understood") : (locale === "fa" ? "به‌عنوان مرورشده ثبت کن" : "Mark as understood")}
        contentColor={done ? theme.colors.success : undefined}
        trailing={done ? <Ionicons name="checkmark" size={18} color={theme.colors.success} /> : undefined}
        onPress={() => {
          if (!done) haptics.success();
          void toggleLesson(lesson.id);
        }}
        style={[{ marginTop: 28 }, done && { borderWidth: 1, borderColor: theme.colors.success }]}
      />
      <View style={[styles.pager, localizedRow(locale)]}>
        {previous ? (
          <PressableSurface style={[styles.pagerCard, localizedRow(locale)]} onPress={() => router.push(`/lesson/${previous.slug}?model=${model}`)} accessibilityRole="button" accessibilityLabel={locale === "fa" ? "درس قبلی" : "Previous lesson"}>
            <Ionicons name={dirIconName(locale, "chevron-back", "chevron-forward")} size={20} color={theme.colors.brandAccent} />
            <View style={styles.pagerCopy}>
              <Text style={[styles.pagerEyebrow, localizedTextStyle(locale)]}>{locale === "fa" ? "درس قبلی" : "Previous lesson"}</Text>
              <Text style={[styles.pagerTitle, localizedTextStyle(locale)]} numberOfLines={1}>{localize(previous.title, locale)}</Text>
            </View>
          </PressableSurface>
        ) : (
          <PressableSurface style={[styles.pagerCard, localizedRow(locale)]} onPress={() => router.push(`/academy/${model}`)} accessibilityRole="button" accessibilityLabel={locale === "fa" ? "شروع دوره" : "Course start"}>
            <Ionicons name={dirIconName(locale, "chevron-back", "chevron-forward")} size={20} color={theme.colors.brandAccent} />
            <View style={styles.pagerCopy}>
              <Text style={[styles.pagerEyebrow, localizedTextStyle(locale)]}>{locale === "fa" ? "شروع دوره" : "Course start"}</Text>
              <Text style={[styles.pagerTitle, localizedTextStyle(locale)]} numberOfLines={1}>{locale === "fa" ? "بازگشت به آکادمی" : "Back to academy"}</Text>
            </View>
          </PressableSurface>
        )}
        {next ? (
          <PressableSurface style={[styles.pagerCard, localizedRow(locale)]} onPress={() => router.push(`/lesson/${next.slug}?model=${model}`)} accessibilityRole="button" accessibilityLabel={locale === "fa" ? "درس بعدی" : "Next lesson"}>
            <View style={styles.pagerCopy}>
              <Text style={[styles.pagerEyebrow, localizedTextStyle(locale)]}>{locale === "fa" ? "درس بعدی" : "Next lesson"}</Text>
              <Text style={[styles.pagerTitle, localizedTextStyle(locale)]} numberOfLines={1}>{localize(next.title, locale)}</Text>
            </View>
            <Ionicons name={dirIconName(locale, "chevron-forward", "chevron-back")} size={20} color={theme.colors.brandAccent} />
          </PressableSurface>
        ) : (
          <PressableSurface style={[styles.pagerCard, localizedRow(locale)]} onPress={() => router.push(`/academy/${model}`)} accessibilityRole="button" accessibilityLabel={locale === "fa" ? "پایان دوره" : "Course end"}>
            <View style={styles.pagerCopy}>
              <Text style={[styles.pagerEyebrow, localizedTextStyle(locale)]}>{locale === "fa" ? "پایان دوره" : "Course end"}</Text>
              <Text style={[styles.pagerTitle, localizedTextStyle(locale)]} numberOfLines={1}>{locale === "fa" ? "بازگشت به آکادمی" : "Back to academy"}</Text>
            </View>
            <Ionicons name={dirIconName(locale, "chevron-forward", "chevron-back")} size={20} color={theme.colors.brandAccent} />
          </PressableSurface>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lessonHeader: { paddingVertical: 22 },
  eyebrow: { color: theme.colors.brandAccent, fontSize: 9, fontWeight: "700", letterSpacing: 1.3 },
  lessonTitle: { marginTop: 9, color: theme.colors.brandPrimary, fontSize: 34, lineHeight: 46, fontWeight: "800", fontFamily: "Vazirmatn_700Bold" },
  lessonSummary: { marginTop: 7, color: theme.colors.textSecondary, fontSize: 13, lineHeight: 22 },
  safetyBadge: { alignSelf: "flex-start", alignItems: "center", gap: 5, marginTop: 14, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 100, backgroundColor: "#FFF7ED" },
  safetyText: { color: theme.colors.warning, fontSize: 10, fontWeight: "700" },
  flow: { padding: 24, borderRadius: theme.radii.panel, backgroundColor: theme.colors.brandPrimaryStrong },
  inverterNode: { alignSelf: "center", alignItems: "center", justifyContent: "center", width: 140, height: 140, borderRadius: 70, borderWidth: 1, borderColor: "rgba(255,255,255,.25)", backgroundColor: theme.colors.brandPrimary },
  inverterTitle: { color: "white", fontSize: 24, fontWeight: "800", letterSpacing: 3 },
  inverterSubtitle: { color: "rgba(255,255,255,.65)", fontSize: 9 },
  flowGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 24 },
  flowNode: { width: "50%", alignItems: "center", padding: 10 },
  flowIcon: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: 24, borderWidth: 1, backgroundColor: "rgba(255,255,255,.06)" },
  flowText: { marginTop: 6, color: "white", fontSize: 11 },
  search: { alignItems: "center", gap: 9, minHeight: 48, paddingHorizontal: 14, borderWidth: 1, borderColor: theme.colors.borderSubtle, borderRadius: theme.radii.control, backgroundColor: theme.colors.raised },
  searchInput: { flex: 1, color: theme.colors.textPrimary, fontSize: 12 },
  dataRow: { alignItems: "flex-start", gap: 12, paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.borderSubtle },
  code: { width: 42, height: 42, paddingTop: 11, color: theme.colors.brandPrimary, borderWidth: 1, borderColor: theme.colors.brandPrimary, borderRadius: 21, textAlign: "center", fontSize: 11, fontWeight: "700" },
  dataCopy: { flex: 1 },
  dataTitle: { color: theme.colors.brandPrimary, fontSize: 13, fontWeight: "700" },
  dataText: { marginTop: 3, color: theme.colors.textSecondary, fontSize: 10, lineHeight: 17 },
  twoCol: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  faultCard: { width: "48.5%", minHeight: 155, padding: 14, borderLeftWidth: 3, borderLeftColor: theme.colors.brandAccent, backgroundColor: theme.colors.raised, ...theme.shadow },
  faultCardRtl: { borderLeftWidth: 0, borderRightWidth: 3, borderRightColor: theme.colors.brandAccent },
  faultCode: { color: theme.colors.brandAccent, fontSize: 22, fontWeight: "800" },
  faultTitle: { marginTop: 14, color: theme.colors.brandPrimary, fontSize: 11, fontWeight: "700" },
  faultText: { marginTop: 5, color: theme.colors.textSecondary, fontSize: 8, lineHeight: 13 },
  specRow: { alignItems: "center", justifyContent: "space-between", gap: 12, minHeight: 52, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.borderSubtle },
  specLabel: { flex: 1, color: theme.colors.textSecondary, fontSize: 11 },
  specValue: { color: theme.colors.brandPrimary, fontSize: 11, fontWeight: "800" },
  manuals: { gap: 9 },
  manual: { overflow: "hidden", alignItems: "center", gap: 11, minHeight: 72, padding: 12, borderWidth: 1, borderColor: theme.colors.borderSubtle, borderRadius: theme.radii.control, backgroundColor: theme.colors.raised },
  manualIcon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "#F9EAEC" },
  anatomyCard: { width: "48.5%", minHeight: 145, alignItems: "flex-start", gap: 6, padding: 15, borderTopWidth: 2, borderTopColor: theme.colors.brandPrimary, borderRadius: 12, backgroundColor: theme.colors.raised, ...theme.shadow },
  anatomyNumber: { color: theme.colors.brandAccent, fontSize: 10, fontWeight: "700" },
  partCardHead: { alignItems: "center", justifyContent: "space-between", width: "100%" },
  partCardTip: { color: theme.colors.textSecondary, fontSize: 11, lineHeight: 18 },
  drawerOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(13,34,62,.58)" },
  drawer: { maxHeight: "86%", padding: 22, paddingBottom: 38, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: theme.colors.raised },
  drawerHandle: { alignSelf: "center", width: 46, height: 4, marginBottom: 20, borderRadius: 4, backgroundColor: theme.colors.borderSubtle },
  drawerScroll: { maxHeight: 420 },
  drawerContent: { paddingBottom: 8 },
  drawerHead: { alignItems: "center", justifyContent: "space-between", gap: 12 },
  drawerTitle: { flex: 1, color: theme.colors.brandPrimary, fontSize: 23, fontWeight: "800" },
  partHead: { alignItems: "center", gap: 12, marginTop: 22 },
  partIcon: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: theme.colors.brandPrimary },
  partSpec: { flex: 1, color: theme.colors.brandAccent, fontFamily: "IBM Plex Mono", fontSize: 11, lineHeight: 18 },
  partRole: { marginTop: 18, color: theme.colors.textPrimary, fontSize: 13, lineHeight: 24 },
  partGuide: { alignItems: "flex-start", gap: 9, marginTop: 16, padding: 13, borderLeftWidth: 3, borderLeftColor: theme.colors.warning, backgroundColor: "#FFF7ED" },
  partGuideRtl: { borderLeftWidth: 0, borderRightWidth: 3, borderRightColor: theme.colors.warning },
  partGuideText: { flex: 1, color: "#24435F", fontSize: 12, lineHeight: 20 },
  checks: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.borderSubtle },
  check: { alignItems: "center", gap: 12, minHeight: 74, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.borderSubtle },
  checkNumber: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, borderWidth: 1, borderColor: theme.colors.borderSubtle },
  checkNumberText: { color: theme.colors.brandAccent, fontSize: 9, fontWeight: "700" },
  checkText: { flex: 1, color: theme.colors.textPrimary, fontSize: 12, lineHeight: 21 },
  doneBanner: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 30, padding: 18, borderWidth: 1, borderColor: "rgba(47,111,85,.35)", borderRadius: 14, backgroundColor: "#F3FAF6" },
  doneBannerIcon: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: "#E1F1E9" },
  doneBannerCopy: { flex: 1, minWidth: 0 },
  doneBannerTitle: { color: theme.colors.success, fontSize: 14, fontWeight: "800" },
  doneBannerText: { marginTop: 3, color: theme.colors.textSecondary, fontSize: 11 },
  doneTrack: { height: 5, marginTop: 11, overflow: "hidden", borderRadius: 3, backgroundColor: "rgba(47,111,85,.14)" },
  doneFill: { height: "100%", borderRadius: 3, backgroundColor: theme.colors.success },
  pager: { gap: 10, marginTop: 20, paddingTop: 18, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.borderSubtle },
  pagerCard: { flex: 1, alignItems: "center", gap: 11, minHeight: 84, padding: 14, borderWidth: 1, borderColor: theme.colors.borderSubtle, borderRadius: 14, backgroundColor: theme.colors.raised },
  pagerCopy: { flex: 1, minWidth: 0 },
  pagerEyebrow: { color: theme.colors.textSecondary, fontSize: 9, fontWeight: "700", letterSpacing: .8 },
  pagerTitle: { marginTop: 5, color: theme.colors.brandPrimary, fontSize: 12, fontWeight: "700" },
  notFound: { alignItems: "center", gap: 12, marginTop: 48, padding: 24 },
  notFoundText: { color: theme.colors.textSecondary, fontSize: 13, lineHeight: 22, textAlign: "center" }
});
