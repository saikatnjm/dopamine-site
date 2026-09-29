import { getCategory, getExperience, listExperiences } from "@/lib/experience/registry";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";
import { t } from "@/lib/i18n/core";
import { siteConfig } from "@/lib/site";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Experience preview";

export function generateStaticParams() {
  return listExperiences().map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const experience = getExperience(slug);
  const category = experience ? getCategory(experience.category) : undefined;

  return renderOgCard({
    eyebrow: category ? `${category.emoji} ${t(category.title, "en")}` : siteConfig.name,
    emoji: experience?.emoji ?? "🎲",
    title: experience ? t(experience.title, "en") : siteConfig.name,
    subtitle: experience ? t(experience.tagline, "en") : siteConfig.tagline,
    chips: experience ? [`~${Math.max(1, Math.round(experience.durationSec / 60))} min`, "No sign-up", "Free"] : [],
    cta: "Play now",
    accent: experience?.accent ?? "violet",
  });
}
