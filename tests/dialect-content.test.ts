import { describe, expect, it } from "vitest";
import { DIALECT_CONTENT } from "@/data/dialects";
import type { DialectContent } from "@/lib/dialects/types";
import { assertValidDialectContent, validateDialectContent } from "@/lib/dialects/validate";
import { fixture, question, word } from "./fixtures/dialects";

const errors = (c: DialectContent) => validateDialectContent(c).filter((i) => i.level === "error");
const messages = (c: DialectContent) => errors(c).map((e) => `${e.where}: ${e.message}`).join("\n");

describe("the shipped dialect content", () => {
  it("is structurally valid", () => {
    expect(messages(DIALECT_CONTENT)).toBe("");
  });
});

describe("validateDialectContent", () => {
  it("accepts well-formed content", () => {
    expect(errors(fixture())).toEqual([]);
  });

  it("finds duplicate and malformed ids", () => {
    const c = fixture(2, ["jashore"]);
    expect(messages({ ...c, words: [...c.words, c.words[0]!] })).toMatch(/duplicate id/);
    expect(messages({ ...c, words: [...c.words, { ...word("ok", "jashore"), id: "Bad Id" }] })).toMatch(/must match/);
    expect(messages({ ...c, questions: [...c.questions, c.questions[0]!] })).toMatch(/question q-jashore-0: duplicate id/);
  });

  it("requires the required fields", () => {
    const c = fixture(1, ["jashore"]);
    const w = { ...c.words[0]!, localWord: " ", meaningBn: "" };
    const out = messages({ ...c, words: [w] });
    expect(out).toMatch(/localWord is required/);
    expect(out).toMatch(/meaningBn is required/);
    const q = { ...c.questions[0]!, explanation: { en: "x", bn: "" } };
    expect(messages({ ...c, questions: [q] })).toMatch(/explanation is required/);
  });

  it("checks district references", () => {
    const c = fixture(1, ["jashore"]);
    expect(messages({ ...c, words: [{ ...c.words[0]!, districtIds: ["atlantis"] }] })).toMatch(/unknown district "atlantis"/);
    expect(messages({ ...c, words: [{ ...c.words[0]!, districtIds: [] }] })).toMatch(/at least one district/);
  });

  it("requires exactly four distinct options and a real correct option", () => {
    const c = fixture(1, ["jashore"]);
    const q = c.questions[0]!;
    expect(messages({ ...c, questions: [{ ...q, options: q.options.slice(0, 3) }] })).toMatch(/exactly 4 options \(has 3\)/);
    const dupText = [q.options[0]!, q.options[1]!, q.options[2]!, { id: "d", text: `${q.options[0]!.text}  ` }];
    expect(messages({ ...c, questions: [{ ...q, options: dupText }] })).toMatch(/duplicate option text/);
    const dupId = [q.options[0]!, q.options[1]!, q.options[2]!, { ...q.options[3]!, id: "a" }];
    expect(messages({ ...c, questions: [{ ...q, options: dupId }] })).toMatch(/duplicate option id "a"/);
    expect(messages({ ...c, questions: [{ ...q, correctOptionId: "z" }] })).toMatch(/correctOptionId "z" is not one of its options/);
  });

  it("checks word references and blocks publishing unreviewed words", () => {
    const c = fixture(1, ["jashore"]);
    expect(messages({ ...c, questions: [question("q-x", "w-missing", "jashore")] })).toMatch(/wordId "w-missing" does not exist/);
    const pending = { ...c, words: [...c.words, word("w-pending", "jashore", "needs_review")] };
    expect(messages({ ...pending, questions: [question("q-p", "w-pending", "jashore", "easy", "published")] })).toMatch(/published, but word "w-pending" is needs_review/);
    // An unreviewed word may have a draft question waiting for review.
    expect(errors({ ...pending, questions: [question("q-p", "w-pending", "jashore", "easy", "draft")] })).toEqual([]);
  });

  it("rejects unknown statuses and difficulties", () => {
    const c = fixture(1, ["jashore"]);
    expect(messages({ ...c, words: [{ ...c.words[0]!, verificationStatus: "probably" as never }] })).toMatch(/unknown verificationStatus/);
    expect(messages({ ...c, questions: [{ ...c.questions[0]!, difficulty: "insane" as never }] })).toMatch(/unknown difficulty/);
  });

  it("warns (doesn't fail) about thin verified words", () => {
    const issues = validateDialectContent(fixture(1, ["jashore"]));
    expect(issues.some((i) => i.level === "warning" && /exampleSentence/.test(i.message))).toBe(true);
  });

  it("assertValidDialectContent throws with every error listed", () => {
    const c = fixture(1, ["jashore"]);
    expect(() => assertValidDialectContent({ ...c, questions: [question("q-x", "nope", "atlantis")] })).toThrow(/does not exist[\s\S]*unknown district|unknown district[\s\S]*does not exist/);
    expect(() => assertValidDialectContent(c)).not.toThrow();
  });
});
