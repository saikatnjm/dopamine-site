// Language primitives shared by server and client code.

export const LANGS = ["en", "bn"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "en";
export const LANG_COOKIE = "lang";

/** Content text: one string for both languages, or a per-language pair. */
export type Text = string | { en: string; bn: string };

export function t(text: Text, lang: Lang): string {
  return typeof text === "string" ? text : text[lang];
}

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "bn";
}

/** Localised number (Bangla digits in bn). */
export function num(n: number, lang: Lang): string {
  return lang === "bn" ? n.toLocaleString("bn-BD") : String(n);
}

/** Replace {name} placeholders. */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
