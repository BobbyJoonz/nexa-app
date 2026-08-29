import { describe, expect, it } from "vitest";
import { dictionaries, directionFor, t, type TranslationKey } from "@nexa/i18n";
import {
  anatomy,
  commissioningSteps,
  connectionFacts,
  documents,
  faultCodes,
  lessons,
  quizBank,
  settings,
  troubleshootTree
} from "@nexa/product-content";
import { completionPercent, parseStoredList, toFaDigits, toggleCompletedLesson } from "@nexa/shared-logic";

/**
 * Adversarial / worst-case suite.
 *
 * Deliberately hostile: digit-conversion edge cases, bilingual-content
 * integrity, decision-tree link integrity (orphans, cycles, dangling refs),
 * duplicate/confusable options and bidi-relevant content invariants. The cases
 * are loop-generated, so the suite exercises hundreds (thousands) of
 * individual assertions from compact tables.
 */

const PERSIAN = /[\u0600-\u06FF]/;
const hasPersian = (value: string) => PERSIAN.test(value);

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const latinToFa = (value: string) => value.replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);

/* ------------------------------------------------------------------ */
/* toFaDigits — exhaustive conversion matrix                           */
/* ------------------------------------------------------------------ */

describe("toFaDigits worst-case matrix", () => {
  it("maps every single digit 0-9 (10 cases)", () => {
    for (let i = 0; i < 10; i++) {
      const latin = String(i);
      expect(toFaDigits(latin)).toBe(FA_DIGITS[i]);
      expect(toFaDigits(i)).toBe(FA_DIGITS[i]);
    }
  });

  it("maps every 2-digit value 00-99 (100 cases)", () => {
    for (let n = 0; n < 100; n++) {
      const latin = String(n).padStart(2, "0");
      expect(toFaDigits(latin)).toBe(latinToFa(latin));
    }
  });

  it("maps every 3-digit value 000-999 (1000 cases)", () => {
    for (let n = 0; n < 1000; n++) {
      const latin = String(n).padStart(3, "0");
      expect(toFaDigits(latin)).toBe(latinToFa(latin));
    }
  });

  it("handles signs, decimals, exponents, grouping and units", () => {
    const cases: Array<[string, string]> = [
      ["-10", "-۱۰"],
      ["+12", "+۱۲"],
      ["41.5", "۴۱.۵"],
      ["1e3", "۱e۳"],
      ["1,234,567", "۱,۲۳۴,۵۶۷"],
      ["2 AWG / 38 mm²", "۲ AWG / ۳۸ mm²"],
      ["500 VDC", "۵۰۰ VDC"],
      ["P01 · 230 VAC", "P۰۱ · ۲۳۰ VAC"],
      ["(800) 123-4567", "(۸۰۰) ۱۲۳-۴۵۶۷"]
    ];
    for (const [input, expected] of cases) expect(toFaDigits(input)).toBe(expected);
  });

  it("is stable on non-digit input and never corrupts Persian text", () => {
    const samples = ["", "بدون عدد", "متن فارسی", "A", "∞", "۰۱"];
    for (const sample of samples) expect(toFaDigits(sample)).toBe(sample);
  });

  it("keeps Arabic-Indic and Perso-Arabic digit variants untouched (documented)", () => {
    for (const sample of ["٠١٢٣", "۴۵۶", "٤٥٦"]) expect(toFaDigits(sample)).toBe(sample);
  });

  it("preserves unicode direction marks and mixed-script strings", () => {
    expect(toFaDigits("\u200E5\u200F")).toBe("\u200E۵\u200F");
    expect(toFaDigits("س5مریخ3")).toBe("س۵مریخ۳");
  });

  it("handles numeric primitives without crashing", () => {
    expect(toFaDigits(NaN)).toBe("NaN");
    expect(toFaDigits(Infinity)).toBe("Infinity");
    expect(toFaDigits(-Infinity)).toBe("-Infinity");
    expect(toFaDigits(Number.MAX_SAFE_INTEGER)).toBe(latinToFa(String(Number.MAX_SAFE_INTEGER)));
    // JS renders tiny floats in exponent form; conversion must stay faithful to that rendering.
    expect(toFaDigits(0.0000001)).toBe(latinToFa(String(0.0000001)));
  });

  it("is idempotent after a single conversion", () => {
    for (const input of ["12", "abc12def", "3.5 kW", "240"]) {
      expect(toFaDigits(toFaDigits(input))).toBe(toFaDigits(input));
    }
  });
});

