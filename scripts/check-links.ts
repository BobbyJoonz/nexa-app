import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { documents, productModels } from "@nexa/product-content";
import { illustrationAssets } from "@nexa/illustrations";

async function main() {
  const webPublic = resolve("apps/web/public");
  const required = [
    "assets/brand/nexa-logo.png",
    "assets/products/nexa-product-hero.webp",
    "assets/products/nexa-product-cutout.webp",
    "assets/products/model-source-required.svg",
    ...Object.values(illustrationAssets).map((path) => path.replace(/^\//, "")),
    ...Object.values(documents).map((document) => `documents/${document.fileName}`),
    ...productModels.flatMap((model) => [model.heroImage, model.cutoutImage]).map((path) => path.replace(/^\//, ""))
  ];

  await Promise.all([...new Set(required)].map((path) => access(resolve(webPublic, path))));
  console.log(`Asset and document links checked: ${new Set(required).size} local targets.`);
}

void main();
