import type { Experience, RunContext } from "@/lib/experience/types";

// Shipped ids are permanent (share links store them). See AGENTS.md.
// Fictional sellers only — no real shops, brands or payment services.

const cart = (c: RunContext) => c.choices.cart ?? "";
const pay = (c: RunContext) => c.choices.payment ?? "";
const speed = (c: RunContext) => c.choices.speed ?? "";
const seller = (c: RunContext) => c.beats.seller ?? "";
const delivery = (c: RunContext) => c.beats.delivery ?? "";

const SELLER = { en: "Seller", bn: "বিক্রেতা" };
const RECEIVED = { en: "Received", bn: "হাতে পেয়েছি" };
const SPENT = { en: "Spent", bn: "খরচ" };

export const fakeShopping: Experience = {
  slug: "fake-shopping-spree",
  title: { en: "Fake Shopping Spree", bn: "ফেক শপিং" },
  tagline: { en: "Add everything to cart. Pay with vibes.", bn: "সবকিছু কার্টে তুলুন। পেমেন্ট করুন ভাইব দিয়ে।" },
  description: {
    en: "Fill your cart, deal with the seller, pick a delivery option and see what actually arrives. No real money, all of the regret.",
    bn: "কার্ট ভরুন, বিক্রেতার সাথে ডিল করুন, ডেলিভারি বেছে নিন আর দেখুন আসলে কী আসে। আসল টাকা নেই, আফসোস পুরোটাই।",
  },
  startLabel: { en: "Start shopping 🛒", bn: "শপিং শুরু 🛒" },
  category: "shopping",
  emoji: "🛍️",
  durationSec: 60,
  accent: "chili",
  seo: {
    title: "Fake Shopping Spree — Online Shopping Without the Bill",
    description:
      "A free, funny one-minute online shopping simulator. Fill your cart, deal with the seller and see what actually arrives. No real money involved.",
  },
  steps: [
    {
      kind: "choice",
      id: "cart",
      prompt: { en: "What's going in the cart?", bn: "কার্টে কী তুলবেন?" },
      cardLabel: { en: "Cart", bn: "কার্ট" },
      options: [
        { id: "phone", emoji: "📱", label: { en: "A phone from the mega sale", bn: "মেগা সেলের একটা ফোন" }, hint: { en: "90% off. Totally normal.", bn: "৯০% ছাড়। একদম স্বাভাবিক।" } },
        { id: "shoes", emoji: "👟", label: { en: "Sneakers from a social media page", bn: "সোশ্যাল মিডিয়া পেজের স্নিকার্স" }, hint: { en: "The photo looks very professional.", bn: "ছবিটা খুবই প্রফেশনাল।" } },
        { id: "blender", emoji: "🧃", label: { en: "A \"wireless\" blender", bn: "\"ওয়্যারলেস\" ব্লেন্ডার" }, hint: { en: "What does wireless mean here?", bn: "এখানে ওয়্যারলেস মানে কী?" } },
        { id: "under99", emoji: "🛒", label: { en: "Everything in the ৳99 section", bn: "৳৯৯ সেকশনের সবকিছু" }, hint: { en: "It's cheap. Each one is cheap.", bn: "সস্তা। প্রতিটাই সস্তা।" } },
      ],
    },
    {
      kind: "beat",
      id: "seller",
      title: { en: "The seller replies", bn: "বিক্রেতার উত্তর" },
      beats: [
        { id: "inbox", speaker: SELLER, text: "দাম জানতে ইনবক্স করুন।", weight: (c) => (cart(c) === "shoes" ? 6 : 2) },
        { id: "limited", speaker: SELLER, text: "স্টক লিমিটেড! আর মাত্র ২টা বাকি।", weight: 3 },
        { id: "original", speaker: SELLER, text: "১০০% অরিজিনাল, একদম মাস্টার কপি।", weight: 3 },
        { id: "extra-charge", speaker: SELLER, text: "ডেলিভারি চার্জ আলাদা। প্যাকেজিং চার্জও আলাদা।", weight: 2 },
      ],
    },
    {
      kind: "choice",
      id: "payment",
      prompt: { en: "How will you pay?", bn: "পেমেন্ট কীভাবে?" },
      cardLabel: { en: "Payment", bn: "পেমেন্ট" },
      options: [
        { id: "cod", emoji: "💵", label: { en: "Cash on delivery", bn: "ক্যাশ অন ডেলিভারি" }, hint: { en: "Trust issues: healthy.", bn: "বিশ্বাসের সমস্যা: স্বাস্থ্যকর।" } },
        { id: "advance", emoji: "📲", label: { en: "Pay in advance", bn: "অগ্রিম পেমেন্ট" }, hint: { en: "Brave. Possibly too brave.", bn: "সাহসী। হয়তো একটু বেশিই।" } },
        { id: "vibes", emoji: "✨", label: { en: "Just add it to the wishlist", bn: "শুধু উইশলিস্টে রাখুন" }, hint: { en: "Paying with vibes.", bn: "ভাইব দিয়ে পেমেন্ট।" } },
      ],
    },
    {
      kind: "choice",
      id: "speed",
      prompt: { en: "Delivery speed?", bn: "ডেলিভারি কত দ্রুত?" },
      cardLabel: { en: "Delivery", bn: "ডেলিভারি" },
      options: [
        { id: "standard", emoji: "📦", label: { en: "Standard (3–5 days)", bn: "স্ট্যান্ডার্ড (৩–৫ দিন)" }, hint: { en: "Days are a social construct.", bn: "দিন তো একটা ধারণা মাত্র।" } },
        { id: "express", emoji: "⚡", label: { en: "Express (same day)", bn: "এক্সপ্রেস (আজই)" }, hint: { en: "Extra ৳150 for extra hope.", bn: "অতিরিক্ত আশার জন্য অতিরিক্ত ৳১৫০।" } },
      ],
    },
    {
      kind: "beat",
      id: "delivery",
      title: { en: "Delivery day", bn: "ডেলিভারির দিন" },
      beats: [
        { id: "wrong-district", emoji: "🗺️", weight: 2, text: { en: "The delivery man calls. He is in a different district. He asks you to come.", bn: "ডেলিভারিম্যানের ফোন। উনি অন্য জেলায়। আপনাকে আসতে বলছেন।" } },
        { id: "forever", emoji: "🚚", weight: (c) => (speed(c) === "standard" ? 4 : 2), text: { en: "Tracking says \"Out for delivery\". It has said this for 11 days.", bn: "ট্র্যাকিং বলছে \"ডেলিভারির পথে\"। ১১ দিন ধরে এটাই বলছে।" } },
        { id: "huge-box", emoji: "📦", weight: 3, text: { en: "A box the size of a fridge arrives. Inside: bubble wrap and your item, very small.", bn: "ফ্রিজের সমান একটা বাক্স এলো। ভেতরে: বাবল র‍্যাপ আর আপনার জিনিস, খুব ছোট।" } },
        { id: "not-home", emoji: "🚪", weight: 2, text: { en: "It arrives the one hour you stepped out. The delivery man has already left. Forever.", bn: "যে এক ঘণ্টা বাইরে ছিলেন, ঠিক তখনই এলো। ডেলিভারিম্যান চলে গেছেন। চিরতরে।" } },
        { id: "smooth", emoji: "🟢", weight: 0.6, text: { en: "It arrives on time. The box is the right size. You check it twice anyway.", bn: "সময়মতো এলো। বাক্সের সাইজও ঠিক। তবুও দুইবার চেক করলেন।" } },
      ],
    },
  ],
  outcomes: [
    {
      id: "expectation-reality",
      emoji: "🤡",
      title: { en: "Expectation vs Reality", bn: "প্রত্যাশা বনাম বাস্তবতা" },
      quote: "ছবির সাথে একটু আধটু পার্থক্য হতেই পারে।",
      message: { en: "What arrived looks nothing like the photo. The colour is a new colour. Science has no name for it.", bn: "যা এসেছে তা ছবির সাথে একদমই মেলে না। রঙটা একটা নতুন রঙ। বিজ্ঞান এর নাম জানে না।" },
      card: [{ label: RECEIVED, value: "✅" }, { label: { en: "Looks like the photo", bn: "ছবির মতো" }, value: "❌" }],
      shareText: { en: "Online shopping: expectation vs reality 🤡", bn: "অনলাইন শপিং: প্রত্যাশা বনাম বাস্তবতা 🤡" },
      weight: (c) => 2 + (cart(c) === "shoes" ? 2 : 0) + (seller(c) === "original" ? 2 : 0),
    },
    {
      id: "inbox-loop",
      emoji: "💬",
      title: { en: "Trapped in the Inbox", bn: "ইনবক্সে আটকা" },
      quote: "দাম জানতে ইনবক্স করুন।",
      message: { en: "You sent 40 messages. The seller replied \"inbox\" 40 times. You still don't know the price. You never will.", bn: "৪০টা মেসেজ পাঠালেন। বিক্রেতা ৪০ বার লিখলেন \"ইনবক্স\"। দাম এখনো জানেন না। কখনো জানবেনও না।" },
      card: [{ label: { en: "Messages sent", bn: "মেসেজ পাঠানো" }, value: { en: "40", bn: "৪০" } }, { label: { en: "Price known", bn: "দাম জানা" }, value: "❌" }],
      shareText: { en: "Asked a page for the price 40 times. They said 'inbox' 40 times 💬", bn: "৪০ বার দাম জিজ্ঞেস করলাম। ৪০ বার উত্তর এলো 'ইনবক্স' 💬" },
      weight: (c) => (seller(c) === "inbox" ? 5 : 0),
    },
    {
      id: "wishlist-rich",
      emoji: "✨",
      title: { en: "Wishlist Millionaire", bn: "উইশলিস্ট কোটিপতি" },
      quote: "পরে কিনব।",
      message: { en: "Your wishlist is worth ৳3.4 lakh. Your bank balance is untouched. Financially, you won today.", bn: "আপনার উইশলিস্টের দাম ৳৩.৪ লাখ। ব্যাংক ব্যালেন্সে হাতও পড়েনি। আর্থিকভাবে আজ আপনি জিতেছেন।" },
      card: [{ label: SPENT, value: "৳0" }, { label: { en: "Wishlist value", bn: "উইশলিস্টের দাম" }, value: { en: "৳3.4 lakh", bn: "৳৩.৪ লাখ" } }],
      shareText: { en: "Went on a shopping spree. Spent ৳0. Wishlist worth ৳3.4 lakh ✨", bn: "শপিংয়ে গেলাম। খরচ ৳০। উইশলিস্ট ৳৩.৪ লাখের ✨" },
      weight: (c) => (pay(c) === "vibes" ? 8 : 0),
    },
    {
      id: "tiny-item",
      emoji: "📦",
      title: { en: "Huge Box, Tiny Item", bn: "বিশাল বাক্স, ছোট্ট জিনিস" },
      quote: "সেফটির জন্য একটু ভালো প্যাকিং দিছি।",
      message: { en: "The box now lives in your room. It is bigger than your wardrobe. Your cat has moved into it permanently.", bn: "বাক্সটা এখন আপনার রুমে থাকে। আলমারির চেয়েও বড়। আপনার বিড়াল স্থায়ীভাবে ওতে উঠে গেছে।" },
      card: [{ label: RECEIVED, value: "✅" }, { label: { en: "Box-to-item ratio", bn: "বাক্স বনাম জিনিস" }, value: "500:1" }],
      shareText: { en: "My online order came in a box the size of a fridge 📦", bn: "আমার অনলাইন অর্ডার এলো ফ্রিজের সমান বাক্সে 📦" },
      weight: (c) => (delivery(c) === "huge-box" ? 5 : 0.5),
    },
    {
      id: "forever-shipping",
      emoji: "🚚",
      title: { en: "Out for Delivery (Forever)", bn: "ডেলিভারির পথে (চিরকাল)" },
      quote: "আজকেই পাবেন ইনশাআল্লাহ।",
      message: { en: "Day 11: out for delivery. Day 19: out for delivery. You've made peace with it. It's a lifestyle now.", bn: "দিন ১১: ডেলিভারির পথে। দিন ১৯: ডেলিভারির পথে। আপনি মেনে নিয়েছেন। এখন এটা লাইফস্টাইল।" },
      card: [{ label: RECEIVED, value: "⏳" }, { label: { en: "Days in transit", bn: "পথে কত দিন" }, value: { en: "19", bn: "১৯" } }],
      shareText: { en: "My package has been 'out for delivery' for 19 days 🚚", bn: "আমার পার্সেল ১৯ দিন ধরে 'ডেলিভারির পথে' 🚚" },
      weight: (c) => (delivery(c) === "forever" ? 5 : 0),
    },
    {
      id: "wrong-district",
      emoji: "🗺️",
      title: { en: "Delivered to Another District", bn: "অন্য জেলায় ডেলিভারি" },
      quote: "ভাই, আপনি একটু আসেন না?",
      message: { en: "Your parcel is in a town you've never visited. The delivery man is enjoying the view. He sent a photo.", bn: "আপনার পার্সেল এমন এক শহরে যেখানে কখনো যাননি। ডেলিভারিম্যান ভিউ উপভোগ করছেন। ছবি পাঠিয়েছেন।" },
      card: [{ label: RECEIVED, value: "❌" }, { label: { en: "Parcel location", bn: "পার্সেলের অবস্থান" }, value: { en: "🗺️ elsewhere", bn: "🗺️ অন্য কোথাও" } }],
      shareText: { en: "My online order got delivered to a different district 🗺️", bn: "আমার অর্ডার অন্য জেলায় ডেলিভারি হয়ে গেল 🗺️" },
      weight: (c) => (delivery(c) === "wrong-district" ? 5 : 0),
    },
    {
      id: "wireless-blender",
      emoji: "🧃",
      title: { en: "Truly Wireless", bn: "সত্যিকারের ওয়্যারলেস" },
      quote: "ওয়্যারলেস মানে তার নাই, মোটরও নাই।",
      message: { en: "The blender is wireless because it has no motor. It is a jug with a lid. You now make smoothies by shaking it.", bn: "ব্লেন্ডারটা ওয়্যারলেস কারণ এতে মোটরই নেই। এটা ঢাকনাওয়ালা একটা জগ। এখন আপনি ঝাঁকিয়ে স্মুদি বানান।" },
      card: [{ label: RECEIVED, value: "✅" }, { label: { en: "Motor", bn: "মোটর" }, value: "❌" }],
      shareText: { en: "Bought a 'wireless' blender. It has no motor 🧃", bn: "\"ওয়্যারলেস\" ব্লেন্ডার কিনলাম। মোটরই নেই 🧃" },
      weight: (c) => (cart(c) === "blender" ? 5 : 0),
    },
    {
      id: "cart-of-nonsense",
      emoji: "🛒",
      title: { en: "The ৳99 Trap", bn: "৳৯৯-এর ফাঁদ" },
      quote: "সবই তো সস্তা ছিল…",
      message: { en: "47 items at ৳99 each. Plus 47 delivery charges. You spent ৳8,000 on things you can't name.", bn: "প্রতিটা ৳৯৯ করে ৪৭টা জিনিস। সাথে ৪৭টা ডেলিভারি চার্জ। যেসব জিনিসের নাম জানেন না তার পেছনে ৳৮,০০০ গেল।" },
      card: [{ label: { en: "Items", bn: "জিনিস" }, value: { en: "47", bn: "৪৭" } }, { label: SPENT, value: { en: "৳8,000", bn: "৳৮,০০০" } }],
      shareText: { en: "Bought everything under ৳99. Somehow spent ৳8,000 🛒", bn: "৳৯৯-এর নিচের সবকিছু কিনলাম। কীভাবে যেন ৳৮,০০০ খরচ 🛒" },
      weight: (c) => (cart(c) === "under99" ? 4 + (seller(c) === "extra-charge" ? 3 : 0) : 0),
    },
    {
      id: "page-vanished",
      emoji: "👻",
      title: { en: "The Page Disappeared", bn: "পেজটাই উধাও" },
      quote: "এই পেজটি আর পাওয়া যাচ্ছে না।",
      message: { en: "You paid in advance. The shop's page vanished the next morning. The profile photo was a cartoon cat. You should have noticed.", bn: "অগ্রিম দিলেন। পরদিন সকালে দোকানের পেজ উধাও। প্রোফাইল ছবি ছিল কার্টুন বিড়াল। আগেই বোঝা উচিত ছিল।" },
      card: [{ label: RECEIVED, value: "❌" }, { label: { en: "Lesson learned", bn: "শিক্ষা" }, value: "✅" }],
      shareText: { en: "Paid in advance to an online page. The page vanished 👻", bn: "অনলাইন পেজে অগ্রিম দিলাম। পেজটাই উধাও 👻" },
      weight: (c) => (pay(c) === "advance" ? 3 : 0),
    },
    {
      id: "not-home",
      emoji: "🚪",
      title: { en: "You Weren't Home", bn: "আপনি বাসায় ছিলেন না" },
      quote: "ভাই, ৫ বার কল দিছি।",
      message: { en: "The parcel came during the only hour you left the house in 3 weeks. It's back at the warehouse. It's happy there.", bn: "৩ সপ্তাহে একবারই বাসা থেকে বের হয়েছিলেন, ঠিক তখনই পার্সেল এলো। এখন ওটা গুদামে ফেরত। সেখানেই খুশি।" },
      card: [{ label: RECEIVED, value: "❌" }, { label: { en: "Missed calls", bn: "মিসড কল" }, value: { en: "5", bn: "৫" } }],
      shareText: { en: "Left home for one hour in 3 weeks. That's when my parcel came 🚪", bn: "৩ সপ্তাহে এক ঘণ্টার জন্য বাইরে গেলাম। তখনই পার্সেল এলো 🚪" },
      weight: (c) => (delivery(c) === "not-home" ? 5 : 0),
    },
    {
      id: "as-pictured",
      emoji: "🏆",
      title: { en: "Exactly as Pictured", bn: "হুবহু ছবির মতো" },
      quote: "আবার কিনবেন ভাই!",
      message: { en: "Right item. Right colour. Right size. On time. You left a 5-star review with tears in your eyes.", bn: "সঠিক জিনিস। সঠিক রঙ। সঠিক সাইজ। সময়মতো। চোখে জল নিয়ে ৫ স্টার রিভিউ দিলেন।" },
      card: [{ label: RECEIVED, value: "✅" }, { label: { en: "Looks like the photo", bn: "ছবির মতো" }, value: "✅ (?!)" }],
      shareText: { en: "My online order arrived exactly as pictured. Framing the receipt 🏆", bn: "আমার অনলাইন অর্ডার হুবহু ছবির মতো এসেছে। রসিদ ফ্রেমে বাঁধাব 🏆" },
      weight: (c) => (pay(c) === "vibes" ? 0 : 0.4 + (delivery(c) === "smooth" ? 3 : 0) + (pay(c) === "cod" ? 0.3 : 0)),
    },
  ],
};
