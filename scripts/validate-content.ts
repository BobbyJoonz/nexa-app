import {
  anatomy,
  commissioningSteps,
  connectionFacts,
  documents,
  faultCodes,
  lessons,
  productModels,
  quizBank,
  settings,
  specifications
} from "@nexa/product-content";

const assertions: Array<[boolean, string]> = [
  [productModels.length === 2, "Exactly two model entries must exist"],
  [productModels[0]?.modelName.value === "CM3500-24S", "Primary model must be CM3500-24S"],
  [productModels[0]?.modelName.verificationStatus === "verified", "Primary model must be verified"],
  [productModels[1]?.modelName.verificationStatus === "missing", "Second model must remain explicitly missing"],
  [productModels[1]?.settings.length === 0, "Missing model must not inherit settings"],
  [productModels[1]?.faultCodes.length === 0, "Missing model must not inherit fault codes"],
  [lessons.length === 15, "The academy must contain 15 lessons"],
  [settings.length === 31, "All 31 documented setting programs must be present"],
  [faultCodes.length === 21, "All 21 documented fault codes must be present"],
  [specifications.length === 18, "All 18 selected model specifications must be present"],
  [connectionFacts.length === 8, "All eight verified wiring facts must be present"],
  [anatomy.length === 12, "All 12 external anatomy points must be present"],
  [new Set(anatomy.map((p) => p.id)).size === anatomy.length, "Anatomy part ids must be unique"],
  [anatomy.every((p) => p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100), "Every anatomy hotspot must sit inside the 0…100 coordinate space"],
  [new Set(anatomy.map((p) => `${p.label.en}|${p.label.fa}`)).size === anatomy.length, "Anatomy part labels must be unique in both languages"],
  [anatomy.every((p) => p.role.en && p.role.fa && p.guide.en && p.guide.fa && p.relatedLesson && p.relatedLabel), "Every anatomy part must carry bilingual role/guide copy and a related lesson"],
  [anatomy.every((p) => p.inspect.length >= 3 && p.inspect.every((s) => s.en && s.fa)), "Every anatomy part must carry at least 3 bilingual inspection steps"],
  [["fault", "earth", "ac-in", "ac-out", "battery-in", "pv-in", "power"].every((id) => { const p = anatomy.find((item) => item.id === id); return p?.safety && p.safety.en && p.safety.fa; }), "Every hazardous anatomy part must carry a bilingual safety warning"],
  [anatomy.every((p) => lessons.some((l) => l.slug === p.relatedLesson)), "Every anatomy related lesson must resolve to a real lesson"],
  [Object.values(documents).length === 4, "All four supplied manuals must be catalogued"],
  [quizBank.length >= 5, "The knowledge check bank must hold at least five questions"],
  [quizBank.every((q) => q.choices.length >= 2 && q.correctIndex >= 0 && q.correctIndex < q.choices.length), "Every quiz question must reference a valid choice index"],
  [commissioningSteps.length >= 6, "The commissioning checklist must cover the full flow"],
  [commissioningSteps.every((s) => s.source.page > 0), "Every commissioning step must cite a manual page"]
];

const failed = assertions.filter(([pass]) => !pass).map(([, message]) => message);
if (failed.length) {
  throw new Error(`Content validation failed:\n${failed.map((item) => `- ${item}`).join("\n")}`);
}

console.log(`Content validated: ${lessons.length} lessons, ${settings.length} settings, ${faultCodes.length} faults, ${specifications.length} specifications.`);
