// 1080×1920 (9:16) map posters for the word map and the dialect detective,
// drawn with Canvas 2D like lib/result-image.ts (same paper, fonts, stickers;
// the browser shapes Bangla). District shapes come from the same SVG paths as
// the on-screen map (Path2D). Client-only, loaded lazily on "Save image".

import type { MapLabel, MapRegion } from "@/components/dialects/dialect-map";
import { DISTRICT_SHAPES, MAP_VIEWBOX } from "@/data/dialects/map";
import { FADED_FILL, REGION_FILL, REGION_LABEL_AT, UNASSIGNED_FILL } from "@/lib/dialects/map-layout";
import { fit, fonts, H, PAD, palette, sticker, W, wrap } from "@/lib/result-image";

export type MapPosterInput = {
  /** Small chip at the top, e.g. "🗺️ শব্দের মানচিত্র". */
  kicker: string;
  title: string;
  subtitle?: string;
  regions: readonly MapRegion[];
  labels: readonly MapLabel[];
  /** Regions kept in colour; the rest fade. */
  highlight?: readonly string[] | null;
  /** Sticker under the map, e.g. "তোমার এলাকায় কী বলে?". */
  cta: string;
  /** Page path for the footer URL. */
  path: string;
};

export async function renderMapPoster(input: MapPosterInput, host: string): Promise<Blob> {
  const p = palette("marigold");
  const f = fonts();
  const sample = `${input.kicker} ${input.title} ${input.subtitle ?? ""} ${input.cta} ${input.labels.map((l) => l.text).join(" ")}`;
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

  // Brand bar + kicker chip.
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

  // Title (≤ 2 lines) + subtitle.
  ctx.fillStyle = p.ink;
  ctx.font = `900 84px ${f.display}`;
  const titleLines = wrap(ctx, input.title, W - PAD * 2, 2);
  let y = 270;
  for (const line of titleLines) {
    ctx.fillText(line, mid, y);
    y += 96;
  }
  if (input.subtitle) {
    ctx.fillStyle = p.muted;
    fit(ctx, input.subtitle, 800, f.sans, 44, W - PAD * 2, 26);
    ctx.fillText(input.subtitle, mid, y);
    y += 50;
  }

  // Map, fitted between the title and the CTA.
  const mapTop = y + 20;
  const mapBottom = H - 300;
  const scale = Math.min((mapBottom - mapTop) / MAP_VIEWBOX.height, (W - PAD * 2) / MAP_VIEWBOX.width);
  const mapW = MAP_VIEWBOX.width * scale;
  const ox = mid - mapW / 2;
  const regionOf = new Map<string, string>();
  for (const r of input.regions) for (const d of r.districts) regionOf.set(d, r.id);
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
  ctx.strokeStyle = "#fffdf7";
  ctx.lineWidth = 1.4;
  for (const s of shapes) {
    const region = regionOf.get(s.id);
    const faded = input.highlight && !input.highlight.includes(region ?? "");
    ctx.fillStyle = faded ? FADED_FILL : region ? (REGION_FILL[region] ?? UNASSIGNED_FILL) : UNASSIGNED_FILL;
    ctx.fill(s.path);
    ctx.stroke(s.path);
  }
  ctx.restore();

  // Label pills (drawn at poster scale so they stay readable).
  for (const l of input.labels) {
    const at = REGION_LABEL_AT[l.region];
    if (!at) continue;
    const lx = ox + at[0] * scale;
    const ly = mapTop + at[1] * scale;
    const size = fit(ctx, l.text, 800, f.sans, l.strong ? 44 : 34, 300, 22);
    const w = ctx.measureText(l.text).width + 32;
    const h = size + 22;
    sticker(ctx, p, lx - w / 2, ly - h / 2, w, h, 999, l.strong ? p.ink : p.surface, 4);
    ctx.fillStyle = l.strong ? p.bg : p.ink;
    ctx.fillText(l.text, lx, ly + 2);
  }

  // CTA sticker.
  ctx.font = `900 50px ${f.display}`;
  const ctaLines = wrap(ctx, input.cta, W - PAD * 2 - 120, 2);
  const ctaH = ctaLines.length * 62 + 48;
  const ctaY = H - 250;
  ctx.save();
  ctx.translate(mid, ctaY);
  ctx.rotate(0.015);
  sticker(ctx, p, -(W - PAD * 2 - 40) / 2, -ctaH / 2, W - PAD * 2 - 40, ctaH, 32, p.accent, 8);
  ctx.fillStyle = p.ink;
  ctaLines.forEach((line, i) => ctx.fillText(line, 0, -ctaH / 2 + 24 + 31 + i * 62));
  ctx.restore();

  // Footer: where to play.
  ctx.fillStyle = p.ink;
  const footer = `🧠 ${host}${input.path}`;
  fit(ctx, footer, 800, f.sans, 40, W - PAD * 2, 22);
  ctx.fillText(footer, mid, H - 100);
  ctx.fillStyle = p.muted;
  ctx.font = `700 26px ${f.sans}`;
  ctx.fillText("শব্দগুলো সূত্রসহ · District map: geoBoundaries (CC BY 3.0 IGO)", mid, H - 52);

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"));
}
