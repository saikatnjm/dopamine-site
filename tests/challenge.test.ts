import { describe, expect, it } from "vitest";
import { challengePath, decodeChallenge, encodeChallenge, legacyChallenge } from "@/lib/challenge";
import { packSeed, QUIZ_LENGTH, unpackSeed } from "@/lib/games/ancholik-quiz";

const seed = packSeed({ scope: "sylhet", level: "medium", shuffle: 0x12abcd })!;

describe("challenge links for the dialect quiz", () => {
  it("round-trips game, packed config and score", () => {
    const token = encodeChallenge({ game: "ancholik-quiz", seed, score: 7 });
    expect(token).toMatch(/^1aq\./);
    const back = decodeChallenge(token);
    expect(back).toEqual({ game: "ancholik-quiz", seed, score: 7 });
    expect(unpackSeed(back!.seed)).toEqual({ scope: "sylhet", level: "medium", shuffle: 0x12abcd });
    expect(challengePath(back!)).toBe(`/c/${token}`);
  });

  it("rejects impossible scores", () => {
    expect(encodeChallenge({ game: "ancholik-quiz", seed, score: QUIZ_LENGTH + 1 })).toBeNull();
    expect(encodeChallenge({ game: "ancholik-quiz", seed, score: -1 })).toBeNull();
    expect(legacyChallenge("ancholik-quiz", seed, 99)).toBeNull();
  });

  it("rejects edited or broken tokens without throwing", () => {
    const token = encodeChallenge({ game: "ancholik-quiz", seed, score: 3 })!;
    const edited = token.replace(/\.3\./, ".9.");
    expect(decodeChallenge(edited)).toBeNull();
    expect(decodeChallenge(token.slice(0, -1))).toBeNull();
    expect(decodeChallenge("%E0%A4%A")).toBeNull();
    expect(decodeChallenge(null)).toBeNull();
    expect(decodeChallenge("x".repeat(100))).toBeNull();
  });
});
