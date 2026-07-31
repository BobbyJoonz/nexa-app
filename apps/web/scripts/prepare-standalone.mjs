import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const standaloneRoot = resolve(projectRoot, ".next/standalone/apps/web");
const publicSource = resolve(projectRoot, "public");
const staticSource = resolve(projectRoot, ".next/static");
const publicTarget = resolve(standaloneRoot, "public");
const staticTarget = resolve(standaloneRoot, ".next/static");

if (!existsSync(standaloneRoot)) {
  throw new Error("Next.js standalone output is missing. Run next build first.");
}

mkdirSync(resolve(standaloneRoot, ".next"), { recursive: true });
cpSync(publicSource, publicTarget, { recursive: true, force: true });
cpSync(staticSource, staticTarget, { recursive: true, force: true });

console.log("Standalone runtime prepared with public and static assets.");
