// Draw a ResultCardData as a PNG with the browser's Canvas 2D API — no
// dependency, no server. The browser shapes Bangla text itself (unlike the
// Satori OG images, which are English-only). Colours come from the site's
// CSS variables and fonts from the page, so the image matches the card.
// Client-only: call from an event handler or effect.

import type { ResultCardData } from "@/lib/result-card";

const W = 1080;
const H = 1350;
const PAD = 72;

type Palette = Record<"bg" | "surface" | "surface2" | "ink" | "muted" | "accent" | "marigold", string>;

function palette(accent: string): Palette {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  return {
    bg: v("--bg", "#fff6e0"),
    surface: v("--surface", "#fffdf7"),
    surface2: v("--surface-2", "#fff1cf"),
    ink: v("--ink", "#1a1325"),
    muted: v("--ink-muted", "#5b5366"),
    accent: v(`--${accent}`, "#ffd23f"),
    marigold: v("--marigold", "#ffb703"),
  };
}

/** The page's font stacks (Bricolage + Noto Sans Bengali), read from rendered elements. */
function fonts(): { display: string; sans: string } {
  const probe = document.createElement("span");
  probe.className = "font-display";
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  document.body.append(probe);
  const display = getComputedStyle(probe).fontFamily || "system-ui, sans-serif";
  probe.remove();
  return { display, sans: getComputedStyle(document.body).fontFamily || display };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** Box with thick ink border and the sticker-zine offset shadow. */
function sticker(ctx: CanvasRenderingContext2D, p: Palette, x: number, y: number, w: number, h: number, r: number, fill: string, shadow = 10) {
  if (shadow) {
    ctx.fillStyle = p.ink;
    roundRect(ctx, x + shadow, y + shadow, w, h, r);
    ctx.fill();
  }
  ctx.fillStyle = fill;
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = p.ink;
  ctx.stroke();
}

/** Wrap text to a width; returns lines (max `max`, last one ellipsised). */
function wrap(ctx: CanvasRenderingContext2D, text: string, width: number, max: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width <= width || !line) line = test;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  if (lines.length > max) {
    const kept = lines.slice(0, max);
    let last = kept[max - 1]!;
    while (last.length > 1 && ctx.measureText(`${last}…`).width > width) last = last.slice(0, -1);
    kept[max - 1] = `${last}…`;
    return kept;
  }
  return lines;
}

