import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { localize, troubleshootTree, type TroubleshootDiagnosis, type TroubleshootQuestion } from "@nexa/product-content";
import { localizedRow, localizedTextStyle, theme } from "@/theme";
import { Button } from "@/src/ui/button/Button";
import { haptics } from "@/src/ui/haptics";
import { dirIconName } from "@/src/ui/direction";
import { PressableSurface } from "@/src/ui/pressable-surface";

const severityMeta = {
  safe: { color: theme.colors.success, en: "Safe user check", fa: "بررسی ایمن کاربر" },
  caution: { color: theme.colors.caution, en: "Installer check required", fa: "نیازمند بررسی نصاب" },
  danger: { color: theme.colors.danger, en: "Stop — hazard", fa: "توقف — خطر" }
} as const;

export function TroubleshootingFlow({ locale }: { locale: "fa" | "en" }) {
  const [path, setPath] = useState<string[]>([troubleshootTree.start]);
  const nodeId = path[path.length - 1] ?? troubleshootTree.start;
  // Defensive: if the tree data ever breaks, fall back to the root question
  // instead of rendering a blank screen under the header.
  const node = troubleshootTree.nodes[nodeId] ?? troubleshootTree.nodes[troubleshootTree.start];

  const go = (next: string) => {
    haptics.tap();
    // Defensive: a stale/future data error must never dead-end the flow.
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

  if (!node) return null;
  return (
    <View style={styles.root}>
      <View style={[styles.crumb, localizedRow(locale)]}>
        <Ionicons name="git-branch-outline" size={13} color={theme.colors.brandAccent} />
        <Text style={[styles.crumbText, localizedTextStyle(locale)]}>
          {node.kind === "diagnosis"
            ? locale === "fa" ? "نتیجهٔ تشخیص" : "Diagnosis"
            : locale === "fa" ? `مرحله ${path.length} از درخت` : `Step ${path.length} of the tree`}
        </Text>
      </View>

      {node.kind === "question" ? <QuestionView node={node} locale={locale} onChoose={go} /> : <DiagnosisView node={node} locale={locale} onBack={back} onRestart={restart} />}

      {node.kind === "question" && path.length > 1 ? (
        <PressableSurface style={[styles.backRow, localizedRow(locale)]} onPress={back} accessibilityRole="button" rippleColor="rgba(18,44,79,0.10)">
          <Ionicons name={dirIconName(locale, "arrow-back", "arrow-forward")} size={15} color={theme.colors.textSecondary} />
          <Text style={[styles.backRowText, localizedTextStyle(locale)]}>{locale === "fa" ? "گام قبل" : "Previous step"}</Text>
        </PressableSurface>
      ) : null}
    </View>
  );
}

function QuestionView({ node, locale, onChoose }: { node: TroubleshootQuestion; locale: "fa" | "en"; onChoose: (next: string) => void }) {
  return (
    <View style={styles.card}>
      <Text style={[styles.question, localizedTextStyle(locale)]}>{localize(node.question, locale)}</Text>
      {node.hint ? <Text style={[styles.hint, localizedTextStyle(locale)]}>{localize(node.hint, locale)}</Text> : null}
      <View style={styles.choices}>
        {node.choices.map((choice) => (
          <PressableSurface
            style={[styles.choice, localizedRow(locale)]}
            onPress={() => onChoose(choice.next)}
            key={choice.id}
            accessibilityRole="button"
            rippleColor="rgba(18,44,79,0.10)"
          >
            <Text style={[styles.choiceText, localizedTextStyle(locale)]}>{localize(choice.label, locale)}</Text>
            <Ionicons name={dirIconName(locale, "chevron-forward", "chevron-back")} size={17} color={theme.colors.brandAccent} />
          </PressableSurface>
        ))}
      </View>
    </View>
  );
}

function DiagnosisView({ node, locale, onBack, onRestart }: { node: TroubleshootDiagnosis; locale: "fa" | "en"; onBack: () => void; onRestart: () => void }) {
  const meta = severityMeta[node.severity];
  return (
    <View style={styles.card}>
      <View style={[styles.severity, localizedRow(locale)]}>
        <Ionicons name={node.severity === "safe" ? "checkmark-circle" : node.severity === "caution" ? "alert-circle" : "warning"} size={16} color={meta.color} />
        <Text style={[styles.severityText, { color: meta.color }, localizedTextStyle(locale)]}>{locale === "fa" ? meta.fa : meta.en}</Text>
      </View>
      <Text style={[styles.problemTitle, localizedTextStyle(locale)]}>{localize(node.problem, locale)}</Text>

      {node.causes.map((cause, index) => (
        <View style={[styles.row, localizedRow(locale)]} key={`cause-${index}`}>
          <Ionicons name="ellipse" size={7} color={theme.colors.textSecondary} />
          <Text style={[styles.rowText, localizedTextStyle(locale)]}>{localize(cause, locale)}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      <View style={[styles.sectionLabel, localizedRow(locale)]}>
        <Ionicons name="construct-outline" size={14} color={theme.colors.brandAccent} />
        <Text style={[styles.sectionLabelText, localizedTextStyle(locale)]}>{locale === "fa" ? "راه‌حل گام‌به‌گام" : "Step-by-step solution"}</Text>
      </View>
      {node.solution.map((step, index) => (
        <View style={[styles.row, localizedRow(locale), styles.stepRow]} key={`sol-${index}`}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{String(index + 1).padStart(2, "0")}</Text>
          </View>
          <Text style={[styles.rowText, localizedTextStyle(locale)]}>{localize(step, locale)}</Text>
        </View>
      ))}

      {node.escalation ? (
        <View style={[styles.escalation, localizedRow(locale)]}>
          <Ionicons name="shield-checkmark-outline" size={16} color={theme.colors.warning} />
          <Text style={[styles.escalationText, localizedTextStyle(locale)]}>{localize(node.escalation, locale)}</Text>
        </View>
      ) : null}

      <View style={[styles.actions, localizedRow(locale)]}>
        <Button variant="secondary" block label={locale === "fa" ? "گام قبل" : "Back"} onPress={onBack} style={{ flex: 1 }} />
        <View style={{ width: 10 }} />
        <Button variant="filled" block label={locale === "fa" ? "شروع دوباره" : "Start again"} onPress={onRestart} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 12 },
  crumb: { alignItems: "center", gap: 6 },
  crumbText: { color: theme.colors.brandAccent, fontSize: 11, letterSpacing: 0.3 },
  card: { backgroundColor: theme.colors.raised, borderRadius: theme.radii.panel, padding: 16, gap: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.borderSubtle },
  question: { color: theme.colors.textPrimary, fontSize: 15, lineHeight: 26, fontWeight: "600" },
  hint: { color: theme.colors.textSecondary, fontSize: 12, lineHeight: 21 },
  choices: { gap: 8, marginTop: 2 },
  choice: { alignItems: "center", minHeight: 50, paddingHorizontal: 14, paddingVertical: 12, borderRadius: theme.radii.control, backgroundColor: theme.colors.canvas, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.borderSubtle, overflow: "hidden" },
  choiceText: { flex: 1, color: theme.colors.textPrimary, fontSize: 13, lineHeight: 21 },
  backRow: { alignItems: "center", justifyContent: "center", gap: 6, minHeight: 44, borderRadius: theme.radii.control, backgroundColor: "transparent", borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.borderSubtle },
  backRowText: { color: theme.colors.textSecondary, fontSize: 13 },
  severity: { alignItems: "center", gap: 6, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: theme.radii.pill, backgroundColor: theme.colors.canvas, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.colors.borderSubtle },
  severityText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.2 },
  problemTitle: { color: theme.colors.textPrimary, fontSize: 16, lineHeight: 26, fontWeight: "700" },
  row: { alignItems: "flex-start", gap: 8 },
  rowText: { flex: 1, color: theme.colors.textPrimary, fontSize: 12, lineHeight: 21 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.borderSubtle },
  sectionLabel: { alignItems: "center", gap: 6 },
  sectionLabelText: { color: theme.colors.brandAccent, fontSize: 13, fontWeight: "700" },
  stepRow: { gap: 10 },
  stepBadge: { width: 28, height: 28, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: theme.colors.technical },
  stepBadgeText: { color: theme.colors.brandPrimary, fontSize: 10, fontWeight: "700" },
  escalation: { alignItems: "flex-start", gap: 8, padding: 12, borderRadius: theme.radii.control, backgroundColor: "rgba(181,71,8,0.07)", borderWidth: StyleSheet.hairlineWidth, borderColor: "rgba(181,71,8,0.35)" },
  escalationText: { flex: 1, color: theme.colors.warning, fontSize: 12, lineHeight: 21 },
  actions: { marginTop: 4 }
});