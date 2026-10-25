// Structural checks for dialect content. Pure, no I/O — used by the content
// registry (bad data fails the build), the CLI (`npm run validate:content`)
// and the tests.
//
// These checks only prove the data is well-formed: unique ids, required
// fields, valid references, four distinct options. They cannot tell whether a
// dialect word, spelling or meaning is correct — that is a person's review
// (verificationStatus), never code.

import type { DialectContent, Difficulty, QuestionStatus, VerificationStatus } from "@/lib/dialects/types";

export type IssueLevel = "error" | "warning";
export type ContentIssue = { level: IssueLevel; where: string; message: string };

export const ID_RE = /^[a-z0-9-]{1,40}$/;
const DIVISIONS = ["barishal", "chattogram", "dhaka", "khulna", "mymensingh", "rajshahi", "rangpur", "sylhet"];
const WORD_STATUSES: readonly VerificationStatus[] = ["draft", "needs_review", "verified"];
const QUESTION_STATUSES: readonly QuestionStatus[] = ["draft", "verified", "published"];
const DIFFICULTIES: readonly Difficulty[] = ["easy", "medium", "hard"];
export const OPTIONS_PER_QUESTION = 4;

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

/** Same text after trimming/collapsing spaces (catches "পোলা" vs "পোলা "). */
function norm(s: string): string {
  return s.normalize("NFC").trim().replace(/\s+/g, " ");
}

export function validateDialectContent(content: DialectContent): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const error = (where: string, message: string) => issues.push({ level: "error", where, message });
  const warn = (where: string, message: string) => issues.push({ level: "warning", where, message });

  const unique = (kind: string, ids: readonly unknown[]) => {
    const seen = new Set<string>();
    ids.forEach((id, i) => {
      const where = `${kind}[${i}]`;
      if (typeof id !== "string" || !ID_RE.test(id)) return error(where, `id ${JSON.stringify(id)} must match ${ID_RE}`);
      if (seen.has(id)) error(`${kind} ${id}`, "duplicate id");
      seen.add(id);
    });
    return seen;
  };

  // Districts
  const districtIds = unique("district", content.districts.map((d) => d.id));
  for (const d of content.districts) {
    const where = `district ${d.id}`;
    if (!filledText(d.name)) error(where, "name is required");
    if (!DIVISIONS.includes(d.division)) error(where, `unknown division "${d.division}"`);
  }

  const checkDistricts = (where: string, ids: readonly string[]) => {
    if (!Array.isArray(ids) || ids.length === 0) return error(where, "districtIds needs at least one district");
    for (const id of ids) if (!districtIds.has(id)) error(where, `unknown district "${id}"`);
  };

  // Words
  unique("word", content.words.map((w) => w.id));
  const words = new Map(content.words.map((w) => [w.id, w]));
  for (const w of content.words) {
    const where = `word ${w.id}`;
    for (const field of ["standardWord", "localWord", "meaningBn", "source"] as const) {
      if (!filled(w[field])) error(where, `${field} is required`);
    }
    checkDistricts(where, w.districtIds);
    if (!DIVISIONS.includes(w.region)) error(where, `unknown region "${w.region}"`);
    if (!Array.isArray(w.variants)) error(where, "variants must be a list (use [] for none)");
    if (!WORD_STATUSES.includes(w.verificationStatus)) error(where, `unknown verificationStatus "${w.verificationStatus}"`);
    if (w.verificationStatus === "verified" && !filled(w.exampleSentence)) {
      warn(where, "verified but has no exampleSentence — its word page stays noindex");
    }
  }

  // Questions
  unique("question", content.questions.map((q) => q.id));
  for (const q of content.questions) {
    const where = `question ${q.id}`;
    if (!filledText(q.question)) error(where, "question text is required");
    if (!filledText(q.explanation)) error(where, "explanation is required");
    if (!DIFFICULTIES.includes(q.difficulty)) error(where, `unknown difficulty "${q.difficulty}"`);
    if (!QUESTION_STATUSES.includes(q.status)) error(where, `unknown status "${q.status}"`);
    if (!Array.isArray(q.tags)) error(where, "tags must be a list (use [] for none)");
    checkDistricts(where, q.districtIds);

    if (!Array.isArray(q.options) || q.options.length !== OPTIONS_PER_QUESTION) {
      error(where, `needs exactly ${OPTIONS_PER_QUESTION} options (has ${Array.isArray(q.options) ? q.options.length : 0})`);
    } else {
      const optionIds = new Set<string>();
      const texts = new Set<string>();
      for (const o of q.options) {
        if (!filled(o.id)) error(where, "an option has no id");
        else if (optionIds.has(o.id)) error(where, `duplicate option id "${o.id}"`);
        optionIds.add(o.id);
        if (!filled(o.text)) error(where, `option "${o.id}" has no text`);
        else if (texts.has(norm(o.text))) error(where, `duplicate option text "${norm(o.text)}"`);
        else texts.add(norm(o.text));
      }
      if (!optionIds.has(q.correctOptionId)) error(where, `correctOptionId "${q.correctOptionId}" is not one of its options`);
    }

    const word = words.get(q.wordId);
    if (!word) {
      error(where, `wordId "${q.wordId}" does not exist`);
      continue;
    }
    if (q.status === "published" && word.verificationStatus !== "verified") {
      error(where, `published, but word "${word.id}" is ${word.verificationStatus} — publish only after the word is verified`);
    }
    for (const id of q.districtIds ?? []) {
      if (districtIds.has(id) && !word.districtIds.includes(id)) warn(where, `district "${id}" is not listed on word "${word.id}"`);
    }
  }

  return issues;
}

/** Throws with every error listed (warnings are ignored). */
export function assertValidDialectContent(content: DialectContent): void {
  const errors = validateDialectContent(content).filter((i) => i.level === "error");
  if (errors.length > 0) {
    throw new Error(`Invalid dialect content:\n${errors.map((e) => `  - ${e.where}: ${e.message}`).join("\n")}`);
  }
}
