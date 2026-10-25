// Structural checks for dialect content. Pure, no I/O — used by the content
// registry (bad data fails the build), the CLI (`npm run validate:content`)
// and the tests.
//
// These checks only prove the data is well-formed: unique ids, required
// fields, valid references. They cannot tell whether a dialect word, spelling
// or attribution is correct — that is a person's review (status), never code.

import type { Confidence, ConceptCategory, DialectContent, Difficulty, Script, SourceType, VerificationStatus } from "@/lib/dialects/types";

export type IssueLevel = "error" | "warning";
export type ContentIssue = { level: IssueLevel; where: string; message: string };

export const ID_RE = /^[a-z0-9-]{1,40}$/;
export const FORM_ID_RE = /^[a-z0-9-]{1,60}$/;
const STATUSES: readonly VerificationStatus[] = ["draft", "needs_review", "verified", "rejected"];
const CONFIDENCES: readonly Confidence[] = ["high", "medium", "low"];
const SCRIPTS: readonly Script[] = ["bangla", "romanized", "rendered"];
const SOURCE_TYPES: readonly SourceType[] = ["encyclopedia", "academic", "dictionary", "government", "newspaper", "dataset", "wiki", "blog", "owner"];
const CATEGORIES: readonly ConceptCategory[] = ["people", "animals", "home", "food", "nature", "words", "phrases"];
const DIFFICULTIES: readonly Difficulty[] = ["easy", "medium", "hard"];
const BANGLA = /[ঀ-৿]/;

function filled(v: unknown): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

/** Text fields may be one string or { en, bn }; both halves must be filled. */
function filledText(v: unknown): boolean {
  if (filled(v)) return true;
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return filled(o.en) && filled(o.bn);
}

function norm(s: string): string {
  return s.normalize("NFC").trim().replace(/\s+/g, " ");
}

export function validateDialectContent(content: DialectContent): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const error = (where: string, message: string) => issues.push({ level: "error", where, message });
  const warn = (where: string, message: string) => issues.push({ level: "warning", where, message });

  const unique = (kind: string, ids: readonly unknown[], re = ID_RE) => {
    const seen = new Set<string>();
    ids.forEach((id, i) => {
      if (typeof id !== "string" || !re.test(id)) return error(`${kind}[${i}]`, `id ${JSON.stringify(id)} must match ${re}`);
      if (seen.has(id)) error(`${kind} ${id}`, "duplicate id");
      seen.add(id);
    });
    return seen;
  };

  // Districts
  const districtIds = unique("district", content.districts.map((d) => d.id));
  for (const d of content.districts) if (!filledText(d.name)) error(`district ${d.id}`, "name is required");

  // Regions
  const regionIds = unique("region", content.regions.map((r) => r.id));
  const owner = new Map<string, string>();
  for (const r of content.regions) {
    const where = `region ${r.id}`;
    if (!filledText(r.name)) error(where, "name is required");
    if (!filledText(r.blurb)) error(where, "blurb is required");
    if (!Array.isArray(r.districts) || r.districts.length === 0) error(where, "needs at least one district");
    for (const d of r.districts ?? []) {
      if (!districtIds.has(d)) error(where, `unknown district "${d}"`);
      else if (owner.has(d)) error(where, `district "${d}" is already in region "${owner.get(d)}"`);
      else owner.set(d, r.id);
    }
  }

  // Sources
  const sourceIds = unique("source", content.sources.map((s) => s.id));
  for (const s of content.sources) {
    const where = `source ${s.id}`;
    if (!filled(s.title)) error(where, "title is required");
    if (!SOURCE_TYPES.includes(s.type)) error(where, `unknown type "${s.type}"`);
    if (s.url !== undefined && !/^https?:\/\//.test(s.url)) error(where, "url must start with http(s)://");
  }

  // Concepts
  const conceptIds = unique("concept", content.concepts.map((c) => c.id));
  for (const c of content.concepts) {
    const where = `concept ${c.id}`;
    if (!filled(c.standard)) error(where, "standard is required");
    if (!filled(c.en)) error(where, "en is required");
    if (!filled(c.emoji)) error(where, "emoji is required");
    if (!CATEGORIES.includes(c.category)) error(where, `unknown category "${c.category}"`);
    if (!DIFFICULTIES.includes(c.difficulty)) error(where, `unknown difficulty "${c.difficulty}"`);
    if (c.kind !== "word" && c.kind !== "phrase") error(where, `unknown kind "${c.kind}"`);
  }

  // Forms
  unique("form", content.forms.map((f) => f.id), FORM_ID_RE);
  const seenForm = new Map<string, string>();
  const used = new Set<string>();
  for (const f of content.forms) {
    const where = `form ${f.id}`;
    if (!conceptIds.has(f.conceptId)) error(where, `unknown concept "${f.conceptId}"`);
    if (!filled(f.form)) error(where, "form is required");
    if (!Array.isArray(f.variants)) error(where, "variants must be a list (use [] for none)");
    if (!Array.isArray(f.regions) || f.regions.length === 0) error(where, "needs at least one region");
    for (const r of f.regions ?? []) if (!regionIds.has(r)) error(where, `unknown region "${r}"`);
    if (!Array.isArray(f.sources) || f.sources.length === 0) error(where, "needs at least one source");
    for (const s of f.sources ?? []) {
      if (!sourceIds.has(s)) error(where, `unknown source "${s}"`);
      used.add(s);
    }
    if (!STATUSES.includes(f.status)) error(where, `unknown status "${f.status}"`);
    if (!CONFIDENCES.includes(f.confidence)) error(where, `unknown confidence "${f.confidence}"`);
    if (!SCRIPTS.includes(f.script)) error(where, `unknown script "${f.script}"`);
    if (f.script === "bangla" && filled(f.form) && !BANGLA.test(f.form)) error(where, `script is "bangla" but "${f.form}" has no Bangla letters`);
    if (f.script === "romanized" && f.status === "verified") error(where, "verified forms need a Bangla spelling (script bangla)");
    // Same word twice for the same concept + region is almost always a copy-paste slip.
    for (const r of f.regions ?? []) {
      const key = `${f.conceptId}|${r}|${norm(f.form ?? "")}`;
      if (seenForm.has(key)) warn(where, `same form as ${seenForm.get(key)} for ${f.conceptId} in ${r}`);
      else seenForm.set(key, f.id);
    }
  }
  for (const s of sourceIds) if (!used.has(s)) warn(`source ${s}`, "not used by any form");

  return issues;
}

/** Throws with every error listed (warnings are ignored). */
export function assertValidDialectContent(content: DialectContent): void {
  const errors = validateDialectContent(content).filter((i) => i.level === "error");
  if (errors.length > 0) {
    throw new Error(`Invalid dialect content:\n${errors.map((e) => `  - ${e.where}: ${e.message}`).join("\n")}`);
  }
}
