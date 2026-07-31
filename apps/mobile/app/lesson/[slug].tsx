import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { useLocalSearchParams } from "expo-router";
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
  specifications,
  troubleshooting
} from "@nexa/product-content";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Screen } from "@/components/screen";
import { useAcademy } from "@/providers/academy-provider";
import { localizedRow, localizedTextStyle, theme } from "@/theme";

function Source({ fileName, page, locale }: { fileName: string; page: number; locale: "fa" | "en" }) {
  return (
    <View style={[styles.source, localizedRow(locale)]}>
      <Ionicons name="document-text-outline" size={15} color={theme.colors.textSecondary} />
      <Text style={[styles.sourceText, localizedTextStyle(locale)]}>{locale === "fa" ? `${fileName}، صفحه ${page}` : `${fileName}, page ${page}`}</Text>
    </View>
  );
}

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
      <View style={styles.twoCol}>{filtered.map((item) => <View style={styles.faultCard} key={item.code}><Text style={styles.faultCode}>{item.code}</Text><Text style={[styles.faultTitle, localizedTextStyle(locale)]}>{localize(item.title, locale)}</Text><Text style={[styles.faultText, localizedTextStyle(locale)]}>{locale === "fa" ? "توقف و ارجاع به سرویس مجاز" : "Stop and escalate to authorized service"}</Text></View>)}</View>
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
  return <View style={styles.manuals}>{manualAssets.map(({ document, module }) => <Pressable style={[styles.manual, localizedRow(locale)]} key={document.id} onPress={() => void openManual(module)}><View style={styles.manualIcon}><Ionicons name="book-outline" size={20} color={theme.colors.brandAccent} /></View><View style={styles.dataCopy}><Text style={[styles.dataTitle, localizedTextStyle(locale)]}>{document.title}</Text><Text style={styles.dataText}>{document.language.toUpperCase()} · {document.pages} pages · {locale === "fa" ? "بازکردن / اشتراک‌گذاری" : "Open / share"}</Text></View><Ionicons name="share-outline" size={18} color={theme.colors.textSecondary} /></Pressable>)}</View>;
}

