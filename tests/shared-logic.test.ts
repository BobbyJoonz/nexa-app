import { describe, expect, it } from "vitest";
import {
  completionPercent,
  parseStoredList,
  toFaDigits,
  toggleCompletedLesson
} from "@nexa/shared-logic";

describe("academy progress", () => {
  it("adds and removes a lesson deterministically", () => {
    expect(toggleCompletedLesson([], "overview")).toEqual(["overview"]);
    expect(toggleCompletedLesson(["overview"], "overview")).toEqual([]);
  });

  it("counts unique completed lessons", () => {
    expect(completionPercent(["overview", "overview", "safety"], 4)).toBe(50);
    expect(completionPercent([], 0)).toBe(0);
  });

  it("clamps progress to the 0…100 range under corrupt storage", () => {
    expect(completionPercent(["a", "b", "c"], 2)).toBe(100);
    expect(completionPercent([], 3)).toBe(0);
    expect(completionPercent(Array.from({ length: 99 }, (_, i) => `x${i}`), 15)).toBe(100);
  });

  it("rejects malformed stored values", () => {
    expect(parseStoredList("[\"overview\"]")).toEqual(["overview"]);
    expect(parseStoredList("{")).toEqual([]);
    expect(parseStoredList("[1]")).toEqual([]);
  });
});

describe("toFaDigits", () => {
  it("transcribes Latin digits to Persian across mixed content", () => {
    expect(toFaDigits("P01 · 230 VAC")).toBe("P۰۱ · ۲۳۰ VAC");
    expect(toFaDigits("1,234.5")).toBe("۱,۲۳۴.۵");
    expect(toFaDigits(41.5)).toBe("۴۱.۵");
    expect(toFaDigits("12")).toBe("۱۲");
  });

  it("leaves non-Latin-digit text untouched", () => {
    const samples = ["بدون عدد", "", "∞", "-", "A"];
    for (const sample of samples) expect(toFaDigits(sample)).toBe(sample);
  });

  it("never double-converts an already Persian string", () => {
    expect(toFaDigits("۰۱")).toBe("۰۱");
    expect(toFaDigits(toFaDigits("240 V"))).toBe(toFaDigits("240 V"));
  });
});
