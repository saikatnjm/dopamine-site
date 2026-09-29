import { ImageResponse } from "next/og";
import type { Experience } from "@/lib/experience/types";
import { siteConfig } from "@/lib/site";

// Link-preview images (WhatsApp, Facebook, X). Rendered with Satori.
// Satori can't shape Bangla script correctly, so previews use English only;
// the Bangla punchlines live on the page itself.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const COLORS = {
  bg: "#fff3d6",
  ink: "#1a1325",
  muted: "#5b4f6b",
  accent: {
    cng: "#3ddc84",
    marigold: "#ffc53d",
    chili: "#ff5c93",
    violet: "#9b7bff",
    sky: "#4fc3ff",
    tangerine: "#ff8a3d",
    lime: "#b8f13a",
  },
} as const;

/** Keep Latin only: swap the Taka sign, drop Bangla characters. */
function latin(text: string): string {
  return text.replace(/৳\s?/g, "Tk ").replace(/[ঀ-৿]/g, "").replace(/\s+/g, " ").trim();
}

/** Fetch a subset of the brand font from Google Fonts. Returns null on any failure. */
async function loadFont(text: string, weight: 400 | 800): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(cssUrl)).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    const res = await fetch(src);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

type CardProps = {
  eyebrow: string;
  emoji: string;
  title: string;
  subtitle: string;
  chips?: string[];
  cta: string;
  accent: Experience["accent"];
};

export async function renderOgCard(props: CardProps): Promise<ImageResponse> {
  const host = new URL(siteConfig.url).host;
  const p = {
    ...props,
    eyebrow: latin(props.eyebrow).toUpperCase(),
    title: latin(props.title),
    subtitle: latin(props.subtitle),
    chips: (props.chips ?? []).map(latin).filter(Boolean),
    cta: latin(props.cta),
  };
  const accent = COLORS.accent[p.accent];
  const allText = [p.eyebrow, p.title, p.subtitle, ...p.chips, p.cta, host].join(" ");
  const [regular, bold] = await Promise.all([loadFont(allText, 400), loadFont(allText, 800)]);
  const fonts = [
    ...(regular ? [{ name: "Bricolage", data: regular, weight: 400 as const, style: "normal" as const }] : []),
    ...(bold ? [{ name: "Bricolage", data: bold, weight: 800 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 48,
          background: accent,
          fontFamily: fonts.length ? "Bricolage" : undefined,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: COLORS.bg,
            color: COLORS.ink,
            border: `6px solid ${COLORS.ink}`,
            borderRadius: 40,
            boxShadow: `12px 12px 0 0 ${COLORS.ink}`,
            padding: "40px 56px",
          }}
        >
          <div style={{ display: "flex", fontSize: 30, fontWeight: 800, letterSpacing: 2, color: COLORS.muted }}>
            {p.eyebrow}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <div style={{ display: "flex", fontSize: 150 }}>{p.emoji}</div>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>{p.title}</div>
              <div style={{ display: "flex", fontSize: 32, marginTop: 16, color: COLORS.muted, lineHeight: 1.3 }}>
                {p.subtitle}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flex: 1 }}>
              {p.chips.map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: "flex",
                    fontSize: 26,
                    padding: "8px 20px",
                    borderRadius: 999,
                    border: `3px solid ${COLORS.ink}`,
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexShrink: 0, fontSize: 28, fontWeight: 800 }}>
              {p.cta} → {host}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}
