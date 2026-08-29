import { describe, expect, it } from "vitest";
import {
  anatomy,
  commissioningSteps,
  connectionFacts,
  faultCodes,
  lessons,
  localize,
  quizBank,
  settings,
  specifications,
  troubleshootTree,
  type LocalizedText
} from "@nexa/product-content";
import { completionPercent, toFaDigits } from "@nexa/shared-logic";

/**
 * Regression / edge suite — deliberately overlapping-free companion to the
 * adversarial suite. Adds DETERMINISTIC randomized fuzzing (seeded LCG so
 * failures reproduce), a full-tree bilingual walker (every LocalizedText
 * node in the content graph) and randomized decision-tree walks. Loop-generated:
 * hundreds of independent assertions from compact generators.
 */

const PERSIAN = /[\u0600-\u06FF]/;
const hasPersian = (value: string) => PERSIAN.test(value);

/** Deterministic PRNG so a failed seed reproduces exactly on re-run. */
let seed = 0x5eed;
const rnd = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};
const pick = <T,>(items: readonly T[]): T => items[Math.floor(rnd() * items.length) % items.length]!;

/* ------------------------------------------------------------------ */
/* 1. Seeded fuzz — digit conversion must stay faithful                */
/* ------------------------------------------------------------------ */

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const latinToFa = (value: string) => value.replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);

describe("toFaDigits seeded fuzz (deterministic)", () => {
  const corpora = ["", "P", "VAC", "VDC", "AWG", "mm²", "باطری", "شارژ", "متن", "°C", "%", "-", "+", "."] as const;

  it("stays faithful on 400 generated digit+text strings", () => {
    for (let i = 0; i < 400; i++) {
      const digits = String(Math.floor(rnd() * 1_000_000));
      const prefix = pick(corpora);
      const suffix = pick(corpora);
      const input = `${prefix}${digits}${suffix}`;
      const expected = `${prefix}${latinToFa(digits)}${suffix}`;
      expect(toFaDigits(input)).toBe(expected);
    }
  });

  it("is idempotent on 300 generated strings", () => {
    for (let i = 0; i < 300; i++) {
      const input = `${pick(corpora)}${Math.floor(rnd() * 10000)}${pick(corpora)}${Math.floor(rnd() * 100)}`;
      const once = toFaDigits(input);
      expect(toFaDigits(once)).toBe(once);
    }
  });

  it("never emits a stray ASCII digit inside a converted run", () => {
    for (let i = 0; i < 200; i++) {
      const input = String(Math.floor(rnd() * 10 ** (1 + Math.floor(rnd() * 6))));
      const out = toFaDigits(input);
      expect(/[0-9]/.test(out)).toBe(false);
    }
  });
});

/* ------------------------------------------------------------------ */
/* 2. completionPercent fuzz — clamp invariant must always hold        */
/* ------------------------------------------------------------------ */

