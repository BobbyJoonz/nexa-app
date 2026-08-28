import { describe, expect, it } from "vitest";
import { commissioningSteps, documents, quizBank } from "@nexa/product-content";

describe("quizBank integrity", () => {
  it("holds at least five sourced questions", () => {
    expect(quizBank.length).toBeGreaterThanOrEqual(5);
  });

  it("uses unique question ids", () => {
    const ids = quizBank.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps every correctIndex inside its choices", () => {
    for (const question of quizBank) {
      expect(question.choices.length).toBeGreaterThanOrEqual(2);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(question.choices.length);
    }
  });

  it("cites a real document page for every question", () => {
    const known = new Set(Object.values(documents).map((doc) => doc.id));
    for (const question of quizBank) {
      expect(question.source.page).toBeGreaterThan(0);
      expect(known.has(question.source.documentId)).toBe(true);
    }
  });
});

describe("commissioningSteps integrity", () => {
  it("covers the whole install flow", () => {
    expect(commissioningSteps.length).toBeGreaterThanOrEqual(6);
  });

  it("uses unique step ids", () => {
    const ids = commissioningSteps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("sources every step to a real document page", () => {
    const known = new Set(Object.values(documents).map((doc) => doc.id));
    for (const step of commissioningSteps) {
      expect(step.source.page).toBeGreaterThan(0);
      expect(known.has(step.source.documentId)).toBe(true);
    }
  });
});