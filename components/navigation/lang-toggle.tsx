"use client";

import { useState } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { LANG_COOKIE, type Lang } from "@/lib/i18n/core";
import { localePath } from "@/lib/i18n/paths";

const options: { lang: Lang; label: string; full: string }[] = [
  { lang: "en", label: "EN", full: "English" },
  { lang: "bn", label: "বাং", full: "বাংলা" },
];

/**
 * Browser side effects live outside the component (React compiler rule).
 * Each language has its own URL (/bn/… for Bangla) and root layout, so the
 * switch is a full page load; the cookie remembers the choice for next visits.
 */
function switchTo(next: Lang) {
  document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  const { pathname, search, hash } = window.location;
  window.location.assign(localePath(`${pathname}${search}${hash}`, next));
}

export function LangToggle() {
  const { lang, d } = useI18n();
  const [pending, setPending] = useState(false);

  function choose(next: Lang) {
    if (next === lang) return;
    setPending(true);
    switchTo(next);
  }

  return (
    <div
      role="group"
      aria-label={d.language}
      className={`inline-flex rounded-pill border-2 border-ink bg-surface p-0.5 shadow-pop transition-opacity ${pending ? "opacity-60" : ""}`}
    >
      {options.map((o) => (
        <button
          key={o.lang}
          type="button"
          lang={o.lang}
          aria-pressed={lang === o.lang}
          aria-label={`${o.label} (${o.full})`}
          onClick={() => choose(o.lang)}
          className={`min-h-9 min-w-10 rounded-pill px-2.5 text-sm font-extrabold transition-colors duration-200 ${
            lang === o.lang ? "bg-ink text-bg" : "text-ink hover:bg-surface-2"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
