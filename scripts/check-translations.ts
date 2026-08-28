import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { dictionaries, glossary } from "@nexa/i18n";
import { faultCodes, lessons, settings } from "@nexa/product-content";

const enKeys = Object.keys(dictionaries.en).sort();
const faKeys = Object.keys(dictionaries.fa).sort();
if (JSON.stringify(enKeys) !== JSON.stringify(faKeys)) {
  throw new Error("English and Persian dictionary keys differ.");
}

const bilingualRecords = [
  ...lessons.flatMap((item) => [item.title, item.summary]),
  ...settings.flatMap((item) => [item.label, item.summary, ...item.options]),
  ...faultCodes.flatMap((item) => [item.title, item.safeCheck])
];

for (const record of bilingualRecords) {
  if (!record.en.trim() || !record.fa.trim()) {
    throw new Error("Empty bilingual content value found.");
  }
}

if (glossary.length < 10) throw new Error("Bilingual technical glossary is incomplete.");

// Regression guard (Phase-2 M2): user-facing copy in these two files MUST come
// from the @nexa/i18n dictionary. Any raw Persian literal here is a debt
// regression. The i18n package itself is data — it is not scanned.
const guardedFiles = ["apps/mobile/app/index.tsx", "apps/mobile/app/_layout.tsx"];
const persian = /[\u0600-\u06FF]/;
const offenders: Array<{ file: string; line: number }> = [];
for (const rel of guardedFiles) {
  const abs = resolve(rel);
  if (!existsSync(abs)) throw new Error(`Translation guard: missing file ${rel}`);
  readFileSync(abs, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (persian.test(line)) offenders.push({ file: rel, line: i + 1 });
    });
}
if (offenders.length > 0) {
  const listing = offenders.map((o) => `  ${o.file}:${o.line}`).join("\n");
  throw new Error(`Hardcoded Persian found outside the i18n dictionary:\n${listing}`);
}

console.log(`Translations checked: ${enKeys.length} interface keys and ${bilingualRecords.length} bilingual content records.`);
