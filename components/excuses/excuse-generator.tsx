"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { CATEGORIES, categoryInfo, excuseCopy as copy, type CategoryId } from "@/data/excuses";
import { track } from "@/lib/analytics";
import { excuseText, freshSeed, generateExcuse, shareMessage, usedIds } from "@/lib/excuses";
import { encodeSeed } from "@/lib/games/shared";
import { num, t } from "@/lib/i18n/core";
import { copyText, shareTargets, type ShareMethod } from "@/lib/sharing";

type Current = { requested: CategoryId; seed: number };

const noSubscribe = () => () => {};
/** window.location.origin after hydration ("" on the server — no mismatch). */
function useOrigin(): string {
  return useSyncExternalStore(noSubscribe, () => window.location.origin, () => "");
}

const tile =
  "grid size-12 place-items-center rounded-full border-2 border-ink text-xl font-black shadow-pop transition-all duration-150 group-hover:-translate-y-1 group-hover:shadow-pop-lg group-active:translate-y-0.5 group-active:shadow-none";

export function ExcuseGenerator({ initial, shared }: { initial: Current | null; shared: boolean }) {
  const { lang } = useI18n();
  const [requested, setRequested] = useState<CategoryId>(initial?.requested ?? "random");
  const [current, setCurrent] = useState<Current | null>(initial);
  const [fromFriend, setFromFriend] = useState(shared);
  const [recent, setRecent] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const resultRef = useRef<HTMLDivElement>(null);
  const origin = useOrigin();

  const excuse = useMemo(() => (current ? generateExcuse(current.requested, current.seed) : null), [current]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const path = (c: Current) => `/excuses?c=${c.requested}&s=${encodeSeed(c.seed)}`;

  function showToast(message: string) {
    setToast(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2000);
  }

  function generate(category: CategoryId = requested) {
    const seed = freshSeed(category, recent);
    const next = { requested: category, seed };
    const ex = generateExcuse(category, seed);
    setCurrent(next);
    setFromFriend(false);
    setRecent((r) => [...usedIds(ex), ...r].slice(0, 12));
    // Keep the address bar shareable without adding history entries.
    window.history.replaceState(null, "", path(next));
    track("excuse_generate", { category: ex.category });
    window.requestAnimationFrame(() => resultRef.current?.focus({ preventScroll: true }));
  }

  if (!excuse || !current) {
    return (
      <div className="grid gap-4">
        <CategoryPicker value={requested} onChange={setRequested} />
        <button type="button" onClick={() => generate()} className={`${btnPrimary} ${accentBg.marigold} min-h-16 text-2xl`}>
          {t(copy.generate, lang)}
        </button>
        <p className="text-center text-sm font-bold text-ink-muted">{t(copy.empty, lang)}</p>
      </div>
    );
  }

  const url = `${origin}${path(current)}`;
  const text = excuseText(excuse, lang);
  const message = shareMessage(copy.shareText, excuse, lang, num);
  const targets = shareTargets(url, message);
  const info = categoryInfo[excuse.category];
  const shared_ = (method: ShareMethod) => track("excuse_share", { category: excuse.category, method });

  async function copyExcuse() {
    if (await copyText(text)) {
      showToast(t(copy.copied, lang));
      track("excuse_copy", { category: excuse.category });
    }
  }
  async function copyLink() {
    if (await copyText(`${message} ${url}`)) {
      showToast(t(copy.linkCopied, lang));
      shared_("copy");
    }
  }
  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text: message, url });
        shared_("native");
      } catch {
        // share sheet dismissed
      }
      return;
    }
    await copyLink();
  }

  const links = [
    { method: "whatsapp" as const, href: targets.whatsapp, label: "WhatsApp", glyph: "💬", bg: "bg-[#25D366]" },
    { method: "facebook" as const, href: targets.facebook, label: "Facebook", glyph: "f", bg: "bg-[#1877F2] text-white" },
    { method: "x" as const, href: targets.x, label: "X", glyph: "𝕏", bg: "bg-ink text-bg" },
  ];

  return (
    <div className="grid gap-4">
      <CategoryPicker value={requested} onChange={setRequested} />

      {fromFriend && (
        <p className="-rotate-1 rounded-2xl border-2 border-ink bg-marigold p-3 text-center font-extrabold shadow-pop">{t(copy.sharedBanner, lang)}</p>
      )}

      {/* Result — built to screenshot well */}
      <div
        ref={resultRef}
        tabIndex={-1}
        aria-live="polite"
        className={`${card} overflow-hidden outline-none focus-visible:outline-3 focus-visible:outline-offset-4`}
      >
        <div className={`${accentBg[info.accent]} flex items-center justify-between gap-2 border-b-2 border-ink px-4 py-2`}>
          <p className="text-sm font-extrabold">
            {info.emoji} {t(info.label, lang)}
          </p>
          <span aria-hidden key={current.seed} className="text-2xl motion-safe:animate-wiggle">
            😂
          </span>
        </div>
        <blockquote className="px-5 pb-4 pt-5">
          <p lang={lang} className="font-display text-2xl font-extrabold leading-snug sm:text-3xl">
            “{text}”
          </p>
        </blockquote>
        <div className="grid gap-3 px-5 pb-4">
          <Meter label={t(copy.credibility, lang)} value={excuse.credibility} color="bg-lime" />
          <Meter label={t(copy.chaos, lang)} value={excuse.chaos} color="bg-chili" />
          <div className="rounded-2xl border-2 border-ink bg-surface-2 p-3">
            <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">{t(copy.verdict, lang)}</p>
            <p className="font-bold">{t(excuse.verdict, lang)}</p>
          </div>
        </div>
        <p className="border-t-2 border-dashed border-ink/30 px-4 py-2 text-center text-xs font-extrabold text-ink-muted">
          🧠 Hottogol · {origin.replace(/^https?:\/\//, "")}/excuses
        </p>
      </div>

      <button type="button" onClick={() => generate()} className={`${btnPrimary} ${accentBg.marigold}`}>
        {t(copy.another, lang)}
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={copyExcuse} className={`${btnPrimary} bg-surface`}>
          {t(copy.copy, lang)}
        </button>
        <button type="button" onClick={share} className={`${btnPrimary} ${accentBg.sky}`}>
          {t(copy.share, lang)}
        </button>
      </div>
      <section aria-label={t(copy.shareVia, lang)} className={`${card} p-3`}>
        <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-wider text-ink-muted">{t(copy.shareVia, lang)}</p>
        <div className="grid grid-cols-4 gap-1">
          {links.map((l) => (
            <a
              key={l.method}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => shared_(l.method)}
              className="group flex flex-col items-center gap-1.5 rounded-xl py-1"
            >
              <span aria-hidden className={`${tile} ${l.bg}`}>
                {l.glyph}
              </span>
              <span className="text-[11px] font-bold leading-tight sm:text-xs">{l.label}</span>
            </a>
          ))}
          <button type="button" onClick={copyLink} className="group flex flex-col items-center gap-1.5 rounded-xl py-1">
            <span aria-hidden className={`${tile} bg-lime`}>
              🔗
            </span>
            <span className="text-[11px] font-bold leading-tight sm:text-xs">{t(copy.copyLink, lang)}</span>
          </button>
        </div>
      </section>
      <Link href="/" className={btnGhost}>
        {t(copy.back, lang)}
      </Link>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4" role="status" aria-live="polite">
        {toast && <p className="rounded-pill border-2 border-ink bg-ink px-5 py-2.5 font-bold text-bg shadow-pop">✅ {toast}</p>}
      </div>
    </div>
  );
}

/** Category chips as an accessible radio group. */
function CategoryPicker({ value, onChange }: { value: CategoryId; onChange: (c: CategoryId) => void }) {
  const { lang } = useI18n();
  return (
    <fieldset>
      <legend className="mb-2 font-extrabold">{t(copy.pick, lang)}</legend>
      <div role="radiogroup" className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const info = categoryInfo[c];
          const active = c === value;
          return (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(c)}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-pill border-2 border-ink px-3.5 py-1.5 text-sm font-extrabold transition-transform ${
                active ? `${accentBg[info.accent]} -rotate-2 shadow-pop` : "bg-surface hover:-rotate-1"
              }`}
            >
              <span aria-hidden>{info.emoji}</span> {t(info.label, lang)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  const { lang } = useI18n();
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm font-extrabold uppercase tracking-wider">
        <span>{label}</span>
        <span className="font-display text-xl tabular-nums">{num(value, lang)}%</span>
      </div>
      <div role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} className="mt-1 h-4 overflow-hidden rounded-pill border-2 border-ink bg-surface">
        <span className={`block h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
