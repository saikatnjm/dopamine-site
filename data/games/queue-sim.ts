// Copy for the Queue Simulator (EN + BN). Rules: lib/games/queue-sim.ts (same ids).
// Placeholders: {place} {counter}. Humor targets queue situations, never people.

import type { Accent } from "@/components/ui/styles";
import type { Text } from "@/lib/i18n/core";
import type { EndingId, EventId, PlaceId, RankId } from "@/lib/games/queue-sim";

export const places: Record<PlaceId, { emoji: string; name: Text; counter: Text }> = {
  bank: { emoji: "🏦", name: { en: "the bank", bn: "ব্যাংক" }, counter: { en: "cash counter", bn: "ক্যাশ কাউন্টার" } },
  "bus-counter": { emoji: "🚌", name: { en: "the bus ticket counter", bn: "বাসের টিকিট কাউন্টার" }, counter: { en: "ticket window", bn: "টিকিট জানালা" } },
  "bill-office": { emoji: "💡", name: { en: "the electricity bill office", bn: "বিদ্যুৎ বিল অফিস" }, counter: { en: "bill desk", bn: "বিল ডেস্ক" } },
  "phone-launch": { emoji: "📱", name: { en: "a new phone launch", bn: "নতুন ফোনের লঞ্চ" }, counter: { en: "pickup desk", bn: "পিকআপ ডেস্ক" } },
  cinema: { emoji: "🎬", name: { en: "the cinema, on release day", bn: "মুক্তির দিনের সিনেমা হল" }, counter: { en: "ticket booth", bn: "টিকিট বুথ" } },
};

export type ChoiceCopy = { label: Text; result: Text } | { label: Text; win: Text; lose: Text };
export type EventCopy = { emoji: string; text: Text; choices: [ChoiceCopy, ChoiceCopy, ChoiceCopy] };

