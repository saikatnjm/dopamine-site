import type { Accent } from "@/components/ui/styles";
import type {
  EventId,
  MissionId,
  ModifierId,
  MoodId,
  OutcomeId,
  PlaceId,
  RankId,
  TrafficId,
  VehicleId,
  WeatherId,
} from "@/lib/games/chaos-machine";
import type { Lang, Text } from "@/lib/i18n/core";
import { num } from "@/lib/i18n/core";

// All copy for Chaos Machine (EN + BN). Quotes stay Bangla in both languages.
// Humor targets the situation (traffic, weather, fares) — never people or groups.
// Placeholders: {dest} destination, {vehicle} vehicle name.

export const chaosCopy = {
  intro: {
    en: "One button. Nine random ingredients. One very Dhaka trip. Survive it.",
    bn: "একটা বোতাম। নয়টা র‍্যান্ডম উপাদান। একদম ঢাকার একটা যাত্রা। টিকে থাকুন।",
  },
  create: { en: "🔥 CREATE MY CHAOS", bn: "🔥 আমার হট্টগোল বানাও" },
  reroll: { en: "🎲 Different chaos", bn: "🎲 অন্য হট্টগোল" },
  start: { en: "▶ START CHAOS", bn: "▶ হট্টগোল শুরু" },
  best: { en: "Best", bn: "সেরা" },
  scenarioTitle: { en: "Your chaos", bn: "আপনার হট্টগোল" },
  vehicle: { en: "Vehicle", bn: "বাহন" },
  destination: { en: "Destination", bn: "গন্তব্য" },
  budget: { en: "Budget", bn: "বাজেট" },
  weather: { en: "Weather", bn: "আবহাওয়া" },
  time: { en: "Time", bn: "সময়" },
  driverMood: { en: "Driver mood", bn: "ড্রাইভারের মেজাজ" },
  helperMood: { en: "Helper mood", bn: "হেল্পারের মেজাজ" },
  yourMood: { en: "Your mood", bn: "আপনার মেজাজ" },
  traffic: { en: "Traffic", bn: "ট্রাফিক" },
  mission: { en: "Mission", bn: "মিশন" },
  modifier: { en: "Chaos modifier", bn: "হট্টগোল মডিফায়ার" },
  step: { en: "Stop {n} of {total}", bn: "ধাপ {n} / {total}" },
  minutesLeft: { en: "Minutes left", bn: "মিনিট বাকি" },
  money: { en: "Money", bn: "টাকা" },
  sanity: { en: "Sanity", bn: "মাথা ঠান্ডা" },
  eggsLeft: { en: "Eggs", bn: "ডিম" },
  min: { en: "{n} min", bn: "{n} মিনিট" },
  late: { en: "{n} min late", bn: "{n} মিনিট দেরি" },
  cantAfford: { en: "Not enough ৳", bn: "টাকায় কুলাচ্ছে না" },
  next: { en: "Next →", bn: "পরের ধাপ →" },
  finish: { en: "See my Chaos Score →", bn: "আমার হট্টগোল স্কোর দেখুন →" },
  chaosScore: { en: "Chaos Score", bn: "হট্টগোল স্কোর" },
  chaosLevel: { en: "Chaos level {n}/6", bn: "হট্টগোল লেভেল {n}/৬" },
  pts: { en: "pts", bn: "পয়েন্ট" },
  legendary: { en: "✨ Legendary ending", bn: "✨ কিংবদন্তি এন্ডিং" },
  missionOk: { en: "✅ Mission complete", bn: "✅ মিশন সফল" },
  missionFail: { en: "❌ Mission failed", bn: "❌ মিশন ব্যর্থ" },
  newBest: { en: "🎉 New personal best!", bn: "🎉 নতুন ব্যক্তিগত রেকর্ড!" },
  statTime: { en: "Time", bn: "সময়" },
  statMoney: { en: "Money left", bn: "টাকা বাকি" },
  statSanity: { en: "Sanity", bn: "মাথা ঠান্ডা" },
  chaosCode: { en: "Chaos code", bn: "হট্টগোল কোড" },
  retry: { en: "↺ Retry this chaos", bn: "↺ একই হট্টগোল আবার" },
  createNew: { en: "🔥 Create new chaos", bn: "🔥 নতুন হট্টগোল বানাও" },
  shareText: {
    en: "My Chaos Machine run: {vehicle} to {dest} in {weather} → “{title}” ({score} pts) 🔥 Same chaos, your turn:",
    bn: "কেওস মেশিনে আমার যাত্রা: {weather}-এ {vehicle} দিয়ে {dest} → “{title}” ({score} পয়েন্ট) 🔥 একই হট্টগোল, এবার আপনার পালা:",
  },
} satisfies Record<string, Text>;