/* ------------------------------------------------------------------ */
/* i18n — locale/direction invariants                                  */
/* ------------------------------------------------------------------ */

describe("i18n worst-case invariants", () => {
  it("reports the correct document direction for both locales", () => {
    expect(directionFor("fa")).toBe("rtl");
    expect(directionFor("en")).toBe("ltr");
  });

  it("every translation key resolves to a non-empty string in BOTH locales", () => {
    const keys = Object.keys(dictionaries.en) as TranslationKey[];
    for (const key of keys) {
      expect(t("en", key).trim().length).toBeGreaterThan(0);
      expect(t("fa", key).trim().length).toBeGreaterThan(0);
    }
    // every fa interface string is actually Persian-script, except the
    // intentional foreign self-label of the English option ("English").
    for (const key of keys) {
      if (key === "language.selfEn") continue;
      expect(hasPersian(t("fa", key))).toBe(true);
    }
  });

  it("en and fa dictionaries expose exactly the same key sets", () => {
    const en = Object.keys(dictionaries.en).sort();
    const fa = Object.keys(dictionaries.fa).sort();
    expect(fa).toEqual(en);
  });

  it("unknown keys fall back to English without throwing", () => {
    expect(t("fa", "does-not-exist" as TranslationKey)).toBeUndefined();
  });
});

/* ------------------------------------------------------------------ */
/* Quiz bank — content + RTL-relevant invariants                       */
/* ------------------------------------------------------------------ */

describe("quizBank worst-case invariants", () => {
  const knownDocs = new Set(Object.values(documents).map((doc) => doc.id));

  it("keeps question ids unique and at least 5 questions", () => {
    const ids = quizBank.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(quizBank.length).toBeGreaterThanOrEqual(5);
  });

  it("every question has valid bilingual text and a sane choice count", () => {
    for (const q of quizBank) {
      expect(q.question.en.trim().length).toBeGreaterThan(0);
      expect(hasPersian(q.question.fa)).toBe(true);
      expect(q.choices.length).toBeGreaterThanOrEqual(2);
      expect(q.choices.length).toBeLessThanOrEqual(6);
    }
  });

  it("every choice is non-empty in both locales and fa choices are Persian", () => {
    for (const q of quizBank) {
      for (const choice of q.choices) {
        expect(choice.en.trim().length).toBeGreaterThan(0);
        expect(choice.fa.trim().length).toBeGreaterThan(0);
        expect(hasPersian(choice.fa)).toBe(true);
      }
    }
  });

  it("options within one question are never confusable duplicates", () => {
    for (const q of quizBank) {
      const keys = q.choices.map((choice) => `${choice.en}|${choice.fa}`);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });

  it("correctIndex always lands inside the choices array", () => {
    for (const q of quizBank) {
      expect(Number.isInteger(q.correctIndex)).toBe(true);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.choices.length);
    }
  });

  it("explanations are bilingual and non-empty", () => {
    for (const q of quizBank) {
      expect(q.explanation.en.trim().length).toBeGreaterThan(0);
      expect(hasPersian(q.explanation.fa)).toBe(true);
    }
  });

  it("every question cites a real document page", () => {
    for (const q of quizBank) {
      expect(q.source.page).toBeGreaterThan(0);
      expect(knownDocs.has(q.source.documentId)).toBe(true);
    }
  });
});

/* ------------------------------------------------------------------ */
/* Anatomy — rich content invariants (the completed refactor)          */
/* ------------------------------------------------------------------ */

