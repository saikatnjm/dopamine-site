import { DISTRICTS } from "@/data/dialects/districts";
import type { Text } from "@/lib/i18n/core";

// The 8 administrative divisions of Bangladesh and their 64 districts.
// Grouping matches the official administrative list (Bangladesh National
// Portal / Banglapedia "Division"): Dhaka 13, Chattogram 11, Rajshahi 8,
// Khulna 10, Barishal 6, Sylhet 4, Rangpur 8, Mymensingh 4 = 64.
// Ids are permanent (badge ids use them). Validated at import: every district
// in exactly one division, all 64 covered — bad data fails the build.

export type Division = { id: string; name: Text; districts: readonly string[] };

export const DIVISIONS: readonly Division[] = [
  {
    id: "dhaka",
    name: { en: "Dhaka", bn: "ঢাকা" },
    districts: ["dhaka", "faridpur", "gazipur", "gopalganj", "kishoreganj", "madaripur", "manikganj", "munshiganj", "narayanganj", "narsingdi", "rajbari", "shariatpur", "tangail"],
  },
  {
    id: "chattogram",
    name: { en: "Chattogram", bn: "চট্টগ্রাম" },
    districts: ["chattogram", "coxsbazar", "cumilla", "brahmanbaria", "chandpur", "feni", "lakshmipur", "noakhali", "rangamati", "khagrachhari", "bandarban"],
  },
  {
    id: "rajshahi",
    name: { en: "Rajshahi", bn: "রাজশাহী" },
    districts: ["rajshahi", "bogura", "chapainawabganj", "joypurhat", "naogaon", "natore", "pabna", "sirajganj"],
  },
  {
    id: "khulna",
    name: { en: "Khulna", bn: "খুলনা" },
    districts: ["khulna", "bagerhat", "chuadanga", "jashore", "jhenaidah", "kushtia", "magura", "meherpur", "narail", "satkhira"],
  },
  {
    id: "barishal",
    name: { en: "Barishal", bn: "বরিশাল" },
    districts: ["barishal", "barguna", "bhola", "jhalokati", "patuakhali", "pirojpur"],
  },
  {
    id: "sylhet",
    name: { en: "Sylhet", bn: "সিলেট" },
    districts: ["sylhet", "habiganj", "moulvibazar", "sunamganj"],
  },
  {
    id: "rangpur",
    name: { en: "Rangpur", bn: "রংপুর" },
    districts: ["rangpur", "dinajpur", "gaibandha", "kurigram", "lalmonirhat", "nilphamari", "panchagarh", "thakurgaon"],
  },
  {
    id: "mymensingh",
    name: { en: "Mymensingh", bn: "ময়মনসিংহ" },
    districts: ["mymensingh", "jamalpur", "netrokona", "sherpur"],
  },
];

/** Every problem with the division data (empty = valid). Pure, for tests. */
export function divisionProblems(divisions: readonly Division[], districtIds: readonly string[]): string[] {
  const problems: string[] = [];
  const seen = new Map<string, string>();
  const known = new Set(districtIds);
  for (const d of divisions) {
    for (const id of d.districts) {
      if (!known.has(id)) problems.push(`division ${d.id}: unknown district "${id}"`);
      else if (seen.has(id)) problems.push(`district "${id}" is in both ${seen.get(id)} and ${d.id}`);
      else seen.set(id, d.id);
    }
  }
  for (const id of districtIds) if (!seen.has(id)) problems.push(`district "${id}" is in no division`);
  if (divisions.length !== 8) problems.push(`expected 8 divisions, found ${divisions.length}`);
  return problems;
}

const problems = divisionProblems(DIVISIONS, DISTRICTS.map((d) => d.id));
if (problems.length > 0) throw new Error(`Invalid divisions:\n  - ${problems.join("\n  - ")}`);

export function divisionOf(districtId: string): Division | undefined {
  return DIVISIONS.find((d) => d.districts.includes(districtId));
}
