// Builds data/dialects/map.ts: simplified SVG paths for Bangladesh's 64 districts.
// Usage (Docker only): docker run --rm -v "$PWD":/app -w /app node:22-alpine node scripts/build-map.mjs
// Source: geoBoundaries gbOpen BGD ADM2 (https://www.geoboundaries.org/), data from
// Bangladesh Bureau of Statistics (BBS) / OCHA ROAP. Licence per geoBoundaries metadata:
// "Creative Commons Attribution 3.0 Intergovernmental Organisations (CC BY 3.0 IGO)".
// Requires attribution (kept in MAP_ATTRIBUTION). Fails loudly on unmapped/missing districts.
import { writeFileSync } from "node:fs";

const API = "https://www.geoboundaries.org/api/current/gbOpen/BGD/ADM2/";
const OUT = "data/dialects/map.ts";
const PAD = 12, W = 1000, MIN_AREA = 4, TOL = Number(process.env.TOL ?? 1.5);

const IDS = `dhaka faridpur gazipur gopalganj kishoreganj madaripur manikganj munshiganj narayanganj narsingdi rajbari shariatpur tangail mymensingh jamalpur netrokona sherpur chattogram coxsbazar cumilla brahmanbaria chandpur feni lakshmipur noakhali rangamati khagrachhari bandarban khulna bagerhat chuadanga jashore jhenaidah kushtia magura meherpur narail satkhira barishal barguna bhola jhalokati patuakhali pirojpur sylhet habiganj moulvibazar sunamganj rangpur dinajpur gaibandha kurigram lalmonirhat nilphamari panchagarh thakurgaon rajshahi bogura chapainawabganj joypurhat naogaon natore pabna sirajganj`.split(" ");

// Source shapeName -> id. Only names that differ from the id (after lowercasing and
// stripping non-letters) are listed here; everything else must match an id exactly.
const NAME_TO_ID = {
  Jessore: "jashore", Chittagong: "chattogram", Comilla: "cumilla", Barisal: "barishal",
  Bogra: "bogura", "Cox's Bazar": "coxsbazar", Nawabganj: "chapainawabganj",
  "Chapai Nababganj": "chapainawabganj", Netrakona: "netrokona", Brahamanbaria: "brahmanbaria",
  Maulvibazar: "moulvibazar", Jhalakati: "jhalokati", Jhalokati: "jhalokati",
  Khagrachari: "khagrachhari", "Rangamati Hill District": "rangamati",
};
const manual = [];
const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, "");
function idFor(name) {
  if (NAME_TO_ID[name]) { manual.push(`${name} -> ${NAME_TO_ID[name]}`); return NAME_TO_ID[name]; }
  const n = norm(name);
  if (IDS.includes(n)) return n;
  throw new Error(`Unmapped shapeName: ${name}`);
}

const meta = await (await fetch(API)).json();
if (!/CC BY|CC0|Public Domain|ODbL/i.test(meta.boundaryLicense)) throw new Error("Licence not open: " + meta.boundaryLicense);
const url = meta.simplifiedGeometryGeoJSON || meta.gjDownloadURL;
const gj = await (await fetch(url, { redirect: "follow" })).json();

// projection bounds
const polysOf = (g) => (g.type === "Polygon" ? [g.coordinates] : g.coordinates);
let minLon = 1e9, maxLon = -1e9, minLat = 1e9, maxLat = -1e9;
for (const f of gj.features) for (const p of polysOf(f.geometry)) for (const r of p) for (const [lo, la] of r) {
  minLon = Math.min(minLon, lo); maxLon = Math.max(maxLon, lo); minLat = Math.min(minLat, la); maxLat = Math.max(maxLat, la);
}
const k = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
const rawW = (maxLon - minLon) * k, rawH = maxLat - minLat;
const scale = (W - 2 * PAD) / rawW;
const H = Math.round(rawH * scale + 2 * PAD);
const proj = ([lo, la]) => [PAD + (lo - minLon) * k * scale, PAD + (maxLat - la) * scale];

