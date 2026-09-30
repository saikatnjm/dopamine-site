// Copy for the Delivery Simulator (EN + BN). Rules live in
// lib/games/delivery-sim.ts under the same ids — keep them in sync.
// Placeholders: {restaurant} {food} {area} {km} {pay} {bill}.
// Humor targets situations (traffic, lifts, pins on the map), never people.

import type { Accent } from "@/components/ui/styles";
import type { Text } from "@/lib/i18n/core";
import type { AreaId, EndingId, EventId, RankId, RestaurantId, StageId, WeatherId } from "@/lib/games/delivery-sim";

export const restaurants: Record<RestaurantId, { name: Text; food: Text; emoji: string }> = {
  "kacchi-kingdom": { name: { en: "Kacchi Kingdom", bn: "কাচ্চি কিংডম" }, food: { en: "kacchi biryani", bn: "কাচ্চি বিরিয়ানি" }, emoji: "🍛" },
  "burger-bhai": { name: { en: "Burger Bhai", bn: "বার্গার ভাই" }, food: { en: "double burger", bn: "ডাবল বার্গার" }, emoji: "🍔" },
  "tehari-house": { name: { en: "Tehari House", bn: "তেহারি হাউস" }, food: { en: "beef tehari", bn: "গরুর তেহারি" }, emoji: "🥘" },
  "pizza-para": { name: { en: "Pizza Para", bn: "পিৎজা পাড়া" }, food: { en: "large pizza", bn: "লার্জ পিৎজা" }, emoji: "🍕" },
  "cake-corner": { name: { en: "Cake Corner", bn: "কেক কর্নার" }, food: { en: "birthday cake", bn: "জন্মদিনের কেক" }, emoji: "🎂" },
  "fuchka-factory": { name: { en: "Fuchka Factory", bn: "ফুচকা ফ্যাক্টরি" }, food: { en: "fuchka (with tok separately)", bn: "ফুচকা (টক আলাদা)" }, emoji: "🥟" },
};

export const areas: Record<AreaId, Text> = {
  dhanmondi: { en: "Dhanmondi", bn: "ধানমন্ডি" },
  mirpur: { en: "Mirpur", bn: "মিরপুর" },
  gulshan: { en: "Gulshan", bn: "গুলশান" },
  uttara: { en: "Uttara", bn: "উত্তরা" },
  mohammadpur: { en: "Mohammadpur", bn: "মোহাম্মদপুর" },
  "old-dhaka": { en: "Old Dhaka", bn: "পুরান ঢাকা" },
  banani: { en: "Banani", bn: "বনানী" },
  bashundhara: { en: "Bashundhara", bn: "বসুন্ধরা" },
};

export const weathers: Record<WeatherId, { emoji: string; name: Text }> = {
  clear: { emoji: "🌤️", name: { en: "Clear sky", bn: "পরিষ্কার আকাশ" } },
  rain: { emoji: "🌧️", name: { en: "Monsoon", bn: "বর্ষা" } },
  heat: { emoji: "🥵", name: { en: "Heatwave", bn: "তীব্র গরম" } },
};

export const stages: Record<StageId, { emoji: string; label: Text }> = {
  accept: { emoji: "📲", label: { en: "Accept", bn: "অর্ডার" } },
  restaurant: { emoji: "🍳", label: { en: "Restaurant", bn: "রেস্টুরেন্ট" } },
  pickup: { emoji: "🛍️", label: { en: "Pick up", bn: "পিকআপ" } },
  find: { emoji: "📍", label: { en: "Find it", bn: "ঠিকানা" } },
  traffic: { emoji: "🚦", label: { en: "Traffic", bn: "ট্রাফিক" } },
  contact: { emoji: "📞", label: { en: "Call", bn: "কল" } },
  deliver: { emoji: "🚪", label: { en: "Deliver", bn: "ডেলিভারি" } },
};

/** A choice's result text: fixed, or win/lose for seeded gambles. */
export type ChoiceCopy = { label: Text; result: Text } | { label: Text; win: Text; lose: Text };
export type EventCopy = { emoji: string; text: Text; choices: [ChoiceCopy, ChoiceCopy, ChoiceCopy] };