export const events: Record<EventId, EventCopy> = {
  "one-item": {
    emoji: "🛍️",
    text: { en: "Someone behind you taps your shoulder: “ভাই আমি শুধু একটা জিনিস নিবো।” (Bhai, just one thing.)", bn: "পেছন থেকে কেউ কাঁধে টোকা দিল: “ভাই আমি শুধু একটা জিনিস নিবো।”" },
    choices: [
      {
        label: { en: "“Sure, go ahead.”", bn: "“আচ্ছা, যান।”" },
        result: { en: "He had 17 items. And a question for each one.", bn: "ওনার হাতে ১৭টা জিনিস। আর প্রতিটার জন্য একটা করে প্রশ্ন।" },
      },
      { label: { en: "“Sorry bhai, line is line.”", bn: "“সরি ভাই, লাইন তো লাইন।”" }, result: { en: "He sighed dramatically. You held your ground.", bn: "উনি নাটকীয় দীর্ঘশ্বাস ফেললেন। আপনি জায়গা ছাড়েননি।" } },
      {
        label: { en: "“Show me the one thing first.”", bn: "“আগে একটা জিনিসটা দেখান।”" },
        win: { en: "Caught! There were 17 things in the bag. He went back. Line-cutter detected.", bn: "ধরা পড়েছে! ব্যাগে ১৭টা জিনিস। উনি পেছনে গেলেন। লাইন-কাটার শনাক্ত।" },
        lose: { en: "He showed one item. Then 16 more appeared from his pockets.", bn: "উনি একটা দেখালেন। তারপর পকেট থেকে আরও ১৬টা বেরোল।" },
      },
    ],
  },
  cutter: {
    emoji: "🥷",
    text: { en: "A man walks straight past the whole line and stands in front of you like it's normal.", bn: "একজন পুরো লাইন পাশ কাটিয়ে এসে আপনার সামনে দাঁড়িয়ে গেলেন, যেন এটাই স্বাভাবিক।" },
    choices: [
      {
        label: { en: "“Bhai, the line starts back there.”", bn: "“ভাই, লাইন ওই পেছন থেকে শুরু।”" },
        win: { en: "He pretended to be surprised and left. Detected!", bn: "উনি অবাক হওয়ার ভান করে চলে গেলেন। শনাক্ত!" },
        lose: { en: "“I was here before, I went to the washroom.” He stayed.", bn: "“আমি আগেই ছিলাম, ওয়াশরুমে গেছিলাম।” উনি রয়ে গেলেন।" },
      },
      { label: { en: "Say nothing. Suffer internally.", bn: "কিছু বলবেন না। ভেতরে ভেতরে কষ্ট পান।" }, result: { en: "Peaceful outside. Volcano inside.", bn: "বাইরে শান্ত। ভেতরে আগ্নেয়গিরি।" } },
      {
        label: { en: "Rally the queue: “লাইনে আসেন ভাই!”", bn: "পুরো লাইনকে ডাকুন: “লাইনে আসেন ভাই!”" },
        win: { en: "Twenty voices joined in. He walked to the back in shame.", bn: "বিশজন একসাথে গলা মেলাল। উনি লজ্জায় পেছনে চলে গেলেন।" },
        lose: { en: "Everyone started shouting about everything. It took a while.", bn: "সবাই সবকিছু নিয়ে চিৎকার শুরু করল। একটু সময় লাগল।" },
      },
    ],
  },
  "friend-call": {
    emoji: "📞",
    text: { en: "The person ahead waves at the gate: “দোস্ত, এদিকে আয়! আমার সামনে দাঁড়া।”", bn: "সামনের জন গেটের দিকে হাত নাড়ছেন: “দোস্ত, এদিকে আয়! আমার সামনে দাঁড়া।”" },
    choices: [
      {
        label: { en: "“Your friend can join at the back.”", bn: "“আপনার বন্ধু পেছনে দাঁড়াক।”" },
        win: { en: "The friend nodded and walked to the back. Detected!", bn: "বন্ধু মাথা নেড়ে পেছনে চলে গেলেন। শনাক্ত!" },
        lose: { en: "Two friends came. Both joined. Both ignored you.", bn: "দুজন বন্ধু এলেন। দুজনই ঢুকলেন। দুজনই আপনাকে পাত্তা দিলেন না।" },
      },
      { label: { en: "Let it go", bn: "ছেড়ে দিন" }, result: { en: "The friend brought a friend. Classic.", bn: "বন্ধু আরেক বন্ধু নিয়ে এল। ক্লাসিক।" } },
      {
        label: { en: "Call YOUR friend who's near the front", bn: "সামনের দিকে থাকা আপনার বন্ধুকে ফোন দিন" },
        win: { en: "Your friend waved you in. Nobody noticed. You feel slightly guilty.", bn: "বন্ধু হাত নেড়ে ডেকে নিল। কেউ খেয়াল করেনি। একটু অপরাধবোধ হচ্ছে।" },
        lose: { en: "Everyone noticed. You were sent further back. Justice.", bn: "সবাই খেয়াল করেছে। আপনাকে আরও পেছনে পাঠানো হলো। ন্যায়বিচার।" },
      },
    ],
  },
  "counter-closes": {
    emoji: "🚫",
    text: { en: "A sign appears on one {counter}: “বন্ধ”. The staff member leaves with a flask of tea.", bn: "একটা {counter}-এ নোটিশ: “বন্ধ”। কর্মী চায়ের ফ্লাস্ক নিয়ে চলে গেলেন।" },
    choices: [
      { label: { en: "Stay in your line", bn: "নিজের লাইনেই থাকুন" }, result: { en: "Two lines became one. Very cosy.", bn: "দুই লাইন এক হয়ে গেল। বেশ ঘনিষ্ঠ।" } },
      {
        label: { en: "Run to the other line", bn: "অন্য লাইনে দৌড় দিন" },
        win: { en: "You got in early. Several people are now behind you. Smart.", bn: "আগেভাগে ঢুকে গেছেন। এখন অনেকে আপনার পেছনে। বুদ্ধিমান।" },
        lose: { en: "Everyone ran. You ended up further back — and was this even the right line?", bn: "সবাই দৌড়াল। আপনি আরও পেছনে — আর এটা আদৌ ঠিক লাইন তো?" },
      },
      {
        label: { en: "Politely ask for the counter to stay open", bn: "ভদ্রভাবে কাউন্টার খোলা রাখার অনুরোধ করুন" },
        win: { en: "Miracle: they came back. With the tea.", bn: "অলৌকিক: উনি ফিরে এসেছেন। চা-সহ।" },
        lose: { en: "“Lunch time, bhai.” It is 11:15.", bn: "“লাঞ্চ টাইম, ভাই।” এখন ১১টা ১৫।" },
      },
    ],
  },
  "hold-place": {
    emoji: "🙏",
    text: { en: "The person in front: “Bhai, can you hold my place? Five minutes.”", bn: "সামনের জন: “ভাই, আমার জায়গাটা একটু রাখবেন? পাঁচ মিনিট।”" },
    choices: [
      {
        label: { en: "“Of course.”", bn: "“অবশ্যই।”" },
        result: { en: "They came back with three cousins. All with “just one thing”.", bn: "উনি ফিরলেন তিনজন কাজিন নিয়ে। সবার “শুধু একটা জিনিস”।" },
      },
      { label: { en: "“Sorry, I can't promise.”", bn: "“সরি, কথা দিতে পারছি না।”" }, result: { en: "They stayed. Eye contact was avoided for the rest of the queue.", bn: "উনি থেকে গেলেন। বাকি সময় কেউ কারো দিকে তাকাননি।" } },
      {
        label: { en: "Agree… then quietly step into their spot", bn: "রাজি হন… তারপর চুপচাপ ওনার জায়গায় ঢুকে যান" },
        win: { en: "They never came back. You moved up. Nobody saw anything.", bn: "উনি আর ফেরেননি। আপনি এগিয়ে গেলেন। কেউ কিছু দেখেনি।" },
        lose: { en: "They came back in 30 seconds. It was awkward. Very awkward.", bn: "উনি ৩০ সেকেন্ডেই ফিরে এলেন। অস্বস্তিকর। খুবই অস্বস্তিকর।" },
      },
    ],
  },
  "queue-jumps": {
    emoji: "🏃",
    text: { en: "Out of nowhere the whole queue lurches forward. You were looking at your phone.", bn: "হঠাৎ পুরো লাইন হুড়মুড় করে সামনে এগিয়ে গেল। আপনি ফোনে তাকিয়ে ছিলেন।" },
    choices: [
      { label: { en: "Keep scrolling. It's fine.", bn: "স্ক্রল করতে থাকুন। সমস্যা নেই।" }, result: { en: "It was not fine. Someone slid into the gap.", bn: "সমস্যা ছিল। কেউ ফাঁকে ঢুকে গেছে।" } },
      { label: { en: "Step up quickly", bn: "দ্রুত সামনে যান" }, result: { en: "Reflexes of a Dhaka commuter. Two places gained.", bn: "ঢাকার যাত্রীর রিফ্লেক্স। দুই জায়গা এগোলেন।" } },
      {
        label: { en: "Big confident stride past two people", bn: "আত্মবিশ্বাসী লম্বা পা ফেলে দুজনকে পাশ কাটান" },
        win: { en: "Nobody questioned it. Confidence is everything.", bn: "কেউ প্রশ্ন করেনি। আত্মবিশ্বাসই সব।" },
        lose: { en: "“Ei je, line-e ashen!” You were marched back.", bn: "“এই যে, লাইনে আসেন!” আপনাকে পেছনে পাঠানো হলো।" },
      },
    ],
  },
  argument: {
    emoji: "🗣️",
    text: { en: "The person at the {counter} starts arguing about a form. Loudly. With everyone.", bn: "{counter}-এ একজন একটা ফর্ম নিয়ে তর্ক শুরু করেছেন। জোরে। সবার সাথে।" },
    choices: [
      { label: { en: "Wait it out", bn: "অপেক্ষা করুন" }, result: { en: "Eight minutes of debate. No winner.", bn: "আট মিনিটের বিতর্ক। কেউ জেতেনি।" } },
      {
        label: { en: "Step in and help with the form", bn: "এগিয়ে গিয়ে ফর্মে সাহায্য করুন" },
        win: { en: "You found the missing signature. The queue applauds you.", bn: "হারানো সইটা আপনি খুঁজে দিলেন। পুরো লাইন তালি দিল।" },
        lose: { en: "Now you are also part of the argument.", bn: "এখন আপনিও তর্কের অংশ।" },
      },
      { label: { en: "Film it for the family group chat", bn: "ফ্যামিলি গ্রুপের জন্য ভিডিও করুন" }, result: { en: "Slow, but entertaining. Your aunt replied “🤣”.", bn: "ধীর, কিন্তু মজার। খালা লিখলেন “🤣”।" } },
    ],
  },
  "new-counter": {
    emoji: "✨",
    text: { en: "“New counter open!” Every head in the queue turns at once.", bn: "“নতুন কাউন্টার খোলা!” লাইনের সবার মাথা একসাথে ঘুরে গেল।" },
    choices: [
      {
        label: { en: "RUN.", bn: "দৌড়!" },
        win: { en: "You were first! Olympic-level queue sprint.", bn: "আপনিই প্রথম! অলিম্পিক মানের লাইন দৌড়।" },
        lose: { en: "Everyone ran. You tripped on a bag. New line, same position.", bn: "সবাই দৌড়াল। আপনি ব্যাগে হোঁচট খেলেন। নতুন লাইন, একই অবস্থান।" },
      },
      { label: { en: "Stay — let the others run", bn: "থাকুন — অন্যরা দৌড়াক" }, result: { en: "Half your line left. You moved up calmly.", bn: "আপনার লাইনের অর্ধেক চলে গেল। আপনি শান্তভাবে এগোলেন।" } },
      { label: { en: "Wait and see if it's real", bn: "দেখুন আসলেই খুলেছে কিনা" }, result: { en: "It was real. Mildly useful caution.", bn: "আসলেই খুলেছে। সতর্কতা কিছুটা কাজে লেগেছে।" } },
    ],
  },
  "two-minutes": {
    emoji: "⏳",
    text: { en: "The staff member stands up: “আর ২ মিনিট।” And disappears.", bn: "কর্মী উঠে দাঁড়ালেন: “আর ২ মিনিট।” তারপর উধাও।" },
    choices: [
      { label: { en: "Believe it", bn: "বিশ্বাস করুন" }, result: { en: "“2 minutes” lasted 11. As tradition demands.", bn: "“২ মিনিট” চলল ১১ মিনিট। প্রথা অনুযায়ী।" } },
      { label: { en: "“২ মিনিট মানে আসলে কত মিনিট?”", bn: "“২ মিনিট মানে আসলে কত মিনিট?”" }, result: { en: "Honest answer: “দেখি।” Slightly faster.", bn: "সৎ উত্তর: “দেখি।” একটু দ্রুত হলো।" } },
      {
        label: { en: "Go get a cha yourself", bn: "নিজেও এক কাপ চা খেয়ে আসুন" },
        win: { en: "Great cha. Your spot was still there. Patience restored.", bn: "দারুণ চা। জায়গাটাও ছিল। ধৈর্য ফিরে এসেছে।" },
        lose: { en: "Great cha. But someone is standing in your spot now.", bn: "দারুণ চা। কিন্তু এখন আপনার জায়গায় অন্য কেউ।" },
      },
    ],
  },
};

