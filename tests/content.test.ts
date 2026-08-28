import { describe, expect, it } from "vitest";
import {
  faultCodes,
  lessons,
  productModels,
  settings,
  specifications
} from "@nexa/product-content";

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
