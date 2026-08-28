import { describe, expect, it } from "vitest";
import { dictionaries, directionFor, t } from "@nexa/i18n";

describe("bilingual interface", () => {
  it("has identical dictionary keys", () => {
    expect(Object.keys(dictionaries.fa).sort()).toEqual(Object.keys(dictionaries.en).sort());
  });

  it("selects the correct direction", () => {
    expect(directionFor("fa")).toBe("rtl");
    expect(directionFor("en")).toBe("ltr");
  });

  it("returns translations", () => {
    expect(t("fa", "models.title")).toContain("سانورتر");
    expect(t("en", "models.title")).toBe("Choose your Sunverter");
  });
});
