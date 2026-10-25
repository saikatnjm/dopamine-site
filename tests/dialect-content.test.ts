import { describe, expect, it } from "vitest";
import { DIALECT_CONTENT } from "@/data/dialects";
import { buildPublicForms, isPublicForm, isScoredForm } from "@/lib/dialects/content";
import type { DialectContent } from "@/lib/dialects/types";
import { assertValidDialectContent, validateDialectContent } from "@/lib/dialects/validate";
import { fixture, form } from "./fixtures/dialects";

const errors = (c: DialectContent) => validateDialectContent(c).filter((i) => i.level === "error");
const messages = (c: DialectContent) => errors(c).map((e) => `${e.where}: ${e.message}`).join("\n");

describe("the shipped dialect content", () => {
  it("is structurally valid", () => {
    expect(messages(DIALECT_CONTENT)).toBe("");
  });

  it("puts every one of the 64 districts in at most one region", () => {
    expect(DIALECT_CONTENT.districts).toHaveLength(64);
    const all = DIALECT_CONTENT.regions.flatMap((r) => r.districts);
    expect(new Set(all).size).toBe(all.length);
  });

  it("ships nothing as verified without a person (all imported research is needs_review)", () => {
    expect(DIALECT_CONTENT.forms.every((f) => f.status !== "verified" || f.script === "bangla")).toBe(true);
  });
});

describe("validateDialectContent", () => {
  it("accepts well-formed content", () => {
    expect(errors(fixture())).toEqual([]);
  });

  it("finds duplicate and malformed ids", () => {
    const c = fixture(2, ["barishal"]);
    expect(messages({ ...c, forms: [...c.forms, c.forms[0]!] })).toMatch(/duplicate id/);
    expect(messages({ ...c, concepts: [...c.concepts, { ...c.concepts[0]!, id: "Bad Id" }] })).toMatch(/must match/);
  });

  it("checks concept, region and source references", () => {
    const c = fixture(1, ["barishal"]);
    expect(messages({ ...c, forms: [form("x", "nope", ["barishal"])] })).toMatch(/unknown concept "nope"/);
    expect(messages({ ...c, forms: [form("x", "c0", ["atlantis"])] })).toMatch(/unknown region "atlantis"/);
    expect(messages({ ...c, forms: [form("x", "c0", ["barishal"], { sources: ["ghost"] })] })).toMatch(/unknown source "ghost"/);
    expect(messages({ ...c, forms: [form("x", "c0", ["barishal"], { sources: [] })] })).toMatch(/at least one source/);
    expect(messages({ ...c, forms: [form("x", "c0", [])] })).toMatch(/at least one region/);
  });

  it("rejects a district in two regions and unknown districts", () => {
    const c = fixture(1, ["barishal"]);
    const twice = c.regions.map((r) => (r.id === "faridpur" ? { ...r, districts: [...r.districts, "barishal"] } : r));
    expect(messages({ ...c, regions: twice })).toMatch(/already in region "barishal"/);
    const bad = c.regions.map((r) => (r.id === "faridpur" ? { ...r, districts: ["narnia"] } : r));
    expect(messages({ ...c, regions: bad })).toMatch(/unknown district "narnia"/);
  });

  it("checks enums and that Bangla-script forms contain Bangla", () => {
    const c = fixture(1, ["barishal"]);
    expect(messages({ ...c, forms: [form("x", "c0", ["barishal"], { status: "probably" as never })] })).toMatch(/unknown status/);
    expect(messages({ ...c, forms: [form("x", "c0", ["barishal"], { confidence: "sure" as never })] })).toMatch(/unknown confidence/);
    expect(messages({ ...c, forms: [form("x", "c0", ["barishal"], { text: "bilai" })] })).toMatch(/has no Bangla letters/);
    expect(messages({ ...c, forms: [form("x", "c0", ["barishal"], { text: "bilai", script: "romanized", status: "verified" })] })).toMatch(/need a Bangla spelling/);
  });

  it("assertValidDialectContent throws with every error listed", () => {
    const c = fixture(1, ["barishal"]);
    expect(() => assertValidDialectContent({ ...c, forms: [form("x", "nope", ["atlantis"])] })).toThrow(/unknown concept[\s\S]*unknown region/);
    expect(() => assertValidDialectContent(c)).not.toThrow();
  });
});

describe("visibility rules", () => {
  const base = { regions: ["barishal"] };
  it("public = verified, or needs_review with high/medium confidence and a sourced Bangla spelling", () => {
    expect(isPublicForm(form("a", "c0", base.regions, { status: "verified" }))).toBe(true);
    expect(isPublicForm(form("a", "c0", base.regions, { status: "needs_review", confidence: "medium" }))).toBe(true);
    expect(isPublicForm(form("a", "c0", base.regions, { status: "needs_review", confidence: "low" }))).toBe(false);
    expect(isPublicForm(form("a", "c0", base.regions, { status: "needs_review", script: "romanized", text: "fua" }))).toBe(false);
    expect(isPublicForm(form("a", "c0", base.regions, { status: "needs_review", script: "rendered" }))).toBe(false);
    expect(isPublicForm(form("a", "c0", base.regions, { status: "draft" }))).toBe(false);
    expect(isPublicForm(form("a", "c0", base.regions, { status: "rejected" }))).toBe(false);
  });

  it("scored = verified only", () => {
    expect(isScoredForm(form("a", "c0", base.regions, { status: "verified" }))).toBe(true);
    expect(isScoredForm(form("a", "c0", base.regions, { status: "needs_review", confidence: "high" }))).toBe(false);
  });

  it("drops romanized variants and examples from public data", () => {
    const c = fixture(1, ["barishal"]);
    const f = { ...form("x", "c0", ["barishal"]), variants: ["বিলই", "bilai", "ꠛꠤꠟꠣꠁ"], example: "amar gori kuae?" };
    const [pub] = buildPublicForms({ ...c, forms: [f] });
    expect(pub!.variants).toEqual(["বিলই"]);
    expect(pub!.example).toBeUndefined();
    expect(pub!.sources).toEqual([{ title: "Test source", type: "owner" }]);
  });
});
