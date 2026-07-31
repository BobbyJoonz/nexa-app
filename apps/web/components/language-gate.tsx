"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Globe2 } from "lucide-react";
import { useAcademy } from "./academy-provider";
import { Button } from "./ui/button";

export function LanguageGate() {
  const router = useRouter();
  const { setLocale } = useAcademy();

  const choose = (locale: "fa" | "en") => {
    setLocale(locale);
    router.push("/models");
  };

  return (
    <main className="language-gate">
      <section className="language-copy">
        <div className="gate-brand">
          <Image src="/assets/brand/nexa-logo.png" width={148} height={55} alt="NEXA" priority />
          <span>Sunverter Academy</span>
        </div>
        <div className="gate-heading">
          <span className="eyebrow"><Globe2 size={16} /> Bilingual product learning</span>
          <h1>دانش فنی،<br />بدون پیچیدگی.</h1>
          <p>یک راهنمای تصویری و مستند برای شناخت، نصب ایمن و عیب‌یابی سانورتر NEXA.</p>
        </div>
        <div className="language-actions">
          <Button size="lg" onClick={() => choose("fa")}>
            فارسی
            <ArrowLeft size={19} />
          </Button>
          <Button size="lg" variant="secondary" onClick={() => choose("en")}>
            English
            <ArrowRight size={19} />
          </Button>
        </div>
        <p className="microcopy">زبان را هر زمان از نوار بالای برنامه تغییر دهید.</p>
      </section>
      <section className="language-visual" aria-label="NEXA CM3500-24S">
        <div className="tech-grid" />
        <div className="product-halo" />
        <Image
          className="gate-product"
          src="/assets/products/nexa-product-cutout.webp"
          alt="NEXA CM3500-24S hybrid solar inverter"
          width={760}
          height={920}
          priority
        />
        <div className="floating-readout readout-a">
          <span>POWER</span><strong>3.5 kW</strong>
        </div>
        <div className="floating-readout readout-b">
          <span>BATTERY</span><strong>24 VDC</strong>
        </div>
      </section>
    </main>
  );
}
