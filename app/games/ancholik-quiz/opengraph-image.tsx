import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Battle of the Dialects — Bangladesh regional dialect quiz on Hottogol";

export default function Image() {
  return renderOgCard({
    eyebrow: "🗣️ Battle of the Dialects",
    emoji: "🇧🇩",
    title: "How well do you know Bangladesh's dialects?",
    subtitle: "10 questions. Jashore, Sylhet, Chattogram, Noakhali and more. Then challenge your friends.",
    cta: "Take the quiz",
    accent: "sky",
  });
}
