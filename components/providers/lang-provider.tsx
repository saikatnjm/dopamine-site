"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LANG, type Lang } from "@/lib/i18n/core";
import { getDictionary } from "@/lib/i18n/dictionary";

const LangContext = createContext<Lang>(DEFAULT_LANG);

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

/** Current language and UI dictionary in client components. */
export function useI18n() {
  const lang = useContext(LangContext);
  return { lang, d: getDictionary(lang) };
}
