import { describe, expect, it } from "vitest";
import {
  clampNumber,
  correctedArrayVoc,
  evaluateCharging,
  evaluateLoad,
  evaluatePvCurrent,
  evaluatePvPower,
  evaluatePvVoltage,
  worstStatus
} from "@nexa/shared-logic";
import { deviceLimits, toEngineLimits } from "@nexa/product-content";

const limits = toEngineLimits(deviceLimits);

describe("deviceLimits extraction stays locked to the verified specification rows", () => {
  it("matches the sourced CM3500-24S table values exactly", () => {
    expect(limits.ratedPowerKw).toBe(3.5);
    expect(limits.surgeFactor).toBe(2);
    expect(limits.surgeSeconds).toBe(5);
    expect(limits.batteryNominalVdc).toBe(24);
    expect(limits.maxTotalChargeA).toBe(100);
    expect(limits.maxUtilityChargeA).toBe(60);
    expect(limits.maxPvPowerW).toBe(4000);
    expect(limits.maxPvVocVdc).toBe(500);
    expect(limits.mpptMinVdc).toBe(30);
    expect(limits.mpptMaxVdc).toBe(500);
    expect(limits.maxPvCurrentA).toBe(15);
    expect(limits.minOperatingTempC).toBe(-10);
  });

  it("carries per-limit source citations", () => {
    expect(deviceLimits.maxPvVocVdc.source.page).toBe(26);
    expect(deviceLimits.ratedPowerKw.source.fileName).toContain("Persian");
  });
});

describe("correctedArrayVoc", () => {
  it("raises Voc at cold temperatures using the panel coefficient", () => {
    // 8 × 41 V at −10 °C with β = −0.30 %/°C → 328 · (1 + (−0.003)(−35)) = 362.44 V
    const voc = correctedArrayVoc({ vocStcV: 41, seriesCount: 8, tempCoefficientPctPerC: -0.3, recordLowC: -10 });
    expect(voc).toBeCloseTo(362.44, 2);
  });

  it("returns null for impossible or malformed inputs", () => {
    expect(correctedArrayVoc({ vocStcV: 0, seriesCount: 8, tempCoefficientPctPerC: -0.3, recordLowC: -10 })).toBeNull();
    expect(correctedArrayVoc({ vocStcV: 41, seriesCount: 0, tempCoefficientPctPerC: -0.3, recordLowC: -10 })).toBeNull();
    expect(correctedArrayVoc({ vocStcV: 41, seriesCount: 21, tempCoefficientPctPerC: -0.3, recordLowC: -10 })).toBeNull();
    expect(correctedArrayVoc({ vocStcV: 41, seriesCount: 8, tempCoefficientPctPerC: 0.3, recordLowC: -10 })).toBeNull();
    expect(correctedArrayVoc({ vocStcV: "", seriesCount: "۸", tempCoefficientPctPerC: "-0.3", recordLowC: -10 })).toBeNull();
  });

  it("accepts Persian-style comma decimals on latin digits", () => {
    const voc = correctedArrayVoc({ vocStcV: "41,5", seriesCount: 2, tempCoefficientPctPerC: "-0,3", recordLowC: 25 });
    expect(voc).toBeCloseTo(83, 5);
  });

  it("is exact at STC regardless of coefficient", () => {
    const voc = correctedArrayVoc({ vocStcV: 40, seriesCount: 5, tempCoefficientPctPerC: -0.34, recordLowC: 25 });
    expect(voc).toBeCloseTo(200, 5);
  });
});