/** Shrink a font until one line fits. */
function fit(ctx: CanvasRenderingContext2D, text: string, weight: number, family: string, start: number, width: number, min = 28): number {
  let size = start;
  ctx.font = `${weight} ${size}px ${family}`;
  while (size > min && ctx.measureText(text).width > width) {
    size -= 4;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

export async function renderResultImage(data: ResultCardData, host: string): Promise<Blob> {
  const p = palette(data.accent);
  const f = fonts();
  const sample = `${data.game} ${data.headline} ${data.title ?? ""} ${data.quote ?? ""}`;
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
  ctx.textBaseline = "alphabetic";

  // Dotted butter-cream paper.
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = p.ink;
  ctx.globalAlpha = 0.08;
  for (let y = 18; y < H; y += 36) for (let x = 18; x < W; x += 36) ctx.fillRect(x, y, 4, 4);
  ctx.globalAlpha = 1;

  const cx = PAD;
  const cw = W - PAD * 2;
  const top = 60;
  const cardH = H - top - 150;
  sticker(ctx, p, cx, top, cw, cardH, 44, p.surface, 16);

  // Clip inner content to the card.
  ctx.save();
  roundRect(ctx, cx + 3, top + 3, cw - 6, cardH - 6, 41);
  ctx.clip();

  // HOTTOGOL bar.
  ctx.fillStyle = p.ink;
  ctx.fillRect(cx, top, cw, 96);
  ctx.fillStyle = p.bg;
  ctx.font = `900 46px ${f.display}`;
  ctx.textAlign = "left";
  ctx.fillText("H O T T O G O L", cx + 40, top + 64);
  ctx.textAlign = "right";
  ctx.font = `800 30px ${f.sans}`;
  ctx.fillText("হট্টগোল", cx + cw - 40, top + 62);

  // Accent hero — measure first so long titles never overflow it.
  const heroTop = top + 96;
  const mid = W / 2;
  const chip = `${data.emoji} ${data.game.toUpperCase()}`;
  const chipSize = fit(ctx, chip, 800, f.sans, 34, cw - 160, 22);
  const chipW = Math.min(cw - 100, ctx.measureText(chip).width + 60);
  const hs = fit(ctx, data.headline, 900, f.display, 120, cw - 100, 48);
  ctx.font = `800 52px ${f.display}`;
  const titleLines = data.title ? wrap(ctx, data.title, cw - 100, 2) : [];
  const heroH =
    40 + chipSize + 34 + (data.badge ? 80 : 0) + (data.titleEmoji ? 178 : 30) + (data.headlineLabel ? 48 : 0) + hs * 1.05 + titleLines.length * 60 + (data.rank ? 76 : 0) + 44;

  ctx.fillStyle = p.accent;
  ctx.fillRect(cx, heroTop, cw, heroH);
  ctx.fillStyle = p.ink;
  ctx.fillRect(cx, heroTop, cw, 6);
  ctx.fillRect(cx, heroTop + heroH - 6, cw, 6);
  ctx.textAlign = "center";

  // Game chip.
  sticker(ctx, p, mid - chipW / 2, heroTop + 40, chipW, chipSize + 34, 40, p.surface, 0);
  ctx.fillStyle = p.ink;
  ctx.font = `800 ${chipSize}px ${f.sans}`;
  ctx.fillText(chip, mid, heroTop + 40 + chipSize + 8);

  let y = heroTop + 40 + chipSize + 34;
  if (data.badge) {
    ctx.font = `800 30px ${f.sans}`;
    const bw = ctx.measureText(data.badge).width + 48;
    sticker(ctx, p, mid - bw / 2, y + 20, bw, 54, 27, p.marigold, 6);
    ctx.fillStyle = p.ink;
    ctx.fillText(data.badge, mid, y + 58);
    y += 80;
  }
  if (data.titleEmoji) {
    ctx.font = `120px ${f.sans}`;
    ctx.fillText(data.titleEmoji, mid, y + 140);
    y += 178;
  } else y += 30;
  if (data.headlineLabel) {
    ctx.font = `800 28px ${f.sans}`;
    ctx.fillText(data.headlineLabel.toUpperCase(), mid, y + 30);
    y += 48;
  }
  ctx.font = `900 ${hs}px ${f.display}`;
  ctx.fillText(data.headline, mid, y + hs * 0.95);
  y += hs * 1.05;
  ctx.font = `800 52px ${f.display}`;
  for (const line of titleLines) {
    ctx.fillText(line, mid, y + 56);
    y += 60;
  }
  if (data.rank) {
    const rs = fit(ctx, data.rank, 800, f.sans, 30, cw - 160, 20);
    const rw = Math.min(cw - 100, ctx.measureText(data.rank).width + 48);
    sticker(ctx, p, mid - rw / 2, y + 16, rw, rs + 26, 26, p.surface, 0);
    ctx.fillStyle = p.ink;
    ctx.font = `800 ${rs}px ${f.sans}`;
    ctx.fillText(data.rank, mid, y + 16 + rs + 5);
    y += 76;
  }

  // Stats.
  y = heroTop + heroH + 40;
  const stats = data.stats.slice(0, 4);
  if (stats.length) {
    const cols = 2;
    const gap = 24;
    const bw = (cw - 80 - gap) / cols;
    const bh = 132;
    stats.forEach((s, i) => {
      const bx = cx + 40 + (i % cols) * (bw + gap);
      const by = y + Math.floor(i / cols) * (bh + gap);
      sticker(ctx, p, bx, by, bw, bh, 22, p.surface2, 0);
      ctx.fillStyle = p.muted;
      ctx.font = `800 24px ${f.sans}`;
      ctx.fillText(wrap(ctx, s.label.toUpperCase(), bw - 30, 1)[0] ?? "", bx + bw / 2, by + 44);
      ctx.fillStyle = p.ink;
      const vs = fit(ctx, s.value, 800, f.display, 50, bw - 30, 24);
      ctx.fillText(s.value, bx + bw / 2, by + 60 + vs);
    });
    y += Math.ceil(stats.length / cols) * (bh + gap) + 8;
  }

  // Quote (or blurb).
  const line = data.quote ? `“${data.quote}”` : data.blurb;
  if (line) {
    ctx.font = `800 40px ${f.display}`;
    const lines = wrap(ctx, line, cw - 140, 3);
    const qh = lines.length * 52 + 44;
    if (y + qh < top + cardH - 20) {
      ctx.save();
      ctx.translate(mid, y + qh / 2);
      ctx.rotate(-0.012);
      sticker(ctx, p, -(cw - 80) / 2, -qh / 2, cw - 80, qh, 28, p.surface2, 0);
      ctx.fillStyle = p.ink;
      lines.forEach((l, i) => ctx.fillText(l, 0, -qh / 2 + 22 + 40 + i * 52));
      ctx.restore();
    }
  }
  ctx.restore();

  // Footer URL under the card.
  ctx.fillStyle = p.ink;
  ctx.textAlign = "center";
  ctx.font = `800 34px ${f.sans}`;
  ctx.fillText(`🧠 ${host}${data.path}`, mid, H - 70);

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"));
}
