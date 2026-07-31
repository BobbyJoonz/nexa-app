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

export const connectionFacts = [
  { id: "battery-cable", label: bilingual("Battery cable", "کابل باتری"), value: "2 AWG / 38 mm²", source: ref(6, "Battery cable table") },
  { id: "battery-strip", label: bilingual("Battery stripping length", "طول لخت‌کردن کابل باتری"), value: "18 mm", source: ref(6, "Battery connection") },
  { id: "battery-tin", label: bilingual("Battery tinning length", "طول قلع‌اندود کابل باتری"), value: "3 mm", source: ref(6, "Battery cable table") },
  { id: "battery-torque", label: bilingual("Battery terminal torque", "گشتاور ترمینال باتری"), value: "2-3 Nm", source: ref(6, "Battery connection") },
  { id: "ac-cable", label: bilingual("AC cable", "کابل AC"), value: "10 AWG", source: ref(7, "AC cable table") },
  { id: "ac-torque", label: bilingual("AC terminal torque", "گشتاور ترمینال AC"), value: "1.4-1.6 Nm", source: ref(7, "AC input/output connection") },
  { id: "pv-cable", label: bilingual("PV cable", "کابل PV"), value: "12 AWG", source: ref(9, "PV connection") },
  { id: "pv-torque", label: bilingual("PV terminal torque", "گشتاور ترمینال PV"), value: "1.4-1.6 Nm", source: ref(9, "PV connection") }
] as const;

export const anatomy = [
  { id: "lcd", label: bilingual("LCD display", "نمایشگر LCD"), x: 59, y: 34, source: ref(4, "Product overview") },
  { id: "status", label: bilingual("Status indicator", "نشانگر وضعیت"), x: 54, y: 43, source: ref(4, "Product overview") },
  { id: "charge", label: bilingual("Charging indicator", "نشانگر شارژ"), x: 59, y: 43, source: ref(4, "Product overview") },
  { id: "fault", label: bilingual("Fault indicator", "نشانگر خطا"), x: 64, y: 43, source: ref(4, "Product overview") },
  { id: "buttons", label: bilingual("Function buttons", "دکمه‌های عملکرد"), x: 59, y: 48, source: ref(4, "Product overview") },
  { id: "earth", label: bilingual("Protective earth", "زمین حفاظتی"), x: 25, y: 90, source: ref(4, "Product overview") },
  { id: "ac-in", label: bilingual("AC input", "ورودی AC"), x: 38, y: 90, source: ref(4, "Product overview") },
  { id: "ac-out", label: bilingual("AC output", "خروجی AC"), x: 48, y: 90, source: ref(4, "Product overview") },
  { id: "battery-in", label: bilingual("Battery input", "ورودی باتری"), x: 59, y: 90, source: ref(4, "Product overview") },
  { id: "pv-in", label: bilingual("PV input", "ورودی PV"), x: 70, y: 90, source: ref(4, "Product overview") },
  { id: "wifi", label: bilingual("Wi-Fi communication", "ارتباط Wi-Fi"), x: 81, y: 90, source: ref(4, "Product overview") },
  { id: "power", label: bilingual("Power switch", "کلید روشن و خاموش"), x: 89, y: 90, source: ref(4, "Product overview") }
] as const;

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