const ringArea = (r) => { let a = 0; for (let i = 0; i < r.length; i++) { const [x1, y1] = r[i], [x2, y2] = r[(i + 1) % r.length]; a += x1 * y2 - x2 * y1; } return a / 2; };
function dp(pts, tol) {
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop(); let md = 0, mi = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b], dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1e-9;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * (pts[i][0] - ax) - dx * (pts[i][1] - ay)) / L;
      if (d > md) { md = d; mi = i; }
    }
    if (md > tol) { keep[mi] = 1; stack.push([a, mi], [mi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
function simplifyRing(r) {
  if (r.length > 1 && r[0][0] === r[r.length - 1][0] && r[0][1] === r[r.length - 1][1]) r = r.slice(0, -1);
  // split closed ring at the point farthest from the start so DP has a proper baseline
  let fi = 0, fd = 0;
  for (let i = 1; i < r.length; i++) { const d = Math.hypot(r[i][0] - r[0][0], r[i][1] - r[0][1]); if (d > fd) { fd = d; fi = i; } }
  const a = dp(r.slice(0, fi + 1), TOL), b = dp([...r.slice(fi), r[0]], TOL);
  return [...a, ...b.slice(1, -1)];
}
const r1 = (v) => Math.round(v * 10) / 10;
const num = (v) => { const s = String(v); return s === "-0" ? "0" : s; };
function pathOf(ring) {
  const q = ring.map(([x, y]) => [r1(x), r1(y)]);
  let s = `M${num(q[0][0])} ${num(q[0][1])}l`, px = q[0][0], py = q[0][1], parts = [];
  for (let i = 1; i < q.length; i++) {
    const dx = r1(q[i][0] - px), dy = r1(q[i][1] - py); px = q[i][0]; py = q[i][1];
    if (dx === 0 && dy === 0) continue;
    parts.push(`${num(dx)} ${num(dy)}`);
  }
  return s + parts.join(" ").replace(/ -/g, "-") + "z";
}

const shapes = {};
for (const f of gj.features) {
  const id = idFor(f.properties.shapeName);
  if (shapes[id]) throw new Error("Duplicate id " + id);
  let d = "", A = 0, sx = 0, sy = 0;
  for (const poly of polysOf(f.geometry)) {
    // outer ring + holes: holes subtract area (opposite winding after projection)
    poly.forEach((ring, ri) => {
      const pr = ring.map(proj);
      if (Math.abs(ringArea(pr)) < MIN_AREA) return;
      const sr = simplifyRing(pr);
      if (sr.length < 3) return;
      const q = sr.map(([x, y]) => [r1(x), r1(y)]);
      const a = ringArea(q); if (Math.abs(a) < MIN_AREA) return;
      const sign = ri === 0 ? 1 : -1, aa = Math.abs(a) * sign;
      let cx = 0, cy = 0;
      for (let i = 0; i < q.length; i++) { const [x1, y1] = q[i], [x2, y2] = q[(i + 1) % q.length]; const c = x1 * y2 - x2 * y1; cx += (x1 + x2) * c; cy += (y1 + y2) * c; }
      cx /= 6 * a; cy /= 6 * a;
      A += aa; sx += cx * aa; sy += cy * aa;
      d += pathOf(sr);
    });
  }
  if (!d || A <= 0) throw new Error("Empty geometry for " + id);
  shapes[id] = { d, cx: r1(sx / A), cy: r1(sy / A), area: Math.round(A) };
}
const missing = IDS.filter((i) => !shapes[i]);
if (missing.length || Object.keys(shapes).length !== 64) throw new Error("Missing ids: " + missing.join(","));

const date = new Date().toISOString().slice(0, 10);
const body = IDS.map((id) => `  ${id}: { d: ${JSON.stringify(shapes[id].d)}, cx: ${shapes[id].cx}, cy: ${shapes[id].cy}, area: ${shapes[id].area} },`).join("\n");
const ts = `// Generated by scripts/build-map.mjs — do not edit by hand.
// Source: geoBoundaries gbOpen BGD ADM2 (${meta.boundaryID}, year ${meta.boundaryYearRepresented}), ${meta.boundarySource}
// Source URL: ${meta.boundarySourceURL}
// Licence: ${meta.boundaryLicense}
// Generated: ${date}. Equirectangular projection, Douglas-Peucker simplified (tolerance ${TOL}px).

export const MAP_VIEWBOX = { width: ${W}, height: ${H} } as const;

export type DistrictShape = { d: string; cx: number; cy: number; area: number };

export const DISTRICT_SHAPES: Readonly<Record<string, DistrictShape>> = {
${body}
};

export const MAP_ATTRIBUTION = {
  text: "District boundaries: geoBoundaries / BBS, OCHA ROAP (CC BY 3.0 IGO)",
  url: "https://www.geoboundaries.org/",
} as const;
`;
writeFileSync(OUT, ts);
console.log(`wrote ${OUT}: ${(Buffer.byteLength(ts) / 1024).toFixed(1)} KB, ${Object.keys(shapes).length} districts, viewBox 1000x${H}`);
console.log("manual mappings:", manual.join("; "));
console.log("licence:", meta.boundaryLicense, "| source:", meta.boundarySource, "|", url);
