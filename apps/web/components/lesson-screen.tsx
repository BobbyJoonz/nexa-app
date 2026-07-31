"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleStop,
  ExternalLink,
  FileText,
  Grid3X3,
  Home,
  Info,
  Search,
  ShieldAlert,
  Sun,
  Wrench
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  anatomy,
  connectionFacts,
  documents,
  faultCodes,
  getProduct,
  localize,
  settings,
  specifications,
  troubleshooting
} from "@nexa/product-content";
import { illustrationAssets } from "@nexa/illustrations";
import { AppShell } from "./app-shell";
import { useAcademy } from "./academy-provider";
import { Accordion } from "./ui/accordion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";
import { Tabs } from "./ui/tabs";

const sourceLabel = (fileName: string, page: number, locale: "en" | "fa") =>
  locale === "fa" ? `${fileName}، صفحه ${page}` : `${fileName}, page ${page}`;

function Diagram({ src, alt }: { src: string; alt: string }) {
  return <Image className="technical-diagram" src={src} alt={alt} width={1200} height={700} />;
}

function SourceNote({
  source,
  locale
}: {
  source: { fileName: string; page: number; section?: string };
  locale: "en" | "fa";
}) {
  return (
    <div className="source-note">
      <FileText size={16} />
      <span>{sourceLabel(source.fileName, source.page, locale)}</span>
      {source.section && <small>{source.section}</small>}
    </div>
  );
}

function Overview({ locale }: { locale: "en" | "fa" }) {
  const highlights = specifications.filter((item) =>
    ["rated-power", "battery-voltage", "pv-rated", "efficiency"].includes(item.id)
  );
  return (
    <div className="lesson-stack">
      <div className="diagram-panel">
        <Diagram src={illustrationAssets.energyFlow} alt="Solar, grid, battery and load energy flow" />
      </div>
      <div className="metric-strip">
        {highlights.map((item) => (
          <div key={item.id}>
            <span>{localize(item.label, locale)}</span>
            <strong>{item.value} {item.unit}</strong>
          </div>
        ))}
      </div>
      <div className="explain-grid">
        <div>
          <Sun size={24} />
          <h3>{locale === "fa" ? "روز: استفاده از خورشید" : "Day: use the sun"}</h3>
          <p>{locale === "fa" ? "MPPT انرژی پنل را برای بار و شارژ باتری مدیریت می‌کند." : "The MPPT manages panel energy for loads and battery charging."}</p>
        </div>
        <div>
          <BatteryCharging size={24} />
          <h3>{locale === "fa" ? "پشتیبان: باتری" : "Backup: battery"}</h3>
          <p>{locale === "fa" ? "در نبود منبع مناسب، سامانه باتری ۲۴ ولت بار را تغذیه می‌کند." : "When other sources are unavailable, the 24 V battery system supplies the load."}</p>
        </div>
        <div>
          <Grid3X3 size={24} />
          <h3>{locale === "fa" ? "شبکه: اولویت‌پذیر" : "Grid: configurable"}</h3>
          <p>{locale === "fa" ? "برنامه ۰۱ ترتیب استفاده از شبکه، خورشید و باتری را تعیین می‌کند." : "Program 01 sets the grid, solar and battery priority."}</p>
        </div>
      </div>
    </div>
  );
}

function Anatomy({ locale }: { locale: "en" | "fa" }) {
  return (
    <div className="anatomy-view">
      <div className="anatomy-product">
        <Image
          src="/assets/products/nexa-product-hotspots.webp"
          alt="NEXA CM3500-24S front view"
          width={820}
          height={1050}
        />
        {anatomy.map((point, index) => (
          <Dialog
            key={point.id}
            title={localize(point.label, locale)}
            trigger={
              <button
                className="hotspot"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                aria-label={localize(point.label, locale)}
              >
                {index + 1}
              </button>
            }
          >
            <p>
              {locale === "fa"
                ? "این بخش از روی نمای کلی محصول در دفترچه شناسایی شده است. پیش از لمس ترمینال‌ها، همه منابع انرژی باید توسط متخصص ایمن‌سازی شوند."
                : "This part is identified from the product overview. A qualified installer must isolate every energy source before terminals are touched."}
            </p>
            <SourceNote source={point.source} locale={locale} />
          </Dialog>
        ))}
      </div>
      <ol className="anatomy-key">
        {anatomy.map((point, index) => (
          <li key={point.id}><span>{index + 1}</span>{localize(point.label, locale)}</li>
        ))}
      </ol>
    </div>
  );
}

