"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { btnPrimary } from "@/components/ui/styles";
import { track } from "@/lib/analytics";
import { pickRandom } from "@/lib/random";

type Props = {
  /** Slugs to choose from (passed from the server so the registry stays server-side here). */
  slugs: readonly string[];
  size?: "lg" | "sm";
  className?: string;
};

const smallButton =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-pill border-2 border-ink bg-marigold px-4 text-base font-extrabold shadow-pop transition-all duration-100 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";

export function SurpriseButton({ slugs, size = "lg", className = "" }: Props) {
  const router = useRouter();
  const { d } = useI18n();
  const [rolling, setRolling] = useState(false);

  function roll() {
    const slug = pickRandom(slugs);
    if (!slug || rolling) return;
    setRolling(true);
    track("surprise_me_click", { experience: slug });
    window.setTimeout(() => {
      router.push(`/experiences/${slug}`);
      setRolling(false);
    }, 450);
  }

  const classes = size === "lg" ? `${btnPrimary} bg-marigold` : smallButton;
  return (
    <button type="button" onClick={roll} aria-busy={rolling} className={`${classes} whitespace-nowrap ${className}`}>
      <span aria-hidden className={`inline-block ${rolling ? "animate-spin-once" : ""}`}>
        🎲
      </span>
      {size === "lg" ? (rolling ? d.rolling : d.surpriseMe) : d.surprise}
    </button>
  );
}
