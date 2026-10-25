// Regional dialect content: the single source of types (data in data/dialects/,
// checks in lib/dialects/validate.ts).
//
// The model is concept-centric: one Concept (বিড়াল, "কোথায় যাচ্ছ?") has many
// RegionalForms, each used in one or more DialectRegions. Dialect regions are
// not districts — a region lists the districts it mainly covers, and borders
// are approximate.
//
// Nothing here is checked for linguistic accuracy by code. Visibility rules
// (lib/dialects/content.ts):
//   - map + detective ("source-backed"): verified, or needs_review with a
//     high/medium-confidence cited source and a Bangla spelling from the source;
//   - scored quizzes: verified only (a person reviewed it).

import type { Text } from "@/lib/i18n/core";

/** All 64 districts, official lowercase spelling (data/dialects/districts.ts). */
export type District = { id: string; name: Text };

export type DialectRegion = {
  /** /^[a-z0-9-]{1,40}$/. APPEND-ONLY order in REGIONS (packed into quiz seeds). Never rename. */
  id: string;
  name: Text;
  /** Districts this dialect is mainly spoken in (district ids). Approximate by nature. */
  districts: readonly string[];
  emoji: string;
  /** One-line, sourced description of the area's speech (shown on its page). */
  blurb: Text;
};

export type SourceType = "encyclopedia" | "academic" | "dictionary" | "government" | "newspaper" | "dataset" | "wiki" | "blog" | "owner";

export type Source = {
  id: string;
  title: string;
  url?: string;
  type: SourceType;
};

export type ConceptCategory = "people" | "animals" | "home" | "food" | "nature" | "words" | "phrases";
export type Difficulty = "easy" | "medium" | "hard";

export type Concept = {
  /** /^[a-z0-9-]{1,40}$/. Never rename or reuse (URLs, share links). */
  id: string;
  /** Standard (প্রমিত) Bangla, e.g. "বিড়াল" or "কোথায় যাচ্ছ?". */
  standard: string;
  /** English gloss for English mode. */
  en: string;
  emoji: string;
  category: ConceptCategory;
  kind: "word" | "phrase";
  difficulty: Difficulty;
};

/** high = reputable source or 2+ independent sources agree; medium = one decent source; low = blog/social. */
export type Confidence = "high" | "medium" | "low";

/** draft → needs_review → verified (by a person). rejected = keep the record, never show. */
export type VerificationStatus = "draft" | "needs_review" | "verified" | "rejected";

/**
 * bangla = Bangla script exactly as a source wrote it; romanized = the source only
 * gives Latin/IPA (shown nowhere until a person writes the Bangla and verifies);
 * rendered = Bangla spelling made by us from a romanized source (unverified).
 */
export type Script = "bangla" | "romanized" | "rendered";

export type RegionalForm = {
  /** /^[a-z0-9-]{1,60}$/, unique. Convention: <region>-<concept>[-n]. Never rename or reuse. */
  id: string;
  conceptId: string;
  /** The regional form exactly as the source writes it. */
  form: string;
  /** Other spellings seen (never merged into `form`). */
  variants: readonly string[];
  regions: readonly string[];
  /** Area as the source states it, when narrower than the region, e.g. "Banaripara". */
  area?: string;
  script: Script;
  /** Source ids (data/dialects/sources.ts), at least one. */
  sources: readonly string[];
  confidence: Confidence;
  status: VerificationStatus;
  /** Example sentence, only if the source gives one. */
  example?: string;
  /** Uncertainty, conflicts, reviewer remarks. Not shown publicly. */
  notes?: string;
};

export type DialectContent = {
  districts: readonly District[];
  regions: readonly DialectRegion[];
  sources: readonly Source[];
  concepts: readonly Concept[];
  forms: readonly RegionalForm[];
};
