# Dialect content (আঞ্চলিক ভাষা)

Content for **আঞ্চলিক ভাষার লড়াই** (`/games/ancholik-quiz`) and the word list
(`/games/words`). Everything is TypeScript in this folder, with no database. Types live in
`lib/dialects/types.ts`.

## The one rule

**Code never verifies a dialect fact.** A word only becomes `verified` when a person
who knows the dialect has checked its spelling, meaning and where it's used. Only
`published` questions about `verified` words appear in scored quizzes. Drafts never
reach the browser, because pages send the client only the published pool.

| Word `verificationStatus` | Meaning | Shown to visitors? |
| --- | --- | --- |
| `draft` | Rough idea, incomplete | No |
| `needs_review` | Complete, waiting for a person to check | No |
| `verified` | Checked by a person | Yes (word list + its page) |

| Question `status` | Meaning | In scored quizzes? |
| --- | --- | --- |
| `draft` | Being written | No |
| `verified` | Reviewed, not live yet | No |
| `published` | Live (its word **must** be `verified`, or the build fails) | Yes |

If you're unsure about something, leave it as `needs_review` and write why in `notes`.
Keep spellings exactly as the source gives them. Put other spellings in `variants`
and never "fix" one into another.

## Files

```
data/dialects/
  districts.ts          district list (APPEND-ONLY: order is packed into challenge seeds)
  words/<district>.ts   words, filed under their main district
  questions.ts          quiz questions (each points at one word)
  copy.ts               UI copy for the word pages
  index.ts              combines everything (DIALECT_CONTENT)
  review/               generated review checklists (npm run content:checklist)
```

## Add a district

1. Append to `DISTRICTS` in `districts.ts`. Never reorder or remove one.
   ```ts
   { id: "rangpur", name: { en: "Rangpur", bn: "রংপুর" }, division: "rangpur", aliases: [], emoji: "🌳" },
   ```
   `id` is the official spelling in lowercase. Old spellings go in `aliases`, so
   `?district=<alias>` still works.
2. Create `words/rangpur.ts` (copy an existing file) and add it to `index.ts`.

That's all. The quiz picks up the district automatically and shows "শীঘ্রই" until
it has at least 5 published questions.

## Add a word

Add it to `words/<district>.ts`:

```ts
{
  id: "jashore-example",              // a-z, 0-9, "-" (≤ 40). Also the URL. Never rename/reuse.
  standardWord: "…",                  // প্রমিত বাংলা
  localWord: "…",                     // exactly as the source writes it
  meaningBn: "…",
  meaningEn: "…",                     // optional, shown in English mode
  districtIds: ["jashore"],
  region: "khulna",                   // the division
  variants: [],                       // other spellings
  pronunciation: "…",                 // optional
  exampleSentence: "…",               // optional; needed for the word page to be indexed
  source: "Owner's Jashore dialect image (2026-10)",
  contributor: "…",                   // optional
  verificationStatus: "needs_review", // always start here
  notes: "…",                         // optional: uncertainty, usage limits (not shown publicly)
},
```

## Create a quiz question

Add it to `questions.ts`:

```ts
{
  id: "q-jashore-example",
  wordId: "jashore-example",
  question: { en: "What does “…” mean in Jashore?", bn: "যশোরের ভাষায় “…” মানে কী?" },
  options: [                                        // exactly 4, all different
    { id: "a", text: "…", gloss: "…" },             // gloss = optional English, English mode only
    { id: "b", text: "…" },
    { id: "c", text: "…" },
    { id: "d", text: "…" },
  ],
  correctOptionId: "b",
  explanation: { en: "…", bn: "…" },
  difficulty: "easy",                               // easy | medium | hard
  districtIds: ["jashore"],
  tags: [],
  status: "draft",                                  // publish only after the word is verified
},
```

Wrong options must really be wrong for that district. Option order is shuffled in
the game, so the correct answer can be any letter. Easy rounds use only easy
questions, Medium uses easy and medium, and Hard uses everything (hard first).

## Review and validate

```bash
docker compose run --rm dev npm run content:checklist   # writes review/YYYY-MM-DD-dialect-review-checklist.md
docker compose run --rm dev npm run validate:content    # structural report; fails on errors
docker compose run --rm dev npm test                    # unit tests (includes the same validation)
```

The checklist lists every word and question that isn't live yet, with tick boxes for
spelling, meaning and usage. To approve an entry, edit its status in the data file by hand.

`validate:content` (also run by the build and CI) checks unique ids, required fields,
valid district references, exactly four distinct options, a correct option that
exists, and that every question's word exists. It also checks that **published questions
only use verified words**. It does **not** check whether a word is right. That's the review.

## What visitors see

- The quiz needs at least 5 published questions for the chosen district and level.
  Below that it shows "প্রশ্ন তৈরি হচ্ছে!". While no round is possible at all, the quiz
  is also `noindex` and left out of the sitemap, recommendations and the roulette.
- `/games/words` lists verified words only. It's indexed once there are 10 or more.
- `/games/words/<id>` exists only for verified words. It's indexed only if the word has
  an `exampleSentence`.
- When content goes live, add `g:ancholik-quiz` to `lib/moods.ts` / `data/world.ts` if
  you want it there (they can't list it while it's hidden).
