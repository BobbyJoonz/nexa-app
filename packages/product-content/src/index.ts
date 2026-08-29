import {
  productModelSchema,
  type FaultCode,
  type LessonModule,
  type LocalizedText,
  type ProductModel,
  type SettingProgram,
  type SourceReference
} from "@nexa/schemas";

const bilingual = (en: string, fa: string): LocalizedText => ({ en, fa });

export const documents = {
  nexaEnglish: {
    id: "manual-nexa-acm35-en",
    fileName: "manual-sunverteracm35kw(2).pdf",
    title: "NEXA Hybrid Solar Inverter/Charger User Manual",
    language: "en",
    pages: 27,
    verificationDate: "2026-07-31"
  },
  astarEnglish: {
    id: "manual-astar-acm35-en",
    fileName: "manual-sunverteracm35kw(3).pdf",
    title: "Original CM 3.5KW English reference manual",
    language: "en",
    pages: 28,
    verificationDate: "2026-07-31"
  },
  persianManual: {
    id: "manual-cm3500-fa",
    fileName: "CM3500-24S Persian User Manual.pdf",
    title: "دفترچه راهنمای کاربر CM3500-24S",
    language: "fa",
    pages: 29,
    verificationDate: "2026-07-31"
  },
  persianQuickStart: {
    id: "quickstart-cm3500-fa",
    fileName: "CM3500-24S Persian Quick Start.pdf",
    title: "دفترچه راهنمای سریع کاربر CM3500-24S",
    language: "fa",
    pages: 14,
    verificationDate: "2026-07-31"
  }
} as const;

const ref = (
  page: number,
  section: string,
  document: keyof typeof documents = "nexaEnglish"
): SourceReference => ({
  documentId: documents[document].id,
  fileName: documents[document].fileName,
  page,
  section
});

const lesson = (
  id: string,
  en: string,
  fa: string,
  summaryEn: string,
  summaryFa: string,
  source: SourceReference,
  safetyCritical = false
): LessonModule => ({
  id,
  slug: id,
  title: bilingual(en, fa),
  summary: bilingual(summaryEn, summaryFa),
  source,
  safetyCritical
});

export const lessons: LessonModule[] = [
  lesson("overview", "Product overview", "معرفی محصول", "See how solar, grid, battery and loads work through this hybrid inverter.", "نقش پنل خورشیدی، برق شهری، باتری و بار را در این اینورتر هیبریدی ببینید.", ref(4, "Product overview")),
  lesson("anatomy", "Interactive anatomy", "آناتومی تعاملی", "Identify the verified external controls, indicators and terminals.", "کنترل‌ها، نشانگرها و ترمینال‌های خارجی تأییدشده را بشناسید.", ref(4, "Product overview")),
  lesson("safety", "Safety academy", "آکادمی ایمنی", "Review the source-backed rules that protect people, batteries and equipment.", "قواعد مستند برای حفاظت از افراد، باتری و تجهیزات را مرور کنید.", ref(3, "Safety instructions"), true),
  lesson("installation", "Unboxing and installation", "بازگشایی و نصب", "Inspect, prepare and mount the unit on a solid non-combustible surface.", "دستگاه را بررسی، آماده و روی سطح محکم و غیرقابل‌اشتعال نصب کنید.", ref(5, "Installation"), true),
  lesson("connections", "Connections", "اتصالات", "Learn the verified battery, AC, earth and PV connection sequence.", "ترتیب تأییدشده اتصال باتری، AC، زمین و PV را یاد بگیرید.", ref(6, "Battery connection"), true),
  lesson("power-on", "First power-on", "روشن‌کردن اولیه", "Use a non-destructive checklist before operating the front power switch.", "پیش از استفاده از کلید جلویی، چک‌لیست غیرمخرب را کامل کنید.", ref(11, "Power on/off"), true),
  lesson("lcd", "LCD simulator", "شبیه‌ساز LCD", "Practice ESC, UP, DOWN and ENTER without controlling real hardware.", "بدون کنترل سخت‌افزار واقعی، کار با ESC، UP، DOWN و ENTER را تمرین کنید.", ref(11, "Operation and display panel")),
  lesson("settings", "Settings explorer", "مرورگر تنظیمات", "Search every program verified in the supplied manual.", "همه برنامه‌های تنظیمی تأییدشده در دفترچه پیوست را جست‌وجو کنید.", ref(12, "LCD setting")),
  lesson("modes", "Operating modes", "حالت‌های کاری", "Compare Utility, Solar, SBU, SUB and SUF energy priorities.", "اولویت‌های انرژی Utility، Solar، SBU، SUB و SUF را مقایسه کنید.", ref(12, "Program 01")),
  lesson("battery", "Battery and charging", "باتری و شارژ", "Understand bulk, absorption, float and equalization stages.", "مراحل شارژ سریع، جذب، شناور و متعادل‌سازی را بشناسید.", ref(19, "Battery equalization"), true),
  lesson("faults", "Fault code finder", "یابنده کد خطا", "Search verified fault codes and stop at safe user-level checks.", "کدهای خطای تأییدشده را جست‌وجو کنید و فقط بررسی‌های ایمن کاربر را انجام دهید.", ref(22, "Fault reference code"), true),
  lesson("troubleshooting", "Troubleshooting tree", "درخت عیب‌یابی", "Answer one question at a time and escalate safely when required.", "هر بار به یک سؤال پاسخ دهید و در صورت نیاز، ایمن به متخصص ارجاع دهید.", ref(27, "Troubleshooting"), true),
  lesson("specifications", "Specifications", "مشخصات فنی", "Read grouped model-specific values with source and verification status.", "مقادیر مدل را همراه منبع و وضعیت تأیید، گروه‌بندی‌شده ببینید.", ref(24, "Specifications")),
  lesson("manuals", "Manuals and sources", "دفترچه‌ها و منابع", "Open every preserved source document and its applicability notes.", "همه اسناد منبع حفظ‌شده و یادداشت دامنه کاربرد آن‌ها را باز کنید.", ref(2, "Table of contents")),
  lesson("quiz", "Knowledge check", "ارزیابی دانش", "Use calm source-backed questions to review what you understood.", "با پرسش‌های آرام و مستند، آموخته‌های خود را مرور کنید.", ref(3, "Safety instructions"), true)
];

const setting = (
  number: string,
  en: string,
  fa: string,
  summaryEn: string,
  summaryFa: string,
  options: LocalizedText[],
  defaultValue: LocalizedText | null,
  category: SettingProgram["category"],
  basic: boolean,
  page: number
): SettingProgram => ({
  number,
  label: bilingual(en, fa),
  summary: bilingual(summaryEn, summaryFa),
  options,
  defaultValue,
  category,
  basic,
  source: ref(page, `Program ${number}`)
});

const enabledDisabled = [
  bilingual("Enable", "فعال"),
  bilingual("Disable", "غیرفعال")
];