function Safety({ locale }: { locale: "en" | "fa" }) {
  const rules = locale === "fa"
    ? [
        ["خطر برق‌گرفتگی", "پیش از هر اتصال، همه کلیدها و منابع AC، PV و باتری را ایزوله کنید."],
        ["فقط نصاب متخصص", "اتصالات ثابت، حفاظت اضافه‌جریان و زمین حفاظتی باید توسط فرد واجد صلاحیت انجام شود."],
        ["محفظه را باز نکنید", "قطعات داخلی قابل سرویس توسط کاربر نیستند و خازن‌ها می‌توانند شارژ باقی‌مانده داشته باشند."],
        ["محیط مناسب", "دستگاه را روی سطح جامد و غیرقابل‌اشتعال، دور از رطوبت و مواد قابل اشتعال نصب کنید."]
      ]
    : [
        ["Electric-shock hazard", "Isolate every AC, PV and battery source before making a connection."],
        ["Qualified installer only", "Fixed wiring, over-current protection and protective earth require a qualified person."],
        ["Do not open the enclosure", "There are no user-serviceable internal parts, and capacitors can retain charge."],
        ["Suitable environment", "Mount on a solid non-combustible surface, away from moisture and flammable materials."]
      ];
  return (
    <div className="lesson-stack">
      <div className="safety-banner">
        <ShieldAlert size={32} />
        <div><strong>{locale === "fa" ? "این بخش ایمنی‌حیاتی است" : "Safety-critical section"}</strong><p>{locale === "fa" ? "کاربر نباید سیم‌کشی زنده یا تعمیر داخلی انجام دهد." : "Users must not perform live wiring or internal repairs."}</p></div>
      </div>
      <Diagram src={illustrationAssets.safety} alt="Safety severity scale" />
      <Accordion items={rules.map(([title, content], index) => ({
        id: String(index),
        title: title ?? "",
        content: <p>{content}</p>
      }))} />
    </div>
  );
}