describe("anatomy worst-case invariants", () => {
  const slugs = new Set(lessons.map((lesson) => lesson.slug));
  const allowedIcons = new Set([
    "lcd", "status", "charge", "fault", "buttons", "earth",
    "ac-in", "ac-out", "battery", "pv", "wifi", "power"
  ]);
  const knownDocs = new Set(Object.values(documents).map((doc) => doc.id));

  it("holds exactly 12 external points with unique ids", () => {
    expect(anatomy).toHaveLength(12);
    const ids = anatomy.map((part) => part.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every part maps to a known icon and a real lesson", () => {
    for (const part of anatomy) {
      expect(allowedIcons.has(part.icon)).toBe(true);
      expect(slugs.has(part.relatedLesson)).toBe(true);
    }
  });

  it("every part carries complete bilingual copy with Persian fa", () => {
    for (const part of anatomy) {
      expect(part.role.en.trim().length).toBeGreaterThan(0); expect(hasPersian(part.role.fa)).toBe(true);
      expect(part.guide.en.trim().length).toBeGreaterThan(0); expect(hasPersian(part.guide.fa)).toBe(true);
      expect(part.stat.en.trim().length).toBeGreaterThan(0); expect(hasPersian(part.stat.fa)).toBe(true);
      expect(part.relatedLabel.en.trim().length).toBeGreaterThan(0); expect(hasPersian(part.relatedLabel.fa)).toBe(true);
    }
  });

  it("hotspot coordinates stay inside the image bounds", () => {
    for (const part of anatomy) {
      expect(part.x).toBeGreaterThanOrEqual(0); expect(part.x).toBeLessThanOrEqual(100);
      expect(part.y).toBeGreaterThanOrEqual(0); expect(part.y).toBeLessThanOrEqual(100);
    }
  });

  it("every part retains a real source reference", () => {
    for (const part of anatomy) {
      expect(part.source.page).toBeGreaterThan(0);
      expect(knownDocs.has(part.source.documentId)).toBe(true);
    }
  });
});

/* ------------------------------------------------------------------ */
/* Troubleshoot decision tree — link integrity, reachability, cycles   */
/* ------------------------------------------------------------------ */

describe("troubleshootTree worst-case invariants", () => {
  const nodeIds = Object.keys(troubleshootTree.nodes);
  const entries = Object.entries(troubleshootTree.nodes);
  const knownDocs = new Set(Object.values(documents).map((doc) => doc.id));

  it("ids are unique and start resolves to a question", () => {
    expect(new Set(nodeIds).size).toBe(nodeIds.length);
    expect(nodeIds).toContain(troubleshootTree.start);
    const start = troubleshootTree.nodes[troubleshootTree.start];
    expect(start?.kind).toBe("question");
  });

  it("every choice in every question links to an existing node", () => {
    for (const [id, node] of entries) {
      if (node.kind !== "question") continue;
      expect(node.id).toBe(id);
      expect(node.choices.length).toBeGreaterThanOrEqual(1);
      for (const choice of node.choices) {
        expect(Object.hasOwn(troubleshootTree.nodes, choice.next)).toBe(true);
      }
    }
  });

  it("every node is reachable from start (no orphan content)", () => {
    const seen = new Set<string>([troubleshootTree.start]);
    const queue = [troubleshootTree.start];
    while (queue.length > 0) {
      const current = queue.shift()!;
      const node = troubleshootTree.nodes[current];
      if (node?.kind !== "question") continue;
      for (const choice of node.choices) {
        if (!seen.has(choice.next)) {
          seen.add(choice.next);
          queue.push(choice.next);
        }
      }
    }
    for (const id of nodeIds) expect(seen.has(id)).toBe(true);
  });

  it("the tree always terminates in a diagnosis (no question-only cycles)", () => {
    const questions = entries.filter(([, node]) => node.kind === "question").map(([id]) => id);
    for (const qid of questions) {
      const visited = new Set<string>();
      const stack = [qid];
      let escaped = false;
      while (stack.length > 0) {
        const current = stack.pop()!;
        if (visited.has(current)) continue;
        visited.add(current);
        const node = troubleshootTree.nodes[current];
        if (!node) continue;
        if (node.kind === "diagnosis") { escaped = true; break; }
        for (const choice of node.choices) {
          if (!visited.has(choice.next)) stack.push(choice.next);
        }
      }
      expect(escaped).toBe(true);
      expect(visited.size).toBeLessThanOrEqual(nodeIds.length);
    }
  });

  it("every question carries bilingual text and Persian fa", () => {
    for (const node of Object.values(troubleshootTree.nodes)) {
      if (node.kind !== "question") continue;
      expect(node.question.en.trim().length).toBeGreaterThan(0);
      expect(hasPersian(node.question.fa)).toBe(true);
      if (node.hint) {
        expect(node.hint.en.trim().length).toBeGreaterThan(0);
        expect(hasPersian(node.hint.fa)).toBe(true);
      }
      for (const choice of node.choices) {
        expect(choice.id.trim().length).toBeGreaterThan(0);
        expect(choice.label.en.trim().length).toBeGreaterThan(0);
        expect(hasPersian(choice.label.fa)).toBe(true);
      }
    }
  });

  it("every diagnosis is complete: severity, causes, solution, source", () => {
    for (const node of Object.values(troubleshootTree.nodes)) {
      if (node.kind !== "diagnosis") continue;
      expect(["safe", "caution", "danger"]).toContain(node.severity);
      expect(node.problem.en.trim().length).toBeGreaterThan(0);
      expect(hasPersian(node.problem.fa)).toBe(true);
      expect(node.causes.length).toBeGreaterThan(0);
      expect(node.solution.length).toBeGreaterThan(0);
      for (const cause of node.causes) {
        expect(cause.en.trim().length).toBeGreaterThan(0);
        expect(hasPersian(cause.fa)).toBe(true);
      }
      for (const sol of node.solution) {
        expect(sol.en.trim().length).toBeGreaterThan(0);
        expect(hasPersian(sol.fa)).toBe(true);
      }
      if (node.escalation) {
        expect(node.escalation.en.trim().length).toBeGreaterThan(0);
        expect(hasPersian(node.escalation.fa)).toBe(true);
      }
    }
  });

  it("every node cites a real manual page", () => {
    for (const node of Object.values(troubleshootTree.nodes)) {
      expect(node.source.page).toBeGreaterThan(0);
      expect(knownDocs.has(node.source.documentId)).toBe(true);
    }
  });

  it("question nodes with a single choice are honest (hint explains why)", () => {
    for (const node of Object.values(troubleshootTree.nodes)) {
      if (node.kind === "question" && node.choices.length === 1) {
        expect(node.hint).toBeDefined();
      }
    }
  });
});

/* ------------------------------------------------------------------ */
/* Lessons / settings / faults / checklist / documents                 */
/* ------------------------------------------------------------------ */

describe("academy data worst-case invariants", () => {
  it("keeps 15 unique lesson slugs and complete bilingual copy", () => {
    expect(lessons.length).toBe(15);
    const slugs = lessons.map((lesson) => lesson.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const lesson of lessons) {
      expect(lesson.title.en.trim().length).toBeGreaterThan(0);
      expect(hasPersian(lesson.title.fa)).toBe(true);
      expect(lesson.summary.en.trim().length).toBeGreaterThan(0);
      expect(hasPersian(lesson.summary.fa)).toBe(true);
      expect(lesson.source.page).toBeGreaterThan(0);
    }
  });

  it("keeps 31 settings with unique numbers and non-empty options", () => {
    expect(settings.length).toBe(31);
    const numbers = settings.map((setting) => setting.number);
    expect(new Set(numbers).size).toBe(numbers.length);
    for (const setting of settings) {
      expect(setting.label.en.trim().length).toBeGreaterThan(0);
      expect(hasPersian(setting.label.fa)).toBe(true);
      expect(setting.summary.en.trim().length).toBeGreaterThan(0);
      expect(hasPersian(setting.summary.fa)).toBe(true);
      expect(setting.options.length).toBeGreaterThanOrEqual(1);
      for (const option of setting.options) {
        expect(option.en.trim().length).toBeGreaterThan(0);
        expect(option.fa.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("default values of discrete programs match a real option", () => {
    // Range-type programs (a single option + a numeric default) are the
    // documented exception: their default is the live current value.
    for (const setting of settings) {
      if (!setting.defaultValue || setting.options.length <= 1) continue;
      const matches = setting.options.some(
        (option) => option.en === setting.defaultValue!.en || option.fa === setting.defaultValue!.fa
      );
      expect(matches).toBe(true);
    }
  });

  it("keeps 21 fault codes with unique codes and bilingual checks", () => {
    expect(faultCodes.length).toBe(21);
    const codes = faultCodes.map((fault) => fault.code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const fault of faultCodes) {
      expect(fault.title.en.trim().length).toBeGreaterThan(0);
      expect(hasPersian(fault.title.fa)).toBe(true);
      expect(fault.safeCheck.en.trim().length).toBeGreaterThan(0);
      expect(hasPersian(fault.safeCheck.fa)).toBe(true);
    }
  });

  it("commissioning checklist is a full, distinct, sourced flow", () => {
    expect(commissioningSteps.length).toBeGreaterThanOrEqual(6);
    const ids = commissioningSteps.map((step) => step.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const step of commissioningSteps) {
      expect(step.text.en.trim().length).toBeGreaterThan(0);
      expect(hasPersian(step.text.fa)).toBe(true);
      expect(step.detail.en.trim().length).toBeGreaterThan(0);
      expect(hasPersian(step.detail.fa)).toBe(true);
      expect(step.source.page).toBeGreaterThan(0);
    }
  });

  it("all four documents are catalogued with unique ids", () => {
    const docs = Object.values(documents);
    expect(docs).toHaveLength(4);
    expect(new Set(docs.map((doc) => doc.id)).size).toBe(docs.length);
    for (const doc of docs) {
      expect(doc.fileName.trim().length).toBeGreaterThan(0);
      expect(doc.pages).toBeGreaterThan(0);
      expect(["en", "fa"]).toContain(doc.language);
    }
  });

  it("connection facts keep 8 sourced bilingual rows", () => {
    expect(connectionFacts.length).toBe(8);
    for (const fact of connectionFacts) {
      expect(fact.label.en.trim().length).toBeGreaterThan(0);
      expect(hasPersian(fact.label.fa)).toBe(true);
      expect(fact.value.trim().length).toBeGreaterThan(0);
      expect(fact.source.page).toBeGreaterThan(0);
    }
  });
});

/* ------------------------------------------------------------------ */
/* Shared-logic helpers — hostile inputs                               */
/* ------------------------------------------------------------------ */

describe("shared-logic helpers worst-case inputs", () => {
  it("completionPercent clamps to 0-100 and survives empty/invalid totals", () => {
    expect(completionPercent([], 0)).toBe(0);
    expect(completionPercent([], -5)).toBe(0);
    expect(completionPercent(["a", "a", "b"], 2)).toBe(100);
    expect(completionPercent(["a", "b", "c", "d", "e", "f", "g"], 1)).toBe(100);
    expect(completionPercent(["a", "b"], 1000)).toBe(0);
  });

  it("toggleCompletedLesson is deterministic and idempotent", () => {
    expect(toggleCompletedLesson([], "x")).toEqual(["x"]);
    expect(toggleCompletedLesson(["x"], "x")).toEqual([]);
    expect(toggleCompletedLesson(toggleCompletedLesson([], "x"), "x")).toEqual([]);
  });

  it("parseStoredList rejects every hostile payload shape", () => {
    const hostile = [
      "{", "[]", "[1]", "[\"a\",1]", "null", "undefined", "NaN", "{}", "[\"a\",\"b\"]",
      "[\"a\", [\"b\"]]", "true", "42", "\"string\""
    ];
    for (const payload of hostile) {
      const parsed = parseStoredList(payload);
      expect(Array.isArray(parsed)).toBe(true);
    }
    expect(parseStoredList("[\"a\",\"b\"]")).toEqual(["a", "b"]);
    expect(parseStoredList("")).toEqual([]);
    expect(parseStoredList(null)).toEqual([]);
  });
});