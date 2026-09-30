// Copy for the Programmer Rage Simulator (EN + BN). Rules: lib/games/programmer-rage.ts.
// Purely fictional comedy — no real commands or instructions anywhere in here.
// Humor targets deploy situations, never people or teams in particular.

import type { Accent } from "@/components/ui/styles";
import type { Text } from "@/lib/i18n/core";
import type { ActionId, CauseId, EndingId, EventId, RankId } from "@/lib/games/programmer-rage";

export const causes: Record<CauseId, { emoji: string; name: Text; log: Text }> = {
  "env-missing": {
    emoji: "🔑",
    name: { en: "a missing environment variable", bn: "একটা হারানো এনভায়রনমেন্ট ভ্যারিয়েবল" },
    log: { en: "LOG: SECRET_THING is undefined. It was defined on your laptop. Only there.", bn: "লগ: SECRET_THING আনডিফাইনড। আপনার ল্যাপটপে ছিল। শুধু ওখানেই।" },
  },
  "port-in-use": {
    emoji: "🚪",
    name: { en: "a port already in use", bn: "আগে থেকেই দখল হওয়া পোর্ট" },
    log: { en: "LOG: port 3000 is busy. Something from last Tuesday is still running.", bn: "লগ: পোর্ট ৩০০০ ব্যস্ত। গত মঙ্গলবারের কিছু একটা এখনো চলছে।" },
  },
  "container-loop": {
    emoji: "🐳",
    name: { en: "a container stuck restarting", bn: "বারবার রিস্টার্ট হওয়া কন্টেইনার" },
    log: { en: "LOG: container restarted 47 times. It's not a bug, it's a lifestyle.", bn: "লগ: কন্টেইনার ৪৭ বার রিস্টার্ট হয়েছে। এটা বাগ না, এটা জীবনধারা।" },
  },
  ssl: {
    emoji: "🔒",
    name: { en: "an SSL certificate problem", bn: "এসএসএল সার্টিফিকেটের ঝামেলা" },
    log: { en: "LOG: certificate expired yesterday. The reminder email is in spam.", bn: "লগ: সার্টিফিকেটের মেয়াদ গতকাল শেষ। রিমাইন্ডার ইমেইল স্প্যামে।" },
  },
  "db-refused": {
    emoji: "🗄️",
    name: { en: "a refused database connection", bn: "প্রত্যাখ্যাত ডেটাবেস কানেকশন" },
    log: { en: "LOG: database connection refused. The database wants some space.", bn: "লগ: ডেটাবেস কানেকশন রিফিউজড। ডেটাবেসের একটু একা থাকা দরকার।" },
  },
  typo: {
    emoji: "✏️",
    name: { en: "one tiny typo", bn: "একটা ছোট্ট টাইপো" },
    log: { en: "LOG: unexpected token on line 1. You wrote “cosnt”.", bn: "লগ: লাইন ১-এ অপ্রত্যাশিত টোকেন। আপনি লিখেছেন “cosnt”।" },
  },
};

/** good = it helped (progress went up), bad = it didn't. Gambles use win/lose. */
export type ActionCopy = { emoji: string; label: Text; good: Text; bad: Text };

