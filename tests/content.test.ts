import { describe, expect, it } from "vitest";
import {
  anatomy,
  faultCodes,
  lessons,
  productModels,
  settings,
  specifications
} from "@nexa/product-content";

const anatomyIcons = ["lcd", "status", "charge", "fault", "buttons", "earth", "ac-in", "ac-out", "battery", "pv", "wifi", "power"] as const;

describe("source-backed product content", () => {
  it("keeps supplied and missing models distinct", () => {
    expect(productModels).toHaveLength(2);
    expect(productModels[0]?.modelName.value).toBe("CM3500-24S");
    expect(productModels[1]?.modelName.value).toBeNull();
    expect(productModels[1]?.ratedPowerKw.value).toBeNull();
  });

  it("contains the complete documented program and fault sets", () => {
    expect(settings.map((item) => item.number)).toEqual([
      "01", "02", "03", "05", "06", "07", "08", "09", "10", "11", "12",
      "13", "16", "18", "19", "20", "23", "25", "26", "27", "29", "32",
      "33", "34", "35", "36", "37", "39", "41", "42", "46"
    ]);
    expect(faultCodes.map((item) => item.code)).toEqual([
      "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11",
      "12", "13", "14", "15", "18", "19", "20", "21", "22", "23"
    ]);
  });

  it("requires a concrete source for every published teaching record", () => {
    expect(lessons.every((item) => item.source.page > 0 && item.source.fileName)).toBe(true);
    expect(settings.every((item) => item.source.page > 0 && item.source.fileName)).toBe(true);
    expect(specifications.every((item) => item.verificationStatus === "verified")).toBe(true);
  });
});

describe("anatomy rich content", () => {
  it("keeps all 12 external points with a valid hotspot and icon", () => {
    expect(anatomy).toHaveLength(12);
    expect(new Set(anatomy.map((part) => part.id)).size).toBe(12);
    expect(anatomy.every((part) => part.x >= 0 && part.x <= 100 && part.y >= 0 && part.y <= 100)).toBe(true);
    anatomy.forEach((part) => {
      // @ts-expect-error — the fixed icon union is validated via the icon set below
      expect(anatomyIcons.includes(part.icon)).toBe(true);
    });
  });

  it("keeps every related lesson resolvable within the academy", () => {
    anatomy.forEach((part) => {
      expect(lessons.some((lesson) => lesson.slug === part.relatedLesson), part.id).toBe(true);
    });
  });

  it("keeps bilingual copy complete on every part and labels unique in both languages", () => {
    expect(anatomy.every((part) => part.role.en && part.role.fa && part.guide.en && part.guide.fa && part.stat.en && part.stat.fa && part.relatedLabel.en && part.relatedLabel.fa)).toBe(true);
    expect(new Set(anatomy.map((part) => `${part.label.en}|${part.label.fa}`)).size).toBe(12);
  });

  it("gives every part at least 3 bilingual inspection steps", () => {
    anatomy.forEach((part) => {
      expect(part.inspect.length, part.id).toBeGreaterThanOrEqual(3);
      expect(part.inspect.every((step) => step.en && step.fa), part.id).toBe(true);
    });
  });

  it("flags a bilingual safety warning on every hazardous part", () => {
    const hazardIds = ["fault", "earth", "ac-in", "ac-out", "battery-in", "pv-in", "power"];
    anatomy.forEach((part) => {
      if (hazardIds.includes(part.id)) {
        expect(part.safety, part.id).toBeDefined();
        expect(Boolean(part.safety && part.safety.en && part.safety.fa), part.id).toBe(true);
      }
    });
  });

  it("retains the doc source for provenance without rendering it", () => {
    expect(anatomy.every((part) => part.source.page > 0 && part.source.fileName)).toBe(true);
  });
});
