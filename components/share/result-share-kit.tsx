"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnPrimary } from "@/components/ui/styles";
import { hostOf, resultText, type ResultCardData } from "@/lib/result-card";
import { copyText, type ShareMethod } from "@/lib/sharing";
import { PlayAnother } from "./play-another";
import { YouMightAlsoLike } from "./you-might-also-like";

// Share / Copy result / Save image for any ResultCardData. The image is drawn
// on demand with the Canvas API (lib/result-image.ts, loaded lazily so it
// costs nothing until used). Existing link sharing (challenge links,
// WhatsApp/Facebook/X) stays where it was — this adds to it.

const noSubscribe = () => () => {};
/** window.location.host after hydration ("" on the server — no mismatch). */
export function useHost(): string {
  return useSyncExternalStore(noSubscribe, () => window.location.host, () => "");
}
/** window.location.origin after hydration ("" on the server). */
export function useOrigin(): string {
  return useSyncExternalStore(noSubscribe, () => window.location.origin, () => "");
}

export function ResultShareKit({
  data,
  url,
  fileName,
  onShared,
  primary = true,
  copy: showCopy = true,
  playAnother = true,
  alsoLike = true,
}: {
  data: ResultCardData;
  /** Link to include (a challenge/result link, or the game page). */
  url: string;
  /** Download name without extension, e.g. "chaos-machine-result". */
  fileName: string;
  /** Analytics hook (the caller tracks with its own event name). */
  onShared: (method: ShareMethod) => void;
  /** Show the big Share button (off when the page already has one). */
  primary?: boolean;
  /** Show "Copy result" (off where the page already has its own copy button). */
  copy?: boolean;
  /** Show "🎲 Play another" (a random different activity). */
  playAnother?: boolean;
  /** Show "😂 LIKED THAT?" (3 related activities). */
  alsoLike?: boolean;
}) {
  const { d } = useI18n();
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const text = resultText(data, url);
  const show = (msg: string) => {
    setToast(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2200);
  };

  async function makeImage(): Promise<File> {
    const { renderResultImage } = await import("@/lib/result-image");
    const blob = await renderResultImage(data, hostOf(window.location.origin));
    return new File([blob], `${fileName}.png`, { type: "image/png" });
  }

  async function share() {
    if (typeof navigator.share !== "function") {
      if (await copyText(text)) {
        show(`✅ ${d.resultCopied}`);
        onShared("copy-result");
      }
      return;
    }
    try {
      await navigator.share({ text, url });
      onShared("native");
    } catch {
      // share sheet dismissed
    }
  }

  async function copy() {
    if (await copyText(text)) {
      show(`✅ ${d.resultCopied}`);
      onShared("copy-result");
    }
  }

  /** Phones: share the PNG (WhatsApp/Instagram…). Elsewhere: download it. */
  async function saveImage() {
    if (busy) return;
    setBusy(true);
    try {
      const file = await makeImage();
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text });
          onShared("image");
          return;
        } catch (e) {
          // Dismissed → done. Lost the user gesture (slow render) → download instead.
          if (e instanceof DOMException && e.name === "AbortError") return;
        }
      }
      const href = URL.createObjectURL(file);
      const a = Object.assign(document.createElement("a"), { href, download: file.name });
      document.body.append(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 1000);
      show(`🖼️ ${d.imageSaved}`);
      onShared("image");
    } catch {
      show(`⚠️ ${d.imageFailed}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {primary && (
        <button type="button" onClick={share} className={`${btnPrimary} ${accentBg[data.accent]}`}>
          📤 {d.shareResult}
        </button>
      )}
      <div className={`grid gap-3 ${showCopy ? "grid-cols-2" : ""}`}>
        {showCopy && (
          <button type="button" onClick={copy} className={`${btnPrimary} bg-surface px-3 text-base`}>
            📋 {d.copyResult}
          </button>
        )}
        <button type="button" onClick={saveImage} disabled={busy} aria-busy={busy} className={`${btnPrimary} bg-surface px-3 text-base`}>
          🖼️ {busy ? d.imageMaking : d.saveImage}
        </button>
      </div>
      {alsoLike && <YouMightAlsoLike path={data.path} />}
      {playAnother && <PlayAnother />}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4" role="status" aria-live="polite">
        {toast && <p className="rounded-pill border-2 border-ink bg-ink px-5 py-2.5 font-bold text-bg shadow-pop">{toast}</p>}
      </div>
    </>
  );
}