export const actions: Record<ActionId, ActionCopy> = {
  "check-logs": {
    emoji: "📜",
    label: { en: "Check logs", bn: "লগ দেখো" },
    good: { en: "Scrolled through 4,000 lines. Found something. Probably.", bn: "৪,০০০ লাইন স্ক্রল করলেন। কিছু একটা পেলেন। সম্ভবত।" },
    bad: { en: "The logs are just the word “error” in different fonts.", bn: "লগে শুধু আলাদা আলাদা ফন্টে “error” লেখা।" },
  },
  "restart-server": {
    emoji: "🔁",
    label: { en: "Restart server", bn: "সার্ভার রিস্টার্ট" },
    good: { en: "Turned it off and on again. Ancient wisdom works.", bn: "বন্ধ করে আবার চালু করলেন। প্রাচীন জ্ঞান কাজ করে।" },
    bad: { en: "It restarted. The problem also restarted.", bn: "রিস্টার্ট হলো। সমস্যাটাও রিস্টার্ট হলো।" },
  },
  "restart-redis": {
    emoji: "🧠",
    label: { en: "Restart Redis", bn: "রেডিস রিস্টার্ট" },
    good: { en: "Redis came back fresh. Something downstream sighed in relief.", bn: "রেডিস তাজা হয়ে ফিরল। কোথাও কেউ স্বস্তির নিঃশ্বাস ফেলল।" },
    bad: { en: "Redis was fine. Redis is always fine. You just hurt its feelings.", bn: "রেডিস ঠিকই ছিল। রেডিস সবসময় ঠিক থাকে। আপনি শুধু ওর মন খারাপ করলেন।" },
  },
  "check-dns": {
    emoji: "🌐",
    label: { en: "Check DNS", bn: "ডিএনএস দেখো" },
    good: { en: "It's always DNS. This time it was actually DNS. Kind of.", bn: "সবসময় ডিএনএস-ই হয়। এবার আসলেই ডিএনএস। কিছুটা।" },
    bad: { en: "It's always DNS. Except today. Today it's not DNS.", bn: "সবসময় ডিএনএস-ই হয়। আজ ছাড়া। আজ ডিএনএস না।" },
  },
  "clear-cache": {
    emoji: "🧹",
    label: { en: "Clear cache", bn: "ক্যাশ ক্লিয়ার" },
    good: { en: "Cache cleared. Something changed. You don't know what.", bn: "ক্যাশ ক্লিয়ার। কিছু একটা বদলেছে। কী, জানেন না।" },
    bad: { en: "Cache cleared. Everything is now slower and exactly as broken.", bn: "ক্যাশ ক্লিয়ার। সব এখন ধীর আর ঠিক আগের মতোই ভাঙা।" },
  },
  "blame-frontend": {
    emoji: "🎨",
    label: { en: "Blame frontend", bn: "ফ্রন্টএন্ডের দোষ দাও" },
    good: { en: "You feel better. Nothing is fixed.", bn: "মনটা হালকা হলো। কিছুই ঠিক হয়নি।" },
    bad: { en: "Frontend replied with a screenshot proving it's not them. Oof.", bn: "ফ্রন্টএন্ড স্ক্রিনশট দিয়ে প্রমাণ করল তাদের দোষ না। উফ।" },
  },
  "blame-backend": {
    emoji: "⚙️",
    label: { en: "Blame backend", bn: "ব্যাকএন্ডের দোষ দাও" },
    good: { en: "Therapeutic. Unproductive. Therapeutic.", bn: "মনের শান্তি। কাজের না। মনের শান্তি।" },
    bad: { en: "You are the backend. You just blamed yourself.", bn: "ব্যাকএন্ড তো আপনিই। নিজেকেই দোষ দিলেন।" },
  },
  "ask-ai": {
    emoji: "🤖",
    label: { en: "Ask AI", bn: "এআই-কে জিজ্ঞেস করো" },
    good: { en: "The AI found it in 3 seconds and politely didn't judge you.", bn: "এআই ৩ সেকেন্ডে খুঁজে দিল, আর ভদ্রভাবে আপনাকে বিচার করল না।" },
    bad: { en: "The AI confidently suggested a setting that has never existed.", bn: "এআই আত্মবিশ্বাসের সাথে এমন একটা সেটিং বলল যেটা কখনো ছিলই না।" },
  },
  "deploy-again": {
    emoji: "🚀",
    label: { en: "Deploy again", bn: "আবার ডিপ্লয়" },
    good: { en: "Green checkmark. You refresh 11 times to be sure.", bn: "সবুজ টিক চিহ্ন। নিশ্চিত হতে ১১ বার রিফ্রেশ দিলেন।" },
    bad: { en: "Red. Again. The pipeline is judging you.", bn: "লাল। আবার। পাইপলাইন আপনাকে বিচার করছে।" },
  },
  "works-on-my-machine": {
    emoji: "💻",
    label: { en: "“It works on my machine”", bn: "“আমার মেশিনে তো চলে”" },
    good: { en: "…and now it works on production too. Nobody questions it.", bn: "…আর এখন প্রোডাকশনেও চলছে। কেউ প্রশ্ন করেনি।" },
    bad: { en: "You typed it in the group chat and closed the laptop.", bn: "গ্রুপ চ্যাটে লিখে ল্যাপটপ বন্ধ করে দিলেন।" },
  },
  rollback: {
    emoji: "⏪",
    label: { en: "Roll back", bn: "রোলব্যাক করো" },
    good: { en: "Back to yesterday's version. Yesterday was a simpler time.", bn: "গতকালের ভার্সনে ফেরত। গতকাল সহজ সময় ছিল।" },
    bad: { en: "Back to yesterday's version. Yesterday was a simpler time.", bn: "গতকালের ভার্সনে ফেরত। গতকাল সহজ সময় ছিল।" },
  },
};