function AnatomyList({ locale }: { locale: "fa" | "en" }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = anatomy.find((item) => item.id === activeId);
  return (
    <>
      <View style={styles.twoCol}>
        {anatomy.map((item, index) => (
          <Pressable style={styles.anatomyCard} onPress={() => setActiveId(item.id)} key={item.id}>
            <Text style={styles.anatomyNumber}>{String(index + 1).padStart(2, "0")}</Text>
            <Text style={[styles.dataTitle, localizedTextStyle(locale)]}>{localize(item.label, locale)}</Text>
            <Ionicons name="expand-outline" size={16} color={theme.colors.textSecondary} />
          </Pressable>
        ))}
      </View>
      <Modal visible={Boolean(active)} transparent animationType="slide" onRequestClose={() => setActiveId(null)}>
        <Pressable style={styles.drawerOverlay} onPress={() => setActiveId(null)}>
          <Pressable style={styles.drawer} onPress={(event) => event.stopPropagation()}>
            <View style={styles.drawerHandle} />
            <View style={[styles.drawerHead, localizedRow(locale)]}>
              <Text style={[styles.drawerTitle, localizedTextStyle(locale)]}>{active ? localize(active.label, locale) : ""}</Text>
              <Pressable style={styles.drawerClose} onPress={() => setActiveId(null)}><Ionicons name="close" size={20} color={theme.colors.brandPrimary} /></Pressable>
            </View>
            <Text style={[styles.drawerText, localizedTextStyle(locale)]}>
              {locale === "fa"
                ? "این بخش از نمای محصول در دفترچه شناسایی شده است. پیش از لمس هر ترمینال، همه منابع باید توسط نصاب متخصص ایزوله شوند."
                : "This part is identified from the manual product view. A qualified installer must isolate every source before any terminal is touched."}
            </Text>
            {active ? <Source fileName={active.source.fileName} page={active.source.page} locale={locale} /> : null}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function ConnectionFacts({ locale }: { locale: "fa" | "en" }) {
  return <View>{connectionFacts.map((item) => <View style={[styles.specRow, localizedRow(locale)]} key={item.id}><Text style={[styles.specLabel, localizedTextStyle(locale)]}>{localize(item.label, locale)}</Text><Text style={styles.specValue}>{item.value}</Text></View>)}</View>;
}

function Lcd({ locale }: { locale: "fa" | "en" }) {
  const screens = [["230", "VAC"], ["24.8", "VDC"], ["560", "PV W"], ["35", "LOAD %"]] as const;
  const [index, setIndex] = useState(0);
  const active = screens[index]!;
  return <View style={styles.lcdDevice}><View style={styles.lcdScreen}><Text style={styles.lcdValue}>{active[0]}</Text><Text style={styles.lcdUnit}>{active[1]}</Text></View><View style={styles.lcdButtons}>{["ESC", "▲", "▼", "ENTER"].map((button, buttonIndex) => <Pressable style={styles.lcdButton} key={button} onPress={() => setIndex((index + (buttonIndex < 2 ? -1 : 1) + screens.length) % screens.length)}><Text style={styles.lcdButtonText}>{button}</Text></Pressable>)}</View><Text style={[styles.simNote, localizedTextStyle(locale)]}>{locale === "fa" ? "شبیه‌ساز آموزشی، بدون اتصال به سخت‌افزار" : "Teaching simulator, not connected to hardware"}</Text></View>;
}

function Trouble({ locale }: { locale: "fa" | "en" }) {
  const [node, setNode] = useState<"start" | "no-response" | "utility-battery" | "fault-code">("start");
  const current = troubleshooting[node];
  if (node === "start" && "choices" in current) return <View style={styles.trouble}><Ionicons name="build-outline" size={28} color="#D9A2AB" /><Text style={[styles.troubleTitle, localizedTextStyle(locale)]}>{localize(current.question, locale)}</Text>{current.choices.map((choice) => <Pressable style={[styles.troubleChoice, localizedRow(locale)]} onPress={() => setNode(choice.next)} key={choice.next}><Text style={[styles.troubleChoiceText, localizedTextStyle(locale)]}>{localize(choice.label, locale)}</Text><Ionicons name="chevron-forward" size={17} color="white" /></Pressable>)}</View>;
  if ("result" in current) return <View style={styles.trouble}><Ionicons name="warning-outline" size={28} color="#D9A2AB" /><Text style={[styles.troubleTitle, localizedTextStyle(locale)]}>{localize(current.question, locale)}</Text><Text style={[styles.troubleResult, localizedTextStyle(locale)]}>{localize(current.result, locale)}</Text><Pressable style={styles.resetButton} onPress={() => setNode("start")}><Text style={styles.resetText}>{locale === "fa" ? "شروع دوباره" : "Start again"}</Text></Pressable></View>;
  return null;
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
  return <View style={styles.checks}>{items.map((item, index) => <View style={[styles.check, localizedRow(locale)]} key={item}><View style={styles.checkNumber}><Text style={styles.checkNumberText}>{String(index + 1).padStart(2, "0")}</Text></View><Text style={[styles.checkText, localizedTextStyle(locale)]}>{item}</Text></View>)}</View>;
}

function LessonContent({ slug, locale }: { slug: string; locale: "fa" | "en" }) {
  switch (slug) {
    case "overview": return <EnergyFlow locale={locale} />;
    case "anatomy": return <AnatomyList locale={locale} />;
    case "connections": return <ConnectionFacts locale={locale} />;
    case "lcd": return <Lcd locale={locale} />;
    case "settings": return <SettingsList locale={locale} />;
    case "faults": return <FaultList locale={locale} />;
    case "troubleshooting": return <Trouble locale={locale} />;
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
  if (!product || !lesson) return null;
  const done = completed.includes(lesson.id);
  return (
    <Screen title={localize(lesson.title, locale)} back>
      <View style={styles.lessonHeader}>
        <Text style={styles.eyebrow}>{String(product.lessons.findIndex((item) => item.id === lesson.id) + 1).padStart(2, "0")} / {product.lessons.length}</Text>
        <Text style={[styles.lessonTitle, localizedTextStyle(locale)]}>{localize(lesson.title, locale)}</Text>
        <Text style={[styles.lessonSummary, localizedTextStyle(locale)]}>{localize(lesson.summary, locale)}</Text>
        {lesson.safetyCritical ? <View style={[styles.safetyBadge, localizedRow(locale)]}><Ionicons name="shield-checkmark-outline" size={15} color={theme.colors.warning} /><Text style={styles.safetyText}>{locale === "fa" ? "ایمنی‌حیاتی" : "Safety critical"}</Text></View> : null}
      </View>
      <LessonContent slug={slug} locale={locale} />
      <Source fileName={lesson.source.fileName} page={lesson.source.page} locale={locale} />
      <Pressable style={[styles.completeButton, done && styles.completeButtonDone, localizedRow(locale)]} onPress={() => void toggleLesson(lesson.id)}>
        <Text style={[styles.completeText, done && styles.completeTextDone, localizedTextStyle(locale)]}>{done ? (locale === "fa" ? "مرور شد" : "Understood") : (locale === "fa" ? "به‌عنوان مرورشده ثبت کن" : "Mark as understood")}</Text>
        {done ? <Ionicons name="checkmark" size={18} color={theme.colors.success} /> : null}
      </Pressable>
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
  source: { alignItems: "center", gap: 7, marginTop: 28, padding: 12, borderLeftWidth: 3, borderLeftColor: theme.colors.borderSubtle, backgroundColor: theme.colors.technical },
  sourceText: { flex: 1, color: theme.colors.textSecondary, fontSize: 9 },
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
  faultCode: { color: theme.colors.brandAccent, fontSize: 22, fontWeight: "800" },
  faultTitle: { marginTop: 14, color: theme.colors.brandPrimary, fontSize: 11, fontWeight: "700" },
  faultText: { marginTop: 5, color: theme.colors.textSecondary, fontSize: 8, lineHeight: 13 },
  specRow: { alignItems: "center", justifyContent: "space-between", gap: 12, minHeight: 52, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.borderSubtle },
  specLabel: { flex: 1, color: theme.colors.textSecondary, fontSize: 11 },
  specValue: { color: theme.colors.brandPrimary, fontSize: 11, fontWeight: "800" },
  manuals: { gap: 9 },
  manual: { alignItems: "center", gap: 11, minHeight: 72, padding: 12, borderWidth: 1, borderColor: theme.colors.borderSubtle, borderRadius: theme.radii.control, backgroundColor: theme.colors.raised },
  manualIcon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "#F9EAEC" },
  anatomyCard: { width: "48.5%", minHeight: 115, justifyContent: "space-between", padding: 15, borderTopWidth: 2, borderTopColor: theme.colors.brandPrimary, backgroundColor: theme.colors.raised },
  anatomyNumber: { color: theme.colors.brandAccent, fontSize: 10, fontWeight: "700" },
  drawerOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(13,34,62,.58)" },
  drawer: { minHeight: 330, padding: 22, paddingBottom: 38, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: theme.colors.raised },
  drawerHandle: { alignSelf: "center", width: 46, height: 4, marginBottom: 20, borderRadius: 4, backgroundColor: theme.colors.borderSubtle },
  drawerHead: { alignItems: "center", justifyContent: "space-between", gap: 12 },
  drawerTitle: { flex: 1, color: theme.colors.brandPrimary, fontSize: 23, fontWeight: "800" },
  drawerClose: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: theme.colors.technical },
  drawerText: { marginTop: 22, color: theme.colors.textSecondary, fontSize: 13, lineHeight: 23 },
  lcdDevice: { padding: 22, borderRadius: theme.radii.panel, backgroundColor: "#E4E6E8", ...theme.shadow },
  lcdScreen: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", minHeight: 160, padding: 22, borderWidth: 8, borderColor: "#28323A", borderRadius: 8, backgroundColor: "#B9D6A8" },
  lcdValue: { color: "#13231D", fontSize: 62, fontWeight: "700" },
  lcdUnit: { paddingBottom: 10, color: "#13231D", fontSize: 13, fontWeight: "700" },
  lcdButtons: { flexDirection: "row", gap: 6, marginTop: 16 },
  lcdButton: { flex: 1, minHeight: 40, alignItems: "center", justifyContent: "center", borderRadius: 6, backgroundColor: "#273743" },
  lcdButtonText: { color: "white", fontSize: 8, fontWeight: "700" },
  simNote: { marginTop: 14, color: theme.colors.textSecondary, fontSize: 9 },
  trouble: { minHeight: 420, padding: 24, borderRadius: theme.radii.panel, backgroundColor: theme.colors.brandPrimary },
  troubleTitle: { marginVertical: 24, color: "white", fontSize: 25, lineHeight: 38, fontWeight: "800" },
  troubleChoice: { alignItems: "center", justifyContent: "space-between", gap: 8, minHeight: 72, marginTop: 8, padding: 13, borderWidth: 1, borderColor: "rgba(255,255,255,.2)", borderRadius: theme.radii.control, backgroundColor: "rgba(255,255,255,.07)" },
  troubleChoiceText: { flex: 1, color: "white", fontSize: 11, lineHeight: 19 },
  troubleResult: { color: "rgba(255,255,255,.72)", fontSize: 12, lineHeight: 22 },
  resetButton: { alignItems: "center", marginTop: 24, padding: 13, borderRadius: theme.radii.control, backgroundColor: "white" },
  resetText: { color: theme.colors.brandPrimary, fontSize: 12, fontWeight: "700" },
  checks: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.colors.borderSubtle },
  check: { alignItems: "center", gap: 12, minHeight: 74, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.borderSubtle },
  checkNumber: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, borderWidth: 1, borderColor: theme.colors.borderSubtle },
  checkNumberText: { color: theme.colors.brandAccent, fontSize: 9, fontWeight: "700" },
  checkText: { flex: 1, color: theme.colors.textPrimary, fontSize: 12, lineHeight: 21 },
  completeButton: { alignItems: "center", justifyContent: "center", gap: 8, minHeight: 52, marginTop: 28, borderRadius: theme.radii.control, backgroundColor: theme.colors.brandPrimary },
  completeButtonDone: { borderWidth: 1, borderColor: theme.colors.success, backgroundColor: "#EEF8F2" },
  completeText: { color: "white", fontSize: 12, fontWeight: "700" },
  completeTextDone: { color: theme.colors.success }
});