export const settings: SettingProgram[] = [
  setting("01", "Output source priority", "اولویت منبع خروجی", "Sets the order used to supply connected loads.", "ترتیب تأمین برق بارهای متصل را تعیین می‌کند.", [
    bilingual("Utility first", "برق شهری"),
    bilingual("Solar first", "اولویت خورشیدی"),
    bilingual("SBU priority", "اولویت SBU"),
    bilingual("SUB priority", "اولویت SUB"),
    bilingual("SUF priority", "اولویت SUF")
  ], bilingual("Utility first", "برق شهری"), "power", true, 12),
  setting("02", "Maximum total charging current", "حداکثر جریان کل شارژ", "Limits combined solar and utility charging current.", "مجموع جریان شارژ خورشیدی و برق شهری را محدود می‌کند.", [
    bilingual("10-100 A, subject to AC current limit", "۱۰ تا ۱۰۰ آمپر با رعایت محدودیت جریان AC")
  ], bilingual("60 A", "۶۰ آمپر"), "battery", true, 13),
  setting("03", "AC input voltage range", "محدوده ولتاژ ورودی AC", "Selects Appliance, UPS or Generator input behavior.", "رفتار ورودی لوازم خانگی، UPS یا ژنراتور را انتخاب می‌کند.", [
    bilingual("Appliance: 90-280 VAC", "لوازم خانگی: ۹۰ تا ۲۸۰ ولت AC"),
    bilingual("UPS: 170-280 VAC", "UPS: ۱۷۰ تا ۲۸۰ ولت AC"),
    bilingual("Generator: 90-280 VAC", "ژنراتور: ۹۰ تا ۲۸۰ ولت AC")
  ], bilingual("Appliance", "لوازم خانگی"), "power", true, 13),
  setting("05", "Battery type", "نوع باتری", "Selects the charging profile and exposes dependent voltage programs.", "پروفایل شارژ را انتخاب و برنامه‌های وابسته ولتاژ را فعال می‌کند.", [
    bilingual("AGM", "AGM"),
    bilingual("Flooded", "اسیدی"),
    bilingual("User-defined", "تعریف‌شده توسط کاربر"),
    bilingual("Lithium without communication", "لیتیوم بدون ارتباط")
  ], bilingual("AGM", "AGM"), "battery", true, 13),
  setting("06", "Auto restart after overload", "راه‌اندازی خودکار پس از اضافه‌بار", "Controls restart after an overload shutdown.", "راه‌اندازی پس از خاموشی ناشی از اضافه‌بار را کنترل می‌کند.", enabledDisabled, bilingual("Enable", "فعال"), "safety", true, 14),
  setting("07", "Auto restart after over-temperature", "راه‌اندازی خودکار پس از افزایش دما", "Controls restart after an over-temperature shutdown.", "راه‌اندازی پس از خاموشی ناشی از دمای زیاد را کنترل می‌کند.", enabledDisabled, bilingual("Enable", "فعال"), "safety", true, 14),
  setting("08", "Output voltage", "ولتاژ خروجی", "Selects the nominal inverter output voltage.", "ولتاژ نامی خروجی اینورتر را تعیین می‌کند.", [
    bilingual("220 VAC", "۲۲۰ ولت AC"),
    bilingual("230 VAC", "۲۳۰ ولت AC"),
    bilingual("240 VAC", "۲۴۰ ولت AC")
  ], bilingual("230 VAC", "۲۳۰ ولت AC"), "power", true, 14),
  setting("09", "Output frequency", "فرکانس خروجی", "Selects nominal output frequency.", "فرکانس نامی خروجی را تعیین می‌کند.", [
    bilingual("50 Hz", "۵۰ هرتز"),
    bilingual("60 Hz", "۶۰ هرتز")
  ], bilingual("50 Hz", "۵۰ هرتز"), "power", true, 14),
  setting("10", "Automatic bypass", "بای‌پس خودکار", "Allows utility bypass while the power switch is off when utility is normal.", "در صورت عادی بودن برق شهر، بای‌پس را هنگام خاموش بودن کلید مجاز می‌کند.", [
    bilingual("Manual", "دستی"),
    bilingual("Automatic", "خودکار")
  ], bilingual("Manual", "دستی"), "power", false, 14),
  setting("11", "Maximum utility charging current", "حداکثر جریان شارژ برق شهری", "Limits AC charging current and constrains program 02.", "جریان شارژ AC را محدود می‌کند و روی برنامه ۰۲ اثر دارد.", [
    bilingual("0-60 A, model specification limit applies", "۰ تا ۶۰ آمپر با رعایت محدودیت مشخصات مدل")
  ], bilingual("30 A", "۳۰ آمپر"), "battery", true, 14),
  setting("12", "Back to utility voltage", "ولتاژ بازگشت به برق شهری", "Used with SBU or Solar first priority.", "با اولویت SBU یا Solar first استفاده می‌شود.", [
    bilingual("24 V model: 22.0-28.6 V", "مدل ۲۴ ولت: ۲۲ تا ۲۸٫۶ ولت")
  ], bilingual("23 V", "۲۳ ولت"), "battery", false, 14),
  setting("13", "Back to battery voltage", "ولتاژ بازگشت به باتری", "Sets the return point after utility operation.", "نقطه بازگشت از برق شهری به باتری را تعیین می‌کند.", [
    bilingual("Full battery or configurable threshold", "باتری کامل یا آستانه قابل تنظیم")
  ], bilingual("Full battery", "باتری کامل"), "battery", false, 14),
  setting("16", "Charger source priority", "اولویت منبع شارژ", "Sets how solar and utility charge the battery.", "نحوه شارژ باتری با خورشیدی و برق شهری را تعیین می‌کند.", [
    bilingual("Solar first", "اولویت خورشیدی"),
    bilingual("Solar and utility", "خورشیدی و برق شهری"),
    bilingual("Only solar", "فقط خورشیدی")
  ], bilingual("Solar and utility", "خورشیدی و برق شهری"), "battery", true, 15),
  setting("18", "Buzzer mode", "حالت بیزر", "Controls which state changes and faults produce sound.", "تعیین می‌کند کدام تغییر وضعیت‌ها و خطاها صدا تولید کنند.", [
    bilingual("Mode 1: mute", "حالت ۱: بی‌صدا"),
    bilingual("Mode 2", "حالت ۲"),
    bilingual("Mode 3", "حالت ۳"),
    bilingual("Mode 4", "حالت ۴")
  ], bilingual("Mode 4", "حالت ۴"), "display", false, 15),
  setting("19", "Auto return display", "بازگشت خودکار نمایشگر", "Returns to the default input/output screen after one minute.", "پس از یک دقیقه به صفحه پیش‌فرض ورودی و خروجی بازمی‌گردد.", [
    bilingual("Return to default", "بازگشت به پیش‌فرض"),
    bilingual("Stay on last screen", "ماندن روی آخرین صفحه")
  ], bilingual("Return to default", "بازگشت به پیش‌فرض"), "display", true, 15),
  setting("20", "Backlight control", "کنترل نور پس‌زمینه", "Turns the LCD backlight behavior on or off.", "رفتار نور پس‌زمینه LCD را فعال یا غیرفعال می‌کند.", enabledDisabled, bilingual("Enable", "فعال"), "display", true, 15),
  setting("23", "Overload bypass", "بای‌پس اضافه‌بار", "Transfers to line mode after a battery-mode overload when enabled.", "در صورت فعال بودن، پس از اضافه‌بار حالت باتری به حالت خط منتقل می‌شود.", enabledDisabled, bilingual("Disable", "غیرفعال"), "safety", false, 15),
  setting("25", "Modbus ID", "شناسه Modbus", "Assigns the communication address.", "آدرس ارتباطی دستگاه را تعیین می‌کند.", [
    bilingual("001-247", "۰۰۱ تا ۲۴۷")
  ], bilingual("001", "۰۰۱"), "advanced", false, 16),
  setting("26", "Bulk charging voltage", "ولتاژ شارژ سریع", "Available for User-defined battery type.", "برای نوع باتری تعریف‌شده توسط کاربر در دسترس است.", [
    bilingual("24 V model: 24.0-30.0 V, 0.1 V steps", "مدل ۲۴ ولت: ۲۴ تا ۳۰ ولت با گام ۰٫۱ ولت")
  ], bilingual("28.2 V", "۲۸٫۲ ولت"), "battery", false, 16),
  setting("27", "Floating charging voltage", "ولتاژ شارژ شناور", "Available for User-defined battery type.", "برای نوع باتری تعریف‌شده توسط کاربر در دسترس است.", [
    bilingual("24 V model: 24.0 V to Program 26", "مدل ۲۴ ولت: از ۲۴ ولت تا مقدار برنامه ۲۶")
  ], bilingual("27.0 V", "۲۷ ولت"), "battery", false, 16),
  setting("29", "Low DC cut-off voltage", "ولتاژ قطع پایین DC", "Sets the fixed low-voltage cut-off for User-defined battery type.", "قطع ولتاژ پایین ثابت را برای باتری تعریف‌شده توسط کاربر تعیین می‌کند.", [
    bilingual("24 V model: 20.0-27.0 V", "مدل ۲۴ ولت: ۲۰ تا ۲۷ ولت")
  ], bilingual("21.0 V", "۲۱ ولت"), "battery", false, 16),
  setting("32", "Bulk charge duration", "زمان شارژ سریع", "Sets or automatically calculates the constant-voltage stage duration.", "مدت مرحله ولتاژ ثابت را تعیین یا به‌صورت خودکار محاسبه می‌کند.", [
    bilingual("Automatic", "خودکار"),
    bilingual("5-900 minutes, 5 minute steps", "۵ تا ۹۰۰ دقیقه با گام ۵ دقیقه")
  ], bilingual("Automatic", "خودکار"), "battery", false, 16),
  setting("33", "Battery equalization", "متعادل‌سازی باتری", "Available for Flooded or User-defined lead-acid profiles.", "برای پروفایل اسیدی یا تعریف‌شده توسط کاربر در دسترس است.", enabledDisabled, bilingual("Disable", "غیرفعال"), "battery", false, 16),
  setting("34", "Battery equalization voltage", "ولتاژ متعادل‌سازی باتری", "Sets the equalization target when program 33 is enabled.", "هدف ولتاژ متعادل‌سازی را هنگام فعال بودن برنامه ۳۳ تعیین می‌کند.", [
    bilingual("24 V model: float voltage to 30.0 V", "مدل ۲۴ ولت: از ولتاژ شناور تا ۳۰ ولت")
  ], bilingual("29.2 V", "۲۹٫۲ ولت"), "battery", false, 17),
  setting("35", "Battery equalized time", "زمان متعادل‌سازی باتری", "Controls the equalization duration.", "مدت متعادل‌سازی را کنترل می‌کند.", [
    bilingual("0-900 minutes", "۰ تا ۹۰۰ دقیقه")
  ], bilingual("60 minutes", "۶۰ دقیقه"), "battery", false, 17),
  setting("36", "Battery equalized timeout", "مهلت متعادل‌سازی باتری", "Limits the extended equalization wait.", "زمان انتظار تمدیدشده متعادل‌سازی را محدود می‌کند.", [
    bilingual("0-900 minutes", "۰ تا ۹۰۰ دقیقه")
  ], bilingual("120 minutes", "۱۲۰ دقیقه"), "battery", false, 17),
  setting("37", "Equalization interval", "فاصله متعادل‌سازی", "Sets the number of days between scheduled equalization cycles.", "فاصله روزهای بین چرخه‌های متعادل‌سازی را تعیین می‌کند.", [
    bilingual("1-90 days", "۱ تا ۹۰ روز")
  ], bilingual("30 days", "۳۰ روز"), "battery", false, 17),
  setting("39", "Immediate equalization", "متعادل‌سازی فوری", "Starts one equalization cycle when the feature is enabled.", "در صورت فعال بودن قابلیت، یک چرخه متعادل‌سازی را آغاز می‌کند.", enabledDisabled, bilingual("Disable", "غیرفعال"), "battery", false, 17),
  setting("41", "Automatic lithium activation", "فعال‌سازی خودکار باتری لیتیومی", "Reserved for models that support lithium activation.", "برای مدل‌های دارای پشتیبانی فعال‌سازی لیتیوم رزرو شده است.", enabledDisabled, bilingual("Disable", "غیرفعال"), "advanced", false, 17),
  setting("42", "Manual lithium activation", "فعال‌سازی دستی باتری لیتیومی", "Reserved for models that support lithium activation.", "برای مدل‌های دارای پشتیبانی فعال‌سازی لیتیوم رزرو شده است.", enabledDisabled, bilingual("Disable", "غیرفعال"), "advanced", false, 17),
  setting("46", "Maximum discharge-current protection", "حفاظت حداکثر جریان دشارژ", "Single-unit behavior documented with a 20-500 A range.", "رفتار مدل تکی با محدوده ۲۰ تا ۵۰۰ آمپر مستند شده است.", [
    bilingual("Off", "خاموش"),
    bilingual("20-500 A", "۲۰ تا ۵۰۰ آمپر")
  ], bilingual("Off", "خاموش"), "safety", false, 18)
];