export const events: Record<EventId, Text> = {
  "env-missing": { en: "🔑 NEW: an environment variable just vanished!", bn: "🔑 নতুন: একটা এনভায়রনমেন্ট ভ্যারিয়েবল উধাও!" },
  "port-in-use": { en: "🚪 NEW: port already in use!", bn: "🚪 নতুন: পোর্ট আগে থেকেই দখল!" },
  "container-loop": { en: "🐳 NEW: a container is restarting in a loop!", bn: "🐳 নতুন: কন্টেইনার বারবার রিস্টার্ট হচ্ছে!" },
  ssl: { en: "🔒 NEW: SSL certificate problem!", bn: "🔒 নতুন: এসএসএল সার্টিফিকেটের ঝামেলা!" },
  "db-refused": { en: "🗄️ NEW: database connection refused!", bn: "🗄️ নতুন: ডেটাবেস কানেকশন রিফিউজড!" },
  typo: { en: "✏️ NEW: someone found one tiny typo. It was you.", bn: "✏️ নতুন: একটা ছোট্ট টাইপো পাওয়া গেছে। আপনারই।" },
  "suddenly-works": { en: "✨ Everything suddenly works. Don't touch anything.", bn: "✨ হঠাৎ সব চলছে। কিছু ধরবেন না।" },
};

export const endings: Record<EndingId, { emoji: string; title: Text; blurb: Text; accent: Accent }> = {
  success: {
    emoji: "✅",
    title: { en: "Successful Deployment", bn: "সফল ডিপ্লয়মেন্ট" },
    blurb: { en: "It's live. It works. You will not touch it again until Monday.", bn: "লাইভ। চলছে। সোমবারের আগে আর হাত দেবেন না।" },
    accent: "lime",
  },
  "legendary-3am": {
    emoji: "🌙",
    title: { en: "Legendary 3 AM Fix", bn: "কিংবদন্তি রাত ৩টার ফিক্স" },
    blurb: { en: "Fixed at 3 AM, alone, with cold coffee. Nobody will ever know how you did it. Including you.", bn: "রাত ৩টায় একা, ঠান্ডা কফি হাতে ফিক্স। কীভাবে করলেন কেউ জানবে না। আপনিও না।" },
    accent: "violet",
  },
  rollback: {
    emoji: "⏪",
    title: { en: "Rolled Back", bn: "রোলব্যাক" },
    blurb: { en: "Production is safe. Your feature is not. See you tomorrow.", bn: "প্রোডাকশন নিরাপদ। আপনার ফিচার না। কাল দেখা হবে।" },
    accent: "sky",
  },
  "friday-disaster": {
    emoji: "🔥",
    title: { en: "Friday Production Disaster", bn: "শুক্রবারের প্রোডাকশন বিপর্যয়" },
    blurb: { en: "You deployed on a Friday. The weekend is cancelled. The group chat is on fire.", bn: "শুক্রবারে ডিপ্লয় করেছেন। উইকেন্ড বাতিল। গ্রুপ চ্যাটে আগুন।" },
    accent: "chili",
  },
  "works-on-my-machine": {
    emoji: "💻",
    title: { en: "“Works on My Machine”", bn: "“আমার মেশিনে তো চলে”" },
    blurb: { en: "Technically true. Production disagrees. Your laptop is now the production server.", bn: "টেকনিক্যালি সত্য। প্রোডাকশন একমত না। আপনার ল্যাপটপই এখন প্রোডাকশন সার্ভার।" },
    accent: "marigold",
  },
  "rage-quit": {
    emoji: "🫠",
    title: { en: "Laptop Closed Forever", bn: "ল্যাপটপ চিরতরে বন্ধ" },
    blurb: { en: "Rage level 100. You are now considering a career in farming.", bn: "রেজ লেভেল ১০০। এখন কৃষিকাজে ক্যারিয়ারের কথা ভাবছেন।" },
    accent: "tangerine",
  },
};

/** Titles by score (lib rankFor). Never rename ids. */
export const ranks: Record<RankId, { emoji: string; title: Text }> = {
  "ten-x": { emoji: "🧙", title: { en: "Mythical 10x Developer", bn: "কিংবদন্তি ১০x ডেভেলপার" } },
  "senior-firefighter": { emoji: "🧯", title: { en: "Senior Production Firefighter", bn: "সিনিয়র প্রোডাকশন ফায়ারফাইটার" } },
  "stack-overflow-scholar": { emoji: "📚", title: { en: "Copy-Paste Scholar", bn: "কপি-পেস্ট পণ্ডিত" } },
  "yaml-survivor": { emoji: "🧾", title: { en: "YAML Indentation Survivor", bn: "YAML ইনডেন্টেশন সারভাইভার" } },
  "intern-with-prod-access": { emoji: "🐣", title: { en: "Intern With Production Access", bn: "প্রোডাকশন অ্যাক্সেসওয়ালা ইন্টার্ন" } },
};

