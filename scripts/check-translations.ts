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
console.log(`Translations checked: ${enKeys.length} interface keys and ${bilingualRecords.length} bilingual content records.`);