const fault = (code: string, en: string, fa: string): FaultCode => ({
  code,
  title: bilingual(en, fa),
  safeCheck: bilingual(
    "Stop operation, note the code and follow only the manual's user-level checks.",
    "کار را متوقف کنید، کد را یادداشت کنید و فقط بررسی‌های سطح کاربر دفترچه را انجام دهید."
  ),
  escalation: true,
  source: ref(22, `Fault code ${code}`)
});

export const faultCodes: FaultCode[] = [
  fault("01", "Inverter module over-temperature", "دمای بیش از حد ماژول اینورتر"),
  fault("02", "DCDC module over-temperature", "دمای بیش از حد ماژول DCDC"),
  fault("03", "Battery voltage too high", "ولتاژ باتری خیلی بالاست"),
  fault("04", "PV module over-temperature", "دمای بیش از حد ماژول PV"),
  fault("05", "Output short-circuited", "خروجی اتصال کوتاه شده است"),
  fault("06", "Output voltage too high", "ولتاژ خروجی خیلی زیاد است"),
  fault("07", "Overload timeout", "زمان اضافه‌بار تمام شده است"),
  fault("08", "Bus voltage too high", "ولتاژ باس خیلی زیاد است"),
  fault("09", "Bus soft-start failed", "راه‌اندازی نرم باس ناموفق بود"),
  fault("10", "PV over-current", "اضافه‌جریان PV"),
  fault("11", "PV over-voltage", "اضافه‌ولتاژ PV"),
  fault("12", "DCDC over-current", "اضافه‌جریان DCDC"),
  fault("13", "Over-current", "اضافه‌جریان"),
  fault("14", "Bus voltage too low", "ولتاژ باس خیلی پایین است"),
  fault("15", "Inverter self-checking fault", "خطای خودآزمایی اینورتر"),
  fault("18", "Operational current offset too high", "آفست جریان عملیاتی خیلی زیاد است"),
  fault("19", "Inverter current offset too high", "آفست جریان اینورتر خیلی زیاد است"),
  fault("20", "DC/DC current offset too high", "آفست جریان DC/DC خیلی زیاد است"),
  fault("21", "PV current offset too high", "آفست جریان PV خیلی زیاد است"),
  fault("22", "Output voltage too low", "ولتاژ خروجی خیلی کم است"),
  fault("23", "Inverter negative power", "توان منفی اینورتر")
];

