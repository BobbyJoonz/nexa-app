import { describe, expect, it } from "vitest";
import {
  completionPercent,
  parseStoredList,
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

  it("rejects malformed stored values", () => {
    expect(parseStoredList("[\"overview\"]")).toEqual(["overview"]);
    expect(parseStoredList("{")).toEqual([]);
    expect(parseStoredList("[1]")).toEqual([]);
  });
});
