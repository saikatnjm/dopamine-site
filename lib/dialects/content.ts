// Read access to dialect content. Validated once at import: structural errors
// fail the dev server and the production build (like validateExperience()).
// Server-side only — pages hand the client plain, pre-filtered data.
//
// Visibility (owner decision, 2026-10-25):
//   - "public" (word map, detective, region pages): verified, or needs_review
//     with high/medium confidence, a cited source and a Bangla spelling taken
//     from the source. Shown with its source, labelled "sourced", not "verified".
//   - "scored" (আঞ্চলিক ভাষার লড়াই): verified only.

import { DIALECT_CONTENT } from "@/data/dialects";
import type { Concept, DialectContent, DialectRegion, RegionalForm, Source } from "@/lib/dialects/types";
import { assertValidDialectContent } from "@/lib/dialects/validate";
import type { PoolQuestion } from "@/lib/games/ancholik-quiz";
import { hashString } from "@/lib/random";

assertValidDialectContent(DIALECT_CONTENT);

/** A region page is indexed only with at least this many public forms (no thin pages). */
export const REGION_INDEX_MIN = 8;

export function isPublicForm(f: RegionalForm): boolean {
  if (f.status === "verified") return f.script === "bangla";
  return f.status === "needs_review" && f.confidence !== "low" && f.script === "bangla" && f.sources.length > 0;
}

export function isScoredForm(f: RegionalForm): boolean {
  return f.status === "verified" && f.script === "bangla";
}

// ---------------------------------------------------------------------------
// Client-safe shapes (no notes, no drafts)
// ---------------------------------------------------------------------------

export type SourceLite = Pick<Source, "title" | "url" | "type">;
export type PublicForm = {
  id: string;
  conceptId: string;
  form: string;
  variants: readonly string[];
  regions: readonly string[];
  area?: string;
  example?: string;
  verified: boolean;
  sources: SourceLite[];
};
export type RegionLite = Pick<DialectRegion, "id" | "name" | "districts" | "emoji">;
export type ConceptLite = Pick<Concept, "id" | "standard" | "en" | "emoji" | "category" | "kind">;

export function listRegions(): readonly DialectRegion[] {
  return DIALECT_CONTENT.regions;
}
export function getRegion(id: string): DialectRegion | undefined {
  return DIALECT_CONTENT.regions.find((r) => r.id === id);
}
export function listConcepts(): readonly Concept[] {
  return DIALECT_CONTENT.concepts;
}
export function getConcept(id: string): Concept | undefined {
  return DIALECT_CONTENT.concepts.find((c) => c.id === id);
}

export function regionLite(r: DialectRegion): RegionLite {
  return { id: r.id, name: r.name, districts: r.districts, emoji: r.emoji };
}
export function conceptLite(c: Concept): ConceptLite {
  return { id: c.id, standard: c.standard, en: c.en, emoji: c.emoji, category: c.category, kind: c.kind };
}

const BANGLA = /[\u0980-\u09FF]/;

/** Pure version for any content (tests). Romanized/Nagri variants and examples stay in the data, not on the page. */
export function buildPublicForms(content: DialectContent): PublicForm[] {
  const sources = new Map(content.sources.map((s) => [s.id, s]));
  return content.forms.filter(isPublicForm).map((f) => ({
    id: f.id,
    conceptId: f.conceptId,
    form: f.form,
    variants: f.variants.filter((v) => BANGLA.test(v)),
    regions: f.regions,
    ...(f.area ? { area: f.area } : {}),
    ...(f.example && BANGLA.test(f.example) ? { example: f.example } : {}),
    verified: f.status === "verified",
    sources: f.sources.flatMap((id) => {
      const s = sources.get(id);
      return s ? [{ title: s.title, type: s.type, ...(s.url ? { url: s.url } : {}) }] : [];
    }),
  }));
}

let publicCache: PublicForm[] | null = null;
export function publicForms(): PublicForm[] {
  return (publicCache ??= buildPublicForms(DIALECT_CONTENT));
}

export function formsForRegion(regionId: string): PublicForm[] {
  return publicForms().filter((f) => f.regions.includes(regionId));
}

/** Regions that have at least one public form for the concept. */
export function regionsWithConcept(conceptId: string): Set<string> {
  return new Set(publicForms().flatMap((f) => (f.conceptId === conceptId ? f.regions : [])));
}

/** Concepts that have public forms in at least `min` regions, best-covered first. */
export function conceptsByCoverage(min = 1): Concept[] {
  return listConcepts()
    .map((c) => ({ c, n: regionsWithConcept(c.id).size }))
    .filter((x) => x.n >= min)
    .sort((a, b) => b.n - a.n)
    .map((x) => x.c);
}

// ---------------------------------------------------------------------------
// Scored quiz pool: one "এই শব্দের মানে কী?" question per verified form
// ---------------------------------------------------------------------------

/** Pure version of quizPool() for any content (tests). */
export function buildQuizPool(content: DialectContent): PoolQuestion[] {
  const concepts = new Map(content.concepts.map((c) => [c.id, c]));
  const regions = new Map(content.regions.map((r) => [r.id, r]));
  const words = content.concepts.filter((c) => c.kind === "word");
  // A form string that means several concepts would make "the" answer ambiguous.
  const meanings = new Map<string, Set<string>>();
  for (const f of content.forms) {
    const key = f.form.normalize("NFC").trim();
    meanings.set(key, (meanings.get(key) ?? new Set()).add(f.conceptId));
  }

  return content.forms.filter(isScoredForm).flatMap((f) => {
    const c = concepts.get(f.conceptId);
    const r = regions.get(f.regions[0] ?? "");
    if (!c || !r || c.kind !== "word") return [];
    const taken = meanings.get(f.form.normalize("NFC").trim()) ?? new Set();
    const distractors = words
      .filter((x) => x.id !== c.id && !taken.has(x.id) && x.standard !== c.standard)
      .sort((a, b) => Number(b.category === c.category) - Number(a.category === c.category) || hashString(`${f.id}:${a.id}`) - hashString(`${f.id}:${b.id}`))
      .slice(0, 3);
    if (distractors.length < 3) return [];
    const rbn = typeof r.name === "string" ? r.name : r.name.bn;
    const ren = typeof r.name === "string" ? r.name : r.name.en;
    return [
      {
        id: `q-${f.id}`,
        question: { en: `In ${ren}, what does “${f.form}” mean?`, bn: `${rbn}-এর ভাষায় “${f.form}” মানে কী?` },
        options: [c, ...distractors].map((x) => ({ id: x.id, text: x.standard, gloss: x.en })),
        correctOptionId: c.id,
        explanation: { en: `In ${ren}, “${f.form}” means “${c.standard}” (${c.en}).`, bn: `${rbn}-এ “${f.form}” মানে “${c.standard}”।` },
        difficulty: c.difficulty,
        regionIds: f.regions,
        word: { id: c.id, localWord: f.form, standardWord: c.standard, meaningBn: c.standard, meaningEn: c.en },
      },
    ];
  });
}

export function quizPool(): PoolQuestion[] {
  return buildQuizPool(DIALECT_CONTENT);
}

/** Counts by status — for the CLI report. */
export function contentStats() {
  const forms = DIALECT_CONTENT.forms;
  return {
    forms: forms.length,
    publicForms: publicForms().length,
    verifiedForms: forms.filter((f) => f.status === "verified").length,
    scoredQuestions: quizPool().length,
  };
}
