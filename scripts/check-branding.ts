import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import fg from "fast-glob";

async function main() {
  const files = await fg([
    "apps/**/*.{ts,tsx,css,json}",
    "assets/**/*.svg"
  ], {
    absolute: true,
    ignore: ["**/node_modules/**", "**/.next/**", "**/.expo/**"]
  });

  const forbidden = [
    { pattern: /\bASTAR\b/i, reason: "ASTAR must not appear in production UI or generated SVG assets" },
    { pattern: /#[A-Fa-f0-9]{0,2}(?:7C3AED|8B5CF6|A855F7)/, reason: "AI-purple palette is forbidden" }
  ];

  for (const file of files) {
    const content = await readFile(file, "utf8");
    for (const item of forbidden) {
      if (item.pattern.test(content)) throw new Error(`${item.reason}: ${file}`);
    }
  }

  const logo = resolve("assets/brand/nexa-logo-source.png");
  await readFile(logo);
  console.log(`Branding checked across ${files.length} source files; exact NEXA logo source is present.`);
}

void main();
