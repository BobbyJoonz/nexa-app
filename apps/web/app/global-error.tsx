"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("NEXA root error", error);
  }, [error]);

  return (
    <html lang="fa" dir="rtl">
      <body>
        <main className="center-page">
          <section className="error-card" aria-labelledby="global-error-title">
            <img className="global-error-logo" src="/assets/brand/nexa-logo.png" alt="NEXA" width="164" height="60" />
            <span className="error-rule" aria-hidden="true" />
            <p className="eyebrow">Safe recovery</p>
            <h1 id="global-error-title">راه‌اندازی برنامه کامل نشد</h1>
            <p>یک خطای موقت در پوستهٔ برنامه رخ داده است. دوباره تلاش کنید یا صفحه را تازه‌سازی کنید.</p>
            {error.digest ? <code className="error-code">Trace: {error.digest}</code> : null}
            <button className="button button-primary" onClick={reset}>راه‌اندازی دوباره</button>
          </section>
        </main>
      </body>
    </html>
  );
}
