import type { Experience, RunContext } from "@/lib/experience/types";

// Shipped ids are permanent (share links store them). See AGENTS.md.

const style = (c: RunContext) => c.choices.style ?? "";
const reason = (c: RunContext) => c.choices.reason ?? "";
const notice = (c: RunContext) => c.choices.notice ?? "";
const boss = (c: RunContext) => c.beats.boss ?? "";
const hr = (c: RunContext) => c.beats.hr ?? "";

const BOSS = { en: "Boss", bn: "বস" };
const EMPLOYED = { en: "Still employed", bn: "এখনো চাকরিতে" };
const FREE = { en: "Free", bn: "মুক্ত" };

export const jobResignation: Experience = {
  slug: "job-resignation-simulator",
  title: { en: "Job Resignation Simulator", bn: "চাকরি ছাড়ার সিমুলেটর" },
  tagline: { en: "Quit dramatically. Your boss replies \"ok\".", bn: "নাটকীয়ভাবে রিজাইন দিন। বস লিখলেন \"ok\"।" },
  description: {
    en: "Choose how you quit, give your reason, survive the boss and HR. Freedom is one resignation letter away. Allegedly.",
    bn: "কীভাবে রিজাইন দেবেন, কেন দেবেন বেছে নিন, তারপর বস আর HR সামলান। মুক্তি মাত্র একটা রিজাইন লেটার দূরে। বলা হয় আর কি।",
  },
  startLabel: { en: "Write the resignation ✍️", bn: "রিজাইন লেটার লিখুন ✍️" },
  category: "work",
  tags: ["office"],
  emoji: "💼",
  durationSec: 60,
  accent: "violet",
  seo: {
    title: "Job Resignation Simulator — Quit Your Job (Safely, Online)",
    description:
      "A free, funny one-minute resignation simulator. Pick how you quit, face your boss and HR, and see how your last day really goes. Share your ending.",
  },
  steps: [
    {
      kind: "choice",
      id: "style",
      prompt: { en: "How do you quit?", bn: "কীভাবে রিজাইন দেবেন?" },
      cardLabel: { en: "Method", bn: "পদ্ধতি" },
      options: [
        { id: "email", emoji: "📧", label: { en: "A polite email", bn: "ভদ্র একটা ইমেইল" }, hint: { en: "\"Dear Sir, with due respect…\"", bn: "\"বিনীত নিবেদন এই যে…\"" } },
        { id: "speech", emoji: "🎤", label: { en: "A dramatic speech in the meeting", bn: "মিটিংয়ে নাটকীয় ভাষণ" }, hint: { en: "You've rehearsed in the shower.", bn: "গোসলের সময় রিহার্সাল করেছেন।" } },
        { id: "whatsapp", emoji: "📱", label: { en: "A WhatsApp message at 2 AM", bn: "রাত ২টায় হোয়াটসঅ্যাপ মেসেজ" }, hint: { en: "Courage peaks after midnight.", bn: "মাঝরাতে সাহস সবচেয়ে বেশি।" } },
        { id: "ghost", emoji: "👻", label: { en: "Just stop showing up", bn: "অফিসে যাওয়াই বন্ধ" }, hint: { en: "Not recommended. Very tempting.", bn: "সুপারিশ করা হয় না। খুব লোভনীয়।" } },
      ],
    },
    {
      kind: "choice",
      id: "reason",
      prompt: { en: "What's the reason?", bn: "কারণটা কী?" },
      cardLabel: { en: "Reason", bn: "কারণ" },
      options: [
        { id: "offer", emoji: "💼", label: { en: "Got a better offer", bn: "ভালো অফার পেয়েছি" } },
        { id: "startup", emoji: "🚀", label: { en: "Starting my own startup", bn: "নিজের স্টার্টআপ শুরু করব" } },
        { id: "village", emoji: "🌾", label: { en: "Moving to the village to farm", bn: "গ্রামে গিয়ে চাষ করব" } },
        { id: "vibes", emoji: "✨", label: { en: "No reason. Vibes.", bn: "কোনো কারণ নেই। ভাইব।" } },
      ],
    },
    {
      kind: "beat",
      id: "boss",
      title: { en: "The boss replies", bn: "বসের উত্তর" },
      beats: [
        { id: "ok", speaker: BOSS, text: "ok", weight: 3 },
        { id: "after-deadline", speaker: BOSS, text: { en: "Let's discuss this after the deadline.", bn: "ডেডলাইনের পরে এটা নিয়ে কথা বলি।" }, weight: 3 },
        { id: "one-last", speaker: BOSS, text: { en: "Sure. Just finish this one last project first.", bn: "ঠিক আছে। শুধু শেষ একটা প্রজেক্ট শেষ করে দাও।" }, weight: 3 },
        { id: "think", speaker: BOSS, text: { en: "Are you sure? Think about your career. And my deadline.", bn: "তুমি শিওর? ক্যারিয়ারের কথা ভাবো। আর আমার ডেডলাইনের কথাও।" }, weight: 2 },
        { id: "match", speaker: BOSS, text: { en: "We'll match the offer! (+৳500 per month)", bn: "আমরা অফার ম্যাচ করব! (মাসে +৳৫০০)" }, weight: (c) => (reason(c) === "offer" ? 6 : 0) },
      ],
    },
    {
      kind: "choice",
      id: "notice",
      prompt: { en: "Notice period?", bn: "নোটিশ পিরিয়ড?" },
      cardLabel: { en: "Notice", bn: "নোটিশ" },
      options: [
        { id: "full", emoji: "📅", label: { en: "Serve the full 3 months", bn: "পুরো ৩ মাস সার্ভ করব" }, hint: { en: "The most honourable prison sentence.", bn: "সবচেয়ে সম্মানজনক জেল।" } },
        { id: "negotiate", emoji: "🤝", label: { en: "Negotiate down to 1 month", bn: "দরদাম করে ১ মাস" }, hint: { en: "You've never won a negotiation. Today?", bn: "কখনো দরদামে জেতেননি। আজ?" } },
        { id: "today", emoji: "🚪", label: { en: "Leave today", bn: "আজই চলে যাব" }, hint: { en: "Your final settlement will remember this.", bn: "ফাইনাল সেটেলমেন্ট এটা মনে রাখবে।" } },
      ],
    },
    {
      kind: "beat",
      id: "hr",
      title: { en: "HR gets involved", bn: "HR মাঠে নামল" },
      beats: [
        { id: "form", emoji: "📑", weight: 3, text: { en: "HR sends a 14-page exit form. Question 9: \"Describe your childhood.\"", bn: "HR পাঠাল ১৪ পৃষ্ঠার এক্সিট ফর্ম। প্রশ্ন ৯: \"আপনার শৈশব বর্ণনা করুন।\"" } },
        { id: "interview", emoji: "🗓️", weight: 3, text: { en: "HR schedules your exit interview. For next year.", bn: "HR আপনার এক্সিট ইন্টারভিউ ঠিক করল। আগামী বছর।" } },
        { id: "cake", emoji: "🎂", weight: 2, text: { en: "Your farewell cake arrives. It says \"Congratulations on your promotion!\"", bn: "ফেয়ারওয়েল কেক এলো। লেখা \"প্রমোশনের জন্য অভিনন্দন!\"" } },
        { id: "silence", emoji: "🦗", weight: 2, text: { en: "HR does not reply. HR has never replied. Is there an HR?", bn: "HR উত্তর দেয় না। কখনো দেয়নি। আদৌ কি HR আছে?" } },
        { id: "smooth", emoji: "🟢", weight: 0.6, text: { en: "HR replies in 5 minutes with a clear checklist. You're scared.", bn: "HR ৫ মিনিটে পরিষ্কার চেকলিস্ট পাঠাল। আপনি ভয় পাচ্ছেন।" } },
      ],
    },
  ],
  outcomes: [
    {
      id: "boss-ok",
      emoji: "🙂",
      title: { en: "Boss Said \"ok\"", bn: "বস বললেন \"ok\"" },
      quote: "ok",
      message: { en: "Five years of work. Two letters. Not even a capital O. You feel free and slightly offended.", bn: "পাঁচ বছরের কাজ। দুইটা অক্ষর। বড় হাতের O-ও না। আপনি মুক্ত, আর একটু অপমানিত।" },
      card: [{ label: FREE, value: "✅" }, { label: { en: "Emotional closure", bn: "মানসিক শান্তি" }, value: "❌" }],
      shareText: { en: "Quit my job after years. Boss replied \"ok\" 🙂", bn: "বছরের পর বছর পর চাকরি ছাড়লাম। বস লিখলেন \"ok\" 🙂" },
      weight: (c) => (boss(c) === "ok" ? 6 : 0.5),
    },
    {
      id: "counter-offer",
      emoji: "💸",
      title: { en: "The ৳500 Counter-Offer", bn: "৳৫০০-এর কাউন্টার অফার" },
      quote: "এটা কিন্তু অনেক বড় ইনক্রিমেন্ট।",
      message: { en: "They matched your new offer with a ৳500 raise and a new title: \"Senior Associate Executive Officer (Acting)\".", bn: "নতুন অফারের জবাবে ৳৫০০ বেতন বাড়ানো আর নতুন পদবি: \"সিনিয়র অ্যাসোসিয়েট এক্সিকিউটিভ অফিসার (ভারপ্রাপ্ত)\"।" },
      card: [{ label: EMPLOYED, value: "🤡 ✅" }, { label: { en: "Raise", bn: "বেতন বৃদ্ধি" }, value: { en: "+৳500", bn: "+৳৫০০" } }],
      shareText: { en: "Tried to quit. Got a ৳500 raise and a longer job title 💸", bn: "চাকরি ছাড়তে চাইলাম। পেলাম ৳৫০০ বেশি আর লম্বা পদবি 💸" },
      weight: (c) => (boss(c) === "match" ? 7 : 0),
    },
    {
      id: "one-last-project",
      emoji: "📎",
      title: { en: "One Last Project", bn: "শেষ একটা প্রজেক্ট" },
      quote: "শুধু এইটা শেষ করে দাও।",
      message: { en: "It is now two years later. You are still finishing the last project. There have been four last projects.", bn: "এখন দুই বছর পর। আপনি এখনো শেষ প্রজেক্টটা শেষ করছেন। এর মধ্যে চারটা শেষ প্রজেক্ট হয়ে গেছে।" },
      card: [{ label: EMPLOYED, value: { en: "✅ (2 years later)", bn: "✅ (২ বছর পর)" } }],
      shareText: { en: "Resigned. Boss said 'finish one last project'. It's been two years 📎", bn: "রিজাইন দিলাম। বস বললেন 'শেষ একটা প্রজেক্ট'। দুই বছর হয়ে গেল 📎" },
      weight: (c) => (boss(c) === "one-last" ? 5 : 0) + (notice(c) === "full" ? 1.5 : 0),
    },
    {
      id: "exit-form",
      emoji: "📑",
      title: { en: "Lost in the Exit Form", bn: "এক্সিট ফর্মে হারিয়ে গেলেন" },
      quote: "পৃষ্ঠা ১৪-তে সই লাগবে। তিন কপি।",
      message: { en: "You filled 14 pages, got 9 signatures and found out page 1 was the wrong version. You still work there. Technically.", bn: "১৪ পৃষ্ঠা পূরণ করলেন, ৯টা সই নিলেন, তারপর জানলেন পৃষ্ঠা ১ ভুল ভার্সনের। আপনি এখনো ওখানেই কাজ করেন। টেকনিক্যালি।" },
      card: [{ label: { en: "Signatures", bn: "সই" }, value: { en: "9/10", bn: "৯/১০" } }, { label: FREE, value: "⏳" }],
      shareText: { en: "Tried to resign. Got lost in a 14-page exit form 📑", bn: "রিজাইন দিতে গিয়ে ১৪ পৃষ্ঠার এক্সিট ফর্মে হারিয়ে গেলাম 📑" },
      weight: (c) => (hr(c) === "form" ? 5 : 0) + (hr(c) === "interview" ? 3 : 0),
    },
    {
      id: "wrong-cake",
      emoji: "🎂",
      title: { en: "The Wrong Farewell Cake", bn: "ভুল ফেয়ারওয়েল কেক" },
      quote: "কেকটা তো মজাই, না?",
      message: { en: "Everyone ate the promotion cake. Your manager gave a speech about your promotion. You were promoted to unemployed.", bn: "সবাই প্রমোশনের কেক খেল। ম্যানেজার আপনার প্রমোশন নিয়ে বক্তৃতা দিলেন। আপনার প্রমোশন হলো — বেকারত্বে।" },
      card: [{ label: FREE, value: "✅" }, { label: { en: "Cake accuracy", bn: "কেকের নির্ভুলতা" }, value: "0%" }],
      shareText: { en: "My farewell cake said 'Congratulations on your promotion' 🎂", bn: "আমার ফেয়ারওয়েল কেকে লেখা ছিল 'প্রমোশনের জন্য অভিনন্দন' 🎂" },
      weight: (c) => (hr(c) === "cake" ? 6 : 0),
    },
    {
      id: "unnoticed",
      emoji: "👻",
      title: { en: "Nobody Noticed", bn: "কেউ খেয়ালই করল না" },
      quote: "টাইমশিট জমা দেননি কেন?",
      message: { en: "You stopped going. Three weeks later the only email you got was a reminder to submit your timesheet.", bn: "অফিসে যাওয়া বন্ধ করলেন। তিন সপ্তাহ পর একমাত্র ইমেইল এলো টাইমশিট জমা দেওয়ার রিমাইন্ডার।" },
      card: [{ label: { en: "Missed", bn: "মিস করেছে" }, value: "❌" }, { label: { en: "Timesheet reminders", bn: "টাইমশিট রিমাইন্ডার" }, value: { en: "3", bn: "৩" } }],
      shareText: { en: "Stopped going to work. Nobody noticed for three weeks 👻", bn: "অফিসে যাওয়া বন্ধ করলাম। তিন সপ্তাহ কেউ খেয়ালই করেনি 👻" },
      weight: (c) => (style(c) === "ghost" ? 6 : 0),
    },
    {
      id: "viral-speech",
      emoji: "🎤",
      title: { en: "Your Speech Went Viral", bn: "আপনার ভাষণ ভাইরাল" },
      quote: "আজ থেকে আমি মুক্ত!",
      message: { en: "An intern filmed your speech. It has 2 million views. Three companies want to hire you. Your mother wants an explanation.", bn: "এক ইন্টার্ন আপনার ভাষণ ভিডিও করেছে। ২০ লাখ ভিউ। তিনটা কোম্পানি আপনাকে নিতে চায়। আম্মু ব্যাখ্যা চান।" },
      card: [{ label: FREE, value: "✅" }, { label: { en: "Views", bn: "ভিউ" }, value: { en: "📈 2M", bn: "📈 ২০ লাখ" } }],
      shareText: { en: "Quit with a dramatic speech. It went viral 🎤", bn: "নাটকীয় ভাষণ দিয়ে চাকরি ছাড়লাম। ভিডিও ভাইরাল 🎤" },
      weight: (c) => (style(c) === "speech" ? 5 : 0),
    },
    {
      id: "family-group",
      emoji: "📱",
      title: { en: "Sent to the Family Group", bn: "ফ্যামিলি গ্রুপে চলে গেল" },
      quote: "বাবা, এসব কী লিখছিস?",
      message: { en: "Your 2 AM resignation went to the family WhatsApp group. Your uncle replied with a job offer. You now work for your uncle.", bn: "রাত ২টার রিজাইন মেসেজ চলে গেল ফ্যামিলি হোয়াটসঅ্যাপ গ্রুপে। মামা উত্তরে চাকরির অফার দিলেন। এখন আপনি মামার অফিসে কাজ করেন।" },
      card: [{ label: EMPLOYED, value: { en: "✅ (by your uncle)", bn: "✅ (মামার অফিসে)" } }],
      shareText: { en: "Sent my 2 AM resignation to the family group. Now I work for my uncle 📱", bn: "রাত ২টার রিজাইন মেসেজ ফ্যামিলি গ্রুপে পাঠালাম। এখন মামার অফিসে চাকরি করি 📱" },
      weight: (c) => (style(c) === "whatsapp" ? 5 : 0),
    },
    {
      id: "farmer",
      emoji: "🌾",
      title: { en: "You're a Farmer Now", bn: "আপনি এখন কৃষক" },
      quote: "মুরগিগুলারও মিটিং লাগে।",
      message: { en: "You moved to the village. Your chickens report to you. They have more meetings than your old team.", bn: "গ্রামে চলে গেলেন। এখন মুরগিরা আপনাকে রিপোর্ট করে। আপনার পুরনো টিমের চেয়েও ওদের মিটিং বেশি।" },
      card: [{ label: FREE, value: "✅" }, { label: { en: "Direct reports", bn: "অধীনস্থ" }, value: { en: "🐔 12", bn: "🐔 ১২" } }],
      shareText: { en: "Quit my job to farm. My chickens have more meetings than my old team 🌾", bn: "চাকরি ছেড়ে চাষ শুরু করলাম। আমার মুরগিদের মিটিং পুরনো টিমের চেয়েও বেশি 🌾" },
      weight: (c) => (reason(c) === "village" ? 5 : 0),
    },
    {
      id: "startup",
      emoji: "🚀",
      title: { en: "Startup Founder (Unpaid)", bn: "স্টার্টআপ ফাউন্ডার (বেতন নেই)" },
      quote: "আমরা এখন প্রি-রেভিনিউ।",
      message: { en: "Your startup is \"Uber for fuchka\". You have zero users, one logo and a LinkedIn post with 400 likes.", bn: "আপনার স্টার্টআপ \"ফুচকার জন্য উবার\"। ইউজার শূন্য, লোগো একটা, আর লিংকডইন পোস্টে ৪০০ লাইক।" },
      card: [{ label: FREE, value: "✅" }, { label: { en: "Revenue", bn: "আয়" }, value: "৳0" }],
      shareText: { en: "Quit my job to start 'Uber for fuchka'. Revenue: ৳0 🚀", bn: "চাকরি ছেড়ে 'ফুচকার উবার' খুললাম। আয়: ৳০ 🚀" },
      weight: (c) => (reason(c) === "startup" ? 5 : 0),
    },
    {
      id: "clean-exit",
      emoji: "🏆",
      title: { en: "The Clean Exit", bn: "পরিচ্ছন্ন বিদায়" },
      quote: "আপনার সাথে কাজ করে ভালো লাগল।",
      message: { en: "Your boss thanked you. HR paid your final settlement on time. You got a good reference. This has never happened before.", bn: "বস ধন্যবাদ দিলেন। HR সময়মতো ফাইনাল সেটেলমেন্ট দিল। ভালো রেফারেন্সও পেলেন। এমন আগে কখনো হয়নি।" },
      card: [{ label: FREE, value: "✅" }, { label: { en: "Final settlement", bn: "ফাইনাল সেটেলমেন্ট" }, value: { en: "✅ on time (?!)", bn: "✅ সময়মতো (?!)" } }],
      shareText: { en: "Left my job and HR paid the final settlement on time. Legendary 🏆", bn: "চাকরি ছাড়লাম আর HR সময়মতো ফাইনাল সেটেলমেন্ট দিল। লেজেন্ডারি 🏆" },
      weight: (c) => 0.4 + (hr(c) === "smooth" ? 3 : 0) + (style(c) === "email" && notice(c) !== "today" ? 0.6 : 0),
    },
  ],
};
