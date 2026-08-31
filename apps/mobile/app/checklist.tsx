import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Circle, CircleCheck, RefreshCw, ShieldCheck } from "lucide-react-native";
import { Text, View } from "react-native";
import { commissioningSteps, localize } from "@nexa/product-content";
import { storageKeys } from "@nexa/shared-logic";
import { Screen } from "@/components/screen";
import { useAcademy } from "@/providers/academy-provider";
import { Button } from "@/src/ui/button/Button";
import { cn } from "@/src/ui/cn";
import { FeedbackRow } from "@/src/ui/feedback";
import { PressableSurface } from "@/src/ui/pressable-surface";

/**
 * Commissioning checklist — device-local progress in AsyncStorage.
 * Explicitly offline and account-free (repository decision): the installer's
 * ticks never leave the device.
 */

export default function ChecklistScreen() {
  const { locale } = useAcademy();
  const isFa = locale === "fa";
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
    <Screen back title={isFa ? "چک‌لیست راه‌اندازی" : "Commissioning checklist"}>
      <View className="py-4">
        <Text className="text-[16px] font-bold text-primary" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
          {isFa ? `${done.size} از ${commissioningSteps.length} گام تیک خورد · ${percent}٪` : `${done.size} of ${commissioningSteps.length} done · ${percent}%`}
        </Text>
        <View className="mt-3 h-[5px] overflow-hidden rounded-full bg-secondary">
          <View className="h-full rounded-full bg-success" style={{ width: `${Math.max(percent, 3)}%` }} />
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
            className={cn(
              "mt-2.5 min-h-[72px] flex-row items-start gap-[11px] rounded-control border border-border bg-card p-3.5",
              checked && "border-[#2F6F55]/40 bg-[#F7FBF8]"
            )}
            style={{ borderRadius: 14 }}
          >
            {checked ? <CircleCheck size={22} color="#2F6F55" /> : <Circle size={22} color="#CCD5DE" />}
            <View className="flex-1">
              <Text className={cn("text-[12px] font-bold leading-5 text-primary", checked && "text-success")} style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
                {localize(step.text, locale)}
              </Text>
              <Text className="mt-[3px] text-[10px] leading-[17px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
                {localize(step.detail, locale)}
              </Text>
              <View className={cn("mt-[7px] flex-row items-center gap-2", isFa && "flex-row-reverse")}>
                {step.safetyCritical ? (
                  <View className="flex-row items-center gap-1 overflow-hidden rounded-full bg-[#FFF7ED] px-[7px] py-[3px]">
                    <ShieldCheck size={10} color="#B54708" />
                    <Text className="text-[8px] font-bold text-warning">{isFa ? "ایمنی" : "Safety"}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </PressableSurface>
        );
      })}

      {hydrated && done.size > 0 ? (
        <Button variant="ghost" block label={isFa ? "پاک‌کردن تمام تیک‌ها" : "Clear all ticks"} onPress={reset} style={{ marginTop: 18 }} trailing={<RefreshCw size={15} color="#122C4F" />} />
      ) : null}

      <FeedbackRow context={isFa ? "چک‌لیست راه‌اندازی" : "Commissioning checklist"} />
    </Screen>
  );
}

function championCount(n: number): number {
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}