export const events: Record<EventId, EventCopy> = {
  "normal-order": {
    emoji: "📲",
    text: {
      en: "New order! {food} from {restaurant} to {area}, {km} km. Pay: ৳{pay}.",
      bn: "নতুন অর্ডার! {restaurant} থেকে {food}, যাবে {area}, {km} কিমি। পেমেন্ট: ৳{pay}।",
    },
    choices: [
      { label: { en: "Accept. Helmet on. Let's go.", bn: "অ্যাকসেপ্ট। হেলমেট পরো। চলো।" }, result: { en: "Professional. Calm. Suspicious.", bn: "পেশাদার। শান্ত। সন্দেহজনক।" } },
      {
        label: { en: "Accept and text “On my way!” right now", bn: "অ্যাকসেপ্ট করে এখনই “আসছি!” লিখে দাও" },
        result: { en: "Customer loves you already. You haven't moved.", bn: "কাস্টমার এখনই খুশি। আপনি এক পা-ও নড়েননি।" },
      },
      {
        label: { en: "Accept… after finishing this cha", bn: "অ্যাকসেপ্ট… চা-টা শেষ করে" },
        result: { en: "Excellent cha. The clock did not wait.", bn: "চা-টা দারুণ ছিল। ঘড়ি অপেক্ষা করেনি।" },
      },
    ],
  },
  "big-order": {
    emoji: "📦",
    text: {
      en: "Party order: 14 items from {restaurant}, one delivery bag, zero extra hands.",
      bn: "পার্টি অর্ডার: {restaurant} থেকে ১৪টা আইটেম, একটা ডেলিভারি ব্যাগ, বাড়তি হাত শূন্য।",
    },
    choices: [
      { label: { en: "Stack it and trust physics", bn: "উপরে উপরে সাজাও, বাকিটা পদার্থবিজ্ঞানের হাতে" }, result: { en: "Physics is… mostly on your side.", bn: "পদার্থবিজ্ঞান… মোটামুটি আপনার পক্ষে।" } },
      {
        label: { en: "Count everything twice", bn: "সব দুইবার গুনে নাও" },
        result: { en: "14 of 14. The customer will never know how hard that was.", bn: "১৪-তে ১৪। কাস্টমার জানবেও না কত কষ্ট হলো।" },
      },
      {
        label: { en: "Tie it all together with a string", bn: "সব একসাথে দড়ি দিয়ে বেঁধে ফেলো" },
        result: { en: "It looks like modern art. It sounds like soup.", bn: "দেখতে মডার্ন আর্টের মতো। শব্দ শোনায় স্যুপের মতো।" },
      },
    ],
  },
  "far-order": {
    emoji: "🗺️",
    text: {
      en: "{area}, {km} km away, at rush hour. The app calls this “nearby”.",
      bn: "{area}, {km} কিমি দূরে, অফিস ছুটির সময়। অ্যাপ বলছে “কাছেই”।",
    },
    choices: [
      { label: { en: "Accept. Adventure awaits.", bn: "অ্যাকসেপ্ট। অ্যাডভেঞ্চার অপেক্ষা করছে।" }, result: { en: "Long ride bonus unlocked.", bn: "লম্বা রাস্তার বোনাস আনলক।" } },
      {
        label: { en: "Ask the customer for a little extra", bn: "কাস্টমারের কাছে একটু বাড়তি চাও" },
        result: { en: "They agreed. With a very long sigh.", bn: "রাজি হলেন। অনেক লম্বা একটা দীর্ঘশ্বাস দিয়ে।" },
      },
      {
        label: { en: "Plan the route before starting", bn: "রওনার আগে রুট ঠিক করে নাও" },
        result: { en: "A plan! In Dhaka! Chaos slightly nervous.", bn: "প্ল্যান! ঢাকায়! হট্টগোল একটু ভয় পেয়েছে।" },
      },
    ],
  },

  "not-ready": {
    emoji: "🍳",
    text: {
      en: "At {restaurant}. The {food} hasn't been started. Cashier: “ভাই, ৫ মিনিট।”",
      bn: "{restaurant}-এ পৌঁছেছেন। {food} রান্নাই শুরু হয়নি। ক্যাশিয়ার: “ভাই, ৫ মিনিট।”",
    },
    choices: [
      {
        label: { en: "Wait patiently", bn: "ধৈর্য ধরে অপেক্ষা করো" },
        result: { en: "“5 minutes” lasted 9. That's a good day.", bn: "“৫ মিনিট” চলল ৯ মিনিট। ভালো দিনই বলতে হবে।" },
      },
      {
        label: { en: "Stand next to the kitchen and stare", bn: "কিচেনের পাশে দাঁড়িয়ে তাকিয়ে থাকো" },
        result: { en: "Staring works. The chef is now cooking nervously.", bn: "তাকানো কাজে দিয়েছে। শেফ এখন ভয়ে ভয়ে রাঁধছেন।" },
      },
      {
        label: { en: "Help them pack it yourself", bn: "নিজেই প্যাকিংয়ে হাত লাগাও" },
        result: { en: "Faster! Also a bit messier. Employee of the month?", bn: "দ্রুত হলো! একটু এলোমেলোও। মাসের সেরা কর্মী?" },
      },
    ],
  },
  ready: {
    emoji: "✅",
    text: { en: "The {food} is ready and waiting. This never happens. Be suspicious.", bn: "{food} রেডি, অপেক্ষা করছে। এমন কখনো হয় না। সন্দেহ করুন।" },
    choices: [
      { label: { en: "Grab it and go", bn: "নিয়েই দৌড়" }, result: { en: "Smooth. Too smooth.", bn: "মসৃণ। একটু বেশিই মসৃণ।" } },
      { label: { en: "Check the order first", bn: "আগে অর্ডার মিলিয়ে নাও" }, result: { en: "All correct. The sauce is even there.", bn: "সব ঠিক। সসও আছে।" } },
      { label: { en: "Take a quick photo for your story", bn: "স্টোরির জন্য একটা ছবি তুলে নাও" }, result: { en: "12 likes. Worth it.", bn: "১২টা লাইক। দাম উঠে গেছে।" } },
    ],
  },
  "missing-item": {
    emoji: "🥤",
    text: {
      en: "The {food} is ready, but the drink is “coming”. From where, nobody knows.",
      bn: "{food} রেডি, কিন্তু ড্রিংকস “আসতেছে”। কোথা থেকে, কেউ জানে না।",
    },
    choices: [
      { label: { en: "Wait for the drink", bn: "ড্রিংকসের জন্য অপেক্ষা" }, result: { en: "It arrived. Lukewarm, but present.", bn: "এসেছে। কুসুম গরম, কিন্তু এসেছে।" } },
      { label: { en: "Leave without it", bn: "ড্রিংকস ছাড়াই রওনা" }, result: { en: "The customer will notice. Customers always notice.", bn: "কাস্টমার টের পাবেন। কাস্টমার সবসময় টের পায়।" } },
      {
        label: { en: "Buy one from the shop next door", bn: "পাশের দোকান থেকে কিনে নাও" },
        result: { en: "Your own money, your own hero moment.", bn: "নিজের টাকা, নিজের হিরো মোমেন্ট।" },
      },
    ],
  },

  "heavy-rain": {
    emoji: "🌧️",
    text: { en: "The sky opens. Full monsoon mode. The road is a river now.", bn: "আকাশ ভেঙে বৃষ্টি। পুরো বর্ষা মোড। রাস্তা এখন নদী।" },
    choices: [
      {
        label: { en: "Ride through it", bn: "বৃষ্টির মধ্যেই চালাও" },
        result: { en: "You are soaked. The bag is… mostly soaked.", bn: "আপনি ভিজে চুপচুপে। ব্যাগটাও… প্রায় তাই।" },
      },
      { label: { en: "Wait under a shop's shade", bn: "দোকানের ছাউনিতে অপেক্ষা" }, result: { en: "Dry and late. Classic trade-off.", bn: "শুকনো এবং দেরি। ক্লাসিক সমঝোতা।" } },
      {
        label: { en: "Wrap the bag in three polythene layers", bn: "ব্যাগে তিন পরত পলিথিন পেঁচাও" },
        result: { en: "The food is dry. You are not. Priorities.", bn: "খাবার শুকনো। আপনি না। এটাই অগ্রাধিকার।" },
      },
    ],
  },
  "low-battery": {
    emoji: "🪫",
    text: { en: "Phone battery: 2%. Map, calls, payment — all on this phone.", bn: "ফোনের চার্জ: ২%। ম্যাপ, কল, পেমেন্ট — সব এই ফোনে।" },
    choices: [
      {
        label: { en: "Charge it at a tea stall for ৳10", bn: "চায়ের দোকানে ৳১০ দিয়ে চার্জ দাও" },
        result: { en: "12%. Luxury.", bn: "১২%। বিলাসিতা।" },
      },
      {
        label: { en: "Ride fast before it dies", bn: "চার্জ শেষ হওয়ার আগে দ্রুত চালাও" },
        win: { en: "Made it with 1% left. Legendary energy.", bn: "১% বাকি থাকতেই পৌঁছে গেছেন। কিংবদন্তি।" },
        lose: { en: "Phone died at the worst junction. You asked six people for directions.", bn: "সবচেয়ে খারাপ মোড়ে ফোন বন্ধ। ছয়জনকে রাস্তা জিজ্ঞেস করতে হলো।" },
      },
      {
        label: { en: "Memorise the map and switch it off", bn: "ম্যাপ মুখস্থ করে ফোন বন্ধ রাখো" },
        result: { en: "You remember “left after the big poster”. There are 40 posters.", bn: "মনে আছে “বড় পোস্টারের পর বামে”। পোস্টার আছে ৪০টা।" },
      },
    ],
  },
  "bag-tetris": {
    emoji: "🎒",
    text: { en: "The delivery bag is tiny. The {food} box is not.", bn: "ডেলিভারি ব্যাগ ছোট। {food}-এর বাক্স ছোট না।" },
    choices: [
      { label: { en: "Keep it perfectly flat", bn: "একদম সোজা রাখো" }, result: { en: "Flat, safe, slightly slower.", bn: "সোজা, নিরাপদ, একটু ধীর।" } },
      { label: { en: "Sideways. It'll be fine.", bn: "কাত করে দাও। কিছু হবে না।" }, result: { en: "It was not fine.", bn: "কিছু হয়েছে।" } },
      {
        label: { en: "Hold it on your lap", bn: "কোলের উপর ধরে রাখো" },
        result: { en: "One hand on the bike, one on the food. Very Dhaka.", bn: "এক হাত বাইকে, এক হাত খাবারে। একদম ঢাকা।" },
      },
    ],
  },

  "wrong-address": {
    emoji: "📍",
    text: { en: "The customer's pin is in the middle of a lake in {area}.", bn: "কাস্টমারের পিন {area}-র একটা লেকের মাঝখানে।" },
    choices: [
      { label: { en: "Call the customer", bn: "কাস্টমারকে কল দাও" }, result: { en: "“Oh, the pin is wrong. I'm next to the pharmacy.” Which one?", bn: "“ও, পিন ভুল। আমি ফার্মেসির পাশে।” কোনটা?" } },
      {
        label: { en: "Ask the tea stall uncle", bn: "চায়ের দোকানের মামাকে জিজ্ঞেস করো" },
        win: { en: "Uncle knows everyone. Found it in two minutes.", bn: "মামা সবাইকে চেনেন। দুই মিনিটে পেয়ে গেলেন।" },
        lose: { en: "Uncle was very confident. Uncle was very wrong.", bn: "মামা খুব আত্মবিশ্বাসী ছিলেন। মামা খুব ভুল ছিলেন।" },
      },
      {
        label: { en: "Trust the pin. Pins don't lie.", bn: "পিনকে বিশ্বাস করো। পিন মিথ্যা বলে না।" },
        win: { en: "Somehow the building was right next to the lake. Lucky!", bn: "কীভাবে যেন বিল্ডিংটা লেকের ঠিক পাশেই। কপাল!" },
        lose: { en: "You delivered to a very surprised stranger.", bn: "খুবই অবাক এক অপরিচিত মানুষের কাছে ডেলিভারি হয়ে গেল।" },
      },
    ],
  },
  "location-change": {
    emoji: "🔁",
    text: {
      en: "Customer: “Actually I'm at my friend's place now. Just 2 km more, OK?”",
      bn: "কাস্টমার: “আসলে আমি এখন বন্ধুর বাসায়। আর মাত্র ২ কিমি, ঠিক আছে?”",
    },
    choices: [
      { label: { en: "“No problem!”", bn: "“কোনো সমস্যা নেই!”" }, result: { en: "Customer happy. Your legs, less so.", bn: "কাস্টমার খুশি। আপনার পা, অতটা না।" } },
      {
        label: { en: "“Extra charge lagbe, bhai”", bn: "“ভাই, এক্সট্রা চার্জ লাগবে”" },
        result: { en: "Paid. Rating: pending. Mood: frosty.", bn: "টাকা দিলেন। রেটিং: অপেক্ষমাণ। মেজাজ: ঠান্ডা।" },
      },
      { label: { en: "“Let's meet halfway”", bn: "“মাঝামাঝি কোথাও দেখা করি”" }, result: { en: "Halfway is a chaotic place.", bn: "মাঝামাঝি জায়গাটা বড়ই এলোমেলো।" } },
    ],
  },
  "vague-landmark": {
    emoji: "🏢",
    text: {
      en: "Address note: “Behind the blue building, near the big tree.” Every building here is blue.",
      bn: "ঠিকানার নোট: “নীল বিল্ডিংয়ের পেছনে, বড় গাছের পাশে।” এখানে সব বিল্ডিংই নীল।",
    },
    choices: [
      { label: { en: "Check every blue building", bn: "সব নীল বিল্ডিং খুঁজে দেখো" }, result: { en: "You now know this block better than its residents.", bn: "এই এলাকা আপনি এখন এখানকার মানুষের চেয়েও ভালো চেনেন।" } },
      { label: { en: "Ask three different people", bn: "তিনজনকে জিজ্ঞেস করো" }, result: { en: "Three directions. You averaged them. It worked?!", bn: "তিন রকম রাস্তা। গড় করলেন। কাজ হলো?!" } },
      { label: { en: "Video call the customer", bn: "কাস্টমারকে ভিডিও কল দাও" }, result: { en: "They waved from a balcony. Found!", bn: "বারান্দা থেকে হাত নাড়লেন। পাওয়া গেছে!" } },
    ],
  },

  jam: {
    emoji: "🚗",
    text: { en: "Total gridlock. Nobody has moved since breakfast.", bn: "পুরো জ্যাম। সকালের নাস্তার পর থেকে কেউ নড়েনি।" },
    choices: [
      { label: { en: "Wait like a statue", bn: "মূর্তির মতো অপেক্ষা" }, result: { en: "Inner peace achieved. Delivery time, not so much.", bn: "মনের শান্তি পেয়েছেন। সময়টা পাননি।" } },
      {
        label: { en: "Slowly squeeze through the gaps", bn: "ফাঁকফোকর দিয়ে আস্তে আস্তে বের হও" },
        result: { en: "Mirrors folded, breath held. You're through.", bn: "মিরর ভাঁজ, দম আটকে। বের হয়ে গেছেন।" },
      },
      { label: { en: "Take the long way around", bn: "ঘুরপথে যাও" }, result: { en: "Longer, but moving. Fuel says hi.", bn: "লম্বা, কিন্তু চলছে। তেল খরচ হাত নাড়ছে।" } },
    ],
  },
  "cng-block": {
    emoji: "🛺",
    text: {
      en: "A CNG has parked sideways, blocking the whole lane. The driver is on a tea break.",
      bn: "একটা সিএনজি আড়াআড়ি দাঁড়িয়ে পুরো লেন আটকে দিয়েছে। মামা চা খাচ্ছেন।",
    },
    choices: [
      { label: { en: "Honk politely (three times)", bn: "ভদ্রভাবে হর্ন দাও (তিনবার)" }, result: { en: "He finished his tea first. Then moved.", bn: "আগে চা শেষ করলেন। তারপর সরলেন।" } },
      {
        label: { en: "“Mama, one minute please?”", bn: "“মামা, এক মিনিট একটু সরবেন?”" },
        win: { en: "He moved and wished you luck. Nice mama.", bn: "সরে গেলেন, শুভকামনাও জানালেন। ভালো মামা।" },
        lose: { en: "He started telling you about his day. All of it.", bn: "উনি আপনাকে সারাদিনের গল্প শোনাতে শুরু করলেন। পুরোটা।" },
      },
      { label: { en: "Turn back and go around", bn: "ঘুরে অন্য রাস্তায় যাও" }, result: { en: "Safe choice. The CNG is still there, forever.", bn: "নিরাপদ সিদ্ধান্ত। সিএনজি এখনো ওখানেই, চিরকাল।" } },
    ],
  },
  "lucky-shortcut": {
    emoji: "🍀",
    text: { en: "A completely empty lane appears. Is this real? Is this Dhaka?", bn: "একদম ফাঁকা একটা গলি দেখা যাচ্ছে। এটা কি সত্যি? এটা কি ঢাকা?" },
    choices: [
      { label: { en: "Take it!", bn: "ঢুকে পড়ো!" }, result: { en: "It was real. Minutes saved. Tell no one.", bn: "সত্যিই ছিল। মিনিট বাঁচলো। কাউকে বলবেন না।" } },
      { label: { en: "Too suspicious. Stay on the main road.", bn: "বেশি সন্দেহজনক। মেইন রোডেই থাকো।" }, result: { en: "Safe. Slow. You'll always wonder.", bn: "নিরাপদ। ধীর। সারাজীবন ভাববেন।" } },
      {
        label: { en: "Take it at full speed", bn: "ফুল স্পিডে ঢুকে পড়ো" },
        win: { en: "Zoom! Fastest ride of your career.", bn: "জুম! ক্যারিয়ারের সবচেয়ে দ্রুত রাইড।" },
        lose: { en: "Surprise speed breaker. The {food} jumped.", bn: "হঠাৎ স্পিড ব্রেকার। {food} লাফ দিয়েছে।" },
      },
    ],
  },

  "no-answer": {
    emoji: "📵",
    text: { en: "You've arrived. Called 4 times. Ringing… ringing… ringing…", bn: "পৌঁছে গেছেন। ৪ বার কল। রিং হচ্ছে… হচ্ছে… হচ্ছে…" },
    choices: [
      {
        label: { en: "Keep calling", bn: "কল দিতে থাকো" },
        win: { en: "Call 7: “Sorry bhai, I was in the shower!”", bn: "৭ নম্বর কল: “সরি ভাই, গোসলে ছিলাম!”" },
        lose: { en: "Phone switched off. The customer has vanished into the city.", bn: "ফোন বন্ধ। কাস্টমার শহরে হারিয়ে গেছেন।" },
      },
      { label: { en: "Text “I'm downstairs 🙂” and wait", bn: "“নিচে আছি 🙂” লিখে অপেক্ষা করো" }, result: { en: "They saw it. Eventually. Very polite of you.", bn: "দেখেছেন। শেষমেশ। আপনি খুব ভদ্র।" } },
      {
        label: { en: "Shout their name at the building", bn: "বিল্ডিংয়ের দিকে নাম ধরে ডাক দাও" },
        win: { en: "A window opened. It was them! The whole street clapped.", bn: "একটা জানালা খুলল। উনিই! পুরো রাস্তা তালি দিল।" },
        lose: { en: "Seven wrong windows opened. None of them ordered food.", bn: "সাতটা ভুল জানালা খুলল। কেউ খাবার অর্ডার করেনি।" },
      },
    ],
  },
  "come-down": {
    emoji: "⬇️",
    text: { en: "Customer on the phone: “ভাই, নিচে আসেন।” You are already on the ground floor.", bn: "কাস্টমার ফোনে: “ভাই, নিচে আসেন।” আপনি তো নিচতলাতেই দাঁড়িয়ে।" },
    choices: [
      { label: { en: "“I'm down, bhai. Very down.”", bn: "“ভাই, আমি নিচেই। একদম নিচে।”" }, result: { en: "Confusion resolved. They were at the other gate.", bn: "ভুল বোঝাবুঝি শেষ। উনি অন্য গেটে ছিলেন।" } },
      {
        label: { en: "Check the basement, just in case", bn: "বেসমেন্টেও দেখে আসো, কী জানি" },
        result: { en: "Basement: 3 cars, 1 cat, 0 customers.", bn: "বেসমেন্ট: ৩টা গাড়ি, ১টা বিড়াল, ০ কাস্টমার।" },
      },
      { label: { en: "Send a photo of where you're standing", bn: "যেখানে দাঁড়িয়ে আছেন তার ছবি পাঠাও" }, result: { en: "Photo evidence. Case closed.", bn: "ছবির প্রমাণ। মামলা খতম।" } },
    ],
  },
  "shop-request": {
    emoji: "🛒",
    text: {
      en: "Customer: “Bhai, can you also grab a pack of chips from the shop downstairs?”",
      bn: "কাস্টমার: “ভাই, নিচের দোকান থেকে একটা চিপসও নিয়ে আসবেন?”",
    },
    choices: [
      { label: { en: "“Sure!” (your money)", bn: "“অবশ্যই!” (নিজের টাকায়)" }, result: { en: "Hero behaviour. Five-star energy.", bn: "হিরোর মতো কাজ। পাঁচ তারকা এনার্জি।" } },
      { label: { en: "“Sorry, not allowed”", bn: "“সরি, এটা নিয়মে নেই”" }, result: { en: "Correct. Also slightly less loved.", bn: "ঠিক আছে। শুধু একটু কম ভালোবাসা।" } },
      {
        label: { en: "Bring it, add a small “service fee”", bn: "এনে দাও, সাথে ছোট্ট “সার্ভিস চার্জ”" },
        result: { en: "Business mindset. They paid, with a look.", bn: "ব্যবসায়ী মাথা। টাকা দিলেন, একটা দৃষ্টিসহ।" },
      },
    ],
  },

  "lift-broken": {
    emoji: "🛗",
    text: { en: "The lift is broken. The customer lives on the 9th floor.", bn: "লিফট নষ্ট। কাস্টমার থাকেন ৯ তলায়।" },
    choices: [
      { label: { en: "Climb all 9 floors", bn: "৯ তলা হেঁটে ওঠো" }, result: { en: "Leg day complete. Customer impressed.", bn: "আজকের ব্যায়াম শেষ। কাস্টমার মুগ্ধ।" } },
      { label: { en: "Ask them to come down", bn: "ওনাকে নিচে আসতে বলো" }, result: { en: "They came down. Slowly. Loudly.", bn: "নামলেন। আস্তে আস্তে। শব্দ করে।" } },
      {
        label: { en: "Send it up with the building guard", bn: "দারোয়ানের হাতে উপরে পাঠাও" },
        win: { en: "Delivered by relay. Teamwork!", bn: "রিলে করে ডেলিভারি। টিমওয়ার্ক!" },
        lose: { en: "The guard took the stairs two at a time. So did the {food}.", bn: "দারোয়ান দুই ধাপ করে উঠলেন। {food}-ও।" },
      },
    ],
  },
  guard: {
    emoji: "💂",
    text: {
      en: "The building guard needs your name, phone number, flat number and possibly your life story.",
      bn: "দারোয়ানের দরকার আপনার নাম, ফোন নম্বর, ফ্ল্যাট নম্বর, আর সম্ভবত জীবনের গল্প।",
    },
    choices: [
      { label: { en: "Fill the register patiently", bn: "ধৈর্য ধরে রেজিস্টারে লেখো" }, result: { en: "Page 47 of the register. Your handwriting is famous now.", bn: "রেজিস্টারের ৪৭ নম্বর পাতা। আপনার হাতের লেখা এখন বিখ্যাত।" } },
      { label: { en: "Offer him a cup of cha", bn: "একটা চা খাওয়াও" }, result: { en: "Instant friendship. Gate opened.", bn: "সাথে সাথে বন্ধুত্ব। গেট খুলে গেল।" } },
      { label: { en: "Call the customer to vouch for you", bn: "কাস্টমারকে ফোন দিয়ে পরিচয় নিশ্চিত করাও" }, result: { en: "The customer had to come to the gate anyway.", bn: "কাস্টমারকে শেষে গেট পর্যন্ত আসতেই হলো।" } },
    ],
  },
  "cash-change": {
    emoji: "💵",
    text: { en: "The bill is ৳{bill}. The customer only has a ৳1,000 note. You have ৳20.", bn: "বিল ৳{bill}। কাস্টমারের কাছে শুধু ১,০০০ টাকার নোট। আপনার কাছে ৳২০।" },
    choices: [
      { label: { en: "Run to the shop for change", bn: "দোকানে দৌড়ে ভাংতি আনো" }, result: { en: "The shopkeeper also had no change. The second one did.", bn: "দোকানদারের কাছেও ভাংতি নেই। পাশেরজনের কাছে ছিল।" } },
      {
        label: { en: "“Keep the change, bhai” (you pay the gap)", bn: "“ভাই, রেখে দেন” (বাকিটা আপনি দেন)" },
        result: { en: "Generous. Your wallet is crying quietly.", bn: "দয়ালু। মানিব্যাগ চুপচাপ কাঁদছে।" },
      },
      { label: { en: "“Can you pay by mobile banking?”", bn: "“মোবাইল ব্যাংকিংয়ে দেওয়া যাবে?”" }, result: { en: "Done in 20 seconds. The future is here.", bn: "২০ সেকেন্ডে শেষ। ভবিষ্যৎ এসে গেছে।" } },
    ],
  },
};