describe("evaluatePvVoltage against the verified 500 VDC ceiling", () => {
  const base = { vocStcV: 45, seriesCount: 8, tempCoefficientPctPerC: -0.3 };

  it("passes with comfortable margin", () => {
    // 360 · 1.105 = 397.8 → ratio 0.796
    const result = evaluatePvVoltage({ ...base, recordLowC: -10 }, limits);
    expect(result.status).toBe("pass");
    expect(result.measured).toBeCloseTo(397.8, 1);
    expect(result.limit).toBe(500);
    expect(result.belowDeviceOperatingRange).toBe(false);
  });

  it("warns inside the last 10% before the ceiling", () => {
    // 8 × 50 = 400 · 1.105 = 442 → pass; push colder: −25 °C → 400·1.15 = 460 → marginal
    const result = evaluatePvVoltage({ ...base, vocStcV: 50, recordLowC: -25 }, limits);
    expect(result.status).toBe("marginal");
    expect(result.belowDeviceOperatingRange).toBe(true); // device rated only to −10 °C
  });

  it("fails past the ceiling", () => {
    const result = evaluatePvVoltage({ ...base, vocStcV: 55, recordLowC: -25 }, limits);
    expect(result.status).toBe("fail");
  });

  it("skips instead of passing when inputs are empty", () => {
    const result = evaluatePvVoltage({ vocStcV: "", seriesCount: "", tempCoefficientPctPerC: "", recordLowC: "" }, limits);
    expect(result.status).toBe("skipped");
    expect(result.ratio).toBeNull();
  });
});

describe("PV current / power checks", () => {
  it("fails when parallel strings exceed the 15 A input limit", () => {
    expect(evaluatePvCurrent(2, 9, limits).status).toBe("fail");
    expect(evaluatePvCurrent(2, 7, limits).status).toBe("marginal");
    expect(evaluatePvCurrent(1, 11, limits).status).toBe("pass");
  });

  it("flags array wattage over the 4000 W MPPT rating", () => {
    expect(evaluatePvPower(8, 1, 550, limits).status).toBe("fail");
    expect(evaluatePvPower(8, 1, 495, limits).status).toBe("marginal");
    expect(evaluatePvPower(8, 1, 300, limits).status).toBe("pass");
  });

  it("skips until every factor is present", () => {
    expect(evaluatePvPower("", "", "", limits).status).toBe("skipped");
    expect(evaluatePvCurrent("", "", limits).status).toBe("skipped");
  });
});

describe("load and charging checks", () => {
  it("bands continuous load around the 3.5 kW rating with surge note", () => {
    const pass = evaluateLoad(3000, limits);
    expect(pass.status).toBe("pass");
    expect(pass.surgeNote).toBe("2× / 5s");

    expect(evaluateLoad(3400, limits).status).toBe("marginal");
    expect(evaluateLoad(3600, limits).status).toBe("fail");
  });

  it("enforces both the 100 A combined and 60 A utility ceilings", () => {
    const calm = evaluateCharging({ utilityChargeA: 30, pvChargeA: 60 }, limits);
    expect(calm.total.status).toBe("pass");
    expect(calm.utility.status).toBe("pass");

    const hotAc = evaluateCharging({ utilityChargeA: 65, pvChargeA: 20 }, limits);
    expect(hotAc.utility.status).toBe("fail"); // AC ceiling breached first

    const hotTotal = evaluateCharging({ utilityChargeA: 60, pvChargeA: 55 }, limits);
    expect(hotTotal.total.status).toBe("fail");

    const partial = evaluateCharging({ utilityChargeA: "", pvChargeA: 40 }, limits);
    expect(partial.total.status).toBe("skipped");
    expect(partial.utility.status).toBe("skipped");
  });
});

describe("aggregation and clamping", () => {
  it("rolls up the worst status and ignores skipped checks", () => {
    expect(worstStatus([{ status: "skipped" }, { status: "pass" }])).toBe("pass");
    expect(worstStatus([{ status: "pass" }, { status: "marginal" }])).toBe("marginal");
    expect(worstStatus([{ status: "marginal" }, { status: "fail" }])).toBe("fail");
    expect(worstStatus([])).toBe("pass");
  });

  it("clamps numeric ranges defensively", () => {
    expect(clampNumber("12", 0, 20)).toBe(12);
    expect(clampNumber("-5", 0, 20)).toBe(0);
    expect(clampNumber("99", 0, 20)).toBe(20);
    expect(clampNumber("abc", 0, 20)).toBeNull();
  });
});
