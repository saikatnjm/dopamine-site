// Lets plain Node (22.18+, built-in TypeScript type stripping) run the repo's
// .ts scripts: resolves the "@/…" alias and extensionless relative imports the
// way the bundler does. No dependency. Usage: node --import ./scripts/register-ts.mjs <file.ts>
// Only for pure modules (no JSX, no enums) — e.g. content validation.

import { statSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);
const SUFFIXES = ["", ".ts", ".tsx", "/index.ts"];

function isFile(url) {
  try {
    return statSync(fileURLToPath(url)).isFile();
  } catch {
    return false;
  }
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    let base = null;
    if (specifier.startsWith("@/")) base = new URL(specifier.slice(2), root);
    else if (/^\.{1,2}\//.test(specifier) && context.parentURL?.startsWith("file:")) base = new URL(specifier, context.parentURL);
    if (base) {
      for (const suffix of SUFFIXES) {
        const candidate = pathToFileURL(fileURLToPath(base) + suffix);
        if (isFile(candidate)) return nextResolve(candidate.href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});