describe("completionPercent seeded fuzz", () => {
  it("always clamps into 0..100 across 500 hostile (count, total) pairs", () => {
    for (let i = 0; i < 500; i++) {
      const count = Math.floor(rnd() * 80) - 20;          // includes negatives
      const total = Math.floor(rnd() * 90) - 30;          // includes negatives
      const result = completionPercent(Array.from({ length: count > 0 ? count : 0 }, (_, j) => `l${j}`), total);
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    }
  });

  it("handles degenerate totals exactly", () => {
    expect(completionPercent([], 0)).toBe(0);
    expect(completionPercent(["a"], -3)).toBe(0);
    expect(completionPercent(Array.from({ length: 1000 }, (_, i) => `k${i}`), 1000)).toBe(100);
    expect(completionPercent(["a", "b"], Number.POSITIVE_INFINITY)).toBe(0);
    expect(completionPercent(["a", "b"], Number.NaN)).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/* 3. Full-tree bilingual walker — every LocalizedText node            */
/* ------------------------------------------------------------------ */

describe("full bilingual content graph", () => {
  const pairs: Array<[string, LocalizedText]> = [];

  for (const lesson of lessons) {
    pairs.push([`lesson:${lesson.slug}:title`, lesson.title]);
    pairs.push([`lesson:${lesson.slug}:summary`, lesson.summary]);
  }
  for (const setting of settings) {
    pairs.push([`setting:${setting.number}:label`, setting.label]);
    pairs.push([`setting:${setting.number}:summary`, setting.summary]);
    setting.options.forEach((option, i) => pairs.push([`setting:${setting.number}:option:${i}`, option]));
  }
  for (const fault of faultCodes) {
    pairs.push([`fault:${fault.code}:title`, fault.title]);
    pairs.push([`fault:${fault.code}:safeCheck`, fault.safeCheck]);
  }
  for (const spec of specifications) pairs.push([`spec:${spec.id}:label`, spec.label]);
  for (const part of anatomy) {
    pairs.push([`anatomy:${part.id}:label`, part.label]);
    pairs.push([`anatomy:${part.id}:role`, part.role]);
    pairs.push([`anatomy:${part.id}:guide`, part.guide]);
    pairs.push([`anatomy:${part.id}:stat`, part.stat]);
    pairs.push([`anatomy:${part.id}:relatedLabel`, part.relatedLabel]);
  }
  for (const step of commissioningSteps) {
    pairs.push([`step:${step.id}:text`, step.text]);
    pairs.push([`step:${step.id}:detail`, step.detail]);
  }
  for (const q of quizBank) {
    pairs.push([`quiz:${q.id}:question`, q.question]);
    pairs.push([`quiz:${q.id}:explanation`, q.explanation]);
    q.choices.forEach((choice, i) => pairs.push([`quiz:${q.id}:choice:${i}`, choice]));
  }
  for (const fact of connectionFacts) pairs.push([`fact:${fact.id}:label`, fact.label]);
  for (const [id, node] of Object.entries(troubleshootTree.nodes)) {
    if (node.kind !== "question") continue;
    pairs.push([`tree:${id}:question`, node.question]);
    if (node.hint) pairs.push([`tree:${id}:hint`, node.hint]);
    node.choices.forEach((choice, i) => pairs.push([`tree:${id}:choice:${i}`, choice.label]));
  }
  for (const [id, node] of Object.entries(troubleshootTree.nodes)) {
    if (node.kind !== "diagnosis") continue;
    pairs.push([`tree:${id}:problem`, node.problem]);
    node.causes.forEach((cause, i) => pairs.push([`tree:${id}:cause:${i}`, cause]));
    node.solution.forEach((sol, i) => pairs.push([`tree:${id}:solution:${i}`, sol]));
    if (node.escalation) pairs.push([`tree:${id}:escalation`, node.escalation]);
  }

  it("walks a large bilingual corpus", () => {
    expect(pairs.length).toBeGreaterThan(200);
  });

  it("every pair is non-empty in en and genuinely Persian in fa", () => {
    for (const [name, pair] of pairs) {
      expect(pair.en.trim().length, `${name}.en`).toBeGreaterThan(0);
      expect(pair.fa.trim().length, `${name}.fa`).toBeGreaterThan(0);
      // Industry acronyms (e.g. "AGM", "UPS", "LED") legitimately stay Latin
      // in fa — the same category as the documented language.selfEn exception.
      const acronymIdiom = pair.en === pair.fa && /^[\p{ASCII} .0-9+-]+$/u.test(pair.fa);
      expect(acronymIdiom || hasPersian(pair.fa), `${name}.fa must contain Persian script`).toBe(true);
    }
  });

  it("no pair shows mojibake or accidental bidi control characters", () => {
    const mojibake = /â€|Ã©|ï»¿/;
    for (const [name, pair] of pairs) {
      expect(mojibake.test(pair.en), `${name}.en mojibake`).toBe(false);
      expect(mojibake.test(pair.fa), `${name}.fa mojibake`).toBe(false);
      expect(/[\u202A-\u202E]/.test(pair.fa), `${name}.fa stray bidi control`).toBe(false);
    }
  });

  it("en and fa copies are not just the same string", () => {
    for (const [name, pair] of pairs) {
      const acronymIdiom = pair.en === pair.fa && /^[\p{ASCII} .0-9+-]+$/u.test(pair.fa);
      expect(pair.fa === pair.en && !acronymIdiom, `${name} bilingual copies identical`).toBe(false);
    }
  });

  it("localize() round-trips every pair for both locales", () => {
    for (const [name, pair] of pairs) {
      expect(localize(pair, "en"), `${name}.localize(en)`).toBe(pair.en);
      expect(localize(pair, "fa"), `${name}.localize(fa)`).toBe(pair.fa);
    }
  });
});

/* ------------------------------------------------------------------ */
/* 4. Randomized decision-tree walks — always terminate in diagnosis   */
/* ------------------------------------------------------------------ */

describe("troubleshootTree seeded walks", () => {
  const nodeCount = Object.keys(troubleshootTree.nodes).length;

  it("200 random root-to-diagnosis walks always terminate", () => {
    for (let i = 0; i < 200; i++) {
      let current = troubleshootTree.start;
      const visited = new Set<string>([current]);
      let guard = 0;
      let diagnosisId: string | null = null;
      while (guard < nodeCount + 1) {
        const node = troubleshootTree.nodes[current];
        if (!node) throw new Error(`dangling node ${current}`);
        if (node.kind === "diagnosis") { diagnosisId = current; break; }
        const choice = pick(node.choices);
        current = choice.next;
        visited.add(current);
        guard += 1;
      }
      expect(diagnosisId, `walk ${i} must reach a diagnosis`).not.toBeNull();
      expect(visited.size).toBeLessThanOrEqual(nodeCount);
    }
  });

  it("every reachable diagnosis appears in at least one walk", () => {
    const reached = new Set<string>();
    for (let i = 0; i < 60; i++) {
      let current = troubleshootTree.start;
      let guard = 0;
      while (guard < nodeCount + 1) {
        const node = troubleshootTree.nodes[current];
        if (!node) break;
        if (node.kind === "diagnosis") { reached.add(current); break; }
        current = pick(node.choices).next;
        guard += 1;
      }
    }
    const diagnoses = Object.values(troubleshootTree.nodes)
      .filter((node) => node.kind === "diagnosis")
      .map((node) => node.id);
    for (const id of diagnoses) expect(reached.has(id), `diagnosis ${id} reachable`).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/* 5. Format / uniqueness matrix on structured collections             */
/* ------------------------------------------------------------------ */

describe("structured format matrix", () => {
  it("settings numbers are all two-digit zero-padded and unique", () => {
    const numbers = settings.map((setting) => setting.number);
    expect(new Set(numbers).size).toBe(numbers.length);
    for (const number of numbers) {
      expect(number).toMatch(/^\d{2}$/);
    }
    expect(Math.min(...numbers.map(Number))).toBeGreaterThanOrEqual(1);
  });

  it("fault codes are unique two-digit numeric strings", () => {
    const codes = faultCodes.map((fault) => fault.code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const code of codes) expect(code).toMatch(/^\d{2}$/);
  });

  it("specifications have unique ids within the 5 documented groups", () => {
    const ids = specifications.map((spec) => spec.id);
    expect(new Set(ids).size).toBe(ids.length);
    const groups = new Set(specifications.map((spec) => spec.group));
    expect(groups.size).toBeGreaterThanOrEqual(5);
    for (const spec of specifications) {
      expect(spec.value.trim().length).toBeGreaterThan(0);
    }
  });

  it("lesson slugs are unique and their source pages are plausible", () => {
    const slugs = lessons.map((lesson) => lesson.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const lesson of lessons) {
      expect(lesson.source.page).toBeGreaterThan(0);
      expect(lesson.source.page).toBeLessThanOrEqual(40);
    }
  });

  it("quiz questions keep their choice options distinct in both locales", () => {
    for (const q of quizBank) {
      const en = q.choices.map((choice) => choice.en);
      const fa = q.choices.map((choice) => choice.fa);
      expect(new Set(en).size).toBe(en.length);
      expect(new Set(fa).size).toBe(fa.length);
    }
  });

  it("wrong choices are never byte-identical to the correct one (trap guard)", () => {
    for (const q of quizBank) {
      const correct = q.choices[q.correctIndex]!;
      for (let i = 0; i < q.choices.length; i++) {
        if (i === q.correctIndex) continue;
        expect(q.choices[i]?.en === correct.en, `quiz ${q.id} confusable choice ${i}`).toBe(false);
        expect(q.choices[i]?.fa === correct.fa, `quiz ${q.id} confusable choice ${i} (fa)`).toBe(false);
      }
    }
  });
});

/* ------------------------------------------------------------------ */
/* 6. RTL rendering contract — digits and direction in rendered copy   */
/* ------------------------------------------------------------------ */

describe("RTL render contract", () => {
  it("every fa lesson title keeps its meaning localizable (no hardcoded Latin digits)", () => {
    // Lessons that name numbers ("Program 01") must actually contain a
    // Persian number in fa, never a bare Latin digit run.
    const numbered = lessons.filter((lesson) => /\d/.test(lesson.title.en));
    for (const lesson of numbered) {
      const faTitle = localize(lesson.title, "fa");
      expect(/[۰-۹]/.test(faTitle), `${lesson.slug} fa title contains Persian digits`).toBe(true);
    }
  });

  it("all program numbers referenced in fa copy use Persian digits", () => {
    for (const setting of settings) {
      for (const field of [setting.label, setting.summary]) {
        const fa = localize(field, "fa");
        // A "Program 0X" reference inside fa copy must carry Persian digits.
        const numbered = fa.match(/\d+/g) ?? [];
        for (const run of numbered) {
          if (/^[۰-۹]+$/.test(run)) continue;
          // Allow Latin runs only when they are part of a technical token
          // (e.g. "90-280 VAC") — otherwise flag as an RTL leak.
          const surrounded = new RegExp(`(^|[^۰-۹0-9])${run}([^۰-۹0-9]|$)`).test(fa);
          const technical = /[A-Za-z]/.test(run) || run.length === 0;
          expect(!surrounded || technical, `${setting.number} fa numeric leak "${run}"`).toBe(true);
        }
      }
    }
  });

  it("no content pair mixes a Persian string with an immediately-following left-to-right unit", () => {
    // Persian text followed by a Latin unit is fine; a Persian digit run
    // glued to a Latin unit is the LTR leak we fixed ("03" → "۰۳").
    for (const q of quizBank) {
      for (const choice of q.choices) {
        expect(/[۰-۹][A-Za-z]/.test(choice.fa), `quiz ${q.id} digit-unit glue`).toBe(false);
      }
    }
  });
});