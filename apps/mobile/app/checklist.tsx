import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, View } from "react-native";
import { commissioningSteps, localize } from "@nexa/product-content";
import { storageKeys, toFaDigits } from "@nexa/shared-logic";
import { Screen } from "@/components/screen";
import { useAcademy } from "@/providers/academy-provider";
import { localizedRow, localizedTextStyle, theme } from "@/theme";
import { Button } from "@/src/ui/button/Button";
import { FeedbackRow } from "@/src/ui/feedback";
import { PressableSurface } from "@/src/ui/pressable-surface";

/**
 * Commissioning checklist — device-local progress in AsyncStorage.
 * Explicitly offline and account-free (repository decision): the installer's
 * ticks never leave the device.
 */

export default function ChecklistScreen() {
  const { locale } = useAcademy();
  const fa = locale === "fa";
  const [done, setDone] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    void AsyncStorage.getItem(storageKeys.commissioningChecklist)
      .then((raw) => {
        if (!active) return;
        try {
          const parsed: unknown = raw ? JSON.parse(raw) : [];
          if (Array.isArray(parsed)) setDone(new Set(parsed.filter((item): item is string => typeof item === "string")));
        } catch {
          setDone(new Set());
        }
      })
      .finally(() => {
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const persist = (next: Set<string>) => {
    void AsyncStorage.setItem(storageKeys.commissioningChecklist, JSON.stringify([...next])).catch(() => undefined);
  };

  const toggle = (id: string) => {
    // Never mutate before hydration: a tap during the read window would be
    // overwritten by the stored state and silently lost.
    if (!hydrated) return;
    const next = new Set(done);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setDone(next);
    persist(next);
  };

  const reset = () => {
    setDone(new Set());
    persist(new Set());
  };

  const percent = championCount(Math.round((done.size / commissioningSteps.length) * 100));

  return (
    <Screen back title={fa ? "چک‌لیست راه‌اندازی" : "Commissioning checklist"}>
      <View style={styles.header}>
        <Text style={[styles.title, localizedTextStyle(locale)]}>
          {fa ? `${toFaDigits(done.size)} از ${toFaDigits(commissioningSteps.length)} گام تیک خورد · ${toFaDigits(percent)}٪` : `${done.size} of ${commissioningSteps.length} done · ${percent}%`}
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.max(percent, 3)}%` }]} />
        </View>
      </View>

      {commissioningSteps.map((step) => {
        const checked = done.has(step.id);
        return (
          <PressableSurface
            key={step.id}
            onPress={() => toggle(step.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked }}
            style={[styles.row, localizedRow(locale), checked && styles.rowDone]}
          >
            <Ionicons
              name={checked ? "checkmark-circle" : "ellipse-outline"}
              size={22}
              color={checked ? theme.colors.success : theme.colors.borderSubtle}
            />
            <View style={styles.rowCopy}>
              <Text style={[styles.rowText, localizedTextStyle(locale), checked && styles.rowTextDone]}>{localize(step.text, locale)}</Text>
              <Text style={[styles.rowDetail, localizedTextStyle(locale)]}>{localize(step.detail, locale)}</Text>
              <View style={[styles.rowMeta, localizedRow(locale)]}>
                <Text style={styles.rowSource}>{`${fa ? "منبع" : "Source"}: ${step.source.fileName}, ${fa ? `صفحهٔ ${toFaDigits(step.source.page)}` : `p.${step.source.page}`}`}</Text>
                {step.safetyCritical ? (
                  <View style={styles.safetyTag}><Ionicons name="shield-checkmark-outline" size={10} color={theme.colors.warning} /><Text style={styles.safetyTagText}>{fa ? "ایمنی" : "Safety"}</Text></View>
                ) : null}
              </View>
            </View>
          </PressableSurface>
        );
      })}

      {hydrated && done.size > 0 ? (
        <Button variant="ghost" block label={fa ? "پاک‌کردن تمام تیک‌ها" : "Clear all ticks"} onPress={reset} style={{ marginTop: 18 }} trailing={<Ionicons name="refresh-outline" size={15} color={theme.colors.brandPrimary} />} />
      ) : null}

      <FeedbackRow context={fa ? "چک‌لیست راه‌اندازی" : "Commissioning checklist"} />
    </Screen>
  );
}

function championCount(n: number): number {
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}

const styles = StyleSheet.create({
  header: { paddingVertical: 16 },
  title: { color: theme.colors.brandPrimary, fontSize: 16, fontWeight: "800" },
  track: { height: 5, marginTop: 12, borderRadius: 99, backgroundColor: theme.colors.technical, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 99, backgroundColor: theme.colors.success },
  row: { overflow: "hidden", flexDirection: "row", alignItems: "flex-start", gap: 11, minHeight: 72, marginTop: 10, padding: 14, borderWidth: 1, borderColor: theme.colors.borderSubtle, borderRadius: theme.radii.control, backgroundColor: theme.colors.raised },
  rowDone: { borderColor: "rgba(47,111,85,.4)", backgroundColor: "#F7FBF8" },
  rowCopy: { flex: 1 },
  rowText: { color: theme.colors.brandPrimary, fontSize: 12, fontWeight: "700", lineHeight: 20 },
  rowTextDone: { color: theme.colors.success },
  rowDetail: { marginTop: 3, color: theme.colors.textSecondary, fontSize: 10, lineHeight: 17 },
  rowMeta: { alignItems: "center", gap: 8, marginTop: 7 },
  rowSource: { color: theme.colors.textSecondary, fontSize: 8, opacity: 0.85 },
  safetyTag: { overflow: "hidden", flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 100, backgroundColor: "#FFF7ED" },
  safetyTagText: { color: theme.colors.warning, fontSize: 8, fontWeight: "700" }
});