export const vehicles: Record<VehicleId, { emoji: string; name: Text }> = {
  cng: { emoji: "🛺", name: { en: "CNG", bn: "সিএনজি" } },
  rickshaw: { emoji: "🚲", name: { en: "Rickshaw", bn: "রিকশা" } },
  bus: { emoji: "🚌", name: { en: "Local bus", bn: "লোকাল বাস" } },
  bike: { emoji: "🏍️", name: { en: "Ride-share bike", bn: "রাইড শেয়ার বাইক" } },
  leguna: { emoji: "🚐", name: { en: "Leguna", bn: "লেগুনা" } },
  walk: { emoji: "🚶", name: { en: "Your own two feet", bn: "নিজের দুই পা" } },
};

export const places: Record<PlaceId, Text> = {
  dhanmondi: { en: "Dhanmondi", bn: "ধানমন্ডি" },
  mirpur10: { en: "Mirpur 10", bn: "মিরপুর ১০" },
  gulshan2: { en: "Gulshan 2", bn: "গুলশান ২" },
  motijheel: { en: "Motijheel", bn: "মতিঝিল" },
  uttara: { en: "Uttara", bn: "উত্তরা" },
  "old-dhaka": { en: "Old Dhaka", bn: "পুরান ঢাকা" },
  farmgate: { en: "Farmgate", bn: "ফার্মগেট" },
  jatrabari: { en: "Jatrabari", bn: "যাত্রাবাড়ী" },
  bashundhara: { en: "Bashundhara", bn: "বসুন্ধরা" },
};

export const weathers: Record<WeatherId, { emoji: string; name: Text }> = {
  heat: { emoji: "🥵", name: { en: "37°C and humid", bn: "৩৭° আর ভ্যাপসা গরম" } },
  rain: { emoji: "🌧️", name: { en: "Heavy rain", bn: "ঝুম বৃষ্টি" } },
  storm: { emoji: "⛈️", name: { en: "Kalboishakhi storm", bn: "কালবৈশাখী ঝড়" } },
  fog: { emoji: "🌫️", name: { en: "Thick fog", bn: "ঘন কুয়াশা" } },
  pleasant: { emoji: "🌤️", name: { en: "Suspiciously pleasant", bn: "সন্দেহজনক রকম সুন্দর" } },
};

export const moods: Record<MoodId, { emoji: string; name: Text; line: Text }> = {
  suspicious: {
    emoji: "🤨",
    name: { en: "Suspicious", bn: "সন্দেহপ্রবণ" },
    line: { en: "“{dest} কেন যান? কী কাজ?” — asked with deep suspicion.", bn: "“{dest} কেন যান? কী কাজ?” — গভীর সন্দেহ নিয়ে জিজ্ঞেস।" },
  },
  philosopher: {
    emoji: "🤔",
    name: { en: "Philosophical", bn: "দার্শনিক" },
    line: { en: "“গন্তব্য আসলে কী, মামা?” He wants a real answer.", bn: "“গন্তব্য আসলে কী, মামা?” উনি সত্যিকারের উত্তর চান।" },
  },
  sleepy: {
    emoji: "😴",
    name: { en: "Very sleepy", bn: "ঘুম ঘুম" },
    line: { en: "The driver yawns for the fourth time. At a green light.", bn: "ড্রাইভার চতুর্থবার হাই তুললেন। সবুজ বাতিতে।" },
  },
  cheerful: {
    emoji: "😁",
    name: { en: "Overly cheerful", bn: "অতিরিক্ত খুশি" },
    line: { en: "“আজকে দিনটা সুন্দর না?” He says this in every jam.", bn: "“আজকে দিনটা সুন্দর না?” প্রতিটা জ্যামে একই কথা।" },
  },
  singer: {
    emoji: "🎤",
    name: { en: "Singing loudly", bn: "জোরে গান গাইছেন" },
    line: { en: "The driver is performing a full album. Requests are open.", bn: "ড্রাইভার পুরো একটা অ্যালবাম গাইছেন। রিকোয়েস্ট নেওয়া হচ্ছে।" },
  },
  "on-phone": {
    emoji: "📱",
    name: { en: "On the phone", bn: "ফোনে ব্যস্ত" },
    line: { en: "The driver is on his third call. You now know his cousin's whole situation.", bn: "ড্রাইভার তৃতীয় কলে। তার চাচাতো ভাইয়ের পুরো কাহিনি আপনি এখন জানেন।" },
  },
};

export const traffics: Record<TrafficId, { emoji: string; name: Text }> = {
  empty: { emoji: "🌙", name: { en: "Empty roads (Eid miracle?)", bn: "ফাঁকা রাস্তা (ঈদের অলৌকিক?)" } },
  moving: { emoji: "🚗", name: { en: "Moving, sort of", bn: "চলছে, মোটামুটি" } },
  slow: { emoji: "🐢", name: { en: "Slow crawl", bn: "ধীরে ধীরে" } },
  gridlock: { emoji: "🧱", name: { en: "Total gridlock", bn: "পুরো জ্যাম" } },
};

