import type { Experience, RunContext } from "@/lib/experience/types";

// Shipped ids are permanent (share links store them). See AGENTS.md.
// Driver lines are Bangla in both languages on purpose — that's the joke.

const FAR = new Set(["uttara", "old-dhaka", "bashundhara", "mirpur"]);
const JAMMY = new Set(["motijheel", "mohakhali", "old-dhaka"]);

const dest = (c: RunContext) => c.choices.destination ?? "";
const offer = (c: RunContext) => c.choices.offer ?? "";
const party = (c: RunContext) => c.choices.party ?? "";
const road = (c: RunContext) => c.beats.road ?? "";
const cheap = (c: RunContext) => offer(c) === "meter" || offer(c) === "low";

const ACCEPTED = { en: "Driver accepted", bn: "ড্রাইভার রাজি" };
const REACHED = { en: "Reached destination", bn: "গন্তব্যে পৌঁছানো" };
const ACCEPTED_YES = { label: ACCEPTED, value: "✅" };
const ARRIVED_NO = { label: REACHED, value: "❌" };

export const dhakaCng: Experience = {
  slug: "dhaka-cng-simulator",
  title: { en: "Dhaka CNG Simulator", bn: "ঢাকা সিএনজি সিমুলেটর" },
  tagline: { en: "Try to get a CNG in Dhaka. Good luck.", bn: "ঢাকায় একটা সিএনজি ধরার চেষ্টা করুন। শুভকামনা।" },
  description: {
    en: "Pick a destination, flag down a CNG, negotiate the fare and survive the traffic. Every ride ends differently — almost never at your destination.",
    bn: "গন্তব্য বেছে নিন, সিএনজি থামান, ভাড়া নিয়ে দরদাম করুন আর জ্যাম পার হোন। প্রতিটা যাত্রার শেষ আলাদা — গন্তব্যে পৌঁছানো প্রায় কখনোই না।",
  },
  startLabel: { en: "Start the ride 🛺", bn: "যাত্রা শুরু 🛺" },
  category: "bangladesh",
  tags: ["cng", "traffic", "haggling"],
  emoji: "🛺",
  durationSec: 60,
  accent: "cng",
  seo: {
    title: "Dhaka CNG Simulator — Can You Actually Get a CNG?",
    description:
      "A free, funny 60-second Dhaka CNG ride simulator. Choose a destination, haggle with the driver, survive the jam and share your result.",
  },
  steps: [
    {
      kind: "choice",
      id: "destination",
      prompt: { en: "Where do you need to go?", bn: "কোথায় যাবেন?" },
      cardLabel: { en: "Destination", bn: "গন্তব্য" },
      options: [
        { id: "gulshan", emoji: "🏙️", label: { en: "Gulshan 1", bn: "গুলশান ১" }, hint: { en: "Fancy. Driver smells money.", bn: "পশ এলাকা। ড্রাইভার টাকার গন্ধ পাচ্ছে।" } },
        { id: "dhanmondi", emoji: "🌳", label: { en: "Dhanmondi 27", bn: "ধানমন্ডি ২৭" }, hint: { en: "Seems easy. Isn't.", bn: "সহজ মনে হয়। আসলে না।" } },
        { id: "motijheel", emoji: "🏦", label: { en: "Motijheel", bn: "মতিঝিল" }, hint: { en: "Office hours. Brave.", bn: "অফিস টাইম। সাহস আছে।" } },
        { id: "mohakhali", emoji: "🚦", label: { en: "Mohakhali", bn: "মহাখালী" }, hint: { en: "The flyover won't save you.", bn: "ফ্লাইওভারও বাঁচাতে পারবে না।" } },
        { id: "mirpur", emoji: "🏏", label: { en: "Mirpur 10", bn: "মিরপুর ১০" }, hint: { en: "Far. Very far.", bn: "দূর। অনেক দূর।" } },
        { id: "uttara", emoji: "✈️", label: { en: "Uttara Sector 7", bn: "উত্তরা সেক্টর ৭" }, hint: { en: "Basically another city.", bn: "এটা মোটামুটি আরেকটা শহর।" } },
        { id: "bashundhara", emoji: "🏢", label: { en: "Bashundhara", bn: "বসুন্ধরা" }, hint: { en: "Which block? Driver doesn't know either.", bn: "কোন ব্লক? ড্রাইভারও জানেন না।" } },
        { id: "old-dhaka", emoji: "🕌", label: { en: "Old Dhaka", bn: "পুরান ঢাকা" }, hint: { en: "Alleys. Rickshaws. Destiny.", bn: "গলি। রিকশা। নিয়তি।" } },
      ],
    },
    {
      kind: "choice",
      id: "party",
      prompt: { en: "Who's riding?", bn: "কে কে যাচ্ছেন?" },
      cardLabel: { en: "Passengers", bn: "যাত্রী" },
      options: [
        { id: "solo", emoji: "🧍", label: { en: "Just me", bn: "শুধু আমি" } },
        { id: "duo", emoji: "👯", label: { en: "Me + 1 friend", bn: "আমি + ১ বন্ধু" } },
        { id: "squad", emoji: "🎒", label: { en: "3 friends + a huge bag", bn: "৩ বন্ধু + বিশাল ব্যাগ" } },
        { id: "family", emoji: "👨‍👩‍👧‍👦", label: { en: "The whole family (6)", bn: "পুরো পরিবার (৬ জন)" } },
        { id: "goat", emoji: "🐐", label: { en: "Me + a goat (Eid)", bn: "আমি + একটা ছাগল (ঈদ)" } },
      ],
    },
    {
      kind: "beat",
      id: "search",
      title: { en: "Finding a CNG", bn: "সিএনজি খোঁজা" },
      beats: [
        { id: "all-reserved", emoji: "🙅", weight: 4, text: { en: "11 CNGs pass by. Every single one is \"রিজার্ভ\".", bn: "১১টা সিএনজি পার হয়ে গেল। সবগুলোই \"রিজার্ভ\"।" } },
        { id: "sleeping", emoji: "😴", weight: 3, text: { en: "One is parked. The driver is asleep. You wake him up. He is not happy.", bn: "একটা দাঁড়িয়ে আছে। ড্রাইভার ঘুমাচ্ছেন। আপনি জাগালেন। উনি খুশি না।" } },
        { id: "phone-call", emoji: "📱", weight: 3, text: { en: "A CNG stops. The driver finishes a 6-minute phone call before looking at you.", bn: "একটা সিএনজি থামল। আপনার দিকে তাকানোর আগে ড্রাইভার ৬ মিনিট ফোনে কথা বললেন।" } },
        { id: "instant", emoji: "⚡", weight: 1, text: { en: "A CNG stops instantly. This has never happened before. Be afraid.", bn: "সাথে সাথে একটা সিএনজি থামল। এমন আগে কখনো হয়নি। সাবধান।" } },
      ],
    },
    {
      kind: "beat",
      id: "driver",
      title: { en: "The driver speaks", bn: "ড্রাইভার বললেন" },
      beats: [
        { id: "no-way", speaker: { en: "Driver", bn: "ড্রাইভার" }, text: "ওইদিকে যাবো না… আচ্ছা, কত দিবেন?", weight: (c) => (FAR.has(dest(c)) ? 5 : 2) },
        { id: "no-meter", speaker: { en: "Driver", bn: "ড্রাইভার" }, text: "মিটারে যাবো না, মামা।", weight: 3 },
        { id: "how-much", speaker: { en: "Driver", bn: "ড্রাইভার" }, text: "কত দিবেন?", weight: 3 },
        { id: "jam-there", speaker: { en: "Driver", bn: "ড্রাইভার" }, text: "ওইদিকে তো জ্যাম, মামা… ১০০ বেশি লাগবে।", weight: (c) => (JAMMY.has(dest(c)) ? 5 : 1.5) },
        { id: "goat-double", speaker: { en: "Driver", bn: "ড্রাইভার" }, text: "ছাগল নিয়া? ভাড়া ডাবল।", weight: (c) => (party(c) === "goat" ? 8 : 0) },
        { id: "too-many", speaker: { en: "Driver", bn: "ড্রাইভার" }, text: "এতজন? পিছনে বসবেন কেমনে?", weight: (c) => (party(c) === "family" ? 6 : party(c) === "squad" ? 3 : 0) },
      ],
    },
    {
      kind: "choice",
      id: "offer",
      prompt: { en: "He's waiting. What do you offer?", bn: "উনি অপেক্ষা করছেন। কত অফার করবেন?" },
      cardLabel: { en: "Your offer", bn: "আপনার অফার" },
      options: [
        { id: "meter", emoji: "🧾", label: { en: "Go by meter", bn: "মিটারে চলেন" }, hint: { en: "Brave. Naive.", bn: "সাহসী। সরল।" } },
        { id: "low", emoji: "🪙", label: { en: "৳150", bn: "৳১৫০" }, hint: { en: "Aggressive opening.", bn: "আগ্রাসী শুরু।" } },
        { id: "fair", emoji: "💵", label: { en: "৳300", bn: "৳৩০০" }, hint: { en: "Reasonable adult.", bn: "বুঝদার মানুষ।" } },
        { id: "blank", emoji: "🏳️", label: { en: "Whatever you say, bhai", bn: "আপনি যা বলেন, ভাই" }, hint: { en: "Full surrender.", bn: "পুরো আত্মসমর্পণ।" } },
      ],
    },
    {
      kind: "beat",
      id: "road",
      title: { en: "On the road", bn: "রাস্তায়" },
      beats: [
        { id: "bijoy-jam", emoji: "🚦", weight: (c) => (JAMMY.has(dest(c)) ? 5 : 3), text: { en: "Stuck at a signal for 43 minutes. A man sells you a phone charger through the window.", bn: "সিগন্যালে ৪৩ মিনিট আটকে। জানালা দিয়ে একজন আপনাকে ফোনের চার্জার বিক্রি করল।" } },
        { id: "shortcut", emoji: "🔀", weight: (c) => (dest(c) === "old-dhaka" ? 5 : 2), text: { en: "The driver takes a \"shortcut\" through three alleys and someone's wedding.", bn: "ড্রাইভার \"শর্টকাট\" নিলেন — তিনটা গলি আর কারো বিয়েবাড়ির ভেতর দিয়ে।" } },
        { id: "rain", emoji: "🌧️", weight: 2, text: { en: "It starts raining. The road is now a river. The CNG is now a boat.", bn: "বৃষ্টি শুরু। রাস্তা এখন নদী। সিএনজি এখন নৌকা।" } },
        { id: "police", emoji: "👮", weight: 1.5, text: { en: "Police stop the CNG. The driver introduces you as his cousin.", bn: "পুলিশ সিএনজি থামাল। ড্রাইভার আপনাকে উনার কাজিন বলে পরিচয় দিলেন।" } },
        { id: "u-turn", emoji: "↩️", weight: 2, text: { en: "The driver misses the U-turn. The next U-turn is in Chattogram.", bn: "ড্রাইভার ইউ-টার্ন মিস করলেন। পরের ইউ-টার্ন চট্টগ্রামে।" } },
        { id: "smooth", emoji: "🟢", weight: 0.6, text: { en: "No traffic. Green signals everywhere. Is this even Dhaka?", bn: "জ্যাম নেই। সব সিগন্যাল সবুজ। এটা কি আদৌ ঢাকা?" } },
      ],
    },
  ],
  outcomes: [
    {
      id: "his-way",
      emoji: "🧭",
      title: { en: "Wrong Destination", bn: "ভুল গন্তব্য" },
      quote: "আমি তো কইছিলাম ওইদিকে যাবো না।",
      message: { en: "You are now in Keraniganj. The driver was going home anyway.", bn: "আপনি এখন কেরানীগঞ্জে। ড্রাইভার এমনিতেও বাসায় যাচ্ছিলেন।" },
      card: [ACCEPTED_YES, ARRIVED_NO],
      shareText: { en: "I took a CNG in Dhaka and ended up where the DRIVER wanted to go 🧭😭", bn: "ঢাকায় সিএনজি নিলাম, পৌঁছালাম ড্রাইভার যেখানে যেতে চেয়েছিলেন সেখানে 🧭😭" },
      weight: (c) => (FAR.has(dest(c)) ? 3 : 1.5) + (c.beats.driver === "no-way" ? 2 : 0),
    },
    {
      id: "fare-hike",
      emoji: "💸",
      title: { en: "Mid-Ride Fare Update", bn: "মাঝপথে ভাড়া আপডেট" },
      quote: "মামা, জ্যাম দেখছেন? ১০০ টাকা বাড়ায়া দেন।",
      message: { en: "The fare was renegotiated at the signal. You did not win the negotiation.", bn: "সিগন্যালে ভাড়া নিয়ে আবার দরদাম হলো। আপনি জেতেননি।" },
      card: [ACCEPTED_YES, { label: { en: "Fare", bn: "ভাড়া" }, value: { en: "📈 +৳100", bn: "📈 +৳১০০" } }],
      shareText: { en: "My CNG fare went up in the middle of the ride 💸 Dhaka things.", bn: "যাত্রার মাঝখানে সিএনজি ভাড়া বেড়ে গেল 💸 ঢাকা থিংস।" },
      weight: (c) => 2 + (road(c) === "bijoy-jam" ? 3 : 0) + (cheap(c) ? 2 : 0),
    },
    {
      id: "dropped",
      emoji: "🛑",
      title: { en: "Dropped Halfway", bn: "মাঝপথে নামিয়ে দিল" },
      quote: "এইখানে নামেন, সামনে যাবো না।",
      message: { en: "You are exactly halfway. No CNG in sight. A rickshaw laughs at you.", bn: "আপনি ঠিক অর্ধেক পথে। আশেপাশে কোনো সিএনজি নেই। একটা রিকশা আপনাকে দেখে হাসছে।" },
      card: [ACCEPTED_YES, ARRIVED_NO],
      shareText: { en: "Got dropped halfway by a Dhaka CNG 🛑 classic.", bn: "ঢাকার সিএনজি মাঝপথে নামিয়ে দিল 🛑 ক্লাসিক।" },
      weight: (c) => 2 + (cheap(c) ? 2 : 0),
    },
    {
      id: "lost",
      emoji: "🗺️",
      title: { en: "The Driver Got Lost", bn: "ড্রাইভার রাস্তা হারালেন" },
      quote: "রাস্তাটা তো এইদিকেই ছিল…",
      message: { en: "He has been driving for 20 years. Today, the city changed.", bn: "২০ বছর ধরে গাড়ি চালান। আজ শহরটাই বদলে গেছে।" },
      card: [ACCEPTED_YES, ARRIVED_NO],
      shareText: { en: "My CNG driver got lost in his own city 🗺️", bn: "সিএনজি ড্রাইভার নিজের শহরেই রাস্তা হারালেন 🗺️" },
      weight: (c) => 1.5 + (road(c) === "shortcut" || road(c) === "u-turn" ? 3 : 0),
    },
    {
      id: "still-stuck",
      emoji: "🐌",
      title: { en: "Still Stuck in Traffic", bn: "এখনো জ্যামে আটকে" },
      quote: "আর ৫ মিনিট, মামা।",
      message: { en: "Technically you're still on the way. Your grandchildren will arrive.", bn: "টেকনিক্যালি আপনি এখনো পথে আছেন। আপনার নাতি-নাতনি পৌঁছাবে।" },
      card: [ACCEPTED_YES, { label: REACHED, value: { en: "⏳ pending", bn: "⏳ চলছে" } }],
      shareText: { en: "Still in a CNG. Still in traffic. Send food 🐌", bn: "এখনো সিএনজিতে। এখনো জ্যামে। খাবার পাঠান 🐌" },
      weight: (c) => 2 + (road(c) === "bijoy-jam" ? 3 : 0) + (JAMMY.has(dest(c)) ? 1 : 0),
    },
    {
      id: "boat",
      emoji: "🚤",
      title: { en: "Arrived by Boat", bn: "নৌকায় করে পৌঁছানো" },
      quote: "সাঁতার জানেন তো?",
      message: { en: "The CNG floated the last kilometre. Technically, you arrived. Your shoes did not.", bn: "শেষ এক কিলোমিটার সিএনজি ভেসে গেল। টেকনিক্যালি পৌঁছেছেন। জুতা পৌঁছায়নি।" },
      card: [ACCEPTED_YES, { label: REACHED, value: { en: "🌊 wet", bn: "🌊 ভেজা" } }],
      shareText: { en: "My Dhaka CNG turned into a boat 🚤🌧️", bn: "আমার ঢাকার সিএনজি নৌকা হয়ে গেল 🚤🌧️" },
      weight: (c) => (road(c) === "rain" ? 6 : 0),
    },
    {
      id: "cousin",
      emoji: "🎉",
      title: { en: "You're Family Now", bn: "আপনি এখন পরিবারের সদস্য" },
      quote: "আমার বইনের বিয়া, আপনিও আসেন!",
      message: {
        en: "The driver invited you to his sister's wedding. You went. Best night of your life. Still not at your destination.",
        bn: "ড্রাইভার আপনাকে উনার বোনের বিয়েতে দাওয়াত দিলেন। আপনি গেলেন। জীবনের সেরা রাত। গন্তব্যে এখনো পৌঁছাননি।",
      },
      card: [ACCEPTED_YES, ARRIVED_NO, { label: { en: "New cousins", bn: "নতুন কাজিন" }, value: { en: "🎉 14", bn: "🎉 ১৪" } }],
      shareText: { en: "A CNG ride in Dhaka and now I'm going to the driver's sister's wedding 🎉", bn: "ঢাকায় সিএনজিতে উঠলাম, এখন ড্রাইভারের বোনের বিয়েতে যাচ্ছি 🎉" },
      weight: (c) => (road(c) === "police" ? 4 : 0.3),
    },
    {
      id: "goat",
      emoji: "🐐",
      title: { en: "The Goat Paid More", bn: "ছাগলের ভাড়া বেশি" },
      quote: "ছাগলের ভাড়া আলাদা।",
      message: {
        en: "The goat got the front seat. You sat on the bag. The goat was charged double and still had a better ride.",
        bn: "ছাগল সামনের সিটে বসল। আপনি ব্যাগের উপর। ছাগলের ভাড়া ডাবল, তবুও ওর যাত্রা আপনার চেয়ে ভালো ছিল।",
      },
      card: [ACCEPTED_YES, { label: { en: "Goat satisfaction", bn: "ছাগলের সন্তুষ্টি" }, value: "⭐⭐⭐⭐⭐" }],
      shareText: { en: "Took a CNG with a goat. The goat had a better time than me 🐐", bn: "ছাগল নিয়ে সিএনজিতে উঠলাম। আমার চেয়ে ছাগলের সময় ভালো কাটল 🐐" },
      weight: (c) => (party(c) === "goat" ? 5 : 0),
    },
    {
      id: "overload",
      emoji: "🧳",
      title: { en: "Squad Ejected", bn: "দলকে নামিয়ে দিল" },
      quote: "এতজন নিয়া যাবো না, মামা।",
      message: {
        en: "The CNG made a sound no machine should make. Half the group is walking now.",
        bn: "সিএনজি এমন একটা শব্দ করল যা কোনো যন্ত্রের করা উচিত না। অর্ধেক দল এখন হাঁটছে।",
      },
      card: [{ label: ACCEPTED, value: "½" }, ARRIVED_NO],
      shareText: { en: "Tried to fit everyone in one CNG. Physics said no 🧳", bn: "সবাইকে এক সিএনজিতে ঢোকাতে চেয়েছিলাম। পদার্থবিজ্ঞান বলল না 🧳" },
      weight: (c) => (party(c) === "family" ? 3 : party(c) === "squad" ? 2 : 0),
    },
    {
      id: "walked",
      emoji: "🚶",
      title: { en: "You Walked. It Was Faster.", bn: "হেঁটেই গেলেন। দ্রুতই হলো।" },
      quote: "মিটারে? হাহাহা।",
      message: { en: "You gave up and walked. You passed the same CNG three times.", bn: "হাল ছেড়ে হাঁটা ধরলেন। একই সিএনজিকে তিনবার পাশ কাটালেন।" },
      card: [{ label: ACCEPTED, value: "❌" }, { label: { en: "Legs", bn: "পা" }, value: { en: "🦵 destroyed", bn: "🦵 শেষ" } }],
      shareText: { en: "Asked a CNG to go by meter. Ended up walking. It was faster 🚶", bn: "সিএনজিকে মিটারে যেতে বললাম। শেষে হেঁটেই গেলাম। দ্রুতই হলো 🚶" },
      weight: (c) => (offer(c) === "meter" ? 3 : 0.8),
    },
    {
      id: "arrived",
      emoji: "🏆",
      title: { en: "You Actually Arrived", bn: "আপনি সত্যিই পৌঁছে গেছেন" },
      quote: "মামা, আসছি। ভালো থাকবেন।",
      message: { en: "On time. At the agreed fare. Screenshot this — nobody will believe you.", bn: "সময়মতো। ঠিক করা ভাড়ায়। স্ক্রিনশট নিন — কেউ বিশ্বাস করবে না।" },
      card: [ACCEPTED_YES, { label: REACHED, value: "✅ (?!)" }],
      shareText: { en: "I actually reached my destination by CNG in Dhaka. Legendary run 🏆", bn: "ঢাকায় সিএনজিতে সত্যিই গন্তব্যে পৌঁছে গেছি। লেজেন্ডারি 🏆" },
      weight: (c) =>
        0.5 +
        (offer(c) === "blank" ? 1.5 : offer(c) === "fair" ? 0.7 : 0) +
        (road(c) === "smooth" ? 3 : 0),
    },
  ],
};
