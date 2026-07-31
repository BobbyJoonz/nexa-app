import {
  anatomy,
  connectionFacts,
  documents,
  faultCodes,
  lessons,
  productModels,
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
  [Object.values(documents).length === 4, "All four supplied manuals must be catalogued"]
];

const failed = assertions.filter(([pass]) => !pass).map(([, message]) => message);
if (failed.length) {
  throw new Error(`Content validation failed:\n${failed.map((item) => `- ${item}`).join("\n")}`);
}

console.log(`Content validated: ${lessons.length} lessons, ${settings.length} settings, ${faultCodes.length} faults, ${specifications.length} specifications.`);
