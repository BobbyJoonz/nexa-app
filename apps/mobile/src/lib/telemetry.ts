import Constants from "expo-constants";

/**
 * Crash telemetry — dormant until configured, exactly like OTA.
 *
 * Activation contract (owner):
 *  1. Create a project at sentry.io, copy the DSN.
 *  2. Put it in `app.json` → `expo.extra.sentry.dsn`.
 * Until then this module is a strict no-op in production builds and is fully
 * disabled under `__DEV__`, so development noise never reaches anyone.
 */

interface SentryLike {
  init(options: { dsn: string; sendDefaultPii?: boolean }): void;
  captureException(exception: unknown, hint?: { extra?: Record<string, unknown> }): unknown;
}

let initialized = false;
let client: SentryLike | null = null;

function readDsn(): string | null {
  const extra = Constants.expoConfig?.extra as { sentry?: { dsn?: unknown } } | undefined;
  const dsn = extra?.sentry?.dsn;
  return typeof dsn === "string" && dsn.trim().length > 0 ? dsn : null;
}

/** Call once from the root layout. Safe to call repeatedly. */
export function initTelemetry(): void {
  if (initialized || __DEV__) return;
  initialized = true;
  try {
    const dsn = readDsn();
    if (!dsn) return;
    // Resolved lazily so bundling/typecheck stay decoupled from install timing;
    // a missing or broken SDK must never take the app down.
    const candidate = require("@sentry/react-native") as SentryLike | undefined | null;
    if (!candidate || typeof candidate.init !== "function") return;
    candidate.init({ dsn, sendDefaultPii: false });
    client = candidate;
  } catch {
    client = null;
  }
}

/** Fire-and-forget exception capture (used by the ErrorBoundary too). */
export function captureException(error: unknown, context?: Record<string, unknown>): void {
  try {
    client?.captureException(error, context ? { extra: context } : undefined);
  } catch {
    // Telemetry failures are silent by contract.
  }
}

/** Exposed for QA screens/tests. */
export function isTelemetryActive(): boolean {
  return client !== null;
}