export const missions: Record<MissionId, { emoji: string; name: Text }> = {
  "on-time": { emoji: "🎯", name: { en: "Reach within {min} minutes", bn: "{min} মিনিটে পৌঁছান" } },
  "under-budget": { emoji: "💸", name: { en: "Arrive with 40% of the budget left", bn: "বাজেটের ৪০% বাঁচিয়ে পৌঁছান" } },
  "stay-dry": { emoji: "☂️", name: { en: "Arrive completely dry", bn: "একদম শুকনো অবস্থায় পৌঁছান" } },
  eggs: { emoji: "🥚", name: { en: "Deliver a dozen eggs (10+ intact)", bn: "এক ডজন ডিম পৌঁছে দিন (১০টা আস্ত)" } },
  calm: { emoji: "🧘", name: { en: "Arrive with your sanity intact", bn: "মাথা ঠান্ডা রেখে পৌঁছান" } },
};

export const modifiers: Record<ModifierId, { emoji: string; name: Text }> = {
  vip: { emoji: "🚨", name: { en: "VIP movement today", bn: "আজ ভিআইপি মুভমেন্ট" } },
  wasa: { emoji: "🚧", name: { en: "WASA is digging somewhere", bn: "ওয়াসা কোথাও খুঁড়ছে" } },
  goat: { emoji: "🐐", name: { en: "A goat is involved", bn: "একটা ছাগল জড়িত" } },
  wedding: { emoji: "💍", name: { en: "Wedding season", bn: "বিয়ের মৌসুম" } },
  "low-battery": { emoji: "🪫", name: { en: "Phone at 3%", bn: "ফোনে ৩% চার্জ" } },
  hilsa: { emoji: "🐟", name: { en: "Carrying a 2 kg hilsa", bn: "সাথে ২ কেজির ইলিশ" } },
  "mom-call": { emoji: "📞", name: { en: "Ammu will video-call", bn: "আম্মু ভিডিও কল দেবেন" } },
  "exact-change": { emoji: "💵", name: { en: "Only a ৳1000 note", bn: "শুধু একটা ১০০০ টাকার নোট" } },
};

type Choice = { label: Text; result: Text };
type EventCopy = { emoji: string; text: Text; choices: [Choice, Choice, Choice] };

