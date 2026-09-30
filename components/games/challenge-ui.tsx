"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnPrimary, card, type Accent } from "@/components/ui/styles";
import { track } from "@/lib/analytics";
import { challengePath, type ChallengeGame, type FriendChallenge } from "@/lib/challenge";
import { fmt, num } from "@/lib/i18n/core";
import { copyText, shareTargets, type ShareMethod } from "@/lib/sharing";

// Shared "Challenge a Friend" UI used by every game. Honest by design: it only
// ever compares you with the one friend who sent the link — no rankings.

/** Big sticker shown before play when the page was opened from a challenge link. */
export function ChallengeBanner({ challenge }: { challenge: FriendChallenge }) {
  const { lang, d } = useI18n();
  return (
    <div className="mb-5 -rotate-1 overflow-hidden rounded-2xl border-2 border-ink bg-marigold text-center shadow-pop" role="note">
      <p className="px-4 pt-3 text-lg font-extrabold">{d.chFriend}</p>
      <p className="px-4 font-display text-5xl font-black tabular-nums leading-tight">
        {fmt(d.chToBeat, { score: num(challenge.score, lang) })}
      </p>
      <p className="mt-2 border-t-2 border-dashed border-ink/30 px-4 py-2 text-sm font-bold">{d.chSame}</p>
    </div>
  );
}

/** Win / tie / lose line on the result card (only when you played the friend's round). */
export function ChallengeOutcome({ challenge, seed, score }: { challenge: FriendChallenge | null; seed: number; score: number }) {
  const { lang, d } = useI18n();
  if (!challenge || challenge.seed !== seed) return null;
  const diff = Math.abs(score - challenge.score);
  const text =
    score > challenge.score
      ? fmt(d.chWin, { diff: num(diff, lang), score: num(challenge.score, lang) })
      : score === challenge.score
        ? fmt(d.chTie, { score: num(score, lang) })
        : fmt(d.chLose, { diff: num(diff, lang), score: num(challenge.score, lang) });
  return (
    <p
      className={`mx-auto mt-3 w-fit rotate-[-1deg] rounded-xl border-2 border-ink px-3 py-1.5 text-center font-extrabold ${
        score > challenge.score ? "bg-lime" : score === challenge.score ? "bg-sky" : "bg-chili"
      }`}
    >
      {text}
    </p>
  );
}

/**
 * Small "where to play" stamp inside result cards, so screenshots carry the
 * site and game. Rendered only after a game ends (client), so reading the
 * host here can't cause a hydration mismatch.
 */
export function ResultStamp({ game }: { game: string }) {
  const host = typeof window !== "undefined" ? window.location.host : "";
  return (
    <p className="border-t-2 border-dashed border-ink/30 px-4 py-2 text-center text-xs font-extrabold text-ink-muted">
      🧠 Hottogol · {host}/games/{game}
    </p>
  );
}

const tile =
  "grid size-12 place-items-center rounded-full border-2 border-ink text-xl font-black shadow-pop transition-all duration-150 group-hover:-translate-y-1 group-hover:shadow-pop-lg group-active:translate-y-0.5 group-active:shadow-none";

/**
 * Primary "Challenge a friend" button (Web Share API → copy-link fallback)
 * plus WhatsApp / Facebook / X / Copy link. The link reproduces your round.
 */
export function ShareActions({
  game,
  seed,
  score,
  text,
  accent,
  rank,
}: {
  game: ChallengeGame;
  seed: number;
  score: number;
  /** Message shown with the link (no URL inside). */
  text: string;
  accent: Accent;
  /** Result id, for analytics only. */
  rank: string;
}) {
  const { d } = useI18n();
  const [toast, setToast] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const path = challengePath({ game, seed, score });
  // Fallback keeps sharing working even if a score ever exceeded the token limits.
  const url = typeof window === "undefined" ? "" : `${window.location.origin}${path ?? `/games/${game}`}`;
  const targets = shareTargets(url, text);
  const shared = (method: ShareMethod) => track("game_share", { game, method, rank });

  async function copy() {
    if (await copyText(`${text} ${url}`)) {
      shared("copy");
      setToast(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setToast(false), 2000);
    }
  }

  async function nativeShare() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text, url });
        shared("native");
      } catch {
        // share sheet dismissed: not a share, not an error
      }
      return;
    }
    await copy();
  }

  const links = [
    { method: "whatsapp" as const, href: targets.whatsapp, label: "WhatsApp", glyph: "💬", bg: "bg-[#25D366]" },
    { method: "facebook" as const, href: targets.facebook, label: "Facebook", glyph: "f", bg: "bg-[#1877F2] text-white" },
    { method: "x" as const, href: targets.x, label: "X", glyph: "𝕏", bg: "bg-ink text-bg" },
  ];

  return (
    <>
      <button type="button" onClick={nativeShare} className={`${btnPrimary} ${accentBg[accent]}`}>
        {d.chShare}
      </button>
      <section aria-label={d.shareTo} className={`${card} p-3`}>
        <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-wider text-ink-muted">{d.chShareVia}</p>
        <div className="grid grid-cols-4 gap-1">
          {links.map((l) => (
            <a
              key={l.method}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => shared(l.method)}
              className="group flex flex-col items-center gap-1.5 rounded-xl py-1"
            >
              <span aria-hidden className={`${tile} ${l.bg}`}>
                {l.glyph}
              </span>
              <span className="text-[11px] font-bold leading-tight sm:text-xs">{l.label}</span>
            </a>
          ))}
          <button type="button" onClick={copy} className="group flex flex-col items-center gap-1.5 rounded-xl py-1">
            <span aria-hidden className={`${tile} bg-lime`}>
              🔗
            </span>
            <span className="text-[11px] font-bold leading-tight sm:text-xs">{d.copyLink}</span>
          </button>
        </div>
      </section>
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4" role="status" aria-live="polite">
        {toast && <p className="rounded-pill border-2 border-ink bg-ink px-5 py-2.5 font-bold text-bg shadow-pop">✅ {d.copied}</p>}
      </div>
    </>
  );
}