function Installation({ locale }: { locale: "en" | "fa" }) {
  const steps = locale === "fa"
    ? ["بدنه، بسته‌بندی و اقلام همراه را از نظر آسیب بررسی کنید.", "سطح جامد، عمودی و غیرقابل‌اشتعال انتخاب کنید.", "فضای تهویه نشان‌داده‌شده را آزاد نگه دارید.", "پیش از سوراخ‌کاری، مسیر کابل و دسترسی سرویس را کنترل کنید."]
    : ["Inspect the enclosure, packaging and supplied items for damage.", "Choose a solid, vertical and non-combustible mounting surface.", "Keep the shown ventilation clearance unobstructed.", "Check cable routes and service access before drilling."];
  return (
    <div className="split-lesson">
      <div className="diagram-panel"><Diagram src={illustrationAssets.mounting} alt="Mounting clearances" /></div>
      <ol className="numbered-checklist">{steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
    </div>
  );
}

function Connections({ locale }: { locale: "en" | "fa" }) {
  const panels = [
    { value: "battery", label: locale === "fa" ? "باتری" : "Battery", src: illustrationAssets.battery, ids: ["battery-cable", "battery-strip", "battery-tin", "battery-torque"] },
    { value: "ac", label: "AC", src: illustrationAssets.ac, ids: ["ac-cable", "ac-torque"] },
    { value: "pv", label: "PV", src: illustrationAssets.pv, ids: ["pv-cable", "pv-torque"] }
  ];
  return (
    <div className="lesson-stack">
      <div className="safety-banner compact"><AlertTriangle size={24} /><p>{locale === "fa" ? "ترتیب و اجرای اتصال‌ها فقط برای نصاب متخصص است. نمودارها آموزشی‌اند." : "Connection sequence and execution are for qualified installers only. Diagrams are educational."}</p></div>
      <Tabs defaultValue="battery" tabs={panels.map((panel) => ({
        value: panel.value,
        label: panel.label,
        content: (
          <div className="connection-panel">
            <Diagram src={panel.src} alt={`${panel.label} connection`} />
            <dl className="fact-list">
              {connectionFacts.filter((fact) => panel.ids.includes(fact.id)).map((fact) => (
                <div key={fact.id}><dt>{localize(fact.label, locale)}</dt><dd>{fact.value}</dd></div>
              ))}
            </dl>
          </div>
        )
      }))} />
    </div>
  );
}

function FirstPowerOn({ locale }: { locale: "en" | "fa" }) {
  const items = locale === "fa"
    ? ["اتصال زمین حفاظتی توسط نصاب کنترل شده است.", "قطبیت و گشتاور ترمینال‌های باتری تأیید شده است.", "محدوده Voc آرایه PV با مشخصات دستگاه سازگار است.", "ورودی و خروجی AC جابه‌جا نشده‌اند.", "محفظه بسته و فضای تهویه آزاد است."]
    : ["Protective earth has been verified by the installer.", "Battery polarity and terminal torque are confirmed.", "The PV array Voc is within the inverter specification.", "AC input and output have not been reversed.", "The enclosure is closed and ventilation is clear."];
  const [checked, setChecked] = useState<string[]>([]);
  return (
    <div className="power-on-layout">
      <div>
        <p className="eyebrow">{checked.length} / {items.length}</p>
        <h3>{locale === "fa" ? "چک‌لیست پیش از روشن‌کردن" : "Pre-power checklist"}</h3>
        <div className="check-list">
          {items.map((item) => (
            <label key={item} className={checked.includes(item) ? "checked" : ""}>
              <input type="checkbox" checked={checked.includes(item)} onChange={() => setChecked((current) => current.includes(item) ? current.filter((x) => x !== item) : [...current, item])} />
              <span><Check size={16} /></span>{item}
            </label>
          ))}
        </div>
      </div>
      <div className={`power-switch ${checked.length === items.length ? "ready" : ""}`}>
        <CircleStop size={48} />
        <strong>{checked.length === items.length ? (locale === "fa" ? "آماده تحویل به نصاب" : "Ready for installer handoff") : (locale === "fa" ? "هنوز روشن نکنید" : "Do not power on yet")}</strong>
        <p>{locale === "fa" ? "این دکمه دستگاه واقعی را کنترل نمی‌کند." : "This control does not operate real hardware."}</p>
      </div>
    </div>
  );
}

function LcdSimulator({ locale }: { locale: "en" | "fa" }) {
  const screens = [
    { code: "230", label: locale === "fa" ? "ولتاژ ورودی" : "Input voltage", unit: "VAC" },
    { code: "24.8", label: locale === "fa" ? "ولتاژ باتری" : "Battery voltage", unit: "VDC" },
    { code: "560", label: locale === "fa" ? "توان PV" : "PV power", unit: "W" },
    { code: "35", label: locale === "fa" ? "درصد بار" : "Load percentage", unit: "%" }
  ];
  const [screen, setScreen] = useState(0);
  const next = (direction: number) => setScreen((current) => (current + direction + screens.length) % screens.length);
  const active = screens[screen]!;
  return (
    <div className="lcd-lab">
      <div className="lcd-device">
        <div className="lcd-screen">
          <span>{active.label}</span>
          <strong>{active.code}</strong>
          <small>{active.unit}</small>
          <div className="lcd-flow"><Sun size={16} /><ArrowRight size={20} /><BatteryCharging size={16} /><ArrowRight size={20} /><Home size={16} /></div>
        </div>
        <div className="lcd-buttons">
          <button onClick={() => next(-1)}>ESC</button>
          <button onClick={() => next(-1)}>▲</button>
          <button onClick={() => next(1)}>▼</button>
          <button onClick={() => next(1)}>ENTER</button>
        </div>
      </div>
      <div className="simulator-note"><Info size={18} /><p>{locale === "fa" ? "شبیه‌ساز آموزشی است. مقادیر نمونه‌اند و داده زنده دستگاه نیستند." : "Teaching simulator only. Values are examples, not live device data."}</p></div>
    </div>
  );
}

function SettingsExplorer({ locale }: { locale: "en" | "fa" }) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"basic" | "all">("basic");
  type SettingCategory = "all" | (typeof settings)[number]["category"];
  const [category, setCategory] = useState<SettingCategory>("all");
  const categories: SettingCategory[] = ["all", "power", "battery", "display", "safety", "advanced"];
  const filtered = useMemo(() => settings.filter((setting) => {
    const haystack = `${setting.number} ${setting.label.en} ${setting.label.fa} ${setting.summary.en} ${setting.summary.fa}`.toLowerCase();
    return (scope === "all" || setting.basic)
      && (category === "all" || setting.category === category)
      && haystack.includes(query.toLowerCase());
  }), [category, query, scope]);
  return (
    <div className="lesson-stack">
      <div className="filter-bar">
        <label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === "fa" ? "شماره یا عنوان برنامه" : "Program number or name"} /></label>
        <div className="segmented">
          <button className={scope === "basic" ? "active" : ""} onClick={() => setScope("basic")}>{locale === "fa" ? "پایه" : "Basic"}</button>
          <button className={scope === "all" ? "active" : ""} onClick={() => setScope("all")}>{locale === "fa" ? "همه ۳۱ برنامه" : "All 31"}</button>
        </div>
      </div>
      <div className="category-filters" aria-label={locale === "fa" ? "دسته‌بندی تنظیمات" : "Setting categories"}>
        {categories.map((item) => (
          <button className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>
            {item === "all" ? (locale === "fa" ? "همه دسته‌ها" : "All categories") : item}
          </button>
        ))}
      </div>
      <div className="settings-list">
        {filtered.map((setting) => (
          <article className="setting-row" key={setting.number}>
            <span className="program-number">{setting.number}</span>
            <div>
              <h3>{localize(setting.label, locale)}</h3>
              <p>{localize(setting.summary, locale)}</p>
              <div className="option-chips">{setting.options.map((option) => <span key={option.en}>{localize(option, locale)}</span>)}</div>
              <div className="setting-meta">
                <span>{locale === "fa" ? "پیش‌فرض" : "Default"}: {setting.defaultValue ? localize(setting.defaultValue, locale) : (locale === "fa" ? "در منبع مشخص نشده" : "Not stated")}</span>
                <span>{sourceLabel(setting.source.fileName, setting.source.page, locale)}</span>
              </div>
            </div>
            <Badge tone={setting.basic ? "verified" : "neutral"}>{setting.basic ? (locale === "fa" ? "پایه" : "Basic") : (locale === "fa" ? "پیشرفته" : "Advanced")}</Badge>
          </article>
        ))}
      </div>
    </div>
  );
}

