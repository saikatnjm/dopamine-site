"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/lang-provider";
import { btnPrimary } from "@/components/ui/styles";

// Shown for unexpected runtime errors. Never exposes error details.
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { d } = useI18n();
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12 text-center">
      <p aria-hidden className="text-7xl">🔧🐐</p>
      <h1 className="mt-4 font-display text-4xl font-extrabold">{d.errTitle}</h1>
      <p className="mt-3 text-lg text-ink-muted">{d.errBody}</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button type="button" onClick={reset} className={`${btnPrimary} bg-marigold`}>
          {d.tryAgain}
        </button>
        <Link href="/" className={`${btnPrimary} bg-surface`}>
          {d.goHome}
        </Link>
      </div>
    </main>
  );
}
