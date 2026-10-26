import { lang as langParam } from "next/root-params";
import { DEFAULT_LANG, isLang, type Lang } from "./core";
import { getDictionary } from "./dictionary";

/**
 * Current language from the URL: every route lives under app/[lang]/ (proxy.ts
 * serves unprefixed English URLs from /en/…). Server components only.
 */
export async function getLang(): Promise<Lang> {
  const value = await langParam();
  return isLang(value) ? value : DEFAULT_LANG;
}

export async function getI18n() {
  const lang = await getLang();
  return { lang, d: getDictionary(lang) };
}