/** Event copy by id. The "mood" event's text comes from moods[mood].line. */
export const events: Record<EventId, EventCopy> = {
  "fare-hike": {
    emoji: "💰",
    text: { en: "Halfway there, the fare suddenly goes up “because of the road”.", bn: "অর্ধেক পথে এসে ভাড়া হঠাৎ বেড়ে গেল “রাস্তার জন্য”।" },
    choices: [
      { label: { en: "Just pay the extra", bn: "বাড়তিটা দিয়ে দিন" }, result: { en: "Peace, at a price.", bn: "শান্তি, একটু দামে।" } },
      { label: { en: "Argue for five minutes", bn: "পাঁচ মিনিট তর্ক করুন" }, result: { en: "You won half. You lost five minutes.", bn: "অর্ধেক জিতলেন। পাঁচ মিনিট হারালেন।" } },
      { label: { en: "Get off and find another", bn: "নেমে অন্যটা খুঁজুন" }, result: { en: "Principles intact. Schedule not.", bn: "নীতি বাঁচল। সময় না।" } },
    ],
  },
  jam: {
    emoji: "🧱",
    text: { en: "Traffic stops completely. A man is selling cucumbers between the cars.", bn: "ট্রাফিক পুরো থেমে গেল। গাড়ির ফাঁকে একজন শসা বিক্রি করছেন।" },
    choices: [
      { label: { en: "Wait it out", bn: "অপেক্ষা করুন" }, result: { en: "You aged slightly.", bn: "আপনার বয়স একটু বাড়ল।" } },
      { label: { en: "Buy a cucumber, accept fate", bn: "শসা কিনুন, ভাগ্য মেনে নিন" }, result: { en: "Crunchy. Zen. Still stuck.", bn: "কুড়মুড়ে। শান্ত। তবুও আটকে।" } },
      { label: { en: "Try the “shortcut” lanes", bn: "“শর্টকাট” গলিতে ঢুকুন" }, result: { en: "Faster, but you saw things.", bn: "দ্রুত হলো, কিন্তু অনেক কিছু দেখলেন।" } },
    ],
  },
  flood: {
    emoji: "🌊",
    text: { en: "The road ahead is now a river. A plastic chair floats past.", bn: "সামনের রাস্তা এখন নদী। একটা প্লাস্টিকের চেয়ার ভেসে গেল।" },
    choices: [
      { label: { en: "Wade through", bn: "পানি ভেঙে যান" }, result: { en: "Your socks will never recover.", bn: "আপনার মোজা আর কখনো আগের মতো হবে না।" } },
      { label: { en: "Wait at a tong, order cha", bn: "টং দোকানে দাঁড়িয়ে চা খান" }, result: { en: "Best ten minutes of the trip.", bn: "যাত্রার সেরা দশ মিনিট।" } },
      { label: { en: "Pay a van to carry you across", bn: "ভ্যানে করে পার হন" }, result: { en: "Royal treatment, ৳50.", bn: "রাজকীয় সেবা, ৫০ টাকা।" } },
    ],
  },
  heat: {
    emoji: "🥵",
    text: { en: "It's so hot your shirt has become a second skin.", bn: "এত গরম যে শার্ট এখন দ্বিতীয় চামড়া।" },
    choices: [
      { label: { en: "Buy a lebu sharbat", bn: "লেবুর শরবত কিনুন" }, result: { en: "Life returns to your body.", bn: "শরীরে প্রাণ ফিরে এলো।" } },
      { label: { en: "Push on bravely", bn: "সাহস করে এগিয়ে যান" }, result: { en: "You are now 40% sweat.", bn: "আপনি এখন ৪০% ঘাম।" } },
      { label: { en: "Stand in an AC shop “browsing”", bn: "এসি দোকানে “দেখছি” বলে দাঁড়ান" }, result: { en: "The salesman knows. You know he knows.", bn: "সেলসম্যান জানে। আপনি জানেন সে জানে।" } },
    ],
  },
  fog: {
    emoji: "🌫️",
    text: { en: "Fog so thick you're navigating by honking.", bn: "এত কুয়াশা যে হর্ন শুনে পথ চলছেন।" },
    choices: [
      { label: { en: "Trust the driver", bn: "ড্রাইভারকে বিশ্বাস করুন" }, result: { en: "Slow, but you're somewhere.", bn: "ধীরে, তবে কোথাও তো আছেন।" } },
      { label: { en: "Follow the car in front", bn: "সামনের গাড়ির পিছু নিন" }, result: { en: "The car in front was also lost.", bn: "সামনের গাড়িও পথ হারিয়েছিল।" } },
      { label: { en: "Stop for cha until it clears", bn: "কুয়াশা কাটা পর্যন্ত চা খান" }, result: { en: "Foggy outside, clear inside.", bn: "বাইরে কুয়াশা, ভেতরে পরিষ্কার।" } },
    ],
  },
  mood: {
    emoji: "🗣️",
    text: { en: "", bn: "" },
    choices: [
      { label: { en: "Chat along", bn: "গল্প জুড়ে দিন" }, result: { en: "You made a friend. Maybe.", bn: "একজন বন্ধু হলো। হয়তো।" } },
      { label: { en: "Put in earphones", bn: "ইয়ারফোন লাগান" }, result: { en: "Silence, mostly.", bn: "নীরবতা, মোটামুটি।" } },
      { label: { en: "Tip ৳20 for a quiet ride", bn: "চুপচাপ যাত্রার জন্য ২০ টাকা বকশিশ" }, result: { en: "The best ৳20 you ever spent.", bn: "জীবনের সেরা ২০ টাকা খরচ।" } },
    ],
  },
  "bus-helper": {
    emoji: "📣",
    text: { en: "The helper shouts “আসেন আসেন, জায়গা আছে!” There is no space.", bn: "হেল্পার চিৎকার করছেন “আসেন আসেন, জায়গা আছে!” জায়গা নেই।" },
    choices: [
      { label: { en: "Squeeze in", bn: "চাপাচাপি করে উঠুন" }, result: { en: "You are now one with 40 strangers.", bn: "আপনি এখন ৪০ জন অচেনার সাথে এক।" } },
      { label: { en: "Wait for the next one", bn: "পরেরটার অপেক্ষা করুন" }, result: { en: "The next one was also full.", bn: "পরেরটাও ভরা ছিল।" } },
      { label: { en: "Share a rickshaw instead", bn: "বরং রিকশা শেয়ার করুন" }, result: { en: "Comfortable, if pricey.", bn: "আরামদায়ক, একটু দামি।" } },
    ],
  },
  footpath: {
    emoji: "🛍️",
    text: { en: "The footpath turns into a market, then a parking lot, then vanishes.", bn: "ফুটপাত প্রথমে বাজার, তারপর পার্কিং, তারপর উধাও।" },
    choices: [
      { label: { en: "Walk carefully along the edge", bn: "সাবধানে কিনারা ধরে হাঁটুন" }, result: { en: "Carefully. Very carefully.", bn: "সাবধানে। খুব সাবধানে।" } },
      { label: { en: "Browse the market", bn: "বাজারটা একটু ঘুরে দেখুন" }, result: { en: "You bought socks you didn't need.", bn: "অকারণে মোজা কিনে ফেললেন।" } },
      { label: { en: "Take the footbridge", bn: "ফুটওভারব্রিজ ধরুন" }, result: { en: "Legs burning, conscience clear.", bn: "পা জ্বলছে, বিবেক পরিষ্কার।" } },
    ],
  },
  helmet: {
    emoji: "⛑️",
    text: { en: "The rider hands you a helmet that smells like three years of Dhaka.", bn: "রাইডার একটা হেলমেট দিলেন যেটায় ঢাকার তিন বছরের গন্ধ।" },
    choices: [
      { label: { en: "Wear it — safety first", bn: "পরে নিন — নিরাপত্তা আগে" }, result: { en: "Safe. Fragrant.", bn: "নিরাপদ। সুগন্ধি।" } },
      { label: { en: "Buy a shower cap to wear inside", bn: "ভেতরে পরতে শাওয়ার ক্যাপ কিনুন" }, result: { en: "Genius. The rider is impressed.", bn: "জিনিয়াস। রাইডার মুগ্ধ।" } },
      { label: { en: "Ask him to ride slower", bn: "আস্তে চালাতে বলুন" }, result: { en: "Slower, calmer, later.", bn: "আস্তে, শান্ত, দেরিতে।" } },
    ],
  },
  vip: {
    emoji: "🚨",
    text: { en: "VIP movement! Every road is closed for “just five minutes”.", bn: "ভিআইপি মুভমেন্ট! সব রাস্তা বন্ধ “মাত্র পাঁচ মিনিটের জন্য”।" },
    choices: [
      { label: { en: "Wait patiently", bn: "ধৈর্য ধরে অপেক্ষা করুন" }, result: { en: "It was not five minutes.", bn: "পাঁচ মিনিট ছিল না।" } },
      { label: { en: "Walk to the next road", bn: "পাশের রাস্তা পর্যন্ত হাঁটুন" }, result: { en: "Walking: the fastest vehicle in Dhaka.", bn: "হাঁটা: ঢাকার সবচেয়ে দ্রুত বাহন।" } },
      { label: { en: "Take a selfie with the barricade", bn: "ব্যারিকেডের সাথে সেলফি তুলুন" }, result: { en: "Content created. Time lost. Worth it.", bn: "কনটেন্ট তৈরি। সময় গেল। তবু পুষিয়েছে।" } },
    ],
  },
  wasa: {
    emoji: "🚧",
    text: { en: "WASA has dug up the road. The sign says “temporary inconvenience” (since forever).", bn: "ওয়াসা রাস্তা খুঁড়েছে। সাইনে লেখা “সাময়িক অসুবিধা” (চিরকাল ধরে)।" },
    choices: [
      { label: { en: "Balance across the plank", bn: "তক্তার ওপর দিয়ে ব্যালেন্স করে যান" }, result: { en: "Circus-level skills. Mild panic.", bn: "সার্কাস লেভেলের দক্ষতা। হালকা আতঙ্ক।" } },
      { label: { en: "Take the long detour", bn: "লম্বা ঘুরপথ ধরুন" }, result: { en: "You toured three new neighbourhoods.", bn: "নতুন তিনটা এলাকা ঘুরে এলেন।" } },
      { label: { en: "Tip the crew to lay a board", bn: "শ্রমিকদের বকশিশ দিয়ে তক্তা পাতান" }, result: { en: "A bridge, built just for you.", bn: "শুধু আপনার জন্য একটা সেতু।" } },
    ],
  },
  goat: {
    emoji: "🐐",
    text: { en: "A goat is now sharing your seat. It seems to have paid.", bn: "একটা ছাগল এখন আপনার সিটের ভাগীদার। মনে হচ্ছে ভাড়াও দিয়েছে।" },
    choices: [
      { label: { en: "Make friends", bn: "বন্ধুত্ব করুন" }, result: { en: "Best travel companion ever.", bn: "সেরা সহযাত্রী।" } },
      { label: { en: "Negotiate for the seat", bn: "সিট নিয়ে দরকষাকষি করুন" }, result: { en: "The goat won.", bn: "ছাগল জিতেছে।" } },
      { label: { en: "Get off and walk", bn: "নেমে হাঁটুন" }, result: { en: "The goat waves goodbye.", bn: "ছাগল বিদায় জানাল।" } },
    ],
  },
  wedding: {
    emoji: "💃",
    text: { en: "A wedding procession with a full band blocks the road.", bn: "পুরো ব্যান্ডসহ বিয়ের বরযাত্রী রাস্তা আটকে দিয়েছে।" },
    choices: [
      { label: { en: "Dance along", bn: "সাথে নাচুন" }, result: { en: "You're in the wedding video now.", bn: "আপনি এখন বিয়ের ভিডিওতে।" } },
      { label: { en: "Squeeze past", bn: "ফাঁক দিয়ে বেরিয়ে যান" }, result: { en: "Elbowed by a trumpet.", bn: "ট্রাম্পেটের কনুই খেলেন।" } },
      { label: { en: "Accept a free mishti", bn: "ফ্রি মিষ্টি নিন" }, result: { en: "Congratulations to the couple!", bn: "নবদম্পতিকে শুভেচ্ছা!" } },
    ],
  },
  "low-battery": {
    emoji: "🪫",
    text: { en: "Phone at 3%. The map app wants to “update” first.", bn: "ফোনে ৩%। ম্যাপ অ্যাপ আগে “আপডেট” করতে চায়।" },
    choices: [
      { label: { en: "Charge at a tong shop (৳10)", bn: "টং দোকানে চার্জ দিন (১০ টাকা)" }, result: { en: "5%. Luxury.", bn: "৫%। বিলাসিতা।" } },
      { label: { en: "Navigate by memory", bn: "স্মৃতি থেকে পথ চলুন" }, result: { en: "Your memory was wrong.", bn: "আপনার স্মৃতি ভুল ছিল।" } },
      { label: { en: "Ask a shopkeeper", bn: "দোকানদারকে জিজ্ঞেস করুন" }, result: { en: "Three shopkeepers, three directions, one correct.", bn: "তিন দোকানদার, তিন দিক, একটা সঠিক।" } },
    ],
  },
  hilsa: {
    emoji: "🐟",
    text: { en: "The hilsa in your bag has attracted every cat in the area.", bn: "ব্যাগের ইলিশ এলাকার সব বিড়ালকে টেনে এনেছে।" },
    choices: [
      { label: { en: "Run!", bn: "দৌড়ান!" }, result: { en: "You and the fish escaped. Barely.", bn: "আপনি আর মাছ পালালেন। অল্পের জন্য।" } },
      { label: { en: "Distract them with a snack", bn: "খাবার দিয়ে ভুলিয়ে দিন" }, result: { en: "Diplomacy works.", bn: "কূটনীতি কাজ করে।" } },
      { label: { en: "Guard it heroically", bn: "বীরের মতো পাহারা দিন" }, result: { en: "A standoff for the ages.", bn: "ঐতিহাসিক মুখোমুখি।" } },
    ],
  },
  "mom-call": {
    emoji: "📞",
    text: { en: "Ammu is on video call. She wants to see the vegetables. From the {vehicle}.", bn: "আম্মু ভিডিও কলে। সবজি দেখতে চান। {vehicle} থেকে।" },
    choices: [
      { label: { en: "Show her the traffic instead", bn: "বরং ট্রাফিক দেখান" }, result: { en: "“এত জ্যাম কেন?” — a fair question.", bn: "“এত জ্যাম কেন?” — ন্যায্য প্রশ্ন।" } },
      { label: { en: "Pretend the network is bad", bn: "নেটওয়ার্ক খারাপ ভান করুন" }, result: { en: "She knows.", bn: "উনি জানেন।" } },
      { label: { en: "Chat properly — she's Ammu", bn: "ঠিকমতো কথা বলুন — আম্মু তো" }, result: { en: "You missed a turn, but you're a good child.", bn: "একটা মোড় মিস হলো, তবে আপনি ভালো সন্তান।" } },
    ],
  },
  "exact-change": {
    emoji: "💵",
    text: { en: "The driver has no change for your ৳1000 note. Nobody ever does.", bn: "আপনার ১০০০ টাকার নোটের ভাংতি ড্রাইভারের কাছে নেই। কারো কাছেই থাকে না।" },
    choices: [
      { label: { en: "Round up generously", bn: "উদার হয়ে বেশি দিন" }, result: { en: "The driver's day is made.", bn: "ড্রাইভারের দিনটা সুন্দর হলো।" } },
      { label: { en: "Buy something to break it", bn: "কিছু কিনে ভাংতি করুন" }, result: { en: "You now own a random packet of chanachur.", bn: "এখন আপনার কাছে একটা র‍্যান্ডম চানাচুরের প্যাকেট।" } },
      { label: { en: "Hunt shop to shop for change", bn: "দোকানে দোকানে ভাংতি খুঁজুন" }, result: { en: "The ninth shop had change.", bn: "নবম দোকানে ভাংতি ছিল।" } },
    ],
  },
  pothole: {
    emoji: "🕳️",
    text: { en: "A pothole the size of a pond. The {vehicle} considers its life choices.", bn: "পুকুরের মতো বড় একটা গর্ত। {vehicle} নিজের জীবন নিয়ে ভাবছে।" },
    choices: [
      { label: { en: "Go straight through", bn: "সোজা ভেতর দিয়ে যান" }, result: { en: "Your spine now has a new shape.", bn: "আপনার মেরুদণ্ডের এখন নতুন আকৃতি।" } },
      { label: { en: "Go the long way round", bn: "ঘুরে যান" }, result: { en: "Safe and slow.", bn: "নিরাপদ, ধীর।" } },
      { label: { en: "Laugh about it", bn: "হেসে উড়িয়ে দিন" }, result: { en: "Dhaka can't break you.", bn: "ঢাকা আপনাকে ভাঙতে পারবে না।" } },
    ],
  },
  fuchka: {
    emoji: "🥙",
    text: { en: "The smell of fuchka ambushes you at the corner.", bn: "মোড়ে ফুচকার গন্ধ আপনাকে আক্রমণ করল।" },
    choices: [
      { label: { en: "Stop for a full plate", bn: "এক প্লেট খেয়ে যান" }, result: { en: "Late, but spiritually full.", bn: "দেরি, কিন্তু আত্মা তৃপ্ত।" } },
      { label: { en: "Resist (with tears)", bn: "লোভ সামলান (চোখে পানি নিয়ে)" }, result: { en: "Discipline. Sadness.", bn: "শৃঙ্খলা। দুঃখ।" } },
      { label: { en: "Just one, to go", bn: "শুধু একটা, হাতে নিয়ে" }, result: { en: "The perfect compromise.", bn: "নিখুঁত সমঝোতা।" } },
    ],
  },
  shortcut: {
    emoji: "🧭",
    text: { en: "A stranger swears he knows a shortcut. He seems very confident.", bn: "একজন অচেনা লোক কসম খেয়ে বলছেন তিনি শর্টকাট জানেন। খুব আত্মবিশ্বাসী।" },
    choices: [
      { label: { en: "Trust him", bn: "বিশ্বাস করুন" }, result: { en: "It actually worked?! Terrifying lanes, though.", bn: "সত্যিই কাজ করল?! যদিও গলিগুলো ভয়ংকর।" } },
      { label: { en: "Stick to the main road", bn: "মেইন রোডেই থাকুন" }, result: { en: "Predictable. Boring. Fine.", bn: "অনুমেয়। বিরক্তিকর। ঠিক আছে।" } },
      { label: { en: "Get a second opinion over cha", bn: "চা খেতে খেতে আরেকজনের মত নিন" }, result: { en: "Cha was great. Advice was not.", bn: "চা দারুণ ছিল। পরামর্শ না।" } },
    ],
  },
  "last-stretch": {
    emoji: "🏁",
    text: { en: "{dest} is in sight! “এখানে নামেন, সামনে যাওয়া যাবে না।”", bn: "{dest} দেখা যাচ্ছে! “এখানে নামেন, সামনে যাওয়া যাবে না।”" },
    choices: [
      { label: { en: "Walk the last bit", bn: "শেষটুকু হেঁটে যান" }, result: { en: "The final steps of a legend.", bn: "এক কিংবদন্তির শেষ পদক্ষেপ।" } },
      { label: { en: "Pay ৳30 to go the last 300 m", bn: "শেষ ৩০০ মিটারের জন্য ৩০ টাকা দিন" }, result: { en: "Door-to-door luxury.", bn: "দরজায় দরজায় বিলাসিতা।" } },
      { label: { en: "Give up and go home", bn: "হাল ছেড়ে বাসায় যান" }, result: { en: "Some battles aren't worth it.", bn: "কিছু যুদ্ধ লড়ার মতো না।" } },
    ],
  },
};