export const endings: Record<EndingId, { emoji: string; title: Text; blurb: Text; accent: Accent }> = {
  "front-legend": {
    emoji: "🏆",
    title: { en: "Front of the Line, Legendary", bn: "লাইনের সামনে, কিংবদন্তি হয়ে" },
    blurb: { en: "Fast, calm, and you caught the cutters. People will tell stories about this queue.", bn: "দ্রুত, শান্ত, আর লাইন-কাটারদের ধরেছেন। এই লাইনের গল্প মানুষ বলবে।" },
    accent: "marigold",
  },
  front: {
    emoji: "✅",
    title: { en: "You Reached the Counter!", bn: "কাউন্টারে পৌঁছে গেছেন!" },
    blurb: { en: "It took a while, but it's your turn. Try not to forget why you came.", bn: "সময় লাগলো, কিন্তু এখন আপনার পালা। কেন এসেছিলেন, ভুলে যাবেন না।" },
    accent: "lime",
  },
  "front-closed": {
    emoji: "🍱",
    title: { en: "Front of the Line… Lunch Break", bn: "লাইনের সামনে… লাঞ্চ ব্রেক" },
    blurb: { en: "You made it to the front just as the window slid shut. “Come after 2:30.”", bn: "সামনে পৌঁছাতেই জানালা বন্ধ। “আড়াইটার পর আসেন।”" },
    accent: "tangerine",
  },
  "wrong-queue": {
    emoji: "🙃",
    title: { en: "Wrong Queue", bn: "ভুল লাইন" },
    blurb: { en: "You reached the front. Of the wrong queue. This one is for something else entirely.", bn: "সামনে পৌঁছেছেন। ভুল লাইনের। এটা একদম অন্য কাজের লাইন।" },
    accent: "violet",
  },
  "gave-up": {
    emoji: "💥",
    title: { en: "Patience Destroyed", bn: "ধৈর্য ধ্বংস" },
    blurb: { en: "You walked out. Somewhere behind you, the queue quietly moved forward.", bn: "আপনি বেরিয়ে গেলেন। পেছনে লাইনটা চুপচাপ সামনে এগিয়ে গেল।" },
    accent: "chili",
  },
  "still-waiting": {
    emoji: "🧍",
    title: { en: "Still Waiting…", bn: "এখনো অপেক্ষায়…" },
    blurb: { en: "You are still in the line. You may always be in the line. The line is life.", bn: "আপনি এখনো লাইনে। হয়তো সারাজীবন লাইনেই থাকবেন। লাইনই জীবন।" },
    accent: "sky",
  },
};

