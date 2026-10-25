import { DISTRICTS } from "@/data/dialects/districts";
import { REGIONS } from "@/data/dialects/regions";
import type { Concept, Confidence, DialectContent, Difficulty, RegionalForm, Script, VerificationStatus } from "@/lib/dialects/types";

// TEST-ONLY placeholder content. Forms are deliberately fake strings
// ("পরীক্ষা-…"), not dialect facts — they only exercise the structure.
// Real districts/regions are used because seeds and the map depend on them.

export function concept(id: string, difficulty: Difficulty = "easy", category: Concept["category"] = "words"): Concept {
  return { id, standard: `প্রমিত-${id}`, en: `std ${id}`, emoji: "🧪", category, kind: "word", difficulty };
}

export function form(
  id: string,
  conceptId: string,
  regions: string[],
  opts: Partial<{ status: VerificationStatus; confidence: Confidence; script: Script; text: string; sources: string[] }> = {},
): RegionalForm {
  return {
    id,
    conceptId,
    form: opts.text ?? `পরীক্ষা-${id}`,
    variants: [],
    regions,
    script: opts.script ?? "bangla",
    sources: opts.sources ?? ["test-source"],
    confidence: opts.confidence ?? "high",
    status: opts.status ?? "verified",
  };
}

/**
 * `perRegion` verified forms in each given region, one concept each,
 * difficulties cycling easy/medium/hard, 3 categories so distractors exist.
 */
export function fixture(perRegion = 12, regions = ["jashore-khulna", "sylhet"]): DialectContent {
  const levels: Difficulty[] = ["easy", "medium", "hard"];
  const cats: Concept["category"][] = ["words", "animals", "food"];
  const concepts: Concept[] = [];
  const forms: RegionalForm[] = [];
  for (let i = 0; i < perRegion; i++) concepts.push(concept(`c${i}`, levels[i % 3], cats[i % 3]));
  for (const r of regions) for (let i = 0; i < perRegion; i++) forms.push(form(`${r}-c${i}`, `c${i}`, [r]));
  return {
    districts: DISTRICTS,
    regions: REGIONS,
    sources: [{ id: "test-source", title: "Test source", type: "owner" }],
    concepts,
    forms,
  };
}
