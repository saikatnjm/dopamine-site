import { choiceSteps } from "@/lib/experience/engine";
import { decodeResultToken } from "@/lib/experience/result-token";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";
import { t } from "@/lib/i18n/core";
import { siteConfig } from "@/lib/site";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Shared result";

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = decodeResultToken(token);

  if (!result) {
    return renderOgCard({
      eyebrow: siteConfig.name,
      emoji: "🤷",
      title: "Result not found",
      subtitle: siteConfig.tagline,
      cta: "Play something",
      accent: "violet",
    });
  }

  const { experience, outcome, choices } = result;
  const chips = choiceSteps(experience).map((step) => {
    const option = step.options.find((o) => o.id === choices[step.id]);
    return option ? t(option.label, "en") : "";
  });

  return renderOgCard({
    eyebrow: `${experience.emoji} ${t(experience.title, "en")}`,
    emoji: outcome.emoji,
    title: t(outcome.title, "en"),
    subtitle: t(outcome.message, "en"),
    chips,
    cta: "Can you do better?",
    accent: experience.accent,
  });
}
