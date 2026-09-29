"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { LANG_COOKIE, type Lang } from "@/lib/i18n/core";

const options: { lang: Lang; label: string; full: string }[] = [
  { lang: "en", label: "EN", full: "English" },
  { lang: "bn", label: "বাং", full: "বাংলা" },
];

// Same URL in both languages: the choice is stored in a cookie for a year
// and the server re-renders the page in place.
export function LangToggle() {
  const { lang, d } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: Lang) {
    if (next === lang) return;
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    startTransition(() => router.refresh());
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
          aria-label={o.full}
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
