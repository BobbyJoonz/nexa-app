import { useState } from "react";
import { CircleCheck, CircleAlert, TriangleAlert, Wrench, ShieldCheck, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, GitBranch, Ellipsis } from "lucide-react-native";
import { Text, View } from "react-native";
import { localize, troubleshootTree, type TroubleshootDiagnosis, type TroubleshootQuestion } from "@nexa/product-content";
import { cn } from "@/src/ui/cn";
import { Button } from "@/src/ui/button/Button";
import { haptics } from "@/src/ui/haptics";
import { dirIcon } from "@/src/ui/direction";
import { PressableSurface } from "@/src/ui/pressable-surface";

const severityMeta = {
  safe: { color: "#2F6F55", en: "Safe user check", fa: "بررسی ایمن کاربر" },
  caution: { color: "#B54708", en: "Installer check required", fa: "نیازمند بررسی نصاب" },
  danger: { color: "#B42318", en: "Stop — hazard", fa: "توقف — خطر" }
} as const;

export function TroubleshootingFlow({ locale }: { locale: "fa" | "en" }) {
  const isFa = locale === "fa";
  const [path, setPath] = useState<string[]>([troubleshootTree.start]);
  const nodeId = path[path.length - 1] ?? troubleshootTree.start;
  const node = troubleshootTree.nodes[nodeId] ?? troubleshootTree.nodes[troubleshootTree.start];

  const go = (next: string) => {
    haptics.tap();
    if (!troubleshootTree.nodes[next]) return;
    setPath((prev) => [...prev, next]);
  };
  const back = () => {
    haptics.tap();
    setPath((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };
  const restart = () => {
    haptics.tap();
    setPath([troubleshootTree.start]);
  };

  const BackArrow = dirIcon(locale, ArrowLeft, ArrowRight);
  const ChevronIcon = dirIcon(locale, ChevronRight, ChevronLeft);

  if (!node) return null;
  return (
    <View className="gap-3">
      <View className={cn("flex-row items-center gap-1.5", isFa && "flex-row-reverse")}>
        <GitBranch size={13} color="#891525" />
        <Text className="text-[11px] tracking-[0.3px] text-accent" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
          {node.kind === "diagnosis"
            ? isFa ? "نتیجهٔ تشخیص" : "Diagnosis"
            : isFa ? `مرحله ${path.length} از درخت` : `Step ${path.length} of the tree`}
        </Text>
      </View>

      {node.kind === "question" ? <QuestionView node={node} locale={locale} onChoose={go} ChevronIcon={ChevronIcon} /> : <DiagnosisView node={node} locale={locale} onBack={back} onRestart={restart} />}

      {node.kind === "question" && path.length > 1 ? (
        <PressableSurface
          onPress={back}
          accessibilityRole="button"
          rippleColor="rgba(18,44,79,0.10)"
          className={cn("flex-row items-center justify-center gap-1.5 min-h-[44px] rounded-control border border-border bg-transparent", isFa && "flex-row-reverse")}
        >
          <BackArrow size={15} color="#5C6878" />
          <Text className="text-[13px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
            {isFa ? "گام قبل" : "Previous step"}
          </Text>
        </PressableSurface>
      ) : null}
    </View>
  );
}

function QuestionView({ node, locale, onChoose, ChevronIcon }: { node: TroubleshootQuestion; locale: "fa" | "en"; onChoose: (next: string) => void; ChevronIcon: React.ComponentType<{ size?: number; color?: string }> }) {
  const isFa = locale === "fa";
  return (
    <View className="rounded-panel border border-border bg-card p-4 gap-3">
      <Text className="text-[15px] font-semibold leading-[26px] text-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
        {localize(node.question, locale)}
      </Text>
      {node.hint ? (
        <Text className="text-[12px] leading-[21px] text-muted-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
          {localize(node.hint, locale)}
        </Text>
      ) : null}
      <View className="gap-2 mt-0.5">
        {node.choices.map((choice) => (
          <PressableSurface
            key={choice.id}
            onPress={() => onChoose(choice.next)}
            accessibilityRole="button"
            rippleColor="rgba(18,44,79,0.10)"
            className={cn("flex-row items-center min-h-[50px] overflow-hidden rounded-control border border-border bg-background px-3.5 py-3", isFa && "flex-row-reverse")}
          >
            <Text className="flex-1 text-[13px] leading-[21px] text-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
              {localize(choice.label, locale)}
            </Text>
            <ChevronIcon size={17} color="#891525" />
          </PressableSurface>
        ))}
      </View>
    </View>
  );
}

function DiagnosisView({ node, locale, onBack, onRestart }: { node: TroubleshootDiagnosis; locale: "fa" | "en"; onBack: () => void; onRestart: () => void }) {
  const isFa = locale === "fa";
  const meta = severityMeta[node.severity];
  const SeverityIcon = node.severity === "safe" ? CircleCheck : node.severity === "caution" ? CircleAlert : TriangleAlert;

  return (
    <View className="rounded-panel border border-border bg-card p-4 gap-3">
      <View className={cn("flex-row items-center gap-1.5 self-start rounded-full border border-border bg-background px-2.5 py-[5px]", isFa && "flex-row-reverse")}>
        <SeverityIcon size={16} color={meta.color} />
        <Text className="text-[11px] font-bold tracking-[0.2px]" style={{ color: meta.color }}>
          {isFa ? meta.fa : meta.en}
        </Text>
      </View>
      <Text className="text-[16px] font-bold leading-[26px] text-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
        {localize(node.problem, locale)}
      </Text>

      {node.causes.map((cause, index) => (
        <View key={`cause-${index}`} className={cn("flex-row items-start gap-2", isFa && "flex-row-reverse")}>
          <View className="w-[7px] h-[7px] rounded-full bg-muted-foreground mt-1.5" />
          <Text className="flex-1 text-[12px] leading-[21px] text-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
            {localize(cause, locale)}
          </Text>
        </View>
      ))}

      <View className="h-px bg-border" />

      <View className={cn("flex-row items-center gap-1.5", isFa && "flex-row-reverse")}>
        <Wrench size={14} color="#891525" />
        <Text className="text-[13px] font-bold text-accent" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
          {isFa ? "راه‌حل گام‌به‌گام" : "Step-by-step solution"}
        </Text>
      </View>
      {node.solution.map((step, index) => (
        <View key={`sol-${index}`} className={cn("flex-row items-start gap-2.5", isFa && "flex-row-reverse")}>
          <View className="h-[28px] w-[28px] items-center justify-center rounded-full bg-secondary">
            <Text className="text-[10px] font-bold text-primary">{String(index + 1).padStart(2, "0")}</Text>
          </View>
          <Text className="flex-1 text-[12px] leading-[21px] text-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
            {localize(step, locale)}
          </Text>
        </View>
      ))}

      {node.escalation ? (
        <View className={cn("flex-row items-start gap-2 p-3 rounded-control border border-[#B54708]/35 bg-[#B54708]/7", isFa && "flex-row-reverse")}>
          <ShieldCheck size={16} color="#B54708" />
          <Text className="flex-1 text-[12px] leading-[21px] text-warning" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
            {localize(node.escalation, locale)}
          </Text>
        </View>
      ) : null}

      <View className={cn("flex-row mt-1 gap-2.5", isFa && "flex-row-reverse")}>
        <Button variant="secondary" block label={isFa ? "گام قبل" : "Back"} onPress={onBack} style={{ flex: 1 }} />
        <Button variant="filled" block label={isFa ? "شروع دوباره" : "Start again"} onPress={onRestart} style={{ flex: 1 }} />
      </View>
    </View>
  );
}