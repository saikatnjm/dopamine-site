// 1080×1920 (9:16) poster for আমার বাংলাদেশ: the 64-district map with the
// visited districts filled, a big "23/64", the title and badges. Canvas 2D
// with the helpers from lib/result-image.ts (same paper, fonts, stickers; the
// browser shapes Bangla). Client-only, loaded lazily on "Save image".

import { fillFor } from "@/components/games/district-map";
import { DISTRICT_SHAPES, MAP_ATTRIBUTION, MAP_VIEWBOX } from "@/data/dialects/map";
import { fit, fonts, H, PAD, palette, sticker, W, wrap } from "@/lib/result-image";

export type DistrictPosterInput = {
  kicker: string;
  /** e.g. "23/64" (already localised). */
  count: string;
  title: string;
  titleEmoji: string;
  /** e.g. "6/8 divisions · 31% of the map". */
  subtitle: string;
  badges: readonly string[];
  visited: ReadonlySet<string>;
  cta: string;
  path: string;
};

export async function renderDistrictPoster(input: DistrictPosterInput, host: string): Promise<Blob> {
  const p = palette("marigold");
  const f = fonts();
  const sample = `${input.kicker} ${input.count} ${input.title} ${input.subtitle} ${input.badges.join(" ")} ${input.cta}`;
  try {
    await Promise.all([document.fonts.load(`900 64px ${f.display}`, sample), document.fonts.load(`800 32px ${f.sans}`, sample)]);
  } catch {
    // fonts unavailable: canvas falls back to system fonts
  }

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unsupported");
  const mid = W / 2;

  // Dotted butter-cream paper.
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = p.ink;
  ctx.globalAlpha = 0.08;
  for (let y = 18; y < H; y += 36) for (let x = 18; x < W; x += 36) ctx.fillRect(x, y, 4, 4);
  ctx.globalAlpha = 1;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Brand + kicker chip.
  ctx.fillStyle = p.ink;
  ctx.font = `900 40px ${f.display}`;
  ctx.fillText("HOTTOGOL · হট্টগোল", mid, 72);
  const chipSize = fit(ctx, input.kicker, 800, f.sans, 40, W - PAD * 2 - 80, 24);
  const chipW = Math.min(W - PAD * 2, ctx.measureText(input.kicker).width + 72);
  ctx.save();
  ctx.translate(mid, 150);
  ctx.rotate(-0.02);
  sticker(ctx, p, -chipW / 2, -(chipSize + 36) / 2, chipW, chipSize + 36, 999, p.accent, 6);
  ctx.fillStyle = p.ink;
  ctx.fillText(input.kicker, 0, 2);
  ctx.restore();

  // Big count + subtitle.
  ctx.fillStyle = p.ink;
  fit(ctx, input.count, 900, f.display, 230, W - PAD * 2, 80);
  ctx.fillText(input.count, mid, 330);
  ctx.fillStyle = p.muted;
  fit(ctx, input.subtitle, 800, f.sans, 44, W - PAD * 2, 24);
  ctx.fillText(input.subtitle, mid, 450);

  // Map, centred.
  const mapTop = 490;
  const mapH = 790;
  const scale = mapH / MAP_VIEWBOX.height;
  const ox = mid - (MAP_VIEWBOX.width * scale) / 2;
  const shapes = Object.entries(DISTRICT_SHAPES).map(([id, s]) => ({ id, path: new Path2D(s.d) }));
  ctx.save();
  ctx.translate(ox, mapTop);
  ctx.scale(scale, scale);
  ctx.lineJoin = "round";
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 10;
  for (const s of shapes) {
    ctx.fillStyle = p.ink;
    ctx.fill(s.path);
    ctx.stroke(s.path);
  }
  ctx.lineWidth = 1.8;
  for (const s of shapes) {
    ctx.fillStyle = fillFor(s.id, input.visited);
    ctx.fill(s.path);
    ctx.stroke(s.path);
  }
  ctx.restore();

  // Title sticker.
  ctx.font = `900 64px ${f.display}`;
  const titleText = `${input.titleEmoji} ${input.title}`;
  const titleLines = wrap(ctx, titleText, W - PAD * 2 - 80, 2);
  const titleH = titleLines.length * 76 + 46;
  const titleY = mapTop + mapH + 40 + titleH / 2;
  ctx.save();
  ctx.translate(mid, titleY);
  ctx.rotate(-0.015);
  sticker(ctx, p, -(W - PAD * 2) / 2, -titleH / 2, W - PAD * 2, titleH, 32, p.accent, 8);
  ctx.fillStyle = p.ink;
  titleLines.forEach((line, i) => ctx.fillText(line, 0, -titleH / 2 + 23 + 38 + i * 76));
  ctx.restore();

  // Badges (≤ 3), as small pills.
  let by = titleY + titleH / 2 + 60;
  for (const badge of input.badges.slice(0, 3)) {
    const size = fit(ctx, badge, 800, f.sans, 34, W - PAD * 2 - 120, 22);
    const w = ctx.measureText(badge).width + 48;
    sticker(ctx, p, mid - w / 2, by - (size + 24) / 2, w, size + 24, 999, p.surface, 4);
    ctx.fillStyle = p.ink;
    ctx.fillText(badge, mid, by + 2);
    by += size + 36;
  }

  // CTA + footer.
  ctx.fillStyle = p.ink;
  ctx.font = `900 48px ${f.display}`;
  ctx.fillText(input.cta, mid, H - 170);
  const footer = `🧠 ${host}${input.path}`;
  fit(ctx, footer, 800, f.sans, 40, W - PAD * 2, 22);
  ctx.fillText(footer, mid, H - 100);
  ctx.fillStyle = p.muted;
  ctx.font = `700 24px ${f.sans}`;
  ctx.fillText(MAP_ATTRIBUTION.text, mid, H - 52);

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"));
}
