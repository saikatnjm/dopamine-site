import { describe, expect, it } from "vitest";
import { listGames } from "@/data/games";
import { GUIDE_SLUGS, guides } from "@/data/guides";
import { HOW_TO } from "@/data/how-to";
import { listActivities } from "@/lib/activities";
import { listExperiences } from "@/lib/experience/registry";
import { howToProblems, type HowTo } from "@/lib/how-to";

const allowed = [...listGames().map((g) => `g:${g.slug}`), ...listExperiences().map((e) => `x:${e.slug}`), "p:dhaka-person", "p:excuses"];
const required = listActivities("en").map((a) => a.key);
const guideParagraphs = GUIDE_SLUGS.flatMap((s) => [...guides[s].intro, ...guides[s].picks.map((p) => p.why), ...(guides[s].faq ?? []).map((f) => f.a)]);

describe("how-to content", () => {
  it("every playable activity has valid, unique, bilingual how-to text", () => {
    expect(howToProblems(HOW_TO, required, allowed, guideParagraphs)).toEqual([]);
  });

  it("validator catches the usual mistakes (fake fixture)", () => {
    const line = (s: string) => ({ en: `Test ${s}`, bn: `পরীক্ষা ${s}` });
    const ok: HowTo = { steps: [line("a"), line("b"), line("c")], tips: [line("d"), line("e")], faq: [1, 2, 3].map((i) => ({ q: line(`q${i}`), a: line(`a${i}`) })) };
    expect(howToProblems({ "g:x": ok }, ["g:x"], ["g:x"])).toEqual([]);
    expect(howToProblems({}, ["g:x"], ["g:x"]).join()).toMatch(/missing/);
    expect(howToProblems({ "g:y": ok }, [], ["g:x"]).join()).toMatch(/not an activity/);
    expect(howToProblems({ "g:x": { ...ok, steps: [line("a")] } }, ["g:x"], ["g:x"]).join()).toMatch(/1 steps/);
    expect(howToProblems({ "g:x": { ...ok, faq: ok.faq.slice(0, 2) } }, ["g:x"], ["g:x"]).join()).toMatch(/2 FAQ/);
    expect(howToProblems({ "g:x": { ...ok, tips: [line("d"), { en: "only english", bn: "" }] } }, ["g:x"], ["g:x"]).join()).toMatch(/EN \+ BN/);
    expect(howToProblems({ "g:x": ok, "g:z": ok }, ["g:x", "g:z"], ["g:x", "g:z"]).join()).toMatch(/duplicated/);
    expect(howToProblems({ "g:x": ok }, ["g:x"], ["g:x"], [line("a")]).join()).toMatch(/duplicated from a guide/);
  });
});
