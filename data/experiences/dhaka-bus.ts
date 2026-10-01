import type { Experience, RunContext } from "@/lib/experience/types";

// Shipped ids are permanent (share links store them). See AGENTS.md.
// Helper lines stay Bangla in both languages — that's the flavour.

const board = (c: RunContext) => c.choices.board ?? "";
const fare = (c: RunContext) => c.choices.fare ?? "";
const arrival = (c: RunContext) => c.beats.arrival ?? "";
const ride = (c: RunContext) => c.beats.ride ?? "";

const HELPER = { en: "Helper", bn: "হেলপার" };
const ARRIVED = { en: "Reached stop", bn: "স্টপে পৌঁছানো" };
const SEAT = { en: "Seat", bn: "সিট" };

export const dhakaBus: Experience = {
  slug: "dhaka-bus-simulator",
  title: { en: "Dhaka Bus Simulator", bn: "ঢাকা বাস সিমুলেটর" },
  tagline: { en: "Board a moving bus. Mind the gap. There is no gap.", bn: "চলন্ত বাসে উঠুন। ফাঁক খেয়াল করুন। ফাঁক নেই।" },
  description: {
    en: "Pick a route, catch a bus that refuses to fully stop, negotiate the fare with the helper and hold on. Every ride ends somewhere — rarely your stop.",
    bn: "রুট বেছে নিন, এমন বাস ধরুন যেটা পুরোপুরি থামে না, হেলপারের সাথে ভাড়া নিয়ে দরদাম করুন আর শক্ত করে ধরে থাকুন। প্রতিটা যাত্রা কোথাও না কোথাও শেষ হয় — কদাচিৎ আপনার স্টপে।",
  },
  startLabel: { en: "Wait for the bus 🚌", bn: "বাসের জন্য দাঁড়ান 🚌" },
  category: "bangladesh",
  tags: ["bus", "traffic"],
  emoji: "🚌",
  durationSec: 60,
  accent: "sky",
  seo: {
    title: "Dhaka Bus Simulator — Can You Survive a Local Bus Ride?",
    description:
      "A free, funny one-minute Dhaka local bus simulator. Catch a moving bus, argue the fare with the helper and see where you actually end up.",
  },
  steps: [
    {
      kind: "choice",
      id: "route",
      prompt: { en: "Which route today?", bn: "আজ কোন রুটে?" },
      cardLabel: { en: "Route", bn: "রুট" },
      options: [
        { id: "mirpur-motijheel", emoji: "🏏", label: { en: "Mirpur → Motijheel", bn: "মিরপুর → মতিঝিল" }, hint: { en: "Office rush. Pray.", bn: "অফিস টাইমের ভিড়। দোয়া করুন।" } },
        { id: "uttara-farmgate", emoji: "✈️", label: { en: "Uttara → Farmgate", bn: "উত্তরা → ফার্মগেট" }, hint: { en: "Long. Very long.", bn: "লম্বা। অনেক লম্বা।" } },
        { id: "gabtoli-sadarghat", emoji: "⛴️", label: { en: "Gabtoli → Sadarghat", bn: "গাবতলী → সদরঘাট" }, hint: { en: "Across the whole city.", bn: "পুরো শহর পার।" } },
        { id: "mohakhali-gulistan", emoji: "🚦", label: { en: "Mohakhali → Gulistan", bn: "মহাখালী → গুলিস্তান" }, hint: { en: "Short on the map. Only on the map.", bn: "ম্যাপে কাছে। শুধু ম্যাপেই।" } },
      ],
    },
    {
      kind: "beat",
      id: "arrival",
      title: { en: "The bus arrives", bn: "বাস আসছে" },
      beats: [
        { id: "no-stop", emoji: "💨", weight: 4, text: { en: "The bus doesn't stop. It slows down to 12 km/h. In Dhaka, that counts as stopping.", bn: "বাস থামে না। গতি কমে ১২ কিমি/ঘণ্টা। ঢাকায় এটাকেই থামা বলে।" } },
        { id: "three-race", emoji: "🏁", weight: 3, text: { en: "Three buses of the same company race each other to reach you first.", bn: "একই কোম্পানির তিনটা বাস আপনার কাছে আগে পৌঁছানোর জন্য রেস দিচ্ছে।" } },
        { id: "overflowing", emoji: "🫠", weight: 3, text: { en: "The bus is so full that some passengers are technically outside it.", bn: "বাস এতটাই ভরা যে কিছু যাত্রী টেকনিক্যালি বাসের বাইরে।" } },
        { id: "empty", emoji: "✨", weight: 1, text: { en: "An empty bus! It's going to the depot. You get on anyway.", bn: "খালি বাস! ওটা ডিপোতে যাচ্ছে। তবুও আপনি উঠে পড়লেন।" } },
      ],
    },
    {
      kind: "beat",
      id: "helper",
      title: { en: "The helper shouts", bn: "হেলপারের ডাক" },
      beats: [
        { id: "empty-lie", speaker: HELPER, text: "খালি গাড়ি, খালি গাড়ি! উঠেন উঠেন!", weight: (c) => (arrival(c) === "overflowing" ? 6 : 3) },
        { id: "seating", speaker: HELPER, text: "সিটিং সার্ভিস! (দাঁড়িয়েও যাবেন)", weight: 3 },
        { id: "left-side", speaker: HELPER, text: "বাম পাশে চাপেন, বাম পাশে! পিছে খালি!", weight: 3 },
        { id: "ostad", speaker: HELPER, text: "ওস্তাদ, আস্তে! লোক উঠতাছে!", weight: (c) => (arrival(c) === "no-stop" ? 5 : 1.5) },
      ],
    },
    {
      kind: "choice",
      id: "board",
      prompt: { en: "How do you get on?", bn: "কীভাবে উঠবেন?" },
      cardLabel: { en: "Boarding", bn: "ওঠার স্টাইল" },
      options: [
        { id: "jump", emoji: "🏃", label: { en: "Jump on while it's moving", bn: "চলন্ত বাসে লাফিয়ে উঠুন" }, hint: { en: "Parkour, Dhaka edition.", bn: "পারকুর, ঢাকা এডিশন।" } },
        { id: "squeeze", emoji: "🫸", label: { en: "Squeeze through the door", bn: "দরজায় চাপাচাপি করে ঢুকুন" }, hint: { en: "Your bag will join you later.", bn: "আপনার ব্যাগ পরে আসবে।" } },
        { id: "window", emoji: "🪟", label: { en: "Hand your bag through the window first", bn: "আগে জানালা দিয়ে ব্যাগ দিন" }, hint: { en: "A seat reservation system.", bn: "সিট রিজার্ভেশনের দেশি সিস্টেম।" } },
        { id: "wait", emoji: "⏳", label: { en: "Wait for the next one", bn: "পরের বাসের জন্য অপেক্ষা" }, hint: { en: "Optimism.", bn: "আশাবাদ।" } },
      ],
    },
    {
      kind: "choice",
      id: "fare",
      prompt: { en: "\"ভাড়া দেন!\" — What do you do?", bn: "\"ভাড়া দেন!\" — কী করবেন?" },
      cardLabel: { en: "Fare", bn: "ভাড়া" },
      options: [
        { id: "exact", emoji: "🪙", label: { en: "Pay the exact fare", bn: "ঠিক ভাড়া দিন" }, hint: { en: "He will still say it's ৳5 more.", bn: "উনি তবুও বলবেন ৳৫ বেশি।" } },
        { id: "student", emoji: "🎓", label: { en: "Show student ID for half fare", bn: "স্টুডেন্ট আইডি দেখিয়ে হাফ ভাড়া" }, hint: { en: "Prepare your arguments.", bn: "যুক্তি রেডি রাখুন।" } },
        { id: "big-note", emoji: "💵", label: { en: "Hand over a ৳500 note", bn: "৳৫০০ নোট দিন" }, hint: { en: "Change? At the next stop. Every stop.", bn: "খুচরা? পরের স্টপে। প্রতিটা স্টপে।" } },
        { id: "sleep", emoji: "😴", label: { en: "Pretend to be asleep", bn: "ঘুমের ভান করুন" }, hint: { en: "Classic. Risky.", bn: "ক্লাসিক। ঝুঁকিপূর্ণ।" } },
      ],
    },
    {
      kind: "beat",
      id: "ride",
      title: { en: "The ride", bn: "যাত্রা" },
      beats: [
        { id: "race", emoji: "🏎️", weight: (c) => (arrival(c) === "three-race" ? 5 : 2.5), text: { en: "Two buses race side by side. Their side mirror is now inside your bus.", bn: "দুইটা বাস পাশাপাশি রেস দিচ্ছে। ওদের সাইড মিরর এখন আপনার বাসের ভেতরে।" } },
        { id: "long-stop", emoji: "🧍", weight: 3, text: { en: "The bus stops for 20 minutes to collect more passengers. It was already full.", bn: "আরও যাত্রী তোলার জন্য বাস ২০ মিনিট দাঁড়িয়ে থাকল। আগে থেকেই ভরা ছিল।" } },
        { id: "detour", emoji: "🔀", weight: 2, text: { en: "The road is closed. The driver invents a new route on the spot.", bn: "রাস্তা বন্ধ। ড্রাইভার সাথে সাথে নতুন রুট আবিষ্কার করলেন।" } },
        { id: "seat-kid", emoji: "👶", weight: 2, text: { en: "You got a seat! A stranger's child is now sitting on your lap.", bn: "সিট পেয়েছেন! এখন অচেনা একজনের বাচ্চা আপনার কোলে বসে আছে।" } },
        { id: "smooth", emoji: "🟢", weight: 0.6, text: { en: "The fan works. There's a breeze. Nobody is standing on your foot. Suspicious.", bn: "ফ্যান চলছে। বাতাস আসছে। কেউ আপনার পায়ের উপর দাঁড়িয়ে নেই। সন্দেহজনক।" } },
      ],
    },
  ],
  outcomes: [
    {
      id: "missed-stop",
      emoji: "⏭️",
      title: { en: "Missed Your Stop", bn: "স্টপ মিস" },
      quote: "নামেন নামেন, তাড়াতাড়ি!",
      message: { en: "The helper announced your stop two stops after your stop. You are now walking back. In the sun.", bn: "হেলপার আপনার স্টপের নাম বললেন দুই স্টপ পরে। এখন আপনি হেঁটে ফিরছেন। রোদের মধ্যে।" },
      card: [{ label: ARRIVED, value: { en: "⏭️ +2 stops", bn: "⏭️ +২ স্টপ" } }],
      shareText: { en: "Took a Dhaka bus. Missed my stop by two stops ⏭️", bn: "ঢাকার বাসে উঠলাম। আমার স্টপ পার হয়ে গেল দুই স্টপ আগেই ⏭️" },
      weight: 3,
    },
    {
      id: "door-rider",
      emoji: "🚪",
      title: { en: "Rode on the Door", bn: "দরজায় ঝুলে যাত্রা" },
      quote: "শক্ত কইরা ধরেন!",
      message: { en: "You travelled the entire route holding the door rail with two fingers. Your arm is now stronger than your future.", bn: "পুরো রাস্তা দুই আঙুলে দরজার রড ধরে গেলেন। আপনার হাত এখন আপনার ভবিষ্যতের চেয়েও শক্ত।" },
      card: [{ label: SEAT, value: "❌" }, { label: { en: "Grip strength", bn: "হাতের জোর" }, value: "💪 +200%" }],
      shareText: { en: "Rode a Dhaka bus hanging on the door the whole way 🚪💪", bn: "পুরো রাস্তা বাসের দরজায় ঝুলে গেলাম 🚪💪" },
      weight: (c) => (board(c) === "jump" || board(c) === "squeeze" ? 4 : 0.5) + (arrival(c) === "overflowing" ? 2 : 0),
    },
    {
      id: "change-war",
      emoji: "💵",
      title: { en: "The Change War", bn: "খুচরার যুদ্ধ" },
      quote: "পরের স্টপে দিমু।",
      message: { en: "The helper promised your change at the next stop. At every stop. You got off without it. You will think about it for years.", bn: "হেলপার বললেন খুচরা পরের স্টপে দেবেন। প্রতিটা স্টপে। খুচরা ছাড়াই নেমে গেলেন। বছরের পর বছর মনে পড়বে।" },
      card: [{ label: { en: "Change received", bn: "খুচরা পেয়েছি" }, value: "৳0" }],
      shareText: { en: "Paid a Dhaka bus fare with a ৳500 note. Still waiting for my change 💵", bn: "বাসে ৳৫০০ নোট দিলাম। খুচরা এখনো পাইনি 💵" },
      weight: (c) => (fare(c) === "big-note" ? 6 : 0),
    },
    {
      id: "student-debate",
      emoji: "🎓",
      title: { en: "The Great Half-Fare Debate", bn: "হাফ ভাড়ার মহাবিতর্ক" },
      quote: "আইডি কার্ড তো পুরান!",
      message: { en: "A 15-minute debate about half fare. The whole bus took sides. You won. Your voice didn't survive.", bn: "হাফ ভাড়া নিয়ে ১৫ মিনিটের বিতর্ক। পুরো বাস দুই ভাগ হয়ে গেল। আপনি জিতলেন। আপনার গলা জেতেনি।" },
      card: [{ label: { en: "Fare paid", bn: "ভাড়া দিয়েছি" }, value: { en: "½ (after 15 min)", bn: "½ (১৫ মিনিট পর)" } }],
      shareText: { en: "Won a 15-minute half-fare debate on a Dhaka bus. Lost my voice 🎓", bn: "বাসে ১৫ মিনিটের হাফ ভাড়া বিতর্কে জিতলাম। গলা হারালাম 🎓" },
      weight: (c) => (fare(c) === "student" ? 6 : 0),
    },
    {
      id: "formula-dhaka",
      emoji: "🏎️",
      title: { en: "Formula Dhaka", bn: "ফর্মুলা ঢাকা" },
      quote: "ওস্তাদ, টান দেন!",
      message: { en: "Your bus won the race. Nobody inside cheered. Several people prayed.", bn: "আপনার বাস রেস জিতেছে। ভেতরে কেউ উল্লাস করেনি। অনেকে দোয়া পড়েছে।" },
      card: [{ label: ARRIVED, value: "✅" }, { label: { en: "Heart rate", bn: "হার্টবিট" }, value: "📈 180" }],
      shareText: { en: "My Dhaka bus won a street race. I did not enjoy it 🏎️", bn: "আমার বাস রাস্তার রেসে জিতেছে। আমি উপভোগ করিনি 🏎️" },
      weight: (c) => (ride(c) === "race" ? 6 : 0.3),
    },
    {
      id: "depot",
      emoji: "🅿️",
      title: { en: "Welcome to the Depot", bn: "ডিপোতে স্বাগতম" },
      quote: "এইটা তো গ্যারেজে যাইব।",
      message: { en: "The empty bus was empty for a reason. You are now at the depot. The driver is having tea. You are offered some.", bn: "খালি বাস খালি ছিল কারণ আছে বলেই। আপনি এখন ডিপোতে। ড্রাইভার চা খাচ্ছেন। আপনাকেও সাধলেন।" },
      card: [{ label: ARRIVED, value: "❌" }, { label: { en: "Free tea", bn: "ফ্রি চা" }, value: "☕ ✅" }],
      shareText: { en: "Got on an empty Dhaka bus. Ended up at the depot having tea with the driver 🅿️", bn: "খালি বাসে উঠলাম। শেষে ডিপোতে ড্রাইভারের সাথে চা খেলাম 🅿️" },
      weight: (c) => (arrival(c) === "empty" ? 7 : 0),
    },
    {
      id: "still-waiting",
      emoji: "⏳",
      title: { en: "Still at the Bus Stop", bn: "এখনো বাস স্টপে" },
      quote: "পরের গাড়ি আসতেছে।",
      message: { en: "You waited for a less crowded bus. Eleven buses passed. Each one was more crowded than the last.", bn: "কম ভিড়ের বাসের অপেক্ষায় ছিলেন। এগারোটা বাস গেল। প্রতিটা আগেরটার চেয়ে বেশি ভরা।" },
      card: [{ label: { en: "Buses passed", bn: "বাস চলে গেল" }, value: { en: "11", bn: "১১" } }, { label: ARRIVED, value: "❌" }],
      shareText: { en: "Waited for a less crowded Dhaka bus. Still waiting ⏳", bn: "কম ভিড়ের বাসের অপেক্ষা করছি। এখনো করছি ⏳" },
      weight: (c) => (board(c) === "wait" ? 6 : 0),
    },
    {
      id: "babysitter",
      emoji: "👶",
      title: { en: "Accidental Babysitter", bn: "হঠাৎ বেবিসিটার" },
      quote: "বাবু, আঙ্কেলের কোলে বসো।",
      message: { en: "You had a seat for 40 minutes and a toddler for 40 minutes. The toddler fell asleep. You can't move. You won't.", bn: "৪০ মিনিট সিট পেলেন, সাথে ৪০ মিনিট একটা বাচ্চা। বাচ্চা ঘুমিয়ে পড়েছে। আপনি নড়তে পারছেন না। নড়বেনও না।" },
      card: [{ label: SEAT, value: "✅" }, { label: { en: "Lap", bn: "কোল" }, value: { en: "👶 occupied", bn: "👶 দখলে" } }],
      shareText: { en: "Finally got a seat on a Dhaka bus. Came with a free toddler 👶", bn: "অবশেষে বাসে সিট পেলাম। সাথে ফ্রি একটা বাচ্চা 👶" },
      weight: (c) => (ride(c) === "seat-kid" ? 6 : 0),
    },
    {
      id: "surprise-tour",
      emoji: "🗺️",
      title: { en: "Surprise City Tour", bn: "সারপ্রাইজ সিটি ট্যুর" },
      quote: "এই রাস্তায় শর্টকাট আছে।",
      message: { en: "The new route included four neighbourhoods you had never heard of. You are now in Savar. The bus is going back tomorrow.", bn: "নতুন রুটে এমন চারটা এলাকা ছিল যার নামও শোনেননি। আপনি এখন সাভারে। বাস ফিরবে কাল।" },
      card: [{ label: ARRIVED, value: "❌" }, { label: { en: "New places seen", bn: "নতুন জায়গা দেখা" }, value: { en: "4", bn: "৪" } }],
      shareText: { en: "My Dhaka bus took a 'shortcut'. I'm now in Savar 🗺️", bn: "আমার বাস \"শর্টকাট\" নিল। আমি এখন সাভারে 🗺️" },
      weight: (c) => (ride(c) === "detour" ? 6 : 0.4),
    },
    {
      id: "overslept",
      emoji: "😴",
      title: { en: "Actually Fell Asleep", bn: "সত্যিই ঘুমিয়ে গেলেন" },
      quote: "লাস্ট স্টপ! পুরা ভাড়া দেন।",
      message: { en: "Pretending worked so well you really fell asleep. You woke up at the last stop and paid the full fare. Twice.", bn: "ভান এত ভালো হলো যে সত্যিই ঘুমিয়ে পড়লেন। লাস্ট স্টপে ঘুম ভাঙল, পুরো ভাড়া দিলেন। দুইবার।" },
      card: [{ label: { en: "Fare paid", bn: "ভাড়া দিয়েছি" }, value: "×2" }, { label: ARRIVED, value: { en: "😴 last stop", bn: "😴 লাস্ট স্টপ" } }],
      shareText: { en: "Pretended to sleep to dodge the bus fare. Fell asleep. Paid double 😴", bn: "ভাড়া না দিতে ঘুমের ভান করলাম। সত্যিই ঘুমিয়ে গেলাম। ডাবল ভাড়া দিলাম 😴" },
      weight: (c) => (fare(c) === "sleep" ? 6 : 0),
    },
    {
      id: "arrived",
      emoji: "🏆",
      title: { en: "Arrived with Dignity", bn: "সম্মানের সাথে পৌঁছালেন" },
      quote: "আপনার স্টপ, সাবধানে নামেন।",
      message: { en: "The bus stopped. Fully. At your stop. The helper even said please. Nobody will believe you.", bn: "বাস থামল। পুরোপুরি। আপনার স্টপেই। হেলপার এমনকি ভদ্রভাবে বললেন। কেউ বিশ্বাস করবে না।" },
      card: [{ label: ARRIVED, value: "✅ (?!)" }, { label: { en: "Dignity", bn: "সম্মান" }, value: "💯" }],
      shareText: { en: "A Dhaka bus fully stopped at my stop. I have proof 🏆", bn: "ঢাকার বাস আমার স্টপে পুরোপুরি থেমেছে। প্রমাণ আছে 🏆" },
      weight: (c) => 0.4 + (ride(c) === "smooth" ? 3 : 0) + (fare(c) === "exact" ? 0.4 : 0),
    },
  ],
};
