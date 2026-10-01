"use client";

// EXPERIMENT "home-cta" (lib/experiments.ts) — UI experimentation only.
// To remove: replace <HomeCtaExperiment …/> in app/page.tsx with
// <SurpriseButton …/>, delete this file, the "home-cta" entry in
// lib/experiments.ts, the homepage_cta_* events (lib/analytics.ts +
// lib/analytics-taxonomy.ts) and the expCta* strings in the dictionary.

import { useEffect, useSyncExternalStore } from "react";
import { SurpriseButton } from "@/components/experience/surprise-button";
import { useI18n } from "@/components/providers/lang-provider";
import { setUserProperty, track } from "@/lib/analytics";
import { getVariant, type Variant } from "@/lib/experiments";

const EXPERIMENT = "home-cta";
const noSubscribe = () => () => {};
// Cached: useSyncExternalStore calls getSnapshot on every render, and the
// variant never changes within a page load (avoids repeated localStorage reads).
let cachedVariant: Variant<typeof EXPERIMENT> | null = null;
const clientVariant = () => (cachedVariant ??= getVariant(EXPERIMENT));
const serverVariant = () => null;

export function HomeCtaExperiment({ slugs, className }: { slugs: readonly string[]; className?: string }) {
  const { d } = useI18n();
  // null on the server / before hydration → label hidden (no visible A→B swap).
  const variant = useSyncExternalStore(noSubscribe, clientVariant, serverVariant);

  useEffect(() => {
    if (!variant) return;
    // Later events (activity_start, …) carry the variant as a GA user property.
    setUserProperty("exp_home_cta", variant);
    track("homepage_cta_view", { experiment: EXPERIMENT, variant });
  }, [variant]);

  return (
    <SurpriseButton
      slugs={slugs}
      className={className}
      icon={variant === "b" ? "🔥" : "🎲"}
      label={variant === "b" ? d.expCtaB : d.expCtaA}
      labelHidden={variant === null}
      onRoll={() => {
        if (variant) track("homepage_cta_click", { experiment: EXPERIMENT, variant });
      }}
    />
  );
}
