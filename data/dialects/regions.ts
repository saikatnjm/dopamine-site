import type { DialectRegion } from "@/lib/dialects/types";

// Dialect regions. APPEND-ONLY: a region's position is packed into quiz
// challenge seeds (lib/games/ancholik-quiz.ts), so never reorder or remove one.
// Districts are where each dialect is *mainly* spoken — borders are fuzzy
// (e.g. Habiganj leans towards Mymensingh speech, southern Cumilla towards
// Noakhali). Blurbs only state things the research sources say.
// Rangamati, Khagrachhari and Bandarban belong to no region here: many
// indigenous languages are spoken there, which this Bangla-dialect map doesn't cover.

export const REGIONS: readonly DialectRegion[] = [
  {
    id: "jashore-khulna",
    name: { en: "Jashore–Khulna", bn: "যশোর–খুলনা" },
    districts: ["jashore", "khulna", "satkhira", "magura", "narail", "jhenaidah", "chuadanga", "kushtia", "meherpur", "bagerhat"],
    emoji: "🌼",
    blurb: {
      en: "“কনে?” for where, “আমাগের” for our, and verbs ending in -তি: খাতি, যাতি.",
      bn: "কোথায় হলো “কনে”, আমাদের হলো “আমাগের”, আর ক্রিয়ার শেষে -তি: খাতি, যাতি।",
    },
  },
  {
    id: "barishal",
    name: { en: "Barishal", bn: "বরিশাল" },
    districts: ["barishal", "patuakhali", "bhola", "pirojpur", "jhalokati", "barguna"],
    emoji: "🛶",
    blurb: {
      en: "মুই, মোগো, আমনে — and the affectionate “মনু” that gives a Barishal person away.",
      bn: "মুই, মোগো, আমনে — আর আদরের ডাক “মনু” শুনলেই বোঝা যায় বরিশালের মানুষ।",
    },
  },
  {
    id: "faridpur",
    name: { en: "Faridpur", bn: "ফরিদপুর" },
    districts: ["faridpur", "madaripur", "gopalganj", "shariatpur", "rajbari"],
    emoji: "🌾",
    blurb: {
      en: "“এইহেনে”, “ম্যালা”, “যাবানে” — and the accent shifts every 15–20 km.",
      bn: "“এইহেনে”, “ম্যালা”, “যাবানে” — আর ১৫–২০ কিলোমিটার পরপর টান বদলে যায়।",
    },
  },
  {
    id: "sylhet",
    name: { en: "Sylhet", bn: "সিলেট" },
    districts: ["sylhet", "moulvibazar", "sunamganj", "habiganj"],
    emoji: "🍃",
    blurb: {
      en: "কিতা, বাক্কা, মাত — and স turns into হ (হউর, হিয়াল). Habiganj speech leans towards Mymensingh.",
      bn: "কিতা, বাক্কা, মাত — আর স হয়ে যায় হ (হউর, হিয়াল)। হবিগঞ্জের টান অনেকটা ময়মনসিংহের দিকে।",
    },
  },
  {
    id: "chattogram",
    name: { en: "Chattogram", bn: "চট্টগ্রাম" },
    districts: ["chattogram", "coxsbazar"],
    emoji: "⛰️",
    blurb: {
      en: "“গম” means good, “কিল্লাই” means why — and “no” comes before the verb.",
      bn: "“গম” মানে ভালো, “কিল্লাই” মানে কেন — আর “না” বসে ক্রিয়ার আগে।",
    },
  },
  {
    id: "noakhali",
    name: { en: "Noakhali", bn: "নোয়াখালী" },
    districts: ["noakhali", "feni", "lakshmipur"],
    emoji: "🌊",
    blurb: {
      en: "প turns into হ: পানি → হানি, পাগল → হাগল — even Feni becomes হেনী.",
      bn: "প হয়ে যায় হ: পানি → হানি, পাগল → হাগল — এমনকি ফেনী হয়ে যায় হেনী!",
    },
  },
  {
    id: "cumilla",
    name: { en: "Cumilla", bn: "কুমিল্লা" },
    districts: ["cumilla", "brahmanbaria", "chandpur"],
    emoji: "🏺",
    blurb: {
      en: "A crossroads: the south sounds like Noakhali, the west like Dhaka.",
      bn: "মিলনস্থল: দক্ষিণে নোয়াখালীর টান, পশ্চিমে ঢাকার।",
    },
  },
  {
    id: "old-dhaka",
    name: { en: "Old Dhaka (Kutti)", bn: "পুরান ঢাকা (কুট্টি)" },
    districts: ["dhaka"],
    emoji: "🕌",
    blurb: {
      en: "হালায়, আবে, আমি বি, মগর — the Kutti speech famous for its jokes.",
      bn: "হালায়, আবে, আমি বি, মগর — রসিকতার জন্য বিখ্যাত কুট্টি ভাষা।",
    },
  },
  {
    id: "dhaka-region",
    name: { en: "Greater Dhaka", bn: "বৃহত্তর ঢাকা" },
    districts: ["narsingdi", "manikganj", "tangail", "gazipur", "narayanganj", "munshiganj"],
    emoji: "🚦",
    blurb: {
      en: "Narsingdi's এফি–হেফি, Tangail's “দেওয়া” for rain.",
      bn: "নরসিংদীর এফি–হেফি, টাঙ্গাইলে বৃষ্টি মানে “দেওয়া”।",
    },
  },
  {
    id: "mymensingh",
    name: { en: "Mymensingh", bn: "ময়মনসিংহ" },
    districts: ["mymensingh", "netrokona", "kishoreganj", "jamalpur", "sherpur"],
    emoji: "🎶",
    blurb: {
      en: "কুনুকা, হাছুন, রিস্কিন্ডি — and Jamalpur drops the first র (রক্ত → অক্ত).",
      bn: "কুনুকা, হাছুন, রিস্কিন্ডি — আর জামালপুরে শুরুর র হারায় (রক্ত → অক্ত)।",
    },
  },
  {
    id: "rangpur",
    name: { en: "Rangpur", bn: "রংপুর" },
    districts: ["rangpur", "lalmonirhat", "kurigram", "gaibandha", "nilphamari", "dinajpur", "thakurgaon", "panchagarh"],
    emoji: "🐅",
    blurb: {
      en: "“বাহে”, ক্যাংকা, এ্যালা — and র disappears: রংপুর becomes অমপুর.",
      bn: "“বাহে” ডাক, ক্যাংকা, এ্যালা — আর র হারিয়ে যায়: রংপুর হয়ে যায় অমপুর।",
    },
  },
  {
    id: "rajshahi",
    name: { en: "Rajshahi (Barendri)", bn: "রাজশাহী (বরেন্দ্রী)" },
    districts: ["rajshahi", "chapainawabganj", "naogaon", "natore", "pabna", "sirajganj"],
    emoji: "🥭",
    blurb: {
      en: "হামি, লদ্দী, and ন and ল swap places: নতুন → লতুন.",
      bn: "হামি, লদ্দী, আর ন–ল অদলবদল: নতুন → লতুন, নৌকা → লৌকা।",
    },
  },
  {
    id: "bogura",
    name: { en: "Bogura", bn: "বগুড়া" },
    districts: ["bogura", "joypurhat"],
    emoji: "🍮",
    blurb: {
      en: "হামি, ব্যাটা ছৈল — and a “বারে” at the end of sentences.",
      bn: "হামি, ব্যাটা ছৈল — আর কথার শেষে একটা “বারে”।",
    },
  },
];
