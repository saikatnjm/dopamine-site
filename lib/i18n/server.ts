import { cookies } from "next/headers";
import { DEFAULT_LANG, isLang, LANG_COOKIE, type Lang } from "./core";
import { getDictionary } from "./dictionary";

/** Current language from the cookie (English when unset). Makes the route dynamic. */
export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(value) ? value : DEFAULT_LANG;
}

export async function getI18n() {
  const lang = await getLang();
  return { lang, d: getDictionary(lang) };
}
