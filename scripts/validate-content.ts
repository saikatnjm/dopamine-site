// npm run validate:content — structural report for data/dialects/.
// Exit code 1 on errors (warnings are listed but don't fail).
// It checks shape and references only; it never "verifies" a dialect fact.

import { DIALECT_CONTENT } from "@/data/dialects";
import { isPublicForm, isScoredForm } from "@/lib/dialects/content";
import { validateDialectContent } from "@/lib/dialects/validate";

const { regions, concepts, forms, sources } = DIALECT_CONTENT;
const issues = validateDialectContent(DIALECT_CONTENT);
const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warning");

const count = <T>(items: readonly T[], key: (x: T) => string) =>
  items.reduce<Record<string, number>>((acc, x) => ({ ...acc, [key(x)]: (acc[key(x)] ?? 0) + 1 }), {});

console.log("Dialect content");
console.log(`  regions:  ${regions.length} · concepts: ${concepts.length} · sources: ${sources.length}`);
console.log(`  forms:    ${forms.length}`, count(forms, (f) => f.status), count(forms, (f) => f.confidence), count(forms, (f) => f.script));
console.log(`  public (map + detective): ${forms.filter(isPublicForm).length}`);
console.log(`  scored (verified, quiz):  ${forms.filter(isScoredForm).length}`);
console.log("  public forms per region:");
for (const r of regions) console.log(`    ${r.id.padEnd(16)} ${forms.filter((f) => isPublicForm(f) && f.regions.includes(r.id)).length}`);

for (const w of warnings) console.log(`⚠️  ${w.where}: ${w.message}`);
for (const e of errors) console.log(`❌ ${e.where}: ${e.message}`);
console.log(errors.length ? `\n${errors.length} error(s).` : "\n✅ Structure OK. (Linguistic accuracy is a human review — see data/dialects/README.md.)");
process.exitCode = errors.length ? 1 : 0;
