// Draw a ResultCardData as a 1080×1920 (9:16) PNG with the browser's Canvas 2D API — no
// dependency, no server. The browser shapes Bangla text itself (unlike the
// Satori OG images, which are English-only). Colours come from the site's
// CSS variables and fonts from the page, so the image matches the card.
// Client-only: call from an event handler or effect.

import { MAX_CARD_STATS, type ResultCardData } from "@/lib/result-card";

// 9:16 — WhatsApp status / Instagram & Facebook stories, and still reads
// fine as a tall image in chats.
const W = 1080;
const H = 1920;
const PAD = 64;

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
  const quoteText = data.quote ? `“${data.quote}”` : data.blurb;
  const sample = `${data.game} ${data.headline} ${data.title ?? ""} ${quoteText ?? ""}`;
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
  const mid = W / 2;
  const top = 96;
  const cardH = H - top - 200;
  const BAR = 128;

  // ---- Measure everything first, then spread spare height evenly. ----
  const chip = `${data.emoji} ${data.game.toUpperCase()}`;
  const chipSize = fit(ctx, chip, 800, f.sans, 40, cw - 160, 24);
  const chipW = Math.min(cw - 100, ctx.measureText(chip).width + 72);
  const chipH = chipSize + 40;
  const hs = fit(ctx, data.headline, 900, f.display, 156, cw - 100, 56);
  ctx.font = `800 66px ${f.display}`;
  const titleLines = data.title ? wrap(ctx, data.title, cw - 100, 2) : [];
  const heroContent =
    chipH +
    (data.badge ? 92 : 0) +
    (data.titleEmoji ? 220 : 40) +
    (data.headlineLabel ? 60 : 0) +
    hs * 1.08 +
    titleLines.length * 78 +
    (data.rank ? 96 : 0);

  const stats = data.stats.slice(0, MAX_CARD_STATS);
  const cols = stats.length === 1 ? 1 : 2;
  const statGap = 28;
  const bh = 176;
  const statsH = stats.length ? Math.ceil(stats.length / cols) * (bh + statGap) - statGap : 0;

  ctx.font = `800 50px ${f.display}`;
  const quoteLines = quoteText ? wrap(ctx, quoteText, cw - 160, 4) : [];
  const quoteH = quoteLines.length ? quoteLines.length * 66 + 64 : 0;

  // Spread spare height: a minimum gap around each lower section first, then
  // up to a quarter of what's left pads the hero; the rest widens the gaps.
  // If it can't all fit, the quote goes first (it's drawn only when it fits).
  const MIN_GAP = 44;
  const MIN_PAD = 56;
  const sections = (q: number) => [statsH, q].filter((h) => h > 0);
  const need = (q: number) => BAR + heroContent + MIN_PAD * 2 + sections(q).reduce((a, b) => a + b, 0) + MIN_GAP * (sections(q).length + 1);
  const showQuote = quoteH > 0 && need(quoteH) <= cardH;
  const below = sections(showQuote ? quoteH : 0);
  const spare = Math.max(0, cardH - need(showQuote ? quoteH : 0));
  const heroPad = MIN_PAD + Math.min(spare * 0.25, 120);
  const gap = MIN_GAP + (spare - (heroPad - MIN_PAD) * 2) / (below.length + 1);

  sticker(ctx, p, cx, top, cw, cardH, 48, p.surface, 18);
  ctx.save();
  roundRect(ctx, cx + 3, top + 3, cw - 6, cardH - 6, 45);
  ctx.clip();

  // HOTTOGOL bar.
  ctx.fillStyle = p.ink;
  ctx.fillRect(cx, top, cw, BAR);
  ctx.fillStyle = p.bg;
  ctx.font = `900 58px ${f.display}`;
  ctx.textAlign = "left";
  ctx.fillText("H O T T O G O L", cx + 44, top + 84);
  ctx.textAlign = "right";
  ctx.font = `800 36px ${f.sans}`;
  ctx.fillText("হট্টগোল", cx + cw - 44, top + 80);

  // Accent hero.
  const heroTop = top + BAR;
  const heroH = heroContent + heroPad * 2;
  ctx.fillStyle = p.accent;
  ctx.fillRect(cx, heroTop, cw, heroH);
  ctx.fillStyle = p.ink;
  ctx.fillRect(cx, heroTop, cw, 6);
  ctx.fillRect(cx, heroTop + heroH - 6, cw, 6);
  ctx.textAlign = "center";

  let y = heroTop + heroPad;
  sticker(ctx, p, mid - chipW / 2, y, chipW, chipH, chipH / 2, p.surface, 0);
  ctx.fillStyle = p.ink;
  ctx.font = `800 ${chipSize}px ${f.sans}`;
  ctx.fillText(chip, mid, y + chipSize + 10);
  y += chipH;

  if (data.badge) {
    ctx.font = `800 34px ${f.sans}`;
    const bw = ctx.measureText(data.badge).width + 56;
    sticker(ctx, p, mid - bw / 2, y + 24, bw, 60, 30, p.marigold, 6);
    ctx.fillStyle = p.ink;
    ctx.fillText(data.badge, mid, y + 66);
    y += 92;
  }
  if (data.titleEmoji) {
    ctx.font = `150px ${f.sans}`;
    ctx.fillText(data.titleEmoji, mid, y + 180);
    y += 220;
  } else y += 40;
  if (data.headlineLabel) {
    ctx.font = `800 32px ${f.sans}`;
    ctx.fillText(data.headlineLabel.toUpperCase(), mid, y + 36);
    y += 60;
  }
  ctx.font = `900 ${hs}px ${f.display}`;
  ctx.fillText(data.headline, mid, y + hs * 0.95);
  y += hs * 1.08;
  ctx.font = `800 66px ${f.display}`;
  for (const line of titleLines) {
    ctx.fillText(line, mid, y + 70);
    y += 78;
  }
  if (data.rank) {
    const rs = fit(ctx, data.rank, 800, f.sans, 36, cw - 160, 22);
    const rw = Math.min(cw - 100, ctx.measureText(data.rank).width + 56);
    sticker(ctx, p, mid - rw / 2, y + 22, rw, rs + 32, 30, p.surface, 0);
    ctx.fillStyle = p.ink;
    ctx.font = `800 ${rs}px ${f.sans}`;
    ctx.fillText(data.rank, mid, y + 22 + rs + 7);
  }

  // Stats (max 4).
  y = heroTop + heroH + gap;
  if (stats.length) {
    const bw = (cw - 88 - (cols - 1) * statGap) / cols;
    stats.forEach((s, i) => {
      // An odd last stat spans the full row (no hole in the grid).
      const wide = cols === 2 && i === stats.length - 1 && stats.length % 2 === 1;
      const w = wide ? cw - 88 : bw;
      const bx = wide ? cx + 44 : cx + 44 + (i % cols) * (bw + statGap);
      const by = y + Math.floor(i / cols) * (bh + statGap);
      sticker(ctx, p, bx, by, w, bh, 26, p.surface2, 0);
      ctx.fillStyle = p.muted;
      ctx.font = `800 28px ${f.sans}`;
      ctx.fillText(wrap(ctx, s.label.toUpperCase(), w - 36, 1)[0] ?? "", bx + w / 2, by + 54);
      ctx.fillStyle = p.ink;
      const vs = fit(ctx, s.value, 800, f.display, 64, w - 36, 26);
      ctx.fillText(s.value, bx + w / 2, by + 72 + vs);
    });
    y += statsH + gap;
  }

  // Funny quote (or the result's own one-liner).
  if (showQuote) {
    ctx.save();
    ctx.translate(mid, y + quoteH / 2);
    ctx.rotate(-0.014);
    sticker(ctx, p, -(cw - 88) / 2, -quoteH / 2, cw - 88, quoteH, 32, p.surface2, 8);
    ctx.fillStyle = p.ink;
    ctx.font = `800 50px ${f.display}`;
    quoteLines.forEach((l, i) => ctx.fillText(l, 0, -quoteH / 2 + 32 + 50 + i * 66));
    ctx.restore();
  }
  ctx.restore();

  // Footer: where to play.
  ctx.fillStyle = p.ink;
  ctx.textAlign = "center";
  const footer = `🧠 ${host}${data.path}`;
  fit(ctx, footer, 800, f.sans, 40, W - PAD * 2, 22);
  ctx.fillText(footer, mid, H - 104);
  ctx.fillStyle = p.muted;
  ctx.font = `700 30px ${f.sans}`;
  ctx.fillText("Free · no sign-up · ফ্রি", mid, H - 52);

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"));
}
