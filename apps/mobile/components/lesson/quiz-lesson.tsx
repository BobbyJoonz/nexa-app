import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { localize, quizBank, type QuizQuestion } from "@nexa/product-content";
import { theme } from "@/theme";
import { Button } from "@/src/ui/button/Button";
import { PressableSurface } from "@/src/ui/pressable-surface";

/**
 * Knowledge check — sourced question bank, one question at a time.
 * Answering reveals an explanation with its manual page; the concept of
 * "safe answer first, escalate" stays central (docs/ARCHITECTURE safety).
 * No score persistence: review is for learning, not for gamification.
 */

type Phase = { state: "question"; question: QuizQuestion } | { state: "answered"; question: QuizQuestion; picked: number } | { state: "done"; correct: number; total: number };

export function QuizLesson({ locale }: { locale: "fa" | "en" }) {
  const fa = locale === "fa";
  const [cursor, setCursor] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<Phase>({ state: "question", question: quizBank[0]! });

  const restart = () => {
    setCursor(0);
    setCorrectCount(0);
    setPhase({ state: "question", question: quizBank[0]! });
  };

  const pick = (picked: number) => {
    if (phase.state !== "question") return;
    if (picked === phase.question.correctIndex) setCorrectCount((n) => n + 1);
    setPhase({ state: "answered", question: phase.question, picked });
  };

  const next = () => {
    if (phase.state !== "answered") return;
    const nextCursor = cursor + 1;
    if (nextCursor >= quizBank.length) {
      setPhase({ state: "done", correct: correctCount, total: quizBank.length });
      return;
    }
    setCursor(nextCursor);
    setPhase({ state: "question", question: quizBank[nextCursor]! });
  };

  if (phase.state === "done") {
    const passed = phase.correct >= phase.total * 0.7;
    return (
      <View style={styles.card}>
        <Ionicons name={passed ? "trophy-outline" : "book-outline"} size={30} color={passed ? theme.colors.success : theme.colors.brandAccent} />
        <Text style={[styles.doneTitle, fa ? styles.rtl : null]}>{fa ? "نتیجهٔ مرور" : "Review result"}</Text>
        <Text style={[styles.doneBody, fa ? styles.rtl : null]}>{`${fa ? `${phase.correct} از ${phase.total} پاسخ درست` : `${phase.correct} of ${phase.total} correct`}`}</Text>
        <Text style={[styles.doneHint, fa ? styles.rtl : null]}>
          {passed
            ? (fa ? "درک خوبی داری؛ مرور دوره‌ای فراموشی را کم می‌کند." : "Solid understanding — periodic review keeps it sharp.")
            : (fa ? "چند درس ایمنی/نصب را دوباره مرور کن، سپس دوباره امتحان کن." : "Revisit the safety/installation lessons, then try again.")}
        </Text>
        <Button variant={passed ? "secondary" : "filled"} block label={fa ? "شروع دوباره" : "Restart"} onPress={restart} style={{ marginTop: 18 }} />
      </View>
    );
  }

  const question = phase.question;
  const answered = phase.state === "answered";
  const picked = answered ? phase.picked : null;

  return (
    <View>
      <Text style={[styles.progress, fa ? styles.rtl : null]}>{`${cursor + 1} / ${quizBank.length}`}</Text>
      <View style={[styles.card, question.safetyCritical && styles.cardSafety]}>
        {question.safetyCritical ? (
          <View style={styles.safetyBadge}><Ionicons name="shield-checkmark-outline" size={12} color={theme.colors.warning} /><Text style={styles.safetyBadgeText}>{fa ? "ایمنی‌حیاتی" : "Safety critical"}</Text></View>
        ) : null}
        <Text style={[styles.question, fa ? styles.rtl : null]}>{localize(question.question, locale)}</Text>

        {question.choices.map((choice, i) => {
          const isCorrect = i === question.correctIndex;
          const isPicked = i === picked;
          const tone = !answered ? "idle" : isCorrect ? "correct" : isPicked ? "wrong" : "idle";
          return (
            <PressableSurface
              key={i}
              onPress={() => pick(i)}
              disabled={answered}
              accessibilityRole="button"
              style={[styles.choice, tone !== "idle" && styles[tone]]}
            >
              <Text style={[styles.choiceText, fa ? styles.rtl : null, tone !== "idle" && styles.choiceTextStrong]}>{localize(choice, locale)}</Text>
              {answered && isCorrect ? <Ionicons name="checkmark-circle" size={17} color={theme.colors.success} /> : null}
              {answered && isPicked && !isCorrect ? <Ionicons name="close-circle" size={17} color={theme.colors.danger} /> : null}
            </PressableSurface>
          );
        })}

        {answered && phase.state === "answered" ? (
          <View style={[styles.feedback, picked === question.correctIndex ? styles.feedbackGood : styles.feedbackBad]}>
            <Ionicons name={picked === question.correctIndex ? "checkmark-circle-outline" : "alert-circle-outline"} size={17} color={picked === question.correctIndex ? theme.colors.success : theme.colors.danger} />
            <Text style={[styles.feedbackText, fa ? styles.rtl : null]}>
              {localize(question.explanation, locale)}
            </Text>
          </View>
        ) : null}

        </View>

      {answered && phase.state === "answered" ? (
        <Button variant="secondary" block label={fa ? "سؤال بعدی" : "Next question"} onPress={next} style={{ marginTop: 16 }} />
      ) : null}

      <Text style={[styles.intro, fa ? styles.rtl : null]}>
        {fa
          ? "پرسش‌ها بر پایهٔ محتوای تأییدشدهٔ درس‌ها هستند."
          : "Questions are based on the verified lesson content."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progress: { color: theme.colors.brandAccent, fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 8 },
  card: { padding: 18, borderWidth: 1, borderColor: theme.colors.borderSubtle, borderRadius: theme.radii.panel, backgroundColor: theme.colors.raised, ...theme.shadow },
  cardSafety: { borderTopWidth: 3, borderTopColor: theme.colors.warning },
  safetyBadge: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 100, backgroundColor: "#FFF7ED" },
  safetyBadgeText: { color: theme.colors.warning, fontSize: 9, fontWeight: "700" },
  question: { color: theme.colors.brandPrimary, fontSize: 16, lineHeight: 27, fontWeight: "800" },
  choice: { overflow: "hidden", flexDirection: "row", alignItems: "center", gap: 9, minHeight: 48, marginTop: 10, paddingHorizontal: 14, borderRadius: theme.radii.control, borderWidth: 1, borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.raised },
  choiceText: { flex: 1, color: theme.colors.textPrimary, fontSize: 12, lineHeight: 20 },
  choiceTextStrong: { fontWeight: "700" },
  correct: { borderColor: theme.colors.success, backgroundColor: "#EEF8F2" },
  wrong: { borderColor: theme.colors.danger, backgroundColor: "#FFF1F0" },
  feedback: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 14, padding: 12, borderRadius: 8 },
  feedbackGood: { backgroundColor: "#EEF8F2" },
  feedbackBad: { backgroundColor: "#FFF1F0" },
  feedbackText: { flex: 1, color: theme.colors.textPrimary, fontSize: 11, lineHeight: 19 },
  doneTitle: { marginTop: 12, color: theme.colors.brandPrimary, fontSize: 18, fontWeight: "800", textAlign: "center" },
  doneBody: { marginTop: 6, color: theme.colors.textSecondary, fontSize: 13, textAlign: "center" },
  doneHint: { marginTop: 8, color: theme.colors.textSecondary, fontSize: 11, lineHeight: 19, textAlign: "center" },
  intro: { marginTop: 16, color: theme.colors.textSecondary, fontSize: 10, lineHeight: 17, textAlign: "center" },
  rtl: { writingDirection: "rtl" }
});