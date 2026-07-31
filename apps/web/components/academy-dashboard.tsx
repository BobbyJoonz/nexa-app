"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import {
  ArrowUpLeft,
  ArrowUpRight,
  BookOpenText,
  Check,
  ChevronLeft,
  ChevronRight,
  CircuitBoard,
  ShieldAlert,
  SlidersHorizontal,
  Wrench
} from "lucide-react";
import { getProduct, localize } from "@nexa/product-content";
import { AppShell } from "./app-shell";
import { useAcademy } from "./academy-provider";
import { Progress } from "./ui/progress";

const iconByLesson: Record<string, typeof BookOpenText> = {
  anatomy: CircuitBoard,
  safety: ShieldAlert,
  settings: SlidersHorizontal,
  troubleshooting: Wrench
};

export function AcademyDashboard() {
  const params = useParams<{ model: string }>();
  const product = getProduct(params.model);
  const { locale, completed, percent, translate } = useAcademy();
  if (!product || product.modelName.verificationStatus !== "verified") notFound();
  const Arrow = locale === "fa" ? ArrowUpLeft : ArrowUpRight;
  const SideArrow = locale === "fa" ? ChevronLeft : ChevronRight;
  const primaryLessons = product.lessons.slice(0, 6);
  const tools = product.lessons.slice(6);

  return (
    <AppShell>
      <main>
        <section className="academy-hero">
          <div className="academy-hero-copy">
            <p className="eyebrow">NEXA / {product.modelName.value}</p>
            <h1>{locale === "fa" ? "سانورترت را بشناس." : "Know your Sunverter."}</h1>
            <p className="hero-lead">
              {locale === "fa"
                ? "از مسیر انرژی تا کدهای خطا، هر بخش به صفحه مشخصی از دفترچه منبع متصل است."
                : "From energy flow to fault codes, every section is tied to a specific source page."}
            </p>
            <div className="hero-progress">
              <div>
                <span>{translate("academy.progress")}</span>
                <strong>{completed.length} / {product.lessons.length}</strong>
              </div>
              <Progress value={percent(product.lessons.length)} />
            </div>
            <div className="hero-actions">
              <Link className="button button-primary button-lg" href={`/academy/${product.slug}/${product.lessons[0]?.slug}`}>
                {translate("academy.start")} <Arrow size={19} />
              </Link>
              <Link className="hero-text-link" href={`/academy/${product.slug}/anatomy`}>
                {translate("academy.anatomy")}
              </Link>
              <Link className="hero-text-link" href={`/academy/${product.slug}/troubleshooting`}>
                {translate("academy.troubleshooting")}
              </Link>
            </div>
          </div>
          <div className="academy-product">
            <div className="product-orbit">
              <span>PV</span><span>AC</span><span>BAT</span>
            </div>
            <Image
              src={product.cutoutImage}
              alt={`NEXA ${product.modelName.value}`}
              width={650}
              height={790}
              priority
            />
          </div>
        </section>

        <section className="learning-roadmap content-width">
          <header className="section-row">
            <div>
              <p className="eyebrow">01 / FOUNDATION</p>
              <h2>{locale === "fa" ? "مسیر یادگیری" : "Learning path"}</h2>
            </div>
            <p>{locale === "fa" ? "گام‌به‌گام، از شناخت تا راه‌اندازی اولیه" : "Step by step, from orientation to first power-on"}</p>
          </header>
          <div className="roadmap-list">
            {primaryLessons.map((lesson, index) => {
              const done = completed.includes(lesson.id);
              return (
                <Link href={`/academy/${product.slug}/${lesson.slug}`} className="roadmap-item" key={lesson.id}>
                  <span className={`roadmap-number ${done ? "done" : ""}`}>{done ? <Check size={18} /> : String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <strong>{localize(lesson.title, locale)}</strong>
                    <small>{localize(lesson.summary, locale)}</small>
                  </span>
                  {lesson.safetyCritical && <span className="safety-dot" title="Safety critical" />}
                  <SideArrow size={20} />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="tool-section">
          <div className="content-width">
            <header className="section-row">
              <div>
                <p className="eyebrow">02 / FIELD TOOLS</p>
                <h2>{locale === "fa" ? "ابزارهای آموزشی" : "Learning tools"}</h2>
              </div>
            </header>
            <div className="tool-grid">
              {tools.map((lesson, index) => {
                const Icon = iconByLesson[lesson.id] ?? BookOpenText;
                return (
                  <Link
                    href={`/academy/${product.slug}/${lesson.slug}`}
                    className={`tool-card tool-card-${(index % 4) + 1}`}
                    key={lesson.id}
                  >
                    <span className="tool-icon"><Icon size={24} /></span>
                    <strong>{localize(lesson.title, locale)}</strong>
                    <p>{localize(lesson.summary, locale)}</p>
                    <Arrow size={18} />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