export const rageCopy = {
  intro: {
    en: "You're about to deploy to production. What could possibly go wrong? Pick your moves, survive the night, ship it.",
    bn: "প্রোডাকশনে ডিপ্লয় করতে যাচ্ছেন। কী আর ভুল হতে পারে? চাল বাছুন, রাত পার করুন, শিপ করুন।",
  },
  disclaimer: { en: "Fictional comedy — no real commands, no real servers were harmed.", bn: "কাল্পনিক কমেডি — কোনো আসল কমান্ড নেই, কোনো আসল সার্ভারের ক্ষতি হয়নি।" },
  newIncident: { en: "🚀 PRESS DEPLOY", bn: "🚀 ডিপ্লয় চাপো" },
  best: { en: "Best score", bn: "সেরা স্কোর" },
  ticketTitle: { en: "Deploy ticket", bn: "ডিপ্লয় টিকিট" },
  day: { en: "Day", bn: "দিন" },
  friday: { en: "Friday 😬", bn: "শুক্রবার 😬" },
  weekday: { en: "Wednesday", bn: "বুধবার" },
  clock: { en: "Clock", bn: "সময়" },
  status: { en: "Status", bn: "স্ট্যাটাস" },
  statusBroken: { en: "🔴 Deploy failed", bn: "🔴 ডিপ্লয় ফেইল" },
  start: { en: "🛠️ START DEBUGGING", bn: "🛠️ ডিবাগিং শুরু" },
  another: { en: "Try a different deploy", bn: "অন্য একটা ডিপ্লয়" },
  turn: { en: "Move {n} of {total}", bn: "চাল {n} / {total}" },
  progress: { en: "Debug progress", bn: "ডিবাগ অগ্রগতি" },
  rage: { en: "Rage", bn: "রাগ" },
  coffee: { en: "Coffee", bn: "কফি" },
  unknown: { en: "Root cause: ??? (check the logs)", bn: "মূল কারণ: ??? (লগ দেখুন)" },
  rootCause: { en: "Root cause: {cause}", bn: "মূল কারণ: {cause}" },
  whatNow: { en: "What do you do?", bn: "এখন কী করবেন?" },
  next: { en: "NEXT →", bn: "পরেরটা →" },
  finish: { en: "SEE RESULT →", bn: "রেজাল্ট দেখো →" },
  luckyWin: { en: "🍀 It worked!", bn: "🍀 কাজ করেছে!" },
  luckyLose: { en: "💥 Nope.", bn: "💥 হয়নি।" },
  score: { en: "💻 DEPLOY SCORE", bn: "💻 ডিপ্লয় স্কোর" },
  pts: { en: "pts", bn: "পয়েন্ট" },
  statRage: { en: "🔥 Rage level", bn: "🔥 রাগের মাত্রা" },
  statSkill: { en: "💻 Debugging skill", bn: "💻 ডিবাগিং দক্ষতা" },
  statTime: { en: "⏱️ Time lost", bn: "⏱️ সময় নষ্ট" },
  statCoffee: { en: "☕ Coffees", bn: "☕ কফি" },
  hm: { en: "{h}h {m}m", bn: "{h}ঘ {m}মি" },
  cause: { en: "It was {cause}.", bn: "আসলে ছিল {cause}।" },
  rankLabel: { en: "🎖️ Rank", bn: "🎖️ র‍্যাঙ্ক" },
  legendary: { en: "✨ LEGENDARY", bn: "✨ কিংবদন্তি" },
  newBest: { en: "🎉 New best score!", bn: "🎉 নতুন সেরা স্কোর!" },
  code: { en: "Incident code", bn: "ইনসিডেন্ট কোড" },
  retry: { en: "↺ RETRY THIS DEPLOY", bn: "↺ এই ডিপ্লয়টাই আবার" },
  newRun: { en: "🚀 NEW DEPLOY", bn: "🚀 নতুন ডিপ্লয়" },
  shareResult: { en: "SHARE RESULT", bn: "রেজাল্ট শেয়ার করো" },
  anotherExp: { en: "Try another experience →", bn: "আরেকটা এক্সপেরিয়েন্স →" },
  shareText: {
    en: "My deploy: {ending}. Rage {rage}%, {coffee} coffees, {score} pts — “{title}” {emoji}. Same incident, can you ship it faster?",
    bn: "আমার ডিপ্লয়: {ending}। রাগ {rage}%, {coffee} কাপ কফি, {score} পয়েন্ট — “{title}” {emoji}। একই ইনসিডেন্ট, তুমি দ্রুত শিপ করতে পারবে?",
  },
} satisfies Record<string, Text>;