export type ChaosOutcome = { emoji: string; title: Text; blurb: Text; accent: Accent };

export const outcomes: Record<OutcomeId, ChaosOutcome> = {
  "early-miracle": {
    emoji: "🌈",
    title: { en: "Arrived EARLY. In Dhaka.", bn: "আগেভাগে পৌঁছালেন। ঢাকায়।" },
    blurb: { en: "Mission done, money left, mind calm, minutes to spare. Scientists want to study you.", bn: "মিশন সফল, টাকা বাকি, মাথা ঠান্ডা, হাতে সময়। বিজ্ঞানীরা আপনাকে নিয়ে গবেষণা করতে চান।" },
    accent: "lime",
  },
  "mission-complete": {
    emoji: "🎯",
    title: { en: "Mission Complete", bn: "মিশন সম্পন্ন" },
    blurb: { en: "The chaos tried. You adapted. Dhaka respects you (a little).", bn: "হট্টগোল চেষ্টা করেছে। আপনি মানিয়ে নিয়েছেন। ঢাকা আপনাকে সম্মান করে (একটু)।" },
    accent: "cng",
  },
  "late-but-alive": {
    emoji: "⏰",
    title: { en: "Late, But Alive", bn: "দেরিতে, তবে জীবিত" },
    blurb: { en: "You arrived. Everyone else was also late, so technically you're on time.", bn: "পৌঁছেছেন। বাকি সবাইও দেরিতে, তাই টেকনিক্যালি আপনি সময়মতো।" },
    accent: "marigold",
  },
  broke: {
    emoji: "🪙",
    title: { en: "Arrived, but Broke", bn: "পৌঁছালেন, কিন্তু ফতুর" },
    blurb: { en: "Every problem had a price, and you paid them all.", bn: "প্রতিটা সমস্যার একটা দাম ছিল, আর আপনি সবগুলোই দিয়েছেন।" },
    accent: "tangerine",
  },
  soaked: {
    emoji: "💦",
    title: { en: "Arrived Fully Soaked", bn: "ভিজে একাকার হয়ে পৌঁছালেন" },
    blurb: { en: "You are now 60% rainwater. The meeting will be… memorable.", bn: "আপনি এখন ৬০% বৃষ্টির পানি। মিটিংটা… মনে রাখার মতো হবে।" },
    accent: "sky",
  },
  omelette: {
    emoji: "🍳",
    title: { en: "Delivered an Omelette", bn: "ডিমের বদলে অমলেট" },
    blurb: { en: "You were supposed to bring eggs. You brought breakfast.", bn: "ডিম আনার কথা ছিল। নিয়ে এলেন নাস্তা।" },
    accent: "marigold",
  },
  meltdown: {
    emoji: "🤯",
    title: { en: "Complete Mental Meltdown", bn: "মাথা পুরো গরম" },
    blurb: { en: "You arrived physically. Mentally, you're still at the first jam.", bn: "শরীর পৌঁছেছে। মন এখনো প্রথম জ্যামে আটকে।" },
    accent: "chili",
  },
  "wrong-destination": {
    emoji: "🗺️",
    title: { en: "Wrong Destination (Confidently)", bn: "ভুল গন্তব্যে (আত্মবিশ্বাসের সাথে)" },
    blurb: { en: "You wanted {dest}. You got somewhere else entirely. Nice place, though.", bn: "যেতে চেয়েছিলেন {dest}। পৌঁছালেন একদম অন্য কোথাও। জায়গাটা অবশ্য সুন্দর।" },
    accent: "violet",
  },
  "went-home": {
    emoji: "🛋️",
    title: { en: "Gave Up and Went Home", bn: "হাল ছেড়ে বাসায় ফিরলেন" },
    blurb: { en: "{dest} will still be there tomorrow. Probably. The sofa welcomed you back.", bn: "{dest} কালও থাকবে। সম্ভবত। সোফা আপনাকে স্বাগত জানাল।" },
    accent: "violet",
  },
  "total-chaos": {
    emoji: "🌪️",
    title: { en: "Total Chaos Achieved", bn: "পূর্ণ হট্টগোল অর্জিত" },
    blurb: { en: "Late, broke and deeply confused. This is the purest Dhaka experience.", bn: "দেরি, ফতুর আর গভীরভাবে বিভ্রান্ত। এটাই সবচেয়ে খাঁটি ঢাকার অভিজ্ঞতা।" },
    accent: "chili",
  },
};

