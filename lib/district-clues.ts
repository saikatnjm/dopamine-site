// District clues for "Guess the District" (food, crafts, landmarks, nature,
// nicknames). These are FACTS ABOUT PLACES, so they follow the dialect content
// rule: never invent, every clue cites a source someone opened, new entries
// are needs_review, and only a person sets verified. Scored rounds use
// verified clues only. Validation here is structural; it can't check facts.

import type { Source } from "@/lib/dialects/types";
import type { Text } from "@/lib/i18n/core";

export type ClueKind = "food" | "product" | "landmark" | "nature" | "nickname";
export type ClueStatus = "draft" | "needs_review" | "verified" | "rejected";

export type DistrictClue = {
  /** `<district>-<kind>[-n]`, /^[a-z0-9-]{1,60}$/. Never rename or reuse. */
  id: string;
  district: string;
  kind: ClueKind;
  /** Must NOT contain the district's name (any spelling). */
  clue: { en: string; bn: string };
  /** One short line shown after answering (may name the district). */
  reveal?: { en: string; bn: string };
  sources: readonly string[];
  confidence: "high" | "medium" | "low";
  status: ClueStatus;
  /** Supporting quote / doubts. Not shown publicly. */
  notes?: string;
};

export type ClueContent = {
  districts: readonly { id: string; name: Text }[];
  sources: readonly Source[];
  clues: readonly DistrictClue[];
};

/** Client-safe shape for scored rounds. */
export type ClueLite = {
  id: string;
  district: string;
  clue: { en: string; bn: string };
  reveal?: { en: string; bn: string };
  sources: { title: string; url?: string }[];
};

const ID_RE = /^[a-z0-9-]{1,60}$/;
const KINDS: readonly ClueKind[] = ["food", "product", "landmark", "nature", "nickname"];
const STATUSES: readonly ClueStatus[] = ["draft", "needs_review", "verified", "rejected"];

/** Old / common spellings people still use; a clue mentioning one gives the answer away. */
export const OLD_SPELLINGS: Readonly<Record<string, readonly string[]>> = {
  chattogram: ["chittagong", "chottogram", "চাটগাঁ"],
  cumilla: ["comilla"],
  jashore: ["jessore"],
  barishal: ["barisal"],
  bogura: ["bogra"],
  coxsbazar: ["cox's bazar", "coxs bazar", "cox bazar"],
  chapainawabganj: ["nawabganj", "chapai nawabganj", "chapai"],
  netrokona: ["netrakona"],
  moulvibazar: ["maulvibazar"],
  jhalokati: ["jhalakati"],
  khagrachhari: ["khagrachari"],
  brahmanbaria: ["brahamanbaria"],
};

function filled(v: unknown): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

/** Every name a clue must avoid for this district (lowercased). */
export function forbiddenNames(district: { id: string; name: Text }): string[] {
  const n = district.name;
  const names = typeof n === "string" ? [n] : [n.en, n.bn];
  return [...names, ...(OLD_SPELLINGS[district.id] ?? [])].map((s) => s.normalize("NFC").toLowerCase());
}

export function validateClues(content: ClueContent): string[] {
  const errors: string[] = [];
  const districts = new Map(content.districts.map((d) => [d.id, d]));
  const sourceIds = new Set<string>();
  for (const s of content.sources) {
    if (!ID_RE.test(s.id)) errors.push(`source ${JSON.stringify(s.id)}: bad id`);
    else if (sourceIds.has(s.id)) errors.push(`source ${s.id}: duplicate id`);
    sourceIds.add(s.id);
    if (!filled(s.title)) errors.push(`source ${s.id}: title is required`);
    if (s.url !== undefined && !/^https?:\/\//.test(s.url)) errors.push(`source ${s.id}: url must start with http(s)://`);
  }
  const ids = new Set<string>();
  for (const c of content.clues) {
    const where = `clue ${c.id}`;
    if (!ID_RE.test(c.id)) errors.push(`${where}: bad id`);
    else if (ids.has(c.id)) errors.push(`${where}: duplicate id`);
    ids.add(c.id);
    const d = districts.get(c.district);
    if (!d) errors.push(`${where}: unknown district "${c.district}"`);
    if (!KINDS.includes(c.kind)) errors.push(`${where}: unknown kind "${c.kind}"`);
    if (!STATUSES.includes(c.status)) errors.push(`${where}: unknown status "${c.status}"`);
    if (!["high", "medium", "low"].includes(c.confidence)) errors.push(`${where}: unknown confidence "${c.confidence}"`);
    if (!filled(c.clue?.en) || !filled(c.clue?.bn)) errors.push(`${where}: clue needs en and bn`);
    if (c.reveal && (!filled(c.reveal.en) || !filled(c.reveal.bn))) errors.push(`${where}: reveal needs en and bn`);
    if (!Array.isArray(c.sources) || c.sources.length === 0) errors.push(`${where}: needs at least one source`);
    for (const s of c.sources ?? []) if (!sourceIds.has(s)) errors.push(`${where}: unknown source "${s}"`);
    if (d && c.clue) {
      const text = `${c.clue.en} ${c.clue.bn}`.normalize("NFC").toLowerCase();
      for (const name of forbiddenNames(d)) if (name && text.includes(name)) errors.push(`${where}: clue gives away the answer ("${name}")`);
    }
  }
  return errors;
}

export function assertValidClues(content: ClueContent): void {
  const errors = validateClues(content);
  if (errors.length > 0) throw new Error(`Invalid district clues:\n  - ${errors.join("\n  - ")}`);
}

/** Verified clues only, sorted by id (so adding clues never reshuffles old picks), client-safe. */
export function verifiedClues(content: ClueContent): ClueLite[] {
  const sources = new Map(content.sources.map((s) => [s.id, s]));
  return content.clues
    .filter((c) => c.status === "verified")
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    .map((c) => ({
      id: c.id,
      district: c.district,
      clue: c.clue,
      ...(c.reveal ? { reveal: c.reveal } : {}),
      sources: c.sources.flatMap((id) => {
        const s = sources.get(id);
        return s ? [{ title: s.title, ...(s.url ? { url: s.url } : {}) }] : [];
      }),
    }));
}
