"use client";

import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, btnPrimary, card as cardStyle } from "@/components/ui/styles";
import { track } from "@/lib/analytics";
import type { Experience } from "@/lib/experience/types";
import { hostOf, resultText, type ResultCardData } from "@/lib/result-card";
import { copyText, shareTargets, type ShareMethod } from "@/lib/sharing";

type Props = {
  slug: string;
  token: string;
  emoji: string;
  accent: Experience["accent"];
  outcomeId: string;
  shareUrl: string;
  shareText: string;
  /** True when the viewer just played (arrived via ?me=1). */
  mine: boolean;
  /** Shared result-card data (for Copy result and the photo card). */
  card: ResultCardData;
};

const tile =
  "grid size-12 place-items-center rounded-full border-2 border-ink text-xl font-black sm:size-14 sm:text-2xl shadow-pop transition-all duration-150 group-hover:-translate-y-1 group-hover:shadow-pop-lg group-active:translate-y-0.5 group-active:shadow-none";

export function ResultActions({ slug, emoji, accent, outcomeId, shareUrl, shareText, mine, card }: Props) {
  const { d } = useI18n();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const targets = shareTargets(shareUrl, shareText);
  const base = { experience: slug, outcome: outcomeId };

  useEffect(() => {
    track("result_view", { experience: slug, outcome: outcomeId, viewer: mine ? "player" : "visitor" });
    // Drop ?me=1 so a copied address-bar URL shows the friend view.
    if (mine) window.history.replaceState(null, "", window.location.pathname);
  }, [slug, outcomeId, mine]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  function showToast(message: string) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2000);
  }

  const shared = (method: ShareMethod) => track("result_share", { ...base, method });

  async function copy() {
    if (await copyText(shareUrl)) {
      showToast(`✅ ${d.copied}`);
      shared("copy");
    }
  }

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text: shareText, url: shareUrl });
        shared("native");
      } catch {
        // Share sheet dismissed: not a share, not an error.
      }
      return;
    }
    await copy();
  }

  async function copyResult() {
    if (await copyText(resultText(card, shareUrl))) {
      showToast(`✅ ${d.resultCopied}`);
      shared("copy-result");
    }
  }

  /**
   * Phones: share the PNG straight to Instagram/WhatsApp. Desktop: download it.
   * Drawn in the browser (lib/result-image.ts) so Bangla works in the image too.
   */
  async function saveImage() {
    const fileName = `${slug}-result.png`;
    try {
      const { renderResultImage } = await import("@/lib/result-image");
      const blob = await renderResultImage(card, hostOf(window.location.origin));
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: `${shareText} ${shareUrl}` });
      } else {
        const href = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement("a"), { href, download: fileName });
        a.click();
        URL.revokeObjectURL(href);
        showToast(`🖼️ ${d.imageSaved}`);
      }
      shared("image");
    } catch {
      // Cancelled or offline: nothing to report.
    }
  }

  const shareButton = (
    <button type="button" onClick={share} className={`${btnPrimary} ${mine ? accentBg[accent] : "bg-surface"}`}>
      📤 {d.share}
    </button>
  );
  const playButton = (
    <Link
      href={`/experiences/${slug}`}
      onClick={mine ? () => track("experience_retry", base) : undefined}
      className={`${btnPrimary} ${mine ? "bg-surface" : accentBg[accent]}`}
    >
      {mine ? `↺ ${d.tryAgain}` : `${d.beatIt} ${emoji}`}
    </Link>
  );

  const links = [
    { method: "whatsapp" as const, href: targets.whatsapp, label: "WhatsApp", glyph: "💬", bg: "bg-[#25D366]" },
    { method: "facebook" as const, href: targets.facebook, label: "Facebook", glyph: "f", bg: "bg-[#1877F2] text-white" },
    { method: "x" as const, href: targets.x, label: "X", glyph: "𝕏", bg: "bg-ink text-bg" },
  ];

  return (
    <div className="mt-6 grid gap-3">
      {mine ? shareButton : playButton}
      {mine ? playButton : shareButton}
      <button type="button" onClick={copyResult} className={`${btnPrimary} bg-surface`}>
        📋 {d.copyResult}
      </button>

      <section aria-label={d.shareTo} className={`${cardStyle} mt-2 p-4`}>
        <p className="mb-3 text-center text-sm font-extrabold uppercase tracking-wider text-ink-muted">{d.shareTo}</p>
        <div className="grid grid-cols-5 gap-1">
          {links.map((l) => (
            <a
              key={l.method}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => shared(l.method)}
              className="group flex flex-col items-center gap-1.5 rounded-xl py-1"
            >
              <span aria-hidden className={`${tile} ${l.bg}`}>{l.glyph}</span>
              <span className="text-[11px] font-bold leading-tight sm:text-xs">{l.label}</span>
            </a>
          ))}
          <button type="button" onClick={copy} className="group flex flex-col items-center gap-1.5 rounded-xl py-1">
            <span aria-hidden className={`${tile} bg-lime`}>🔗</span>
            <span className="text-[11px] font-bold leading-tight sm:text-xs">{d.copyLink}</span>
          </button>
          <button type="button" onClick={saveImage} className="group flex flex-col items-center gap-1.5 rounded-xl py-1">
            <span aria-hidden className={`${tile} bg-sky`}>🖼️</span>
            <span className="text-[11px] font-bold leading-tight sm:text-xs">{d.saveImage}</span>
          </button>
        </div>
      </section>

      <Link href="/" className={btnGhost}>
        {d.tryAnother}
      </Link>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4" role="status" aria-live="polite">
        <AnimatePresence>
          {toast && (
            <m.p
              key={toast}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="rounded-pill border-2 border-ink bg-ink px-5 py-2.5 font-bold text-bg shadow-pop"
            >
              {toast}
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