export const endings: Record<EndingId, { emoji: string; title: Text; blurb: Text; accent: Accent }> = {
  legendary: {
    emoji: "🏆",
    title: { en: "Legendary Delivery", bn: "কিংবদন্তি ডেলিভারি" },
    blurb: {
      en: "Early, perfect, hot. The customer is telling their whole family about you. Other riders speak your name in whispers.",
      bn: "আগেভাগে, নিখুঁত, গরম গরম। কাস্টমার পুরো পরিবারকে আপনার গল্প বলছেন। অন্য রাইডাররা ফিসফিস করে আপনার নাম নেয়।",
    },
    accent: "marigold",
  },
  perfect: {
    emoji: "✅",
    title: { en: "Perfect Delivery", bn: "পারফেক্ট ডেলিভারি" },
    blurb: { en: "On time, food intact, customer smiling. In Dhaka, this is basically a miracle.", bn: "ঠিক সময়ে, খাবার অক্ষত, কাস্টমার হাসছেন। ঢাকায় এটা প্রায় অলৌকিক।" },
    accent: "lime",
  },
  delivered: {
    emoji: "📦",
    title: { en: "Delivered. Technically.", bn: "ডেলিভারি হয়েছে। টেকনিক্যালি।" },
    blurb: { en: "On time, but the vibes were off. The customer said “ok” with no emoji.", bn: "সময়মতো, কিন্তু ভাইব ঠিক ছিল না। কাস্টমার ইমোজি ছাড়া “ok” লিখেছেন।" },
    accent: "sky",
  },
  late: {
    emoji: "⏰",
    title: { en: "Late Delivery", bn: "দেরিতে ডেলিভারি" },
    blurb: {
      en: "The food arrived. So did the customer's patience — it ran out. “Bhai, traffic?” “Bhai, traffic.”",
      bn: "খাবার পৌঁছেছে। কাস্টমারের ধৈর্যও — শেষ হয়ে গেছে। “ভাই, জ্যাম?” “ভাই, জ্যাম।”",
    },
    accent: "tangerine",
  },
  "customer-gone": {
    emoji: "👻",
    title: { en: "Customer Disappeared", bn: "কাস্টমার উধাও" },
    blurb: {
      en: "Phone off, gate closed, no trace. You are now holding {food} for a person who may not exist.",
      bn: "ফোন বন্ধ, গেট বন্ধ, কোনো চিহ্ন নেই। আপনি এখন এমন একজনের {food} ধরে আছেন, যিনি হয়তো আদৌ নেই।",
    },
    accent: "violet",
  },
  "food-damaged": {
    emoji: "🫠",
    title: { en: "Food Damaged", bn: "খাবারের বারোটা" },
    blurb: { en: "It arrived as a “deconstructed” {food}. Very modern. Not very edible.", bn: "{food} পৌঁছেছে “ডিকনস্ট্রাক্টেড” অবস্থায়। খুব আধুনিক। খুব একটা খাওয়ার মতো না।" },
    accent: "chili",
  },
  "wrong-address": {
    emoji: "🏚️",
    title: { en: "Wrong Address", bn: "ভুল ঠিকানা" },
    blurb: {
      en: "A stranger in {area} got a free {food} and a great day. The real customer is still waiting.",
      bn: "{area}-র এক অপরিচিত মানুষ ফ্রি {food} আর দারুণ একটা দিন পেলেন। আসল কাস্টমার এখনো অপেক্ষায়।",
    },
    accent: "violet",
  },
  "total-chaos": {
    emoji: "🌪️",
    title: { en: "Complete Chaos", bn: "পুরো হট্টগোল" },
    blurb: {
      en: "Rain, horns, strangers shouting directions. Somehow the food arrived. Nobody, including you, knows how.",
      bn: "বৃষ্টি, হর্ন, অচেনা মানুষের চিৎকার করে রাস্তা বলা। কীভাবে যেন খাবার পৌঁছেছে। কীভাবে, আপনিও জানেন না।",
    },
    accent: "chili",
  },
};

