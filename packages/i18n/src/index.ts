import en from "../locales/en/common.json";
import fa from "../locales/fa/common.json";

export type Locale = "en" | "fa";
export const dictionaries = { en, fa } as const;
export type TranslationKey = keyof typeof en;

export const directionFor = (locale: Locale) => (locale === "fa" ? "rtl" : "ltr");

export function t(locale: Locale, key: TranslationKey): string {
  return dictionaries[locale][key] ?? dictionaries.en[key];
}

export const glossary = [
  { en: "Hybrid inverter", fa: "اینورتر هیبریدی" },
  { en: "Utility / Grid", fa: "برق شهری / شبکه" },
  { en: "Load", fa: "بار مصرفی" },
  { en: "Battery", fa: "باتری" },
  { en: "Photovoltaic (PV)", fa: "فتوولتائیک (PV)" },
  { en: "MPPT", fa: "ردیابی نقطه بیشینه توان (MPPT)" },
  { en: "Bulk charging", fa: "شارژ سریع (Bulk)" },
  { en: "Float charging", fa: "شارژ شناور (Float)" },
  { en: "Equalization", fa: "متعادل‌سازی" },
  { en: "Protective earth", fa: "زمین حفاظتی (PE)" },
  { en: "Low DC cut-off", fa: "قطع ولتاژ پایین DC" },
  { en: "Fault", fa: "خطا" },
  { en: "Warning", fa: "هشدار" }
] as const;
