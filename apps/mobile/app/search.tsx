import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { faultCodes, localize, productModels, settings } from "@nexa/product-content";
import { Screen } from "@/components/screen";
import { useAcademy } from "@/providers/academy-provider";
import { localizedRow, localizedTextStyle, theme } from "@/theme";
import { dirIconName } from "@/src/ui/direction";
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
  const fa = locale === "fa";
  const [query, setQuery] = useState("");
  const [expandedFault, setExpandedFault] = useState<string | null>(null);
  const product = productModels.find((model) => model.modelName.verificationStatus === "verified");
  const lessons = product?.lessons ?? [];

  const results = useMemo<Result[]>(() => {
    const raw = query.trim();
    if (!raw || !product) return [];
    // Match against the normalized key for code/number hits; use the raw
    // lower-cased query for plain text titles.
    const key = normalizeKey(raw);
    const text = raw.toLowerCase();
    const found: Result[] = [];
    for (const lesson of lessons) {
      const title = localize(lesson.title, locale);
      const summary = localize(lesson.summary, locale);
      if (title.toLowerCase().includes(text) || summary.toLowerCase().includes(text)) {
        found.push({ kind: "lesson", id: `lesson-${lesson.id}`, title, extra: fa ? "درس" : "Lesson", slug: lesson.slug });
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
    <Screen back title={fa ? "جست‌وجوی همهٔ بخش‌ها" : "Global search"}>
      <View style={styles.search}>
        <Ionicons name="search" size={18} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.input, { writingDirection: fa ? "rtl" : "ltr" }]}
          value={query}
          onChangeText={setQuery}
          placeholder={fa ? "کد خطا، شماره برنامه یا عنوان…" : "Fault code, program number or title…"}
          placeholderTextColor={theme.colors.borderSubtle}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 ? (
          <PressableSurface onPress={() => setQuery("")} accessibilityRole="button" accessibilityLabel="Clear" style={styles.clear}>
            <Ionicons name="close-circle" size={17} color={theme.colors.textSecondary} />
          </PressableSurface>
        ) : null}
      </View>

      <Text style={[styles.sectionLabel, localizedTextStyle(locale)]}>{fa ? "مرجع سریع کد خطا" : "Fault code quick reference"}</Text>
      <View style={[styles.chips, localizedRow(locale)]}>
        {faultCodes.map((fault) => {
          const expanded = expandedFault === fault.code;
          return (
            <View key={fault.code} style={styles.chipWrap}>
              <PressableSurface
                onPress={() => setExpandedFault(expanded ? null : fault.code)}
                accessibilityRole="button"
                accessibilityLabel={fault.code}
                style={[styles.chip, expanded && styles.chipActive]}
              >
                <Text style={[styles.chipText, expanded && styles.chipTextActive]}>{fault.code}</Text>
              </PressableSurface>
              {expanded ? (
                <View style={styles.chipDetail}>
                  <Text style={[styles.chipDetailTitle, localizedTextStyle(locale)]}>{localize(fault.title, locale)}</Text>
                  <Text style={[styles.chipDetailBody, localizedTextStyle(locale)]}>{localize(fault.safeCheck, locale)}</Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {query.trim().length > 0 ? (
        <View style={styles.results}>
          <Text style={[styles.sectionLabel, localizedTextStyle(locale)]}>
            {fa ? `نتایج (${results.length})` : `Results (${results.length})`}
          </Text>
          {results.length === 0 ? (
            <Text style={[styles.empty, localizedTextStyle(locale)]}>{fa ? "چیزی پیدا نشد — املای فارسی یا شماره را چک کنید." : "Nothing found — check Persian spelling or the number."}</Text>
          ) : results.map((result) => (
            <PressableSurface
              key={result.id}
              onPress={() => open(result)}
              accessibilityRole="button"
              style={styles.resultRow}
            >
              <View style={styles.resultTag}><Text style={styles.resultTagText}>{result.extra}</Text></View>
              <Text style={[styles.resultTitle, localizedTextStyle(locale)]} numberOfLines={1}>{result.title}</Text>
              <Ionicons name={dirIconName(locale, "chevron-forward", "chevron-back")} size={16} color={theme.colors.borderSubtle} />
            </PressableSurface>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { alignItems: "center", gap: 9, minHeight: 50, paddingHorizontal: 14, marginTop: 6, borderWidth: 1, borderColor: theme.colors.borderSubtle, borderRadius: theme.radii.control, backgroundColor: theme.colors.raised },
  input: { flex: 1, color: theme.colors.textPrimary, fontSize: 13 },
  clear: { overflow: "hidden", padding: 3, borderRadius: 99 },
  sectionLabel: { marginTop: 22, marginBottom: 8, color: theme.colors.brandAccent, fontSize: 11, fontWeight: "800" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chipWrap: { maxWidth: "100%" },
  chip: { overflow: "hidden", minWidth: 52, minHeight: 38, alignItems: "center", justifyContent: "center", paddingHorizontal: 10, borderRadius: 99, borderWidth: 1, borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.raised },
  chipActive: { borderColor: theme.colors.brandPrimary, backgroundColor: theme.colors.brandPrimary },
  chipText: { color: theme.colors.brandPrimary, fontSize: 11, fontWeight: "800" },
  chipTextActive: { color: "white" },
  chipDetail: { minWidth: "100%", marginTop: 6, padding: 12, borderRadius: theme.radii.control, borderWidth: 1, borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.raised },
  chipDetailTitle: { color: theme.colors.brandPrimary, fontSize: 12, fontWeight: "700" },
  chipDetailBody: { marginTop: 5, color: theme.colors.textSecondary, fontSize: 10, lineHeight: 17 },
  chipDetailSource: { marginTop: 8, color: theme.colors.textSecondary, fontSize: 9, opacity: 0.85 },
  results: { marginTop: 22 },
  empty: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 8 },
  resultRow: { overflow: "hidden", alignItems: "center", gap: 10, minHeight: 50, marginTop: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: theme.colors.borderSubtle, borderRadius: theme.radii.control, backgroundColor: theme.colors.raised },
  resultTag: { flexDirection: "row", alignItems: "center", justifyContent: "center", minWidth: 44, paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, backgroundColor: theme.colors.technical },
  resultTagText: { color: theme.colors.brandPrimary, fontSize: 9, fontWeight: "800" },
  resultTitle: { flex: 1, color: theme.colors.textPrimary, fontSize: 12, fontWeight: "600" }
});