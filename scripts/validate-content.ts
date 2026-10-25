// npm run validate:content — structural report for data/dialects/.
// Exit code 1 on errors (warnings are listed but don't fail).
// It checks shape and references only; it never "verifies" a dialect fact.

import { DIALECT_CONTENT } from "@/data/dialects";
import { validateDialectContent } from "@/lib/dialects/validate";

const { districts, words, questions } = DIALECT_CONTENT;
const issues = validateDialectContent(DIALECT_CONTENT);
const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warning");

const count = <T>(items: readonly T[], key: (x: T) => string) =>
  items.reduce<Record<string, number>>((acc, x) => ({ ...acc, [key(x)]: (acc[key(x)] ?? 0) + 1 }), {});

console.log("Dialect content");
console.log(`  districts: ${districts.length}`);
console.log(`  words:     ${words.length}`, count(words, (w) => w.verificationStatus));
console.log(`  questions: ${questions.length}`, count(questions, (q) => q.status));
const verified = new Set(words.filter((w) => w.verificationStatus === "verified").map((w) => w.id));
const scored = questions.filter((q) => q.status === "published" && verified.has(q.wordId));
console.log(`  usable in scored quizzes: ${scored.length}`);
for (const d of districts) {
  const n = scored.filter((q) => q.districtIds.includes(d.id)).length;
  if (n > 0) console.log(`    ${d.id}: ${n}`);
}

for (const w of warnings) console.log(`⚠️  ${w.where}: ${w.message}`);
for (const e of errors) console.log(`❌ ${e.where}: ${e.message}`);
console.log(errors.length ? `\n${errors.length} error(s).` : "\n✅ Structure OK. (Linguistic accuracy is a human review — see data/dialects/README.md.)");
process.exitCode = errors.length ? 1 : 0;