export type ChaosRank = { emoji: string; title: Text };

export const chaosRanks: Record<RankId, ChaosRank> = {
  "chaos-lord": { emoji: "👑", title: { en: "Lord of Chaos", bn: "হট্টগোলের সম্রাট" } },
  "dhaka-native": { emoji: "🏙️", title: { en: "Certified Dhaka Native", bn: "সার্টিফায়েড ঢাকাবাসী" } },
  "street-survivor": { emoji: "🧭", title: { en: "Street-Smart Survivor", bn: "চালাক পথযাত্রী" } },
  "confused-tourist": { emoji: "🗺️", title: { en: "Confused Tourist", bn: "বিভ্রান্ত পর্যটক" } },
  "chaos-victim": { emoji: "🌀", title: { en: "Victim of Chaos", bn: "হট্টগোলের শিকার" } },
};

/** "7:43 PM" / "সন্ধ্যা ৭:৪৩". */
export function formatClock(minutes: number, lang: Lang): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mm = String(m).padStart(2, "0");
  if (lang === "en") return `${h12}:${mm} ${h < 12 ? "AM" : "PM"}`;
  const part = h < 12 ? "সকাল" : h < 15 ? "দুপুর" : h < 18 ? "বিকাল" : h < 20 ? "সন্ধ্যা" : "রাত";
  return `${part} ${num(h12, "bn")}:${mm.replace(/\d/g, (d) => num(Number(d), "bn"))}`;
}
