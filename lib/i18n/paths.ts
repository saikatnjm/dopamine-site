// Language-aware URLs (Phase 49 step B). English lives at unprefixed URLs,
// Bangla under /bn. Client-safe (no Next server APIs).

import type { Lang } from "./core";

/** Prefix used in URLs for each language. */
export const LANG_PREFIX: Record<Lang, string> = { en: "", bn: "/bn" };

const PREFIXED = /^\/(en|bn)(?=\/|$|\?|#)/;

/** Drop a leading /en or /bn from a path ("/bn/games?x" → "/games?x"). */
export function stripLang(path: string): string {
  const out = path.replace(PREFIXED, "");
  return out === "" || out[0] === "?" || out[0] === "#" ? `/${out}` : out;
}

/** The language a pathname is in (unprefixed = English). */
export function langOfPath(pathname: string): Lang {
  return /^\/bn(?=\/|$)/.test(pathname) ? "bn" : "en";
}

/**
 * Internal path in `lang` ("/games" → "/bn/games"). External URLs, protocol-
 * relative URLs and hash-only links are returned untouched.
 */
export function localePath(path: string, lang: Lang): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const bare = stripLang(path);
  if (lang === "en") return bare;
  return bare === "/" ? LANG_PREFIX.bn : bare.startsWith("/?") || bare.startsWith("/#") ? `${LANG_PREFIX.bn}${bare.slice(1)}` : `${LANG_PREFIX.bn}${bare}`;
}