export interface Specification {
  id: string;
  label: LocalizedText;
  value: string;
  unit?: string;
  verificationStatus: "verified" | "conflicting" | "missing" | "needs-review";
  source: SourceReference;
  group: "output" | "battery" | "solar" | "physical" | "environment";
}

export const specifications: Specification[] = [
  { id: "rated-power", label: bilingual("Rated output power", "توان نامی خروجی"), value: "3.5", unit: "kVA / kW", verificationStatus: "verified", source: ref(26, "Table 2", "persianManual"), group: "output" },
  { id: "waveform", label: bilingual("Output waveform", "شکل موج خروجی"), value: "Pure sine wave", verificationStatus: "verified", source: ref(25, "Table 2"), group: "output" },
  { id: "voltage-regulation", label: bilingual("Output voltage regulation", "تنظیم ولتاژ خروجی"), value: "230 VAC ±5%", verificationStatus: "verified", source: ref(25, "Table 2"), group: "output" },
  { id: "frequency", label: bilingual("Output frequency", "فرکانس خروجی"), value: "50 / 60", unit: "Hz", verificationStatus: "verified", source: ref(25, "Table 2"), group: "output" },
  { id: "efficiency", label: bilingual("Peak efficiency", "حداکثر بازده"), value: "94", unit: "%", verificationStatus: "verified", source: ref(25, "Table 2"), group: "output" },
  { id: "surge", label: bilingual("Surge capacity", "توان لحظه‌ای"), value: "2× rated power for 5 seconds", verificationStatus: "verified", source: ref(25, "Table 2"), group: "output" },
  { id: "battery-voltage", label: bilingual("Battery-system voltage", "ولتاژ سامانه باتری"), value: "24", unit: "VDC", verificationStatus: "verified", source: ref(2, "Model title", "persianManual"), group: "battery" },
  { id: "max-total-charge", label: bilingual("Maximum total charging current", "حداکثر جریان کل شارژ"), value: "100", unit: "A", verificationStatus: "verified", source: ref(26, "Table 3"), group: "battery" },
  { id: "max-ac-charge", label: bilingual("Maximum utility charging current", "حداکثر جریان شارژ برق شهری"), value: "60", unit: "A", verificationStatus: "verified", source: ref(26, "Table 3"), group: "battery" },
  { id: "pv-rated", label: bilingual("Rated PV input power", "توان نامی ورودی PV"), value: "4000", unit: "W", verificationStatus: "verified", source: ref(26, "Solar input"), group: "solar" },
  { id: "pv-voc", label: bilingual("Maximum PV open-circuit voltage", "حداکثر ولتاژ مدار باز PV"), value: "500", unit: "VDC", verificationStatus: "verified", source: ref(26, "Solar input"), group: "solar" },
  { id: "mppt", label: bilingual("PV MPPT voltage range", "محدوده ولتاژ MPPT"), value: "30-500", unit: "VDC", verificationStatus: "verified", source: ref(26, "Solar input"), group: "solar" },
  { id: "pv-current", label: bilingual("Maximum PV input current", "حداکثر جریان ورودی PV"), value: "15", unit: "A", verificationStatus: "verified", source: ref(26, "Solar input"), group: "solar" },
  { id: "dimensions", label: bilingual("Dimensions (D×W×H)", "ابعاد (عمق×عرض×ارتفاع)"), value: "330×278×98", unit: "mm", verificationStatus: "verified", source: ref(28, "Table 4", "persianManual"), group: "physical" },
  { id: "weight", label: bilingual("Net weight", "وزن خالص"), value: "4.4", unit: "kg", verificationStatus: "verified", source: ref(28, "Table 4", "persianManual"), group: "physical" },
  { id: "operating-temp", label: bilingual("Operating temperature", "دمای کارکرد"), value: "-10 to 55", unit: "°C", verificationStatus: "verified", source: ref(28, "Table 4", "persianManual"), group: "environment" },
  { id: "storage-temp", label: bilingual("Storage temperature", "دمای نگهداری"), value: "-15 to 60", unit: "°C", verificationStatus: "verified", source: ref(28, "Table 4", "persianManual"), group: "environment" },
  { id: "humidity", label: bilingual("Relative humidity", "رطوبت نسبی"), value: "5-95, non-condensing", unit: "%", verificationStatus: "verified", source: ref(28, "Table 4", "persianManual"), group: "environment" }
];

/* ------------------------------------------------------------------ */
/* Device electrical limits — extracted from VERIFIED specification     */
/* rows above so the sizing calculator can never drift from the source  */
/* data. Any content regression here throws at import time.             */
/* ------------------------------------------------------------------ */

function limitRow(id: string): Specification {
  const row = specifications.find((item) => item.id === id);
  if (!row) throw new Error(`deviceLimits: specification "${id}" disappeared from the verified table`);
  if (row.verificationStatus !== "verified") throw new Error(`deviceLimits: specification "${id}" is no longer verified`);
  return row;
}

function limitNumber(id: string, unit?: string): number {
  const row = limitRow(id);
  if (unit && row.unit !== unit) throw new Error(`deviceLimits: "${id}" unit changed to "${String(row.unit)}"`);
  const parsed = Number(row.value);
  if (!Number.isFinite(parsed)) throw new Error(`deviceLimits: "${id}" is no longer a plain number ("${row.value}")`);
  return parsed;
}

function limitRange(id: string): { min: number; max: number } {
  const raw = limitRow(id).value;
  const match = /^(-?\d+(?:\.\d+)?)-(-?\d+(?:\.\d+)?)$/.exec(raw.trim());
  if (!match || !match[1] || !match[2]) throw new Error(`deviceLimits: "${id}" is no longer a range ("${raw}")`);
  return { min: Number(match[1]), max: Number(match[2]) };
}

function limitTempMin(id: string): number {
  const raw = limitRow(id).value;
  const match = /^(-?\d+(?:\.\d+)?)\s*to\s*(-?\d+(?:\.\d+)?)$/.exec(raw.trim());
  if (!match || !match[1] || !match[2]) throw new Error(`deviceLimits: "${id}" is no longer a temperature range ("${raw}")`);
  return Number(match[1]);
}

export interface DeviceElectricalLimit<T> {
  value: T;
  source: SourceReference;
}

