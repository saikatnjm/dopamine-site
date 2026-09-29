import { categories } from "@/data/categories";
import { experiences } from "@/data/experiences";
import { validateExperience } from "./engine";
import type { Category, CategorySlug, Experience } from "./types";

// Fail loudly on bad content in development and at build time.
if (process.env.NODE_ENV !== "production" || typeof window === "undefined") {
  const problems = experiences.flatMap(validateExperience);
  const slugs = experiences.map((e) => e.slug);
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dupes.length) problems.push(`duplicate experience slugs: ${dupes.join(", ")}`);
  if (problems.length) {
    throw new Error(`Invalid experience data:\n- ${problems.join("\n- ")}`);
  }
}

const bySlug = new Map(experiences.map((e) => [e.slug, e]));

export function listExperiences(): readonly Experience[] {
  return experiences;
}

export function getExperience(slug: string): Experience | undefined {
  return bySlug.get(slug);
}

export function listCategories(): readonly Category[] {
  return categories;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function experiencesInCategory(slug: CategorySlug): Experience[] {
  return experiences.filter((e) => e.category === slug);
}
