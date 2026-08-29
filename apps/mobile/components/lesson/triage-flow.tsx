import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { localize, troubleshootTree, type TroubleshootDiagnosis, type TroubleshootQuestion } from "@nexa/product-content";
import { toFaDigits } from "@nexa/shared-logic";
import { localizedRow, localizedTextStyle, theme } from "@/theme";
import { Button } from "@/src/ui/button/Button";
import { haptics } from "@/src/ui/haptics";
import { dirIconName } from "@/src/ui/direction";
import { PressableSurface } from "@/src/ui/pressable-surface";

/**
 * Interactive troubleshooting — walks the shared troubleshootTree one
 * question at a time and ends in a severity-aware diagnosis. Fully
 * direction-aware: rows, text and chevrons mirror for Persian.
 */

const severityMeta: Record<TroubleshootDiagnosis["severity"], { icon: keyof typeof Ionicons.glyphMap; color: string; dot: string; fa: string; en: string }> = {
  safe: { icon: "shield-checkmark-outline", color: theme.colors.success, dot: "#2F6F55", fa: "بررسی ایمن کاربر", en: "Safe user check" },
  caution: { icon: "person-outline", color: theme.colors.warning, dot: "#B57808", fa: "نیازمند بررسی نصاب", en: "Installer check required" },
  danger: { icon: "warning-outline", color: theme.colors.danger, dot: "#B54708", fa: "توقف — خطر", en: "Stop — hazard" }
};

function QuestionView({ node, locale, onChoose }: { node: TroubleshootQuestion; locale: "fa" | "en"; onChoose: (next: string) => void }) {
  return (
    <View style={styles.panel}>
      <Ionicons name="git-network-outline" size={26} color={theme.colors.brandAccent} />
      <Text style={[styles.question, localizedTextStyle(locale)]}>{localize(node.question, locale)}</Text>
      {node.hint ? (
        <View style={[styles.hint, localizedRow(locale)]}>
          <Ionicons name="information-circle-outline" size={15} color={theme.colors.brandAccent} />
          <Text style={[styles.hintText, localizedTextStyle(locale)]}>{localize(node.hint, locale)}</Text>
        </View>
      ) : null}
      <View style={styles.choices}>
        {node.choices.map((choice) => (
          <PressableSurface style={[styles.choice, localizedRow(locale)]} onPress={() => onChoose(choice.next)} key={choice.id} accessibilityRole="button" accessibilityLabel={localize(choice.label, locale)}>
            <Text style={[styles.choiceText, localizedTextStyle(locale)]}>{localize(choice.label, locale)}</Text>
            <Ionicons name={dirIconName(locale, "chevron-forward", "chevron-back")} size={16} color={theme.colors.brandAccent} />
          </PressableSurface>
        ))}
      </View>
    </View>
  );
}