/** Performance titles by score (lib rankFor). Never rename ids. */
export const ranks: Record<RankId, { emoji: string; title: Text }> = {
  "delivery-legend": { emoji: "🏍️", title: { en: "Delivery Legend of Dhaka", bn: "ঢাকার ডেলিভারি কিংবদন্তি" } },
  "pro-rider": { emoji: "⭐", title: { en: "Five-Star Rider", bn: "ফাইভ-স্টার রাইডার" } },
  "gps-believer": { emoji: "🧭", title: { en: "GPS Believer", bn: "জিপিএস-বিশ্বাসী" } },
  "lane-explorer": { emoji: "🗺️", title: { en: "Accidental Lane Explorer", bn: "দুর্ঘটনাক্রমে গলি অভিযাত্রী" } },
  "chaos-courier": { emoji: "🌀", title: { en: "Chaos Courier", bn: "হট্টগোল কুরিয়ার" } },
};

export const deliveryCopy = {
  intro: {
    en: "This time you're the rider. One order, seven stages, many problems. Get the food there hot, on time, and in one piece.",
    bn: "এবার আপনিই রাইডার। একটা অর্ডার, সাতটা ধাপ, অনেক ঝামেলা। খাবার পৌঁছান গরম, সময়মতো, আর আস্ত অবস্থায়।",
  },
  newOrder: { en: "🔔 FIND AN ORDER", bn: "🔔 অর্ডার খোঁজো" },
  best: { en: "Best score", bn: "সেরা স্কোর" },
  orderTitle: { en: "New order", bn: "নতুন অর্ডার" },
  from: { en: "From", bn: "কোথা থেকে" },
  to: { en: "To", bn: "কোথায়" },
  distance: { en: "Distance", bn: "দূরত্ব" },
  pay: { en: "Pay", bn: "পেমেন্ট" },
  weather: { en: "Weather", bn: "আবহাওয়া" },
  promised: { en: "Promised", bn: "প্রতিশ্রুত সময়" },
  km: { en: "{n} km", bn: "{n} কিমি" },
  min: { en: "{n} min", bn: "{n} মিনিট" },
  start: { en: "🏍️ START RIDING", bn: "🏍️ রাইড শুরু" },
  another: { en: "Skip, find another order", bn: "বাদ দাও, আরেকটা অর্ডার" },
  stage: { en: "Stage {n} of {total}", bn: "ধাপ {n} / {total}" },
  clock: { en: "Time", bn: "সময়" },
  food: { en: "Food", bn: "খাবার" },
  chaos: { en: "Chaos", bn: "হট্টগোল" },
  of: { en: "{n}/{total} min", bn: "{n}/{total} মিনিট" },
  next: { en: "NEXT →", bn: "পরেরটা →" },
  finish: { en: "SEE RESULT →", bn: "রেজাল্ট দেখো →" },
  luckyWin: { en: "🍀 Lucky!", bn: "🍀 কপাল ভালো!" },
  luckyLose: { en: "💥 Unlucky!", bn: "💥 কপাল খারাপ!" },
  score: { en: "🏍️ DELIVERY SCORE", bn: "🏍️ ডেলিভারি স্কোর" },
  pts: { en: "pts", bn: "পয়েন্ট" },
  statTime: { en: "⏱️ Time", bn: "⏱️ সময়" },
  statEarnings: { en: "💰 Earnings", bn: "💰 আয়" },
  statChaos: { en: "🔥 Chaos", bn: "🔥 হট্টগোল" },
  statRating: { en: "⭐ Rating", bn: "⭐ রেটিং" },
  tip: { en: "incl. ৳{n} tip", bn: "৳{n} টিপসহ" },
  lateBy: { en: "{n} min late", bn: "{n} মিনিট দেরি" },
  early: { en: "{n} min early", bn: "{n} মিনিট আগে" },
  onTime: { en: "right on time", bn: "একদম সময়মতো" },
  legendary: { en: "✨ LEGENDARY", bn: "✨ কিংবদন্তি" },
  newBest: { en: "🎉 New best score!", bn: "🎉 নতুন সেরা স্কোর!" },
  orderCode: { en: "Order code", bn: "অর্ডার কোড" },
  shareResult: { en: "SHARE RESULT", bn: "রেজাল্ট শেয়ার করো" },
  retry: { en: "↺ RETRY THIS ORDER", bn: "↺ এই অর্ডারটাই আবার" },
  newRun: { en: "🔔 NEW ORDER", bn: "🔔 নতুন অর্ডার" },
  anotherExp: { en: "Try another experience →", bn: "আরেকটা এক্সপেরিয়েন্স →" },
  shareText: {
    en: "I delivered {food} to {area} and scored {score} pts — “{title}” {emoji} on Hottogol's Delivery Simulator. Same order, can you beat me?",
    bn: "হট্টগোলের ডেলিভারি সিমুলেটরে {area}-তে {food} পৌঁছে {score} পয়েন্ট — “{title}” {emoji}। একই অর্ডার, আমাকে হারাতে পারবে?",
  },
} satisfies Record<string, Text>;
