/**
 * Sizing engine — pure math binding USER panel/load inputs against VERIFIED
 * device electrical limits. No React, no locale, no side effects.
 *
 * Honesty contract (brand-critical):
 * - Every LIMIT comes from sourced content (`@nexa/product-content`).
 * - Panel-side physics (temperature coefficient presets etc.) live in the app
 *   layer and are labelled as user assumptions, never presented as manual data.
 * - A check whose inputs are invalid is `skipped`, never silently "pass".
 */

export type SizingStatus = "pass" | "marginal" | "fail" | "skipped";

export interface SizingCheck {
  id: string;
  /** measured / limit; null when not applicable or skipped. */
  ratio: number | null;
  status: SizingStatus;
  /** Human-facing raw numbers (already rounded by caller). */
  measured: number | null;
  limit: number | null;
}

export interface DeviceLimits {
  ratedPowerKw: number;
  surgeFactor: number;
  surgeSeconds: number;
  batteryNominalVdc: number;
  maxTotalChargeA: number;
  maxUtilityChargeA: number;
  maxPvPowerW: number;
  maxPvVocVdc: number;
  mpptMinVdc: number;
  mpptMaxVdc: number;
  maxPvCurrentA: number;
  minOperatingTempC: number;
}

/** At/below this utilization the margin is comfortable; above it, warn before fail. */
export const MARGINAL_RATIO = 0.9;

const finite = (value: unknown): number | null => {
  const n = typeof value === "string" ? Number(value.replace(",", ".")) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
};

export function clampNumber(value: unknown, min: number, max: number): number | null {
  const n = finite(value);
  if (n === null) return null;
  return Math.min(max, Math.max(min, n));
}

function judge(ratio: number): Exclude<SizingStatus, "skipped"> {
  if (!Number.isFinite(ratio)) return "fail";
  if (ratio <= 1) return ratio <= MARGINAL_RATIO ? "pass" : "marginal";
  return "fail";
}

function makeCheck(id: string, measured: number | null, limit: number | null): SizingCheck {
  if (measured === null || limit === null || limit <= 0) {
    return { id, ratio: null, status: "skipped", measured, limit };
  }
  const ratio = measured / limit;
  return { id, ratio, status: judge(ratio), measured, limit };
}

/* ------------------------------------------------------------------ */
/* PV array open-circuit voltage at record cold                         */
/* ------------------------------------------------------------------ */

export interface PvVoltageInput {
  /** Panel Voc at STC (25 °C), volts. */
  vocStcV: unknown;
  /** Panels wired in series within the string. */
  seriesCount: unknown;
  /** Panel temperature coefficient of Voc, percent per °C (negative). */
  tempCoefficientPctPerC: unknown;
  /** Record-low site temperature, °C. */
  recordLowC: unknown;
}

/**
 * Voc(array, T) = N · Voc(STC) · (1 + β·(T − 25))
 * β is negative; colder than STC therefore raises Voc.
 */
export function correctedArrayVoc(input: PvVoltageInput): number | null {
  const voc = finite(input.vocStcV);
  const count = finite(input.seriesCount);
  const beta = finite(input.tempCoefficientPctPerC);
  const temp = finite(input.recordLowC);
  if (
    voc === null || count === null || beta === null || temp === null ||
    voc <= 0 || count < 1 || count > 20 || beta > 0
  ) {
    return null;
  }
  return count * voc * (1 + (beta / 100) * (temp - 25));
}

export function evaluatePvVoltage(input: PvVoltageInput, limits: DeviceLimits): SizingCheck & { belowDeviceOperatingRange: boolean } {
  const voc = correctedArrayVoc(input);
  const temp = finite(input.recordLowC);
  const check = makeCheck("pv-voc-cold", voc === null ? null : round1(voc), limits.maxPvVocVdc);
  // The device itself is only rated down to its own operating floor.
  const belowDeviceOperatingRange = temp !== null && temp < limits.minOperatingTempC;
  return { ...check, belowDeviceOperatingRange };
}

/* ------------------------------------------------------------------ */
/* PV current (strings in parallel × panel Isc)                         */
/* ------------------------------------------------------------------ */

export function evaluatePvCurrent(parallelStrings: unknown, panelIscA: unknown, limits: DeviceLimits): SizingCheck {
  const strings = finite(parallelStrings);
  const isc = finite(panelIscA);
  if (strings === null || isc === null || strings < 1 || isc <= 0) {
    return { id: "pv-current", ratio: null, status: "skipped", measured: null, limit: limits.maxPvCurrentA };
  }
  return makeCheck("pv-current", round2(strings * isc), limits.maxPvCurrentA);
}

/* ------------------------------------------------------------------ */
/* PV array power                                                       */
/* ------------------------------------------------------------------ */

export function evaluatePvPower(seriesCount: unknown, parallelStrings: unknown, panelWatts: unknown, limits: DeviceLimits): SizingCheck {
  const s = finite(seriesCount);
  const p = finite(parallelStrings);
  const w = finite(panelWatts);
  if (s === null || p === null || w === null || s < 1 || p < 1 || w <= 0) {
    return { id: "pv-power", ratio: null, status: "skipped", measured: null, limit: limits.maxPvPowerW };
  }
  return makeCheck("pv-power", Math.round(s * p * w), limits.maxPvPowerW);
}

/* ------------------------------------------------------------------ */
/* Continuous load                                                      */
/* ------------------------------------------------------------------ */

export function evaluateLoad(continuousLoadW: unknown, limits: DeviceLimits): SizingCheck & { surgeNote: string } {
  const load = finite(continuousLoadW);
  const limit = limits.ratedPowerKw * 1000;
  const check = makeCheck("load-continuous", load, limit);
  return { ...check, surgeNote: `${limits.surgeFactor}× / ${limits.surgeSeconds}s` };
}

/* ------------------------------------------------------------------ */
/* Charging currents                                                    */
/* ------------------------------------------------------------------ */

export interface ChargingInput {
  utilityChargeA: unknown;
  pvChargeA: unknown;
}

export function evaluateCharging(input: ChargingInput, limits: DeviceLimits): { total: SizingCheck; utility: SizingCheck } {
  const ac = finite(input.utilityChargeA);
  const pv = finite(input.pvChargeA);
  // Numeric 0 and empty input are BOTH invalid here: Number("") is 0, so an
  // untouched field must not read as a truthful zero-amp value (honesty
  // contract: invalid input is "skipped", never a silent "pass").
  const validAc = ac !== null && ac > 0;
  const validPv = pv !== null && pv > 0;
  const total = validAc && validPv ? round1(ac + pv) : null;
  return {
    total: makeCheck(
      "charge-total",
      total,
      limits.maxTotalChargeA
    ),
    utility: makeCheck(
      "charge-ac",
      validAc ? ac : null,
      limits.maxUtilityChargeA
    )
  };
}

/* ------------------------------------------------------------------ */

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Worst aggregate verdict across checks (skipped ignored). */
export function worstStatus(checks: Array<{ status: SizingStatus }>): SizingStatus {
  if (checks.some((c) => c.status === "fail")) return "fail";
  if (checks.some((c) => c.status === "marginal")) return "marginal";
  if (checks.length > 0 && checks.every((c) => c.status === "skipped")) return "skipped";
  return "pass";
}
