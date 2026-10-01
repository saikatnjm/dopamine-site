import type { Experience, RunContext } from "@/lib/experience/types";

// Shipped ids are permanent (share links store them). See AGENTS.md.
// Landlord lines stay Bangla in both languages. Jokes target the situation,
// never a group of people.

const who = (c: RunContext) => c.choices.who ?? "";
const budget = (c: RunContext) => c.choices.budget ?? "";
const move = (c: RunContext) => c.choices.move ?? "";
const listing = (c: RunContext) => c.beats.listing ?? "";
const landlord = (c: RunContext) => c.beats.landlord ?? "";
const bachelor = (c: RunContext) => who(c) === "solo" || who(c) === "squad";

const LANDLORD = { en: "Landlord", bn: "বাড়িওয়ালা" };
const GOT_FLAT = { en: "Got the flat", bn: "বাসা পেলাম" };

export const houseRent: Experience = {
  slug: "house-rent-simulator",
  title: { en: "House Rent Simulator", bn: "বাসা ভাড়া সিমুলেটর" },
  tagline: { en: "Landlord interview: are you married? Do you breathe?", bn: "বাড়িওয়ালার ইন্টারভিউ: বিবাহিত? শ্বাস নেন?" },
  description: {
    en: "Find a flat in Dhaka: pick who's moving, set a budget, read the To-Let sign carefully and survive the landlord's rules. Keys not guaranteed.",
    bn: "ঢাকায় বাসা খুঁজুন: কে উঠবে ঠিক করুন, বাজেট দিন, টু-লেট সাইন মন দিয়ে পড়ুন আর বাড়িওয়ালার নিয়ম সামলান। চাবির গ্যারান্টি নেই।",
  },
  startLabel: { en: "Start house hunting 🔑", bn: "বাসা খোঁজা শুরু 🔑" },
  category: "bangladesh",
  tags: ["money", "haggling"],
  emoji: "🏠",
  durationSec: 60,
  accent: "lime",
  seo: {
    title: "House Rent Simulator — Can You Rent a Flat in Dhaka?",
    description:
      "A free, funny one-minute Dhaka house-hunting simulator. Read the To-Let sign, meet the landlord, negotiate the advance and share how it ends.",
  },
  steps: [
    {
      kind: "choice",
      id: "who",
      prompt: { en: "Who's moving in?", bn: "কে উঠবে?" },
      cardLabel: { en: "Tenant", bn: "ভাড়াটিয়া" },
      options: [
        { id: "solo", emoji: "🧑", label: { en: "Just me (bachelor)", bn: "শুধু আমি (ব্যাচেলর)" }, hint: { en: "Hard mode.", bn: "হার্ড মোড।" } },
        { id: "squad", emoji: "🎒", label: { en: "Four friends", bn: "চার বন্ধু" }, hint: { en: "Impossible mode.", bn: "ইম্পসিবল মোড।" } },
        { id: "couple", emoji: "💍", label: { en: "Newly married couple", bn: "নতুন বিবাহিত দম্পতি" }, hint: { en: "Bring the marriage certificate.", bn: "বিয়ের কাবিননামা সাথে রাখুন।" } },
        { id: "cat", emoji: "🐈", label: { en: "A small family + one cat", bn: "ছোট পরিবার + একটা বিড়াল" }, hint: { en: "The cat is the problem.", bn: "সমস্যা বিড়ালটা।" } },
      ],
    },
    {
      kind: "choice",
      id: "budget",
      prompt: { en: "Monthly budget?", bn: "মাসিক বাজেট?" },
      cardLabel: { en: "Budget", bn: "বাজেট" },
      options: [
        { id: "low", emoji: "🪙", label: { en: "৳8,000", bn: "৳৮,০০০" }, hint: { en: "For a dream. Or a storeroom.", bn: "স্বপ্নের জন্য। অথবা স্টোররুমের।" } },
        { id: "mid", emoji: "💵", label: { en: "৳15,000", bn: "৳১৫,০০০" }, hint: { en: "Reasonable. Allegedly.", bn: "যুক্তিসঙ্গত। শোনা যায়।" } },
        { id: "high", emoji: "💰", label: { en: "৳30,000", bn: "৳৩০,০০০" }, hint: { en: "Fancy. Still no lift.", bn: "বিলাসী। তবুও লিফট নেই।" } },
      ],
    },
    {
      kind: "beat",
      id: "listing",
      title: { en: "The To-Let sign", bn: "টু-লেট সাইন" },
      beats: [
        { id: "small-family", emoji: "🪧", weight: (c) => (bachelor(c) ? 4 : 2), text: { en: "\"To-Let: small family only.\" Nobody has ever defined small.", bn: "\"টু-লেট: শুধু ছোট পরিবার।\" ছোট মানে কী, কেউ কখনো বলেনি।" } },
        { id: "main-road", emoji: "🛣️", weight: 3, text: { en: "\"Near the main road.\" The main road is 2 km and three alleys away.", bn: "\"মেইন রোডের কাছে।\" মেইন রোড ২ কিমি আর তিনটা গলি দূরে।" } },
        { id: "photos", emoji: "📸", weight: 2, text: { en: "The listing photos show a bright, airy flat. They are photos of the flat next door.", bn: "বিজ্ঞাপনের ছবিতে আলো-বাতাসে ভরা বাসা। ছবিগুলো পাশের বাসার।" } },
        { id: "lift", emoji: "🛗", weight: 3, text: { en: "\"Lift available.\" The lift has been under construction since 2011. The flat is on the 7th floor.", bn: "\"লিফট আছে।\" লিফট ২০১১ সাল থেকে নির্মাণাধীন। বাসা ৭ তলায়।" } },
        { id: "perfect", emoji: "✨", weight: 0.6, text: { en: "Bright flat, working lift, gas line, and the photos are real. Something is wrong.", bn: "আলো-বাতাস, চালু লিফট, গ্যাস লাইন, আর ছবিগুলোও আসল। কিছু একটা গড়বড়।" } },
      ],
    },
    {
      kind: "beat",
      id: "landlord",
      title: { en: "The landlord's interview", bn: "বাড়িওয়ালার ইন্টারভিউ" },
      beats: [
        { id: "no-bachelor", speaker: LANDLORD, text: "ব্যাচেলর ভাড়া দিই না।", weight: (c) => (bachelor(c) ? 7 : 0) },
        { id: "gate", speaker: LANDLORD, text: "গেট রাত ১০টায় বন্ধ। ১০টা ১ মিনিটেও না।", weight: 3 },
        { id: "advance", speaker: LANDLORD, text: "অ্যাডভান্স ছয় মাসের। ফেরত? দেখা যাবে।", weight: 3 },
        { id: "water", speaker: LANDLORD, text: "পানি আসে সকাল ৬টা থেকে ৭টা। প্রতিদিন না।", weight: 2 },
        { id: "cat-no", speaker: LANDLORD, text: "বিড়াল? বিড়াল তো অ্যালাউড না…", weight: (c) => (who(c) === "cat" ? 7 : 0) },
      ],
    },
    {
      kind: "choice",
      id: "move",
      prompt: { en: "Your move?", bn: "আপনার সিদ্ধান্ত?" },
      cardLabel: { en: "Strategy", bn: "কৌশল" },
      options: [
        { id: "agree", emoji: "✅", label: { en: "Agree to everything", bn: "সব শর্তে রাজি" }, hint: { en: "Dignity is optional.", bn: "সম্মান ঐচ্ছিক।" } },
        { id: "negotiate", emoji: "🤝", label: { en: "Negotiate the advance", bn: "অ্যাডভান্স নিয়ে দরদাম" }, hint: { en: "Bold.", bn: "সাহসী।" } },
        { id: "gas", emoji: "🔥", label: { en: "Ask about the gas line", bn: "গ্যাস লাইনের কথা জিজ্ঞেস" }, hint: { en: "The forbidden question.", bn: "নিষিদ্ধ প্রশ্ন।" } },
        { id: "walk", emoji: "🚶", label: { en: "Walk away and keep searching", bn: "চলে গিয়ে আরও খোঁজা" }, hint: { en: "There are 400 more To-Let signs.", bn: "আরও ৪০০টা টু-লেট সাইন আছে।" } },
      ],
    },
  ],
  outcomes: [
    {
      id: "bachelor-denied",
      emoji: "🙅",
      title: { en: "Bachelor Denied", bn: "ব্যাচেলর নিষেধ" },
      quote: "ব্যাচেলর ভাড়া দিই না।",
      message: { en: "Rejected before you finished saying hello. You have now been rejected by 23 buildings. You're collecting them like stamps.", bn: "সালাম শেষ করার আগেই না। এ পর্যন্ত ২৩টা বিল্ডিং না করেছে। আপনি ডাকটিকিটের মতো জমাচ্ছেন।" },
      card: [{ label: GOT_FLAT, value: "❌" }, { label: { en: "Rejections", bn: "প্রত্যাখ্যান" }, value: { en: "23", bn: "২৩" } }],
      shareText: { en: "Tried to rent a flat in Dhaka as a bachelor. Rejection #23 🙅", bn: "ব্যাচেলর হিসেবে ঢাকায় বাসা খুঁজলাম। প্রত্যাখ্যান নম্বর ২৩ 🙅" },
      weight: (c) => (landlord(c) === "no-bachelor" ? 7 : 0),
    },
    {
      id: "curfew",
      emoji: "🕙",
      title: { en: "Curfew at 10 PM", bn: "রাত ১০টায় কারফিউ" },
      quote: "১০টা বাজে, গেট বন্ধ।",
      message: { en: "You got the flat. You also got a 10 PM curfew. Your social life now ends at 9:40 so you can make it home.", bn: "বাসা পেলেন। সাথে পেলেন রাত ১০টার কারফিউ। এখন আপনার সামাজিক জীবন শেষ হয় রাত ৯:৪০-এ, যাতে সময়মতো ফেরা যায়।" },
      card: [{ label: GOT_FLAT, value: "✅" }, { label: { en: "Curfew", bn: "কারফিউ" }, value: "🕙 10:00" }],
      shareText: { en: "Got a flat in Dhaka. Also got a 10 PM curfew 🕙", bn: "ঢাকায় বাসা পেলাম। সাথে রাত ১০টার কারফিউ 🕙" },
      weight: (c) => (landlord(c) === "gate" ? 4 : 0) + (move(c) === "agree" ? 1.5 : 0),
    },
    {
      id: "six-months",
      emoji: "💰",
      title: { en: "Six Months in Advance", bn: "ছয় মাসের অ্যাডভান্স" },
      quote: "অ্যাডভান্স ছাড়া তো হবে না।",
      message: { en: "You paid six months in advance. You now own nothing, but you have a key. The key doesn't fit the lock yet.", bn: "ছয় মাসের অ্যাডভান্স দিলেন। এখন আপনার কিছুই নেই, তবে একটা চাবি আছে। চাবিটা এখনো তালায় লাগে না।" },
      card: [{ label: GOT_FLAT, value: "✅" }, { label: { en: "Advance", bn: "অ্যাডভান্স" }, value: { en: "6 months", bn: "৬ মাস" } }],
      shareText: { en: "Rented a flat. Paid six months in advance. Wallet is on the 7th floor too 💰", bn: "বাসা নিলাম। ছয় মাসের অ্যাডভান্স দিলাম। মানিব্যাগ এখন শূন্য 💰" },
      weight: (c) => (landlord(c) === "advance" ? 4 : 0) + (move(c) === "negotiate" ? 2 : 0),
    },
    {
      id: "cat-approved",
      emoji: "🐈",
      title: { en: "Only the Cat Was Approved", bn: "শুধু বিড়াল পাস করল" },
      quote: "বিড়াল থাকতে পারে। আপনারা না।",
      message: { en: "The landlord met your cat and fell in love. The cat got the flat. You are negotiating visiting hours.", bn: "বাড়িওয়ালা বিড়ালকে দেখে প্রেমে পড়ে গেলেন। বাসা পেল বিড়াল। আপনি দেখা করার সময় নিয়ে দরদাম করছেন।" },
      card: [{ label: GOT_FLAT, value: { en: "🐈 (the cat did)", bn: "🐈 (বিড়াল পেয়েছে)" } }],
      shareText: { en: "Went house hunting in Dhaka. The landlord approved my cat, not me 🐈", bn: "বাসা খুঁজতে গেলাম। বাড়িওয়ালা বিড়ালকে পাস করালেন, আমাকে না 🐈" },
      weight: (c) => (landlord(c) === "cat-no" ? 6 : 0),
    },
    {
      id: "main-road",
      emoji: "🗺️",
      title: { en: "\"Near\" the Main Road", bn: "মেইন রোডের \"কাছে\"" },
      quote: "এই তো, একটু সামনেই।",
      message: { en: "You took the flat. Your daily walk to the main road is 25 minutes. You've lost 4 kg and all hope.", bn: "বাসা নিলেন। মেইন রোডে যেতে প্রতিদিন ২৫ মিনিট হাঁটা। ৪ কেজি কমেছে, আশাও।" },
      card: [{ label: GOT_FLAT, value: "✅" }, { label: { en: "Walk to main road", bn: "মেইন রোডে হাঁটা" }, value: { en: "25 min", bn: "২৫ মিনিট" } }],
      shareText: { en: "My flat is 'near the main road'. It's a 25-minute walk 🗺️", bn: "আমার বাসা 'মেইন রোডের কাছে'। হাঁটা পথে ২৫ মিনিট 🗺️" },
      weight: (c) => (listing(c) === "main-road" ? 4 : 0) + (move(c) === "agree" ? 0.5 : 0),
    },
    {
      id: "photos-next-door",
      emoji: "📸",
      title: { en: "The Photos Were Next Door", bn: "ছবিগুলো পাশের বাসার" },
      quote: "ছবি তো একই রকমই, না?",
      message: { en: "Your flat faces a wall. The wall faces another wall. The bright flat from the photos is next door. You wave at it.", bn: "আপনার বাসা একটা দেয়ালের দিকে মুখ করা। দেয়ালটা আরেকটা দেয়ালের দিকে। ছবির আলো-ঝলমলে বাসাটা পাশে। আপনি হাত নাড়েন।" },
      card: [{ label: GOT_FLAT, value: "✅" }, { label: { en: "Sunlight", bn: "রোদ" }, value: "❌" }],
      shareText: { en: "The flat in the ad photos was the one next door 📸", bn: "বিজ্ঞাপনের ছবির বাসাটা আসলে পাশের বাসা ছিল 📸" },
      weight: (c) => (listing(c) === "photos" ? 5 : 0),
    },
    {
      id: "no-lift",
      emoji: "🛗",
      title: { en: "Lift Coming Soon (Since 2011)", bn: "লিফট আসছে (২০১১ থেকে)" },
      quote: "লিফট এই বছরই চালু হবে।",
      message: { en: "Seven floors. Every day. Your legs are now your best feature. Delivery riders have stopped accepting your orders.", bn: "সাত তলা। প্রতিদিন। এখন আপনার পা-ই সবচেয়ে শক্তিশালী অঙ্গ। ডেলিভারি রাইডাররা আপনার অর্ডার নেওয়া বন্ধ করেছে।" },
      card: [{ label: GOT_FLAT, value: "✅" }, { label: { en: "Stairs per day", bn: "প্রতিদিনের সিঁড়ি" }, value: { en: "🦵 280", bn: "🦵 ২৮০" } }],
      shareText: { en: "Rented a 7th-floor flat. The lift has been 'coming soon' since 2011 🛗", bn: "৭ তলায় বাসা নিলাম। লিফট ২০১১ থেকে 'শিগগিরই আসছে' 🛗" },
      weight: (c) => (listing(c) === "lift" ? 4 : 0),
    },
    {
      id: "water-schedule",
      emoji: "🚿",
      title: { en: "Water: 6–7 AM Only", bn: "পানি: সকাল ৬–৭টা" },
      quote: "পানি ধইরা রাখবেন, বালতি আছে তো?",
      message: { en: "Your alarm is now set for 5:55 AM to fill buckets. You own 14 buckets. You've named them.", bn: "বালতি ভরার জন্য এখন অ্যালার্ম সকাল ৫:৫৫-তে। আপনার ১৪টা বালতি। সবগুলোর নাম দিয়েছেন।" },
      card: [{ label: GOT_FLAT, value: "✅" }, { label: { en: "Buckets owned", bn: "বালতি" }, value: { en: "🪣 14", bn: "🪣 ১৪" } }],
      shareText: { en: "New flat, water only 6–7 AM. I own 14 buckets now 🚿", bn: "নতুন বাসা, পানি শুধু সকাল ৬–৭টা। এখন আমার ১৪টা বালতি 🚿" },
      weight: (c) => (landlord(c) === "water" ? 5 : 0),
    },
    {
      id: "no-gas",
      emoji: "🔥",
      title: { en: "No Gas Line", bn: "গ্যাস লাইন নেই" },
      quote: "সিলিন্ডার আছে না? সমস্যা কী।",
      message: { en: "You asked about the gas line. The room went silent. The answer was a cylinder, and a look you'll never forget.", bn: "গ্যাস লাইনের কথা জিজ্ঞেস করলেন। রুম চুপ। উত্তর এলো একটা সিলিন্ডার, আর একটা চাহনি যা কখনো ভুলবেন না।" },
      card: [{ label: GOT_FLAT, value: "✅" }, { label: { en: "Gas line", bn: "গ্যাস লাইন" }, value: "❌ 🧯" }],
      shareText: { en: "Asked the landlord about the gas line. Big mistake 🔥", bn: "বাড়িওয়ালাকে গ্যাস লাইনের কথা জিজ্ঞেস করলাম। বড় ভুল 🔥" },
      weight: (c) => (move(c) === "gas" ? 5 : 0),
    },
    {
      id: "still-searching",
      emoji: "🔄",
      title: { en: "Still House Hunting", bn: "এখনো বাসা খুঁজছি" },
      quote: "টু-লেট… টু-লেট… টু-লেট…",
      message: { en: "You walked away. Then from the next one. And the next. You now know every To-Let sign in the city personally.", bn: "চলে এলেন। তারপর পরেরটা থেকেও। তারপর আরেকটা। শহরের প্রতিটা টু-লেট সাইন এখন আপনার ব্যক্তিগত পরিচিত।" },
      card: [{ label: GOT_FLAT, value: "⏳" }, { label: { en: "Flats visited", bn: "বাসা দেখা" }, value: { en: "37", bn: "৩৭" } }],
      shareText: { en: "Visited 37 flats in Dhaka. Still searching 🔄", bn: "ঢাকায় ৩৭টা বাসা দেখলাম। এখনো খুঁজছি 🔄" },
      weight: (c) => (move(c) === "walk" ? 5 : 0),
    },
    {
      id: "dream-flat",
      emoji: "🏆",
      title: { en: "The Dream Flat", bn: "স্বপ্নের বাসা" },
      quote: "যেকোনো দরকারে ফোন দিয়েন।",
      message: { en: "Good light, working lift, gas line, fair advance, and a friendly landlord. You signed before anyone could wake you up.", bn: "ভালো আলো, চালু লিফট, গ্যাস লাইন, ন্যায্য অ্যাডভান্স আর বন্ধুসুলভ বাড়িওয়ালা। কেউ ঘুম ভাঙানোর আগেই সই করে দিলেন।" },
      card: [{ label: GOT_FLAT, value: "✅" }, { label: { en: "Everything works", bn: "সব ঠিকঠাক" }, value: "✅ (?!)" }],
      shareText: { en: "Found the perfect flat in Dhaka. Pinch me 🏆", bn: "ঢাকায় পারফেক্ট বাসা পেয়ে গেছি। চিমটি কাটুন 🏆" },
      weight: (c) =>
        bachelor(c) && landlord(c) === "no-bachelor"
          ? 0
          : 0.3 + (listing(c) === "perfect" ? 3 : 0) + (budget(c) === "high" ? 0.5 : 0),
    },
  ],
};