function OperatingModes({ locale }: { locale: "en" | "fa" }) {
  const modes = ["Utility first", "Solar first", "SBU priority", "SUB priority", "SUF priority"];
  return (
    <div className="lesson-stack">
      <Diagram src={illustrationAssets.energyFlow} alt="Energy priority modes" />
      <Accordion items={modes.map((mode, index) => ({
        id: mode,
        title: mode,
        content: <p>{locale === "fa" ? `این گزینه یکی از اولویت‌های مستند برنامه ۰۱ است. پیش از تغییر، اثر آن بر شارژ باتری و پایداری بار را با نصاب بررسی کنید. ردیف ${index + 1}.` : "This is a documented Program 01 priority. Review its effect on battery charging and load continuity with the installer before changing it."}</p>
      }))} />
    </div>
  );
}

function BatteryLesson({ locale }: { locale: "en" | "fa" }) {
  return (
    <div className="lesson-stack">
      <Diagram src={illustrationAssets.charging} alt="Battery charging stages" />
      <div className="safety-banner compact"><AlertTriangle size={24} /><p>{locale === "fa" ? "متعادل‌سازی برای همه شیمی‌های باتری مناسب نیست. برنامه‌های ۳۳ تا ۳۹ فقط بر اساس سازنده باتری تنظیم شوند." : "Equalization is not suitable for every battery chemistry. Programs 33 to 39 must follow the battery manufacturer's instructions."}</p></div>
      <div className="metric-strip">
        <div><span>{locale === "fa" ? "شارژ کل" : "Total charge"}</span><strong>100 A max</strong></div>
        <div><span>{locale === "fa" ? "شارژ AC" : "AC charge"}</span><strong>60 A max</strong></div>
        <div><span>{locale === "fa" ? "سامانه" : "System"}</span><strong>24 VDC</strong></div>
      </div>
    </div>
  );
}

function FaultFinder({ locale }: { locale: "en" | "fa" }) {
  const [query, setQuery] = useState("");
  const filtered = faultCodes.filter((fault) => `${fault.code} ${fault.title.en} ${fault.title.fa}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="lesson-stack">
      <label className="search-field standalone"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === "fa" ? "کد خطا یا عنوان" : "Fault code or title"} /></label>
      <div className="fault-grid">
        {filtered.map((fault) => (
          <article className="fault-card" key={fault.code}>
            <span>{fault.code}</span>
            <h3>{localize(fault.title, locale)}</h3>
            <p>{localize(fault.safeCheck, locale)}</p>
            <Badge tone="warning">{locale === "fa" ? "ارجاع به سرویس" : "Service escalation"}</Badge>
          </article>
        ))}
      </div>
    </div>
  );
}

function Troubleshooting({ locale }: { locale: "en" | "fa" }) {
  const [node, setNode] = useState<"start" | "no-response" | "utility-battery" | "fault-code">("start");
  const current = troubleshooting[node];
  if (node === "start" && "choices" in current) {
    return (
      <div className="troubleshoot-panel">
        <Wrench size={32} />
        <h3>{localize(current.question, locale)}</h3>
        <div className="decision-list">{current.choices.map((choice) => (
          <button key={choice.next} onClick={() => setNode(choice.next)}>{localize(choice.label, locale)}<ChevronRight size={18} /></button>
        ))}</div>
      </div>
    );
  }
  if ("result" in current && "source" in current) {
    return (
      <div className="troubleshoot-panel result">
        <AlertTriangle size={32} />
        <h3>{localize(current.question, locale)}</h3>
        <p>{localize(current.result, locale)}</p>
        <SourceNote source={current.source} locale={locale} />
        <Button variant="secondary" onClick={() => setNode("start")}>{locale === "fa" ? "شروع دوباره" : "Start again"}</Button>
      </div>
    );
  }
  return null;
}

function Specifications({ locale }: { locale: "en" | "fa" }) {
  const groups = ["output", "battery", "solar", "physical", "environment"] as const;
  const labels = {
    output: locale === "fa" ? "خروجی" : "Output",
    battery: locale === "fa" ? "باتری و شارژ" : "Battery & charging",
    solar: locale === "fa" ? "ورودی خورشیدی" : "Solar input",
    physical: locale === "fa" ? "فیزیکی" : "Physical",
    environment: locale === "fa" ? "محیطی" : "Environment"
  };
  return (
    <div className="spec-groups">
      {groups.map((group) => (
        <section key={group}>
          <h3>{labels[group]}</h3>
          <dl>{specifications.filter((item) => item.group === group).map((item) => (
            <div key={item.id}><dt>{localize(item.label, locale)}</dt><dd>{item.value} {item.unit}</dd><Badge tone="verified">{locale === "fa" ? "تأییدشده" : "Verified"}</Badge></div>
          ))}</dl>
        </section>
      ))}
    </div>
  );
}

function Manuals({ locale }: { locale: "en" | "fa" }) {
  return (
    <div className="manual-list">
      {Object.values(documents).map((document) => (
        <a className="manual-row" href={`/documents/${document.fileName}`} target="_blank" rel="noreferrer" key={document.id}>
          <span className="manual-icon"><BookOpen size={22} /></span>
          <span><strong>{document.title}</strong><small>{document.language.toUpperCase()} · {document.pages} pages</small></span>
          <ExternalLink size={18} />
        </a>
      ))}
      <div className="missing-source-card">
        <AlertTriangle size={22} />
        <p>{locale === "fa" ? "دیتاشیت مستقل و منبع مدل دوم در فایل‌های تحویلی وجود نداشت." : "No standalone datasheet or second-model source was present in the supplied files."}</p>
      </div>
    </div>
  );
}

function Quiz({ locale }: { locale: "en" | "fa" }) {
  const [selected, setSelected] = useState<string | null>(null);
  const answer = "isolate";
  const options = [
    { id: "isolate", label: locale === "fa" ? "همه منابع AC، PV و باتری را ایزوله می‌کنم." : "Isolate all AC, PV and battery sources." },
    { id: "open", label: locale === "fa" ? "برای بررسی سریع، محفظه را باز می‌کنم." : "Open the enclosure for a quick check." },
    { id: "reset", label: locale === "fa" ? "بدون ثبت کد، دستگاه را چند بار ریست می‌کنم." : "Reset repeatedly without recording the code." }
  ];
  return (
    <div className="quiz-card">
      <p className="eyebrow">01 / 01</p>
      <h3>{locale === "fa" ? "پیش از بررسی یک اتصال، اولین اقدام چیست؟" : "Before checking a connection, what is the first action?"}</h3>
      <div className="quiz-options">{options.map((option) => <button className={selected === option.id ? "selected" : ""} onClick={() => setSelected(option.id)} key={option.id}>{option.label}</button>)}</div>
      {selected && <div className={`quiz-result ${selected === answer ? "correct" : "incorrect"}`}>{selected === answer ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}<p>{selected === answer ? (locale === "fa" ? "درست است. ایزوله‌سازی باید توسط فرد واجد صلاحیت انجام شود." : "Correct. Isolation must be carried out by a qualified person.") : (locale === "fa" ? "این اقدام ایمن نیست. به بخش ایمنی بازگردید." : "That is not safe. Review the safety section.")}</p></div>}
    </div>
  );
}

function ModuleContent({ module, locale }: { module: string; locale: "en" | "fa" }) {
  switch (module) {
    case "overview": return <Overview locale={locale} />;
    case "anatomy": return <Anatomy locale={locale} />;
    case "safety": return <Safety locale={locale} />;
    case "installation": return <Installation locale={locale} />;
    case "connections": return <Connections locale={locale} />;
    case "power-on": return <FirstPowerOn locale={locale} />;
    case "lcd": return <LcdSimulator locale={locale} />;
    case "settings": return <SettingsExplorer locale={locale} />;
    case "modes": return <OperatingModes locale={locale} />;
    case "battery": return <BatteryLesson locale={locale} />;
    case "faults": return <FaultFinder locale={locale} />;
    case "troubleshooting": return <Troubleshooting locale={locale} />;
    case "specifications": return <Specifications locale={locale} />;
    case "manuals": return <Manuals locale={locale} />;
    case "quiz": return <Quiz locale={locale} />;
    default: return null;
  }
}

export function LessonScreen() {
  const params = useParams<{ model: string; module: string }>();
  const product = getProduct(params.model);
  const { locale, completed, toggleLesson, translate } = useAcademy();
  const lessonIndex = product?.lessons.findIndex((item) => item.slug === params.module) ?? -1;
  const lesson = product?.lessons[lessonIndex];
  if (!product || !lesson || product.modelName.verificationStatus !== "verified") notFound();
  const done = completed.includes(lesson.id);
  const previous = product.lessons[lessonIndex - 1];
  const next = product.lessons[lessonIndex + 1];
  const Back = locale === "fa" ? ArrowRight : ArrowLeft;
  const Forward = locale === "fa" ? ChevronLeft : ChevronRight;

  return (
    <AppShell>
      <main className="lesson-page">
        <aside className="lesson-sidebar">
          <Link className="sidebar-back" href={`/academy/${product.slug}`}><Back size={18} />{translate("nav.academy")}</Link>
          <p className="sidebar-model">NEXA<br /><strong>{product.modelName.value}</strong></p>
          <nav>
            {product.lessons.map((item, index) => (
              <Link className={`${item.slug === lesson.slug ? "active" : ""} ${completed.includes(item.id) ? "complete" : ""}`} href={`/academy/${product.slug}/${item.slug}`} key={item.id}>
                <span>{completed.includes(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, "0")}</span>
                {localize(item.title, locale)}
              </Link>
            ))}
          </nav>
        </aside>
        <article className="lesson-main">
          <header className="lesson-header">
            <div>
              <p className="eyebrow">{String(lessonIndex + 1).padStart(2, "0")} / {String(product.lessons.length).padStart(2, "0")}</p>
              <h1>{localize(lesson.title, locale)}</h1>
              <p>{localize(lesson.summary, locale)}</p>
            </div>
            {lesson.safetyCritical && <Badge tone="warning"><ShieldAlert size={14} />{locale === "fa" ? "ایمنی‌حیاتی" : "Safety critical"}</Badge>}
          </header>
          <ModuleContent module={lesson.slug} locale={locale} />
          <SourceNote source={lesson.source} locale={locale} />
          <div className="lesson-complete">
            <Button variant={done ? "secondary" : "primary"} onClick={() => toggleLesson(lesson.id)}>
              {done ? <Check size={18} /> : null}
              {done ? translate("common.understood") : translate("common.markUnderstood")}
            </Button>
          </div>
          <nav className="lesson-pagination">
            {previous ? <Link href={`/academy/${product.slug}/${previous.slug}`}><Back size={18} /><span><small>{translate("common.previous")}</small>{localize(previous.title, locale)}</span></Link> : <span />}
            {next ? <Link href={`/academy/${product.slug}/${next.slug}`}><span><small>{translate("common.next")}</small>{localize(next.title, locale)}</span><Forward size={18} /></Link> : <span />}
          </nav>
        </article>
      </main>
    </AppShell>
  );
}
