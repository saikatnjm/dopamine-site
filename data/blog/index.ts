import type { BlogPost } from "@/lib/blog";
import { bangladesh64Districts } from "./bangladesh-64-districts-list";
import { kacherGutiRules } from "./kacher-guti-rules";
import { latimKhelaRules } from "./latim-khela-rules";

// Every article, any status (lib/blog-content.ts decides what's visible).
// One file per article; slugs are permanent.
export const BLOG_POSTS: readonly BlogPost[] = [kacherGutiRules, latimKhelaRules, bangladesh64Districts];
