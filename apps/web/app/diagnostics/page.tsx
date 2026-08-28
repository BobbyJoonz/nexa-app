"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, RefreshCw, TriangleAlert, WifiOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface HealthResponse {
  ok: boolean;
  app: string;
  version: string;
  commit: string;
  model: string;
  timestamp: string;
}

interface DiagnosticState {
  online: boolean;
  storage: boolean;
  health: HealthResponse | null;
  error: string | null;
}

function storageWorks() {
  const key = "nexa:diagnostic-probe";
  try {
    window.localStorage.setItem(key, "ok");
    const available = window.localStorage.getItem(key) === "ok";
    window.localStorage.removeItem(key);
    return available;
  } catch {
    return false;
  }
}

export default function DiagnosticsPage() {
  const [checking, setChecking] = useState(true);
  const [state, setState] = useState<DiagnosticState>({ online: true, storage: true, health: null, error: null });

  const runChecks = useCallback(async () => {
    setChecking(true);
    const online = navigator.onLine;
    const storage = storageWorks();
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const health = await response.json() as HealthResponse;
      setState({ online, storage, health, error: null });
    } catch (error) {
      setState({ online, storage, health: null, error: error instanceof Error ? error.message : "Unknown error" });
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void runChecks();
  }, [runChecks]);

  const serviceUp = Boolean(state.health?.ok);

  return (
    <main className="diagnostics-page">
      <section className="diagnostics-card">
        <header className="diagnostics-header">
          <div>
            <Image src="/assets/brand/nexa-logo.png" alt="NEXA" width={145} height={53} priority />
            <p className="eyebrow">Live diagnostics</p>
            <h1>تشخیص وضعیت اجرا</h1>
            <p>این صفحه فقط وضعیت فنی عمومی را نشان می‌دهد و هیچ دادهٔ شخصی یا کلید محرمانه‌ای نمایش نمی‌دهد.</p>
          </div>
          <span className={serviceUp ? "diagnostics-summary healthy" : "diagnostics-summary unhealthy"}>
            {serviceUp ? <CheckCircle2 size={20} /> : <TriangleAlert size={20} />}
            {serviceUp ? "سرویس در دسترس است" : "نیازمند بررسی"}
          </span>
        </header>

        <div className="diagnostics-grid">
          <DiagnosticItem label="اتصال مرورگر" value={state.online ? "Online" : "Offline"} ok={state.online} />
          <DiagnosticItem label="ذخیره‌سازی محلی" value={state.storage ? "Available" : "Blocked"} ok={state.storage} />
          <DiagnosticItem label="API سلامت" value={serviceUp ? "Healthy" : state.error ?? "Unavailable"} ok={serviceUp} />
          <DiagnosticItem label="مدل محصول" value={state.health?.model ?? "CM3500-24S"} ok />
          <DiagnosticItem label="نسخه" value={state.health?.version ?? "—"} ok={Boolean(state.health)} />
          <DiagnosticItem label="شناسهٔ ساخت" value={state.health?.commit ?? "—"} ok={Boolean(state.health)} />
        </div>

        {!state.online ? (
          <div className="diagnostics-note"><WifiOff size={18} /><p>اتصال اینترنت این مرورگر قطع است. پس از اتصال دوباره آزمون را اجرا کنید.</p></div>
        ) : null}

        <div className="diagnostics-actions">
          <button className="button button-primary" disabled={checking} onClick={() => void runChecks()}>
            <RefreshCw size={17} className={checking ? "spin" : undefined} />
            {checking ? "در حال بررسی" : "بررسی دوباره"}
          </button>
          <Link className="button button-secondary" href="/">بازگشت به برنامه</Link>
        </div>
        <p className="diagnostics-footnote">برای بررسی لایو، همین نشانی کامل را همراه با زمان رخداد خطا ارسال کنید.</p>
      </section>
    </main>
  );
}

function DiagnosticItem({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="diagnostics-item">
      <span>{label}</span>
      <strong>{value}</strong>
      <i className={ok ? "status-dot ok" : "status-dot failed"} aria-label={ok ? "سالم" : "ناموفق"} />
    </div>
  );
}