/** Final titles (lib rankOf). Never rename ids. */
export const ranks: Record<RankId, { emoji: string; title: Text }> = {
  "queue-legend": { emoji: "👑", title: { en: "Bangladesh Queue Survivor — Legend Edition", bn: "বাংলাদেশ কিউ সারভাইভার — কিংবদন্তি সংস্করণ" } },
  "cutter-detector": { emoji: "🕵️", title: { en: "Professional Line Cutter Detector", bn: "পেশাদার লাইন-কাটার শনাক্তকারী" } },
  "queue-veteran": { emoji: "🎖️", title: { en: "Queue Veteran", bn: "লাইনের প্রবীণ যোদ্ধা" } },
  "queue-survivor": { emoji: "🇧🇩", title: { en: "Bangladesh Queue Survivor", bn: "বাংলাদেশ কিউ সারভাইভার" } },
  "patience-destroyed": { emoji: "🫠", title: { en: "Patience Destroyed", bn: "ধৈর্য ধ্বংস" } },
};

export const queueCopy = {
  intro: {
    en: "You're in a Dhaka queue. Reach the front without losing your place — or your mind. Every choice matters. Some are gambles.",
    bn: "আপনি ঢাকার এক লাইনে। জায়গা না হারিয়ে — আর মাথা ঠিক রেখে — সামনে পৌঁছান। প্রতিটা সিদ্ধান্ত গুরুত্বপূর্ণ। কিছু সিদ্ধান্ত জুয়া।",
  },
  join: { en: "🧍 JOIN A QUEUE", bn: "🧍 লাইনে দাঁড়াও" },
  best: { en: "Best score", bn: "সেরা স্কোর" },
  queueTitle: { en: "Your queue", bn: "আপনার লাইন" },
  where: { en: "Where", bn: "কোথায়" },
  ahead: { en: "Ahead of you", bn: "আপনার সামনে" },
  counters: { en: "Open counters", bn: "খোলা কাউন্টার" },
  people: { en: "{n} people", bn: "{n} জন" },
  start: { en: "▶ START WAITING", bn: "▶ অপেক্ষা শুরু" },
  another: { en: "Pick a different queue", bn: "অন্য লাইন বাছুন" },
  round: { en: "Round {n} of {total}", bn: "রাউন্ড {n} / {total}" },
  patience: { en: "Patience", bn: "ধৈর্য" },
  waited: { en: "Waited", bn: "অপেক্ষা" },
  min: { en: "{n} min", bn: "{n} মিনিট" },
  you: { en: "YOU", bn: "আপনি" },
  served: { en: "The line moved: {n} served", bn: "লাইন এগোল: {n} জনের কাজ শেষ" },
  next: { en: "NEXT →", bn: "পরেরটা →" },
  finish: { en: "SEE RESULT →", bn: "রেজাল্ট দেখো →" },
  luckyWin: { en: "🍀 It worked!", bn: "🍀 কাজ হয়েছে!" },
  luckyLose: { en: "💥 Backfired!", bn: "💥 উল্টো হয়েছে!" },
  score: { en: "🏆 QUEUE SCORE", bn: "🏆 কিউ স্কোর" },
  pts: { en: "pts", bn: "পয়েন্ট" },
  statTime: { en: "⏱️ Waiting time", bn: "⏱️ অপেক্ষার সময়" },
  statSurvived: { en: "👥 People survived", bn: "👥 যাদের পেরিয়ে এলেন" },
  statPatience: { en: "🔥 Patience left", bn: "🔥 বাকি ধৈর্য" },
  statCaught: { en: "🕵️ Cutters caught", bn: "🕵️ ধরা লাইন-কাটার" },
  rankLabel: { en: "🏆 Queue rank", bn: "🏆 লাইন র‍্যাঙ্ক" },
  legendary: { en: "✨ LEGENDARY", bn: "✨ কিংবদন্তি" },
  newBest: { en: "🎉 New best score!", bn: "🎉 নতুন সেরা স্কোর!" },
  queueCode: { en: "Queue code", bn: "লাইন কোড" },
  retry: { en: "↺ RETRY THIS QUEUE", bn: "↺ এই লাইনটাই আবার" },
  newRun: { en: "🧍 NEW QUEUE", bn: "🧍 নতুন লাইন" },
  shareResult: { en: "SHARE RESULT", bn: "রেজাল্ট শেয়ার করো" },
  anotherExp: { en: "Try another experience →", bn: "আরেকটা এক্সপেরিয়েন্স →" },
  shareText: {
    en: "I survived a Dhaka queue at {place}: {min} min, {survived} people outlasted, {score} pts — “{title}” {emoji}. Same queue, can you do better?",
    bn: "{place}-এর লাইনে টিকে গেলাম: {min} মিনিট, {survived} জনকে পেরিয়ে, {score} পয়েন্ট — “{title}” {emoji}। একই লাইন, তুমি পারবে?",
  },
} satisfies Record<string, Text>;
