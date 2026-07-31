"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("NEXA route error", error);
  }, [error]);

  return (
    <main className="center-page">
      <section className="error-card" aria-labelledby="route-error-title">
        <Image src="/assets/brand/nexa-logo.png" alt="NEXA" width={164} height={60} priority />
        <span className="error-rule" aria-hidden="true" />
        <p className="eyebrow">Recovery mode</p>
        <h1 id="route-error-title">این بخش درست بارگذاری نشد</h1>
        <p>اطلاعات شما حذف نشده است. ابتدا دوباره تلاش کنید؛ اگر مشکل ادامه داشت، صفحهٔ تشخیص را برای بررسی باز کنید.</p>
        {error.digest ? <code className="error-code">Trace: {error.digest}</code> : null}
        <div className="error-actions">
          <button className="button button-primary" onClick={reset}>تلاش دوباره</button>
          <Link className="button button-secondary" href="/diagnostics">تشخیص وضعیت</Link>
        </div>
      </section>
    </main>
  );
}
