"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, ArrowUpRight, FileWarning, Gauge, ShieldCheck } from "lucide-react";
import { productModels } from "@nexa/product-content";
import { AppShell } from "./app-shell";
import { useAcademy } from "./academy-provider";
import { Badge } from "./ui/badge";

export function ModelSelector() {
  const { locale, translate } = useAcademy();
  const Arrow = locale === "fa" ? ArrowUpLeft : ArrowUpRight;

  return (
    <AppShell compact>
      <main className="model-page">
        <header className="section-heading">
          <p className="eyebrow">{translate("common.model")} / 02</p>
          <h1>{translate("models.title")}</h1>
          <p>{translate("models.subtitle")}</p>
        </header>
        <div className="model-stage">
          {productModels.map((model, index) => {
            const verified = model.modelName.verificationStatus === "verified";
            return (
              <article className={`model-card ${verified ? "model-featured" : "model-missing"}`} key={model.id}>
                <div className="model-index">0{index + 1}</div>
                <div className="model-image-wrap">
                  <Image
                    className={verified ? "model-image" : "model-image model-placeholder"}
                    src={model.heroImage}
                    alt={model.modelName.value ?? translate("status.sourceRequired")}
                    width={580}
                    height={680}
                    priority={verified}
                  />
                </div>
                <div className="model-copy">
                  <Badge tone={verified ? "verified" : "missing"}>
                    {verified ? <ShieldCheck size={14} /> : <FileWarning size={14} />}
                    {verified ? translate("status.verified") : translate("status.missing")}
                  </Badge>
                  <p className="model-kicker">NEXA HYBRID SOLAR INVERTER</p>
                  <h2>{model.modelName.value ?? translate("status.sourceRequired")}</h2>
                  {verified ? (
                    <>
                      <div className="model-facts">
                        <span><strong>{model.ratedPowerKw.value}</strong> kW</span>
                        <span><strong>{model.batteryVoltageVdc.value}</strong> VDC</span>
                        <span><Gauge size={17} /> 94% peak</span>
                      </div>
                      <Link className="button button-primary button-lg" href={`/academy/${model.slug}`}>
                        {translate("models.explore")} <Arrow size={19} />
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="missing-note">
                        {locale === "fa"
                          ? "تصویر، دفترچه و دیتاشیت اختصاصی این مدل ارائه نشده است. مشخصات تا زمان دریافت منبع معتبر منتشر نمی‌شود."
                          : "No model-specific image, manual or datasheet was supplied. Specifications remain unpublished until a verified source is available."}
                      </p>
                      <button className="button button-secondary button-lg" disabled>
                        {translate("common.verificationRequired")}
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </AppShell>
  );
}
