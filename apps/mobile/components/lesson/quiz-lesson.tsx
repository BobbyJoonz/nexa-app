import { useState } from "react";
import { BookOpen, CircleCheck, ShieldCheck, Trophy } from "lucide-react-native";
import { Text, View } from "react-native";
import { localize, quizBank, type QuizQuestion } from "@nexa/product-content";
import { cn } from "@/src/ui/cn";
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
  const isFa = locale === "fa";
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
      <View className="rounded-panel border border-border bg-card p-4 items-center">
        <Trophy size={30} color={passed ? "#2F6F55" : "#891525"} />
        <Text className="mt-3 text-[18px] font-bold text-primary text-center" style={{ writingDirection: isFa ? "rtl" : "ltr" }}>
          {isFa ? "نتیجهٔ مرور" : "Review result"}
        </Text>
        <Text className="mt-1.5 text-[13px] text-muted-foreground text-center" style={{ writingDirection: isFa ? "rtl" : "ltr" }}>
          {`${isFa ? `${phase.correct} از ${phase.total} پاسخ درست` : `${phase.correct} of ${phase.total} correct`}`}
        </Text>
        <Text className="mt-2 text-[11px] leading-[19px] text-muted-foreground text-center" style={{ writingDirection: isFa ? "rtl" : "ltr" }}>
          {passed
            ? (isFa ? "درک خوبی داری؛ مرور دوره‌ای فراموشی را کم می‌کند." : "Solid understanding — periodic review keeps it sharp.")
            : (isFa ? "چند درس ایمنی/نصب را دوباره مرور کن، سپس دوباره امتحان کن." : "Revisit the safety/installation lessons, then try again.")}
        </Text>
        <Button variant={passed ? "secondary" : "filled"} block label={isFa ? "شروع دوباره" : "Restart"} onPress={restart} style={{ marginTop: 18 }} />
      </View>
    );
  }

  const question = phase.question;
  const answered = phase.state === "answered";
  const picked = answered ? phase.picked : null;

  return (
    <View>
      <Text className="text-[11px] text-muted-foreground mb-3" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
        {`${cursor + 1} / ${quizBank.length}`}
      </Text>
      <View className={cn("rounded-panel border border-border bg-card p-4", question.safetyCritical && "border-[#B54708]/40 bg-[#FFF7ED]")}>
        {question.safetyCritical ? (
          <View className="flex-row items-center gap-1 mb-3 rounded-full bg-[#FFF7ED] px-[9px] py-[5px] self-start">
            <ShieldCheck size={12} color="#B54708" />
            <Text className="text-[8px] font-bold text-warning">{isFa ? "ایمنی‌حیاتی" : "Safety critical"}</Text>
          </View>
        ) : null}
        <Text className="text-[14px] font-semibold leading-6 text-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
          {localize(question.question, locale)}
        </Text>

        <View className="mt-3 gap-2">
          {question.choices.map((choice, index) => {
            const isPicked = picked === index;
            const isCorrect = question.correctIndex === index;
            const isWrong = answered && isPicked && !isCorrect;
            return (
              <PressableSurface
                key={index}
                onPress={() => pick(index)}
                disabled={answered}
                accessibilityRole="button"
                className={cn(
                  "min-h-[44px] rounded-control border px-3.5 py-3 justify-center",
                  !answered && "border-border bg-card",
                  answered && isCorrect && "border-success bg-[#EEF8F2]",
                  answered && isWrong && "border-destructive bg-[#FFF1F0]",
                  answered && !isCorrect && !isPicked && "border-border bg-card opacity-50"
                )}
              >
                <Text className="text-[12px] text-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
                  {localize(choice, locale)}
                </Text>
              </PressableSurface>
            );
          })}
        </View>

        {answered && (
          <View>
            <View className={cn("flex-row items-start gap-2 mt-3.5 p-3 rounded-[8px]", question.correctIndex === picked ? "bg-[#EEF8F2]" : "bg-[#FFF1F0]")}>
              <Text className="flex-1 text-[11px] leading-[19px] text-foreground" style={{ writingDirection: isFa ? "rtl" : "ltr", textAlign: isFa ? "right" : "left" }}>
                {localize(question.explanation, locale)}
              </Text>
            </View>
            <Button variant="filled" block label={isFa ? "بعدی" : "Next"} onPress={next} style={{ marginTop: 14 }} />
          </View>
        )}
      </View>
    </View>
  );
}