export const deviceLimits: {
  ratedPowerKw: DeviceElectricalLimit<number>;
  surgeFactor: DeviceElectricalLimit<number>;
  surgeSeconds: DeviceElectricalLimit<number>;
  batteryNominalVdc: DeviceElectricalLimit<number>;
  maxTotalChargeA: DeviceElectricalLimit<number>;
  maxUtilityChargeA: DeviceElectricalLimit<number>;
  maxPvPowerW: DeviceElectricalLimit<number>;
  maxPvVocVdc: DeviceElectricalLimit<number>;
  mpptRangeVdc: DeviceElectricalLimit<{ min: number; max: number }>;
  maxPvCurrentA: DeviceElectricalLimit<number>;
  minOperatingTempC: DeviceElectricalLimit<number>;
} = (() => {
  const surge = limitRow("surge").value;
  const surgeMatch = /^(\d+)x?×?\s*rated power for (\d+) seconds?$/.exec(surge.trim());
  if (!surgeMatch || !surgeMatch[1] || !surgeMatch[2]) throw new Error(`deviceLimits: surge spec changed ("${surge}")`);
  return {
    ratedPowerKw: { value: limitNumber("rated-power"), source: limitRow("rated-power").source },
    surgeFactor: { value: Number(surgeMatch[1]), source: limitRow("surge").source },
    surgeSeconds: { value: Number(surgeMatch[2]), source: limitRow("surge").source },
    batteryNominalVdc: { value: limitNumber("battery-voltage", "VDC"), source: limitRow("battery-voltage").source },
    maxTotalChargeA: { value: limitNumber("max-total-charge", "A"), source: limitRow("max-total-charge").source },
    maxUtilityChargeA: { value: limitNumber("max-ac-charge", "A"), source: limitRow("max-ac-charge").source },
    maxPvPowerW: { value: limitNumber("pv-rated", "W"), source: limitRow("pv-rated").source },
    maxPvVocVdc: { value: limitNumber("pv-voc", "VDC"), source: limitRow("pv-voc").source },
    mpptRangeVdc: { value: limitRange("mppt"), source: limitRow("mppt").source },
    maxPvCurrentA: { value: limitNumber("pv-current", "A"), source: limitRow("pv-current").source },
    minOperatingTempC: { value: limitTempMin("operating-temp"), source: limitRow("operating-temp").source }
  };
})();

export function toEngineLimits(limits: typeof deviceLimits) {
  return {
    ratedPowerKw: limits.ratedPowerKw.value,
    surgeFactor: limits.surgeFactor.value,
    surgeSeconds: limits.surgeSeconds.value,
    batteryNominalVdc: limits.batteryNominalVdc.value,
    maxTotalChargeA: limits.maxTotalChargeA.value,
    maxUtilityChargeA: limits.maxUtilityChargeA.value,
    maxPvPowerW: limits.maxPvPowerW.value,
    maxPvVocVdc: limits.maxPvVocVdc.value,
    mpptMinVdc: limits.mpptRangeVdc.value.min,
    mpptMaxVdc: limits.mpptRangeVdc.value.max,
    maxPvCurrentA: limits.maxPvCurrentA.value,
    minOperatingTempC: limits.minOperatingTempC.value
  };
}

export const connectionFacts = [  { id: "battery-cable", label: bilingual("Battery cable", "کابل باتری"), value: "2 AWG / 38 mm²", source: ref(6, "Battery cable table") },
  { id: "battery-strip", label: bilingual("Battery stripping length", "طول لخت‌کردن کابل باتری"), value: "18 mm", source: ref(6, "Battery connection") },
  { id: "battery-tin", label: bilingual("Battery tinning length", "طول قلع‌اندود کابل باتری"), value: "3 mm", source: ref(6, "Battery cable table") },
  { id: "battery-torque", label: bilingual("Battery terminal torque", "گشتاور ترمینال باتری"), value: "2-3 Nm", source: ref(6, "Battery connection") },
  { id: "ac-cable", label: bilingual("AC cable", "کابل AC"), value: "10 AWG", source: ref(7, "AC cable table") },
  { id: "ac-torque", label: bilingual("AC terminal torque", "گشتاور ترمینال AC"), value: "1.4-1.6 Nm", source: ref(7, "AC input/output connection") },
  { id: "pv-cable", label: bilingual("PV cable", "کابل PV"), value: "12 AWG", source: ref(9, "PV connection") },
  { id: "pv-torque", label: bilingual("PV terminal torque", "گشتاور ترمینال PV"), value: "1.4-1.6 Nm", source: ref(9, "PV connection") }
] as const;

export interface AnatomyPart {
  id: string;
  label: LocalizedText;
  x: number;
  y: number;
  /** Platform-neutral icon key; mapped to per-platform icon sets in the UI. */
  icon: "lcd" | "status" | "charge" | "fault" | "buttons" | "earth" | "ac-in" | "ac-out" | "battery" | "pv" | "wifi" | "power";
  /** What the part is and what it does — user-facing, no source citations. */
  role: LocalizedText;
  /** One practical tip for the user or installer. */
  guide: LocalizedText;
  /** Short value line. */
  stat: LocalizedText;
  /** Academy lesson this part leads to. */
  relatedLesson: string;
  /** CTA label next to the related-lesson link. */
  relatedLabel: LocalizedText;
  source: SourceReference;
}

export const anatomy: AnatomyPart[] = [
  {
    id: "lcd", label: bilingual("LCD display", "نمایشگر LCD"), x: 59, y: 34, icon: "lcd",
    role: bilingual(
      "Main display; shows input voltage, battery voltage, PV power and load percentage. All setting programs are browsed here.",
      "نمایشگر اصلی دستگاه؛ ولتاژ ورودی، ولتاژ باتری، توان PV و درصد بار را نشان می‌دهد. همهٔ برنامه‌های تنظیمی از همین‌جا مرور می‌شوند."
    ),
    guide: bilingual("Returns to the default screen after one minute.", "پس از یک دقیقه به صفحهٔ پیش‌فرض برمی‌گردد."),
    stat: bilingual("230 VAC · battery · PV · load", "۲۳۰ ولت AC · باتری · PV · بار"),
    relatedLesson: "lcd", relatedLabel: bilingual("Learn the display & keys", "آموزش نمایشگر و دکمه‌ها"),
    source: ref(4, "Product overview")
  },
  {
    id: "status", label: bilingual("Status indicator", "نشانگر وضعیت"), x: 54, y: 43, icon: "status",
    role: bilingual(
      "Status light; green means normal operation, red means check for a fault.",
      "چراغ وضعیت؛ سبز یعنی عملکرد عادی و قرمز یعنی به خطا نگاه کنید."
    ),
    guide: bilingual("Blinks in battery mode or on fault.", "در حالت باتری یا هنگام خطا چشمک می‌زند."),
    stat: bilingual("Green = normal · red = fault", "سبز = عادی · قرمز = خطا"),
    relatedLesson: "troubleshooting", relatedLabel: bilingual("Troubleshooting lesson", "آموزش عیب‌یابی"),
    source: ref(4, "Product overview")
  },
  {
    id: "charge", label: bilingual("Charging indicator", "نشانگر شارژ"), x: 59, y: 43, icon: "charge",
    role: bilingual(
      "Charging light; on or blinking while the battery is being charged.",
      "چراغ شارژ؛ هنگام شارژ شدن باتری روشن یا چشمک‌زن است."
    ),
    guide: bilingual("Off means charging is not active.", "خاموش بودن یعنی شارژ انجام نمی‌شود."),
    stat: bilingual("Blinking while charging", "شارژ فعال = چشمک"),
    relatedLesson: "battery", relatedLabel: bilingual("Battery & charging lesson", "درس باتری و شارژ"),
    source: ref(4, "Product overview")
  },
  {
    id: "fault", label: bilingual("Fault indicator", "نشانگر خطا"), x: 64, y: 43, icon: "fault",
    role: bilingual(
      "Fault light; with the continuous buzzer it signals a fault code.",
      "چراغ خطا؛ همراه بیزر پیوسته نشان‌دهندهٔ وجود کد خطاست."
    ),
    guide: bilingual("Note the code and use the fault finder.", "کد را یادداشت کنید و از یابندهٔ خطا کمک بگیرید."),
    stat: bilingual("Sounded with the continuous buzzer", "با بیزر پیوسته روشن"),
    relatedLesson: "faults", relatedLabel: bilingual("Fault code finder", "یابندهٔ کد خطا"),
    source: ref(4, "Product overview")
  },
  {
    id: "buttons", label: bilingual("Function buttons", "دکمه‌های عملکرد"), x: 59, y: 48, icon: "buttons",
    role: bilingual(
      "ESC, UP, DOWN and ENTER keys; used to browse programs and change settings.",
      "چهار دکمهٔ ESC، بالا، پایین و ENTER؛ برای مرور برنامه‌ها و تغییر تنظیمات."
    ),
    guide: bilingual("ENTER opens settings; ESC exits.", "ENTER وارد تنظیمات می‌شود و ESC برمی‌گردد."),
    stat: bilingual("ESC · ▲ · ▼ · ENTER", "ESC · ▲ · ▼ · ENTER"),
    relatedLesson: "lcd", relatedLabel: bilingual("Learn the keys", "آموزش کار با دکمه‌ها"),
    source: ref(4, "Product overview")
  },
  {
    id: "earth", label: bilingual("Protective earth", "زمین حفاظتی"), x: 25, y: 90, icon: "earth",
    role: bilingual(
      "Protective earth terminal; connected first and disconnected last.",
      "ترمینال زمین حفاظتی؛ اولین اتصالی که انجام می‌شود و آخرین اتصالی که باز می‌شود."
    ),
    guide: bilingual("Earthing is for qualified installers only.", "سیم‌کشی زمین فقط توسط نصاب متخصص انجام شود."),
    stat: bilingual("Protective earth", "زمین حفاظتی"),
    relatedLesson: "connections", relatedLabel: bilingual("Connections lesson", "درس اتصالات"),
    source: ref(4, "Product overview")
  },
  {
    id: "ac-in", label: bilingual("AC input", "ورودی AC"), x: 38, y: 90, icon: "ac-in",
    role: bilingual(
      "Grid (utility) input; AC input wiring must be separate and protected.",
      "ورودی برق شهر؛ سیم‌کشی ورودی AC باید جدا و با حفاظت مناسب باشد."
    ),
    guide: bilingual("Check input via the LCD voltage readout.", "ولتاژ ورودی را از روی LCD بررسی کنید."),
    stat: bilingual("90–280 VAC", "۹۰–۲۸۰ ولت AC"),
    relatedLesson: "connections", relatedLabel: bilingual("AC input connection", "اتصال ورودی AC"),
    source: ref(4, "Product overview")
  },
  {
    id: "ac-out", label: bilingual("AC output", "خروجی AC"), x: 48, y: 90, icon: "ac-out",
    role: bilingual(
      "AC output; supplies the loads and must not be reversed with the input.",
      "خروجی AC؛ برق بارها را تأمین می‌کند و نباید با ورودی جابه‌جا شود."
    ),
    guide: bilingual("Continuous load must stay within rated power.", "بار پیوسته نباید از توان نامی بیشتر شود."),
    stat: bilingual("230 VAC output", "۲۳۰ ولت AC خروجی"),
    relatedLesson: "connections", relatedLabel: bilingual("AC output connection", "اتصال خروجی AC"),
    source: ref(4, "Product overview")
  },
  {
    id: "battery-in", label: bilingual("Battery input", "ورودی باتری"), x: 59, y: 90, icon: "battery",
    role: bilingual(
      "24 V battery terminals; polarity and torque must be exact.",
      "ترمینال‌های باتری ۲۴ ولت؛ قطبیت و گشتاور باید دقیق رعایت شود."
    ),
    guide: bilingual("Isolate all sources before touching.", "پیش از لمس، همهٔ منابع ایزوله شوند."),
    stat: bilingual("24 VDC · 2–3 Nm", "۲۴ ولت DC · ۲–۳ نیوتن‌متر"),
    relatedLesson: "connections", relatedLabel: bilingual("Battery connection", "اتصال باتری"),
    source: ref(4, "Product overview")
  },
  {
    id: "pv-in", label: bilingual("PV input", "ورودی PV"), x: 70, y: 90, icon: "pv",
    role: bilingual(
      "Solar (PV) input; array open-circuit voltage must not exceed 500 VDC.",
      "ورودی پنل خورشیدی؛ ولتاژ مدار باز آرایه نباید از ۵۰۰ ولت DC بیشتر شود."
    ),
    guide: bilingual("Check Voc with the temperature-adjusted sizing calculator.", "Voc را با تصحیح دما در ماشین‌حساب سازگاری بسنجید."),
    stat: bilingual("500 VDC max", "حداکثر ۵۰۰ ولت DC"),
    relatedLesson: "connections", relatedLabel: bilingual("PV connection", "اتصال پنل خورشیدی"),
    source: ref(4, "Product overview")
  },
  {
    id: "wifi", label: bilingual("Wi-Fi communication", "ارتباط Wi-Fi"), x: 81, y: 90, icon: "wifi",
    role: bilingual(
      "Optional communication module port for monitoring and advanced setup.",
      "پورت ماژول ارتباطی اختیاری برای مانیتورینگ و تنظیمات پیشرفته."
    ),
    guide: bilingual("Coordinate communication setup with the installer.", "راه‌اندازی ارتباط با نصاب هماهنگ شود."),
    stat: bilingual("Optional monitoring", "مانیتورینگ اختیاری"),
    relatedLesson: "settings", relatedLabel: bilingual("Settings explorer", "برنامه‌های تنظیمی"),
    source: ref(4, "Product overview")
  },
  {
    id: "power", label: bilingual("Power switch", "کلید روشن و خاموش"), x: 89, y: 90, icon: "power",
    role: bilingual(
      "Power switch; operate only after the commissioning checklist is complete.",
      "کلید روشن و خاموش؛ فقط پس از تکمیل چک‌لیست راه‌اندازی استفاده شود."
    ),
    guide: bilingual("Power on only after earth and polarity are confirmed.", "روشن‌کردن فقط پس از تأیید زمین و قطبیت."),
    stat: bilingual("ON / OFF", "روشن / خاموش"),
    relatedLesson: "power-on", relatedLabel: bilingual("First power-on lesson", "درس روشن‌کردن اولیه"),
    source: ref(4, "Product overview")
  }
];

export const troubleshooting = {
  start: {
    question: bilingual("What do you observe?", "چه وضعیتی مشاهده می‌کنید؟"),
    choices: [
      { label: bilingual("No response after power-on", "پس از روشن‌کردن واکنشی نیست"), next: "no-response" },
      { label: bilingual("Utility is present but battery mode remains", "برق شهر هست اما دستگاه روی باتری است"), next: "utility-battery" },
      { label: bilingual("Buzzer is continuous and red LED is on", "بیزر پیوسته است و LED قرمز روشن است"), next: "fault-code" }
    ]
  },
  "no-response": {
    question: bilingual("Is the battery wiring and polarity confirmed by a qualified installer?", "آیا سیم‌کشی و قطبیت باتری توسط نصاب متخصص تأیید شده است؟"),
    result: bilingual("Do not reconnect live wiring. Ask a qualified installer to check battery voltage, polarity and connections.", "سیم زنده را دوباره وصل نکنید. از نصاب متخصص بخواهید ولتاژ، قطبیت و اتصالات باتری را بررسی کند."),
    source: ref(27, "No response after power-on")
  },
  "utility-battery": {
    question: bilingual("Does the LCD show zero AC input voltage?", "آیا LCD ولتاژ ورودی AC را صفر نشان می‌دهد؟"),
    result: bilingual("Have a qualified installer check the AC protection and wiring, then verify Program 03 matches the source quality.", "از نصاب متخصص بخواهید حفاظت و سیم‌کشی AC را بررسی کند و سپس تطابق برنامه ۰۳ با کیفیت منبع را بسنجد."),
    source: ref(27, "Utility exists but unit works in battery mode")
  },
  "fault-code": {
    question: bilingual("Read and record the fault code without opening the enclosure.", "بدون بازکردن محفظه، کد خطا را بخوانید و یادداشت کنید."),
    result: bilingual("Use the fault finder. Internal repair is prohibited; persistent faults require an authorized service center.", "از یابنده خطا استفاده کنید. تعمیر داخلی ممنوع است و خطای ماندگار باید به مرکز خدمات مجاز ارجاع شود."),
    source: ref(27, "Buzzer continuous and red LED on")
  }
} as const;

const verifiedProduct: ProductModel = {
  id: "cm3500-24s",
  slug: "cm3500-24s",
  brand: "NEXA",
  modelName: {
    value: "CM3500-24S",
    verificationStatus: "verified",
    sources: [ref(2, "Model title", "persianManual")]
  },
  ratedPowerKw: {
    value: 3.5,
    unit: "kW",
    verificationStatus: "verified",
    sources: [ref(2, "Model title", "persianManual"), ref(26, "Table 2", "persianManual")]
  },
  batteryVoltageVdc: {
    value: 24,
    unit: "VDC",
    verificationStatus: "verified",
    sources: [ref(2, "Model title", "persianManual"), ref(25, "Table 2")]
  },
  heroImage: "/assets/products/nexa-product-hero.webp",
  cutoutImage: "/assets/products/nexa-product-cutout.webp",
  manualDocumentId: documents.persianManual.id,
  datasheetDocumentId: null,
  settings,
  faultCodes,
  lessons
};

const missingProduct: ProductModel = {
  id: "model-02-source-required",
  slug: "model-02-source-required",
  brand: "NEXA",
  modelName: {
    value: null,
    verificationStatus: "missing",
    sources: [],
    notes: "No model-specific image, manual or datasheet was supplied."
  },
  ratedPowerKw: {
    value: null,
    unit: "kW",
    verificationStatus: "missing",
    sources: [],
    notes: "The requested 6.5 kW identity is not supported by the supplied documents."
  },
  batteryVoltageVdc: {
    value: null,
    unit: "VDC",
    verificationStatus: "missing",
    sources: []
  },
  heroImage: "/assets/products/model-source-required.svg",
  cutoutImage: "/assets/products/model-source-required.svg",
  manualDocumentId: null,
  datasheetDocumentId: null,
  settings: [],
  faultCodes: [],
  lessons: []
};

export const productModels = [
  productModelSchema.parse(verifiedProduct),
  productModelSchema.parse(missingProduct)
] as const;

export function getProduct(slug: string): ProductModel | undefined {
  return productModels.find((model) => model.slug === slug);
}

export function localize(text: LocalizedText, locale: "en" | "fa"): string {
  return text[locale];
}

/* ------------------------------------------------------------------ */
/* Knowledge-check bank — every question carries a source page.         */
/* ------------------------------------------------------------------ */

export interface QuizQuestion {
  id: string;
  question: LocalizedText;
  choices: LocalizedText[];
  /** 0-based index into choices. */
  correctIndex: number;
  explanation: LocalizedText;
  source: SourceReference;
  safetyCritical: boolean;
}

const quiz = (
  id: string,
  questionEn: string,
  questionFa: string,
  choices: Array<[string, string]>,
  correctIndex: number,
  explanationEn: string,
  explanationFa: string,
  source: SourceReference,
  safetyCritical = false
): QuizQuestion => ({
  id,
  question: bilingual(questionEn, questionFa),
  choices: choices.map(([en, fa]) => bilingual(en, fa)),
  correctIndex,
  explanation: bilingual(explanationEn, explanationFa),
  source,
  safetyCritical
});

export const quizBank: QuizQuestion[] = [
  quiz(
    "q-safety-isolate",
    "Before touching any connection on a battery-powered install, what must happen first?",
    "پیش از لمس هر اتصال در سیستمی با باتری، ابتدا چه کاری باید انجام شود؟",
    [["Disconnect the load", "بار را جدا کنید"], ["Isolate every energy source", "همهٔ منابع انرژی ایزوله شوند"], ["Disconnect only the solar panels", "فقط پنل‌ها جدا شوند"]],
    1,
    "Every source must be isolated by a qualified person before a connection is checked.",
    "پیش از هر بررسی، همهٔ منابع باید توسط فرد واجد صلاحیت ایزوله شوند.",
    ref(3, "Safety instructions"),
    true
  ),
  quiz(
    "q-install-surface",
    "Which surface is acceptable for mounting this inverter?",
    "کدام سطح برای نصب این اینورتر قابل قبول است؟",
    [["Solid and non-combustible", "محکم و غیرقابل‌اشتعال"], ["Any dry surface", "هر سطح خشکی"], ["Directly above flammable materials", "مستقیماً روی مواد قابل‌اشتعال"]],
    0,
    "Mount on a solid, non-combustible surface and keep ventilation clearance open.",
    "روی سطح محکم و غیرقابل‌اشتعال نصب کنید و فضای تهویه را باز نگه دارید.",
    ref(5, "Installation"),
    true
  ),
  quiz(
    "q-poweron-earth",
    "Before the first power-on, which item must be verified by a qualified installer?",
    "پیش از اولین روشن‌کردن، کدام مورد باید توسط نصاب متخصص تأیید شود؟",
    [["Protective earth and battery polarity", "زمین حفاظتی و قطبیت باتری"], ["LCD brightness", "روشنایی LCD"], ["Buzzer volume", "صدای بیزر"]],
    0,
    "Verify protective earth and battery polarity before operating the front power switch.",
    "پیش از کار با کلید روشن و خاموش جلو، زمین حفاظتی و قطبیت باتری را تأیید کنید.",
    ref(11, "Power on/off"),
    true
  ),
  quiz(
    "q-fault-action",
    "A persistent fault code appears on the LCD. What is the correct user-level action?",
    "یک کد خطای ماندگار روی LCD ظاهر شده است. اقدام درست کاربر چیست؟",
    [["Open the enclosure and inspect", "محفظه را باز و بررسی کنید"], ["Stop, record the code, escalate to authorized service", "متوقف شوید، کد را یادداشت و به سرویس مجاز ارجاع دهید"], ["Temporarily bypass the protection", "حفاظت را موقتاً دور بزنید"]],
    1,
    "Internal repair is prohibited; persistent faults require an authorized service center.",
    "تعمیر داخلی ممنوع است و خطای ماندگار باید به مرکز خدمات مجاز ارجاع شود.",
    ref(22, "Fault reference code"),
    true
  ),
  quiz(
    "q-program01",
    "Program 01 controls what behavior?",
    "برنامهٔ ۰۱ چه رفتاری را کنترل می‌کند؟",
    [["Output frequency", "فرکانس خروجی"], ["Output source priority", "اولویت منبع خروجی"], ["Buzzer mode", "حالت بیزر"]],
    1,
    "Program 01 sets the order used to supply connected loads (Utility/Solar/SBU/SUB/SUF).",
    "برنامهٔ ۰۱ ترتیب تأمین برق بارهای متصل را تعیین می‌کند.",
    ref(12, "Program 01")
  ),
  quiz(
    "q-program02",
    "Program 02 'Maximum total charging current' allows:",
    "برنامهٔ ۰۲ «حداکثر جریان کل شارژ» چه محدوده‌ای را مجاز می‌داند؟",
    [["2-6 A", "۲ تا ۶ آمپر"], ["10-100 A, subject to the AC current limit", "۱۰ تا ۱۰۰ آمپر با رعایت محدودیت جریان AC"], ["Always 200 A", "همیشه ۲۰۰ آمپر"]],
    1,
    "The combined charging current is 10-100 A, subject to the model's AC current limit.",
    "جریان کل شارژ ۱۰ تا ۱۰۰ آمپر است با رعایت محدودیت جریان AC مدل.",
    ref(13, "Program 02")
  ),
  quiz(
    "q-battery-stages",
    "Which charging stage comes after bulk charging in a typical lead-acid profile?",
    "در پروفایل استاندارد باتری اسیدی، کدام مرحله پس از شارژ سریع می‌آید؟",
    [["Equalization", "متعادل‌سازی"], ["Absorption (constant voltage)", "جذب (ولتاژ ثابت)"], ["Discharge", "دشارژ"]],
    1,
    "Bulk, absorption, float and equalization are the documented charging stages.",
    "مراحل مستند شارژ: سریع، جذب، شناور و متعادل‌سازی.",
    ref(19, "Battery equalization")
  ),
  quiz(
    "q-battery-volt",
    "The CM3500-24S battery system voltage is:",
    "ولتاژ سامانه باتری CM3500-24S چقدر است؟",
    [["12 VDC", "۱۲ ولت DC"], ["24 VDC", "۲۴ ولت DC"], ["48 VDC", "۴۸ ولت DC"]],
    1,
    "The model name indicates a 24 VDC battery system.",
    "نام مدل نشان‌دهندهٔ سامانهٔ باتری ۲۴ ولت DC است.",
    ref(2, "Model title", "persianManual")
  )
];

/* ------------------------------------------------------------------ */
/* Commissioning checklist — sourced, safety-aware, persisted by the    */
/* app in AsyncStorage (offline, no account).                          */
/* ------------------------------------------------------------------ */

export interface CommissioningStep {
  id: string;
  text: LocalizedText;
  detail: LocalizedText;
  source: SourceReference;
  safetyCritical: boolean;
}

const step = (
  id: string,
  textEn: string,
  textFa: string,
  detailEn: string,
  detailFa: string,
  source: SourceReference,
  safetyCritical = false
): CommissioningStep => ({
  id,
  text: bilingual(textEn, textFa),
  detail: bilingual(detailEn, detailFa),
  source,
  safetyCritical
});

export const commissioningSteps: CommissioningStep[] = [
  step("c-unbox", "Inspect packaging and enclosure for transport damage", "بسته‌بندی و بدنه را از نظر آسیب حمل بررسی کنید", "Document any damage before installing.", "هر آسیب را پیش از نصب ثبت کنید.", ref(5, "Installation")),
  step("c-surface", "Choose a solid vertical, non-combustible mount", "سطح نصب عمودی، محکم و غیرقابل‌اشتعال انتخاب کنید", "Keep ventilation clearance open around the unit.", "فضای تهویه را دور دستگاه باز نگه دارید.", ref(5, "Installation"), true),
  step("c-battery-cable", "Fit the verified battery cable (2 AWG / 38 mm²)", "کابل باتری تأییدشده (2 AWG / 38 mm²) را نصب کنید", "Torque 2-3 Nm; strip 18 mm; tin 3 mm.", "گشتاور ۲-۳ نیوتن‌متر؛ لخت‌کردن ۱۸ میلی‌متر؛ قلع‌اندود ۳ میلی‌متر.", ref(6, "Battery connection"), true),
  step("c-battery-polarity", "Confirm battery polarity and protective earth", "قطبیت باتری و زمین حفاظتی را تأیید کنید", "Incorrect polarity can damage the unit.", "قطبیت اشتباه می‌تواند به دستگاه آسیب بزند.", ref(6, "Battery connection"), true),
  step("c-ac-wiring", "Fit AC input/output wiring (10 AWG, 1.4-1.6 Nm)", "سیم‌کشی ورودی/خروجی AC را نصب کنید (10 AWG، ۱٫۴-۱٫۶ نیوتن‌متر)", "Keep input and output circuits separated.", "مدار ورودی و خروجی را جدا نگه دارید.", ref(7, "AC input/output connection"), true),
  step("c-pv-voc", "Validate the array Voc against the 500 VDC ceiling", "Voc آرایه را مقابل سقف ۵۰۰ ولت DC بسنجید", "Use the temperature-adjusted calculation in the sizing calculator.", "از محاسبهٔ تصحیح‌شدهٔ دما در ماشین‌حساب سازگاری استفاده کنید.", ref(9, "PV connection"), true),
  step("c-pv-connect", "Connect PV with correct polarity and 12 AWG cable", "پنل را با قطبیت درست و کابل 12 AWG متصل کنید", "Torque 1.4-1.6 Nm on PV terminals.", "گشتاور ۱٫۴-۱٫۶ نیوتن‌متر روی ترمینال‌های PV.", ref(9, "PV connection"), true),
  step("c-power-on", "Final check-list review, then operate the power switch", "بازبینی نهایی چک‌لیست، سپس کار با کلید روشن و خاموش", "Protective earth and battery polarity must be verified first.", "زمین حفاظتی و قطبیت باتری ابتدا باید تأیید شوند.", ref(11, "Power on/off"), true)
];