function DiagnosisView({ node, locale, onBack, onRestart }: { node: TroubleshootDiagnosis; locale: "fa" | "en"; onBack: () => void; onRestart: () => void }) {
  const meta = severityMeta[node.severity];
  return (
    <View style={styles.panel}>
      <Ionicons name={meta.icon} size={26} color={meta.color} />
      <View style={[styles.severity, localizedRow(locale)]}>
        <View style={[styles.severityDot, { backgroundColor: meta.dot }]} />
        <Text style={[styles.severityText, localizedTextStyle(locale)]}>{locale === "fa" ? meta.fa : meta.en}</Text>
      </View>
      <Text style={[styles.problem, localizedTextStyle(locale)]}>{localize(node.problem, locale)}</Text>

      <Text style={[styles.sectionTitle, localizedTextStyle(locale)]}>{locale === "fa" ? "علت‌های محتمل" : "Likely causes"}</Text>
      <View style={styles.details}>
        {node.causes.map((cause, index) => (
          <View style={[styles.bullet, localizedRow(locale)]} key={index}>
            <View style={styles.bulletDot} />
            <Text style={[styles.bulletText, localizedTextStyle(locale)]}>{localize(cause, locale)}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, localizedTextStyle(locale)]}>{locale === "fa" ? "اقدام‌ها" : "Actions"}</Text>
      <View style={styles.details}>
        {node.solution.map((sol, index) => (
          <View style={[styles.bullet, localizedRow(locale)]} key={index}>
            <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>{locale === "fa" ? toFaDigits(index + 1) : `${index + 1}`}</Text></View>
            <Text style={[styles.bulletText, localizedTextStyle(locale)]}>{localize(sol, locale)}</Text>
          </View>
        ))}
      </View>

      {node.escalation ? (
        <View style={[styles.escalation, localizedRow(locale)]}>
          <Ionicons name="hand-left-outline" size={16} color={theme.colors.warning} />
          <Text style={[styles.escalationText, localizedTextStyle(locale)]}>{localize(node.escalation, locale)}</Text>
        </View>
      ) : null}

      <Text style={[styles.source, localizedTextStyle(locale)]}>
        {locale === "fa" ? "مرجع: راهنمای آموزشی دستگاه" : "Reference: the device training guide"}
      </Text>

      <View style={styles.actions}>
        <Button variant="secondary" block label={locale === "fa" ? "گام قبل" : "Previous step"} onPress={onBack} style={{ marginTop: 18 }} />
        <Button variant="filled" block label={locale === "fa" ? "شروع دوباره" : "Start again"} onPress={onRestart} style={{ marginTop: 10 }} />
      </View>
    </View>
  );
}

export function TroubleshootingFlow({ locale }: { locale: "fa" | "en" }) {
  const [path, setPath] = useState<string[]>([troubleshootTree.start]);
  const node = troubleshootTree.nodes[path[path.length - 1] ?? troubleshootTree.start];

  const go = (next: string) => {
    haptics.tap();
    setPath((previous) => [...previous, next]);
  };
  const back = () => {
    haptics.tap();
    setPath((previous) => (previous.length > 1 ? previous.slice(0, -1) : previous));
  };
  const restart = () => {
    haptics.tap();
    setPath([troubleshootTree.start]);
  };

  if (!node) return null;

  return (
    <View style={styles.root}>
      <View style={[styles.crumb, localizedRow(locale)]}>
        <Ionicons name="git-branch-outline" size={13} color={theme.colors.brandAccent} />
        <Text style={[styles.crumbText, localizedTextStyle(locale)]}>
          {node.kind === "diagnosis"
            ? (locale === "fa" ? "نتیجهٔ تشخیص" : "Diagnosis")
            : (locale === "fa" ? `مرحله ${toFaDigits(path.length)} از درخت` : `Step ${path.length} of the tree`)}
        </Text>
      </View>

      {node.kind === "question" ? (
        <QuestionView node={node} locale={locale} onChoose={go} />
      ) : (
        <DiagnosisView node={node} locale={locale} onBack={back} onRestart={restart} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { minHeight: 420, paddingVertical: 4 },
  crumb: { alignItems: "center", gap: 6, marginBottom: 10 },
  crumbText: { color: theme.colors.textSecondary, fontSize: 10 },
  panel: { minHeight: 400, padding: 22, borderRadius: theme.radii.panel, backgroundColor: theme.colors.brandPrimary },
  question: { marginVertical: 22, color: "white", fontSize: 22, lineHeight: 36, fontWeight: "800" },
  hint: { alignItems: "flex-start", gap: 7, marginBottom: 16, padding: 11, borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,255,255,.14)", backgroundColor: "rgba(255,255,255,.06)" },
  hintText: { flex: 1, color: "rgba(255,255,255,.78)", fontSize: 10.5, lineHeight: 18 },
  choices: { marginTop: "auto", gap: 8 },
  choice: { alignItems: "center", justifyContent: "space-between", gap: 10, minHeight: 68, paddingHorizontal: 14, borderWidth: 1, borderColor: "rgba(255,255,255,.2)", borderRadius: theme.radii.control, backgroundColor: "rgba(255,255,255,.07)" },
  choiceText: { flex: 1, color: "white", fontSize: 11, lineHeight: 19 },
  severity: { alignItems: "center", gap: 7, alignSelf: "flex-start", marginTop: 18, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100, backgroundColor: "rgba(255,255,255,.09)" },
  severityDot: { width: 8, height: 8, borderRadius: 4 },
  severityText: { color: "white", fontSize: 10, fontWeight: "700" },
  problem: { marginTop: 14, color: "white", fontSize: 16, lineHeight: 28, fontWeight: "700" },
  sectionTitle: { marginTop: 22, color: "rgba(255,255,255,.62)", fontSize: 9.5, fontWeight: "800", letterSpacing: 0.6 },
  details: { marginTop: 8, gap: 7 },
  bullet: { alignItems: "flex-start", gap: 9 },
  bulletDot: { width: 5, height: 5, marginTop: 7, borderRadius: 3, backgroundColor: theme.colors.brandAccent },
  stepBadge: { width: 20, height: 20, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "rgba(255,255,255,.16)" },
  stepBadgeText: { color: "white", fontSize: 9, fontWeight: "700" },
  bulletText: { flex: 1, color: "rgba(255,255,255,.82)", fontSize: 11, lineHeight: 19 },
  escalation: { alignItems: "flex-start", gap: 8, marginTop: 20, padding: 12, borderWidth: 1, borderColor: "rgba(181,120,8,.5)", borderRadius: 10, backgroundColor: "rgba(181,120,8,.13)" },
  escalationText: { flex: 1, color: "#FFD98E", fontSize: 10.5, lineHeight: 18 },
  source: { marginTop: 18, color: "rgba(255,255,255,.45)", fontSize: 9 },
  actions: { marginTop: 4 }
});