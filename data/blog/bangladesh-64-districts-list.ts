import type { BlogPost } from "@/lib/blog";

// District names and grouping come from data/divisions.ts and
// data/dialects/districts.ts (validated at import). Keep them in sync.

const HEAD = [
  { en: "District (English)", bn: "জেলা (ইংরেজি)" },
  { en: "District (Bangla)", bn: "জেলা (বাংলা)" },
] as const;

export const bangladesh64Districts: BlogPost = {
  slug: "bangladesh-64-districts-list",
  status: "needs_review",
  published: "",
  topic: "places",
  title: {
    en: "All 64 Districts of Bangladesh, by Division",
    bn: "বিভাগ অনুযায়ী বাংলাদেশের ৬৪টি জেলা",
  },
  seo: {
    en: {
      title: "All 64 Districts of Bangladesh by Division (with Map)",
      description:
        "Every one of Bangladesh's 64 districts listed under its 8 divisions, with English and Bangla names, a district map and the 2018 spelling changes.",
    },
    bn: {
      title: "বাংলাদেশের ৬৪ জেলার নাম: বিভাগ অনুযায়ী তালিকা ও মানচিত্র",
      description:
        "বাংলাদেশের ৮টি বিভাগ ও ৬৪টি জেলার পূর্ণ তালিকা — ইংরেজি ও বাংলা নামসহ, জেলার মানচিত্র এবং ২০১৮ সালে বদলানো ইংরেজি বানানের ব্যাখ্যা।",
    },
  },
  lead: {
    en: "A clear list of the 8 divisions and 64 districts of Bangladesh, with English and Bangla names, a colour map, and a short guide to the spellings that changed in 2018.",
    bn: "বাংলাদেশের ৮টি বিভাগ আর ৬৪টি জেলার একটি পরিষ্কার তালিকা — ইংরেজি ও বাংলা নাম, রঙিন মানচিত্র এবং ২০১৮ সালে বদলানো বানানের ছোট্ট একটি গাইডসহ।",
  },
  cover: { emoji: "🗺️", accent: "marigold" },
  body: [
    {
      kind: "p",
      text: {
        en: "Bangladesh is divided into 8 divisions, and together those divisions contain 64 districts, called zila in Bangla. This page lists every district under its division, with the English spelling the government uses today and the Bangla name, so you can find a place quickly or check how it is written.",
        bn: "বাংলাদেশ ৮টি বিভাগে ভাগ করা, আর এই বিভাগগুলো মিলিয়ে মোট ৬৪টি জেলা। এই পাতায় প্রতিটি জেলাকে তার বিভাগের নিচে রাখা হয়েছে — সরকারের বর্তমান ইংরেজি বানান আর বাংলা নাম দুটোই দেওয়া আছে, যাতে আপনি দ্রুত কোনো জায়গা খুঁজে পান বা তার নাম কীভাবে লেখা হয় তা মিলিয়ে নিতে পারেন।",
      },
    },
    {
      kind: "p",
      text: {
        en: "A division is the top level of local administration and is headed by a Divisional Commissioner. A district is the next level down, run by a Deputy Commissioner, usually just called the DC. Districts are split further into upazilas, but this list stops at the district level.",
        bn: "বিভাগ হলো স্থানীয় প্রশাসনের সবচেয়ে উপরের স্তর, যার প্রধান বিভাগীয় কমিশনার। তার পরের স্তর জেলা, যা পরিচালনা করেন জেলা প্রশাসক বা ডেপুটি কমিশনার — সবাই যাঁকে ডিসি বলে চেনেন। জেলাগুলো আবার উপজেলায় ভাগ করা, তবে এই তালিকা জেলা পর্যন্তই।",
      },
    },
    {
      kind: "callout",
      tone: "note",
      text: {
        en: "Quick count: Dhaka 13, Chattogram 11, Rajshahi 8, Khulna 10, Barishal 6, Sylhet 4, Rangpur 8 and Mymensingh 4. Add them up and you get 64.",
        bn: "এক নজরে হিসাব: ঢাকা ১৩, চট্টগ্রাম ১১, রাজশাহী ৮, খুলনা ১০, বরিশাল ৬, সিলেট ৪, রংপুর ৮ আর ময়মনসিংহ ৪। যোগ করলে দাঁড়ায় ৬৪।",
      },
    },
    { kind: "h2", text: { en: "Map of the 64 districts", bn: "৬৪ জেলার মানচিত্র" } },
    {
      kind: "p",
      text: {
        en: "On the map below, each district is coloured by the division it belongs to. It is a handy way to see how the divisions fit together before you read the lists.",
        bn: "নিচের মানচিত্রে প্রতিটি জেলা তার বিভাগের রঙে রাঙানো। তালিকাগুলো পড়ার আগে বিভাগগুলো কীভাবে পাশাপাশি বসানো, তা এক নজরে দেখে নেওয়ার সহজ উপায় এটি।",
      },
    },
    { kind: "map" },

    { kind: "h2", text: { en: "Dhaka Division (13 districts)", bn: "ঢাকা বিভাগ (১৩টি জেলা)" } },
    {
      kind: "p",
      text: {
        en: "Dhaka Division sits in the middle of the country and has more districts than any other division. Besides the capital, it includes nearby Gazipur and Narayanganj and reaches south to Gopalganj and Shariatpur.",
        bn: "ঢাকা বিভাগ দেশের মাঝখানে, আর জেলার সংখ্যায় এটিই সবচেয়ে বড় বিভাগ। রাজধানী ছাড়াও এতে আছে কাছের গাজীপুর ও নারায়ণগঞ্জ, আর দক্ষিণে এটি গোপালগঞ্জ ও শরীয়তপুর পর্যন্ত বিস্তৃত।",
      },
    },
    { kind: "table", head: HEAD, rows: [
        [{ en: "Dhaka", bn: "Dhaka" }, { en: "ঢাকা", bn: "ঢাকা" }],
        [{ en: "Faridpur", bn: "Faridpur" }, { en: "ফরিদপুর", bn: "ফরিদপুর" }],
        [{ en: "Gazipur", bn: "Gazipur" }, { en: "গাজীপুর", bn: "গাজীপুর" }],
        [{ en: "Gopalganj", bn: "Gopalganj" }, { en: "গোপালগঞ্জ", bn: "গোপালগঞ্জ" }],
        [{ en: "Kishoreganj", bn: "Kishoreganj" }, { en: "কিশোরগঞ্জ", bn: "কিশোরগঞ্জ" }],
        [{ en: "Madaripur", bn: "Madaripur" }, { en: "মাদারীপুর", bn: "মাদারীপুর" }],
        [{ en: "Manikganj", bn: "Manikganj" }, { en: "মানিকগঞ্জ", bn: "মানিকগঞ্জ" }],
        [{ en: "Munshiganj", bn: "Munshiganj" }, { en: "মুন্সীগঞ্জ", bn: "মুন্সীগঞ্জ" }],
        [{ en: "Narayanganj", bn: "Narayanganj" }, { en: "নারায়ণগঞ্জ", bn: "নারায়ণগঞ্জ" }],
        [{ en: "Narsingdi", bn: "Narsingdi" }, { en: "নরসিংদী", bn: "নরসিংদী" }],
        [{ en: "Rajbari", bn: "Rajbari" }, { en: "রাজবাড়ী", bn: "রাজবাড়ী" }],
        [{ en: "Shariatpur", bn: "Shariatpur" }, { en: "শরীয়তপুর", bn: "শরীয়তপুর" }],
        [{ en: "Tangail", bn: "Tangail" }, { en: "টাঙ্গাইল", bn: "টাঙ্গাইল" }],
    ] },

    { kind: "h2", text: { en: "Chattogram Division (11 districts)", bn: "চট্টগ্রাম বিভাগ (১১টি জেলা)" } },
    {
      kind: "p",
      text: {
        en: "Chattogram Division covers the south-east, from Brahmanbaria and Cumilla in the north to Cox's Bazar on the coast. Three of its districts, Rangamati, Khagrachhari and Bandarban, make up the Chittagong Hill Tracts.",
        bn: "চট্টগ্রাম বিভাগ দেশের দক্ষিণ-পূর্ব অংশ জুড়ে — উত্তরে ব্রাহ্মণবাড়িয়া ও কুমিল্লা থেকে উপকূলের কক্সবাজার পর্যন্ত। এর তিনটি জেলা — রাঙ্গামাটি, খাগড়াছড়ি ও বান্দরবান — মিলে পার্বত্য চট্টগ্রাম।",
      },
    },
    { kind: "table", head: HEAD, rows: [
        [{ en: "Chattogram", bn: "Chattogram" }, { en: "চট্টগ্রাম", bn: "চট্টগ্রাম" }],
        [{ en: "Cox's Bazar", bn: "Cox's Bazar" }, { en: "কক্সবাজার", bn: "কক্সবাজার" }],
        [{ en: "Cumilla", bn: "Cumilla" }, { en: "কুমিল্লা", bn: "কুমিল্লা" }],
        [{ en: "Brahmanbaria", bn: "Brahmanbaria" }, { en: "ব্রাহ্মণবাড়িয়া", bn: "ব্রাহ্মণবাড়িয়া" }],
        [{ en: "Chandpur", bn: "Chandpur" }, { en: "চাঁদপুর", bn: "চাঁদপুর" }],
        [{ en: "Feni", bn: "Feni" }, { en: "ফেনী", bn: "ফেনী" }],
        [{ en: "Lakshmipur", bn: "Lakshmipur" }, { en: "লক্ষ্মীপুর", bn: "লক্ষ্মীপুর" }],
        [{ en: "Noakhali", bn: "Noakhali" }, { en: "নোয়াখালী", bn: "নোয়াখালী" }],
        [{ en: "Rangamati", bn: "Rangamati" }, { en: "রাঙ্গামাটি", bn: "রাঙ্গামাটি" }],
        [{ en: "Khagrachhari", bn: "Khagrachhari" }, { en: "খাগড়াছড়ি", bn: "খাগড়াছড়ি" }],
        [{ en: "Bandarban", bn: "Bandarban" }, { en: "বান্দরবান", bn: "বান্দরবান" }],
    ] },

    { kind: "h2", text: { en: "Rajshahi Division (8 districts)", bn: "রাজশাহী বিভাগ (৮টি জেলা)" } },
    {
      kind: "p",
      text: {
        en: "Rajshahi Division lies in the west of the country, with Rajshahi city on the bank of the Padma. Bogura, one of the five districts whose English spelling changed in 2018, belongs here.",
        bn: "রাজশাহী বিভাগ দেশের পশ্চিম অংশে; বিভাগীয় শহর রাজশাহী পদ্মার তীরে। ২০১৮ সালে যে পাঁচটি জেলার ইংরেজি বানান বদলেছে, তার একটি বগুড়া এই বিভাগেরই।",
      },
    },
    { kind: "table", head: HEAD, rows: [
        [{ en: "Rajshahi", bn: "Rajshahi" }, { en: "রাজশাহী", bn: "রাজশাহী" }],
        [{ en: "Bogura", bn: "Bogura" }, { en: "বগুড়া", bn: "বগুড়া" }],
        [{ en: "Chapainawabganj", bn: "Chapainawabganj" }, { en: "চাঁপাইনবাবগঞ্জ", bn: "চাঁপাইনবাবগঞ্জ" }],
        [{ en: "Joypurhat", bn: "Joypurhat" }, { en: "জয়পুরহাট", bn: "জয়পুরহাট" }],
        [{ en: "Naogaon", bn: "Naogaon" }, { en: "নওগাঁ", bn: "নওগাঁ" }],
        [{ en: "Natore", bn: "Natore" }, { en: "নাটোর", bn: "নাটোর" }],
        [{ en: "Pabna", bn: "Pabna" }, { en: "পাবনা", bn: "পাবনা" }],
        [{ en: "Sirajganj", bn: "Sirajganj" }, { en: "সিরাজগঞ্জ", bn: "সিরাজগঞ্জ" }],
    ] },

    { kind: "h2", text: { en: "Khulna Division (10 districts)", bn: "খুলনা বিভাগ (১০টি জেলা)" } },
    {
      kind: "p",
      text: {
        en: "Khulna Division is in the south-west and stretches from Kushtia and Meherpur in the north down to Satkhira and Bagerhat near the coast. Jashore, formerly spelled Jessore in English, is one of its ten districts.",
        bn: "খুলনা বিভাগ দেশের দক্ষিণ-পশ্চিমে — উত্তরে কুষ্টিয়া ও মেহেরপুর থেকে উপকূলের কাছে সাতক্ষীরা ও বাগেরহাট পর্যন্ত। আগে ইংরেজিতে Jessore লেখা যশোরও এর দশটি জেলার একটি।",
      },
    },
    { kind: "table", head: HEAD, rows: [
        [{ en: "Khulna", bn: "Khulna" }, { en: "খুলনা", bn: "খুলনা" }],
        [{ en: "Bagerhat", bn: "Bagerhat" }, { en: "বাগেরহাট", bn: "বাগেরহাট" }],
        [{ en: "Chuadanga", bn: "Chuadanga" }, { en: "চুয়াডাঙ্গা", bn: "চুয়াডাঙ্গা" }],
        [{ en: "Jashore", bn: "Jashore" }, { en: "যশোর", bn: "যশোর" }],
        [{ en: "Jhenaidah", bn: "Jhenaidah" }, { en: "ঝিনাইদহ", bn: "ঝিনাইদহ" }],
        [{ en: "Kushtia", bn: "Kushtia" }, { en: "কুষ্টিয়া", bn: "কুষ্টিয়া" }],
        [{ en: "Magura", bn: "Magura" }, { en: "মাগুরা", bn: "মাগুরা" }],
        [{ en: "Meherpur", bn: "Meherpur" }, { en: "মেহেরপুর", bn: "মেহেরপুর" }],
        [{ en: "Narail", bn: "Narail" }, { en: "নড়াইল", bn: "নড়াইল" }],
        [{ en: "Satkhira", bn: "Satkhira" }, { en: "সাতক্ষীরা", bn: "সাতক্ষীরা" }],
    ] },

    { kind: "h2", text: { en: "Barishal Division (6 districts)", bn: "বরিশাল বিভাগ (৬টি জেলা)" } },
    {
      kind: "p",
      text: {
        en: "Barishal Division lies on the southern coast, where the river delta meets the Bay of Bengal. Its six districts include Bhola, an island district.",
        bn: "বরিশাল বিভাগ দক্ষিণের উপকূলে, যেখানে নদীর বদ্বীপ বঙ্গোপসাগরে মিশেছে। এর ছয়টি জেলার একটি দ্বীপ জেলা ভোলা।",
      },
    },
    { kind: "table", head: HEAD, rows: [
        [{ en: "Barishal", bn: "Barishal" }, { en: "বরিশাল", bn: "বরিশাল" }],
        [{ en: "Barguna", bn: "Barguna" }, { en: "বরগুনা", bn: "বরগুনা" }],
        [{ en: "Bhola", bn: "Bhola" }, { en: "ভোলা", bn: "ভোলা" }],
        [{ en: "Jhalokati", bn: "Jhalokati" }, { en: "ঝালকাঠি", bn: "ঝালকাঠি" }],
        [{ en: "Patuakhali", bn: "Patuakhali" }, { en: "পটুয়াখালী", bn: "পটুয়াখালী" }],
        [{ en: "Pirojpur", bn: "Pirojpur" }, { en: "পিরোজপুর", bn: "পিরোজপুর" }],
    ] },

    { kind: "h2", text: { en: "Sylhet Division (4 districts)", bn: "সিলেট বিভাগ (৪টি জেলা)" } },
    {
      kind: "p",
      text: {
        en: "Sylhet Division is in the north-east of the country. It has four districts, each named after its main town.",
        bn: "সিলেট বিভাগ দেশের উত্তর-পূর্ব কোণে। এর চারটি জেলা, আর প্রতিটির নাম সেই জেলার প্রধান শহরের নামে।",
      },
    },
    { kind: "table", head: HEAD, rows: [
        [{ en: "Sylhet", bn: "Sylhet" }, { en: "সিলেট", bn: "সিলেট" }],
        [{ en: "Habiganj", bn: "Habiganj" }, { en: "হবিগঞ্জ", bn: "হবিগঞ্জ" }],
        [{ en: "Moulvibazar", bn: "Moulvibazar" }, { en: "মৌলভীবাজার", bn: "মৌলভীবাজার" }],
        [{ en: "Sunamganj", bn: "Sunamganj" }, { en: "সুনামগঞ্জ", bn: "সুনামগঞ্জ" }],
    ] },

    { kind: "h2", text: { en: "Rangpur Division (8 districts)", bn: "রংপুর বিভাগ (৮টি জেলা)" } },
    {
      kind: "p",
      text: {
        en: "Rangpur Division covers the far north. Panchagarh sits at its northern tip, and Kurigram and Gaibandha lie along its eastern side.",
        bn: "রংপুর বিভাগ দেশের একেবারে উত্তরে। এর উত্তরের শেষ মাথায় পঞ্চগড়, আর পূর্ব দিকে কুড়িগ্রাম ও গাইবান্ধা।",
      },
    },
    { kind: "table", head: HEAD, rows: [
        [{ en: "Rangpur", bn: "Rangpur" }, { en: "রংপুর", bn: "রংপুর" }],
        [{ en: "Dinajpur", bn: "Dinajpur" }, { en: "দিনাজপুর", bn: "দিনাজপুর" }],
        [{ en: "Gaibandha", bn: "Gaibandha" }, { en: "গাইবান্ধা", bn: "গাইবান্ধা" }],
        [{ en: "Kurigram", bn: "Kurigram" }, { en: "কুড়িগ্রাম", bn: "কুড়িগ্রাম" }],
        [{ en: "Lalmonirhat", bn: "Lalmonirhat" }, { en: "লালমনিরহাট", bn: "লালমনিরহাট" }],
        [{ en: "Nilphamari", bn: "Nilphamari" }, { en: "নীলফামারী", bn: "নীলফামারী" }],
        [{ en: "Panchagarh", bn: "Panchagarh" }, { en: "পঞ্চগড়", bn: "পঞ্চগড়" }],
        [{ en: "Thakurgaon", bn: "Thakurgaon" }, { en: "ঠাকুরগাঁও", bn: "ঠাকুরগাঁও" }],
    ] },

    { kind: "h2", text: { en: "Mymensingh Division (4 districts)", bn: "ময়মনসিংহ বিভাগ (৪টি জেলা)" } },
    {
      kind: "p",
      text: {
        en: "Mymensingh is the newest division. It was split off from Dhaka Division on 14 September 2015 and became the eighth division, with four districts.",
        bn: "ময়মনসিংহ সবচেয়ে নতুন বিভাগ। ২০১৫ সালের ১৪ সেপ্টেম্বর ঢাকা বিভাগ থেকে আলাদা হয়ে এটি চারটি জেলা নিয়ে দেশের অষ্টম বিভাগ হয়।",
      },
    },
    { kind: "table", head: HEAD, rows: [
        [{ en: "Mymensingh", bn: "Mymensingh" }, { en: "ময়মনসিংহ", bn: "ময়মনসিংহ" }],
        [{ en: "Jamalpur", bn: "Jamalpur" }, { en: "জামালপুর", bn: "জামালপুর" }],
        [{ en: "Netrokona", bn: "Netrokona" }, { en: "নেত্রকোণা", bn: "নেত্রকোণা" }],
        [{ en: "Sherpur", bn: "Sherpur" }, { en: "শেরপুর", bn: "শেরপুর" }],
    ] },

    { kind: "h2", text: { en: "Chattogram or Chittagong? The 2018 spelling changes", bn: "Chattogram নাকি Chittagong? ২০১৮ সালের বানান পরিবর্তন" } },
    {
      kind: "p",
      text: {
        en: "On 2 April 2018, the government changed the English spelling of five districts so that the English names follow the Bangla pronunciation more closely. The decision was taken at a meeting of the National Implementation Committee for Administrative Reorganisation-Reform (NICAR). The older spellings date from the British era, so you will still meet them in older books and maps.",
        bn: "২০১৮ সালের ২ এপ্রিল সরকার পাঁচটি জেলার ইংরেজি বানান বদলায়, যাতে ইংরেজি নাম বাংলা উচ্চারণের আরও কাছাকাছি হয়। সিদ্ধান্তটি নেওয়া হয় প্রশাসনিক পুনর্বিন্যাস-সংস্কার বিষয়ক জাতীয় বাস্তবায়ন কমিটির (নিকার) সভায়। পুরোনো বানানগুলো ব্রিটিশ আমলের, তাই পুরোনো বই আর মানচিত্রে এখনো সেগুলো চোখে পড়বে।",
      },
    },
    {
      kind: "table",
      head: [
        { en: "Old English spelling", bn: "পুরোনো ইংরেজি বানান" },
        { en: "New English spelling", bn: "নতুন ইংরেজি বানান" },
        { en: "Bangla name", bn: "বাংলা নাম" },
      ],
      rows: [
        [{ en: "Chittagong", bn: "Chittagong" }, { en: "Chattogram", bn: "Chattogram" }, { en: "চট্টগ্রাম", bn: "চট্টগ্রাম" }],
        [{ en: "Comilla", bn: "Comilla" }, { en: "Cumilla", bn: "Cumilla" }, { en: "কুমিল্লা", bn: "কুমিল্লা" }],
        [{ en: "Jessore", bn: "Jessore" }, { en: "Jashore", bn: "Jashore" }, { en: "যশোর", bn: "যশোর" }],
        [{ en: "Barisal", bn: "Barisal" }, { en: "Barishal", bn: "Barishal" }, { en: "বরিশাল", bn: "বরিশাল" }],
        [{ en: "Bogra", bn: "Bogra" }, { en: "Bogura", bn: "Bogura" }, { en: "বগুড়া", bn: "বগুড়া" }],
      ],
    },
    {
      kind: "p",
      text: {
        en: "This list uses the new spellings for the Chattogram and Barishal divisions as well. A few other names also appear in more than one English form, for example Chapainawabganj and Chapai Nawabganj, or Moulvibazar and Moulvi Bazar. They are the same places.",
        bn: "এই তালিকায় চট্টগ্রাম ও বরিশাল বিভাগের নামেও নতুন বানান ব্যবহার করা হয়েছে। আরও কিছু নাম ইংরেজিতে একাধিকভাবে লেখা হয় — যেমন Chapainawabganj ও Chapai Nawabganj, কিংবা Moulvibazar ও Moulvi Bazar। দুটো রূপই একই জায়গা বোঝায়।",
      },
    },
    {
      kind: "callout",
      tone: "tip",
      text: {
        en: "The Bangla names did not change in 2018, only the English ones. If you are unsure of a spelling, searching with the Bangla name, such as যশোর, finds the same place either way.",
        bn: "২০১৮ সালে শুধু ইংরেজি বানান বদলেছে, বাংলা নাম একই আছে। বানান নিয়ে সন্দেহ থাকলে বাংলা নাম — যেমন যশোর — লিখে খুঁজলেই একই জায়গা পেয়ে যাবেন।",
      },
    },

    { kind: "h2", text: { en: "Test yourself on the map", bn: "মানচিত্রে নিজেকে যাচাই করুন" } },
    {
      kind: "p",
      text: {
        en: "Reading a list is one thing; finding Jhalokati on a blank map is another. In [My Bangladesh Map](/games/my-bangladesh) you tap the districts you have visited and see how much of the map you have covered so far.",
        bn: "তালিকা পড়া এক জিনিস, আর ফাঁকা মানচিত্রে ঝালকাঠি খুঁজে বের করা আরেক জিনিস। [আমার বাংলাদেশ](/games/my-bangladesh) মানচিত্রে আপনি যেসব জেলায় গেছেন সেগুলোতে ট্যাপ করুন, আর দেখুন মানচিত্রের কতটা আপনার ঘোরা হয়ে গেছে।",
      },
    },
    { kind: "activity", key: "g:my-bangladesh" },
    {
      kind: "p",
      text: {
        en: "[Guess the District](/games/guess-district) turns this list into a ten-question round: find a highlighted district, name one from its outline alone, or answer a clue. There is a new puzzle every day, plus a practice mode.",
        bn: "[কোন জেলা?](/games/guess-district) খেলাটি এই তালিকাকে দশ প্রশ্নের একটি রাউন্ডে বদলে দেয়: মানচিত্রে রাঙানো জেলাটি চিনুন, শুধু সীমারেখা দেখে নাম বলুন, কিংবা একটি সূত্র থেকে উত্তর দিন। প্রতিদিন নতুন ধাঁধা থাকে, সঙ্গে অনুশীলনের সুযোগও।",
      },
    },
    { kind: "activity", key: "g:guess-district" },
  ],
  play: ["g:my-bangladesh", "g:guess-district"],
  sources: [
    { title: "Bangladesh National Portal — District list (জেলা তালিকা)", url: "https://bangladesh.gov.bd/views/district-list" },
    { title: "Banglapedia — Bangladesh (administrative units)", url: "https://en.banglapedia.org/index.php/Bangladesh" },
    { title: "Wikipedia — Districts of Bangladesh", url: "https://en.wikipedia.org/wiki/Districts_of_Bangladesh" },
    { title: "Wikipedia — Divisions of Bangladesh", url: "https://en.wikipedia.org/wiki/Divisions_of_Bangladesh" },
    { title: "Prothom Alo — English spelling of 5 districts changed (2 April 2018)", url: "https://en.prothomalo.com/bangladesh/English-spelling-of-5-districts-changed" },
    { title: "The Independent — English spelling of five districts changed (3 April 2018)", url: "https://theindependentbd.com/post/144248" },
  ],
  faq: [
    {
      q: { en: "How many districts and divisions does Bangladesh have?", bn: "বাংলাদেশে কয়টি জেলা ও কয়টি বিভাগ?" },
      a: {
        en: "Bangladesh has 64 districts grouped into 8 divisions: Dhaka, Chattogram, Rajshahi, Khulna, Barishal, Sylhet, Rangpur and Mymensingh.",
        bn: "বাংলাদেশে ৬৪টি জেলা, যেগুলো ৮টি বিভাগে ভাগ করা: ঢাকা, চট্টগ্রাম, রাজশাহী, খুলনা, বরিশাল, সিলেট, রংপুর ও ময়মনসিংহ।",
      },
    },
    {
      q: { en: "Which is the newest division of Bangladesh?", bn: "বাংলাদেশের সবচেয়ে নতুন বিভাগ কোনটি?" },
      a: {
        en: "Mymensingh. It was separated from Dhaka Division on 14 September 2015 and has four districts: Mymensingh, Jamalpur, Netrokona and Sherpur.",
        bn: "ময়মনসিংহ। ২০১৫ সালের ১৪ সেপ্টেম্বর এটি ঢাকা বিভাগ থেকে আলাদা হয়; এর চারটি জেলা হলো ময়মনসিংহ, জামালপুর, নেত্রকোণা ও শেরপুর।",
      },
    },
    {
      q: { en: "Is it Chittagong or Chattogram?", bn: "Chittagong নাকি Chattogram — কোনটি ঠিক?" },
      a: {
        en: "Both names refer to the same place. Chattogram has been the official English spelling since April 2018, when Comilla, Jessore, Barisal and Bogra also became Cumilla, Jashore, Barishal and Bogura.",
        bn: "দুটো নামই একই জায়গার। ২০১৮ সালের এপ্রিল থেকে সরকারি ইংরেজি বানান Chattogram; একই সঙ্গে Comilla, Jessore, Barisal ও Bogra হয়েছে Cumilla, Jashore, Barishal ও Bogura।",
      },
    },
    {
      q: { en: "Which division has the most districts?", bn: "কোন বিভাগে সবচেয়ে বেশি জেলা?" },
      a: {
        en: "Dhaka Division, with 13 districts. Sylhet and Mymensingh have the fewest, with four each.",
        bn: "ঢাকা বিভাগে, মোট ১৩টি জেলা। সবচেয়ে কম জেলা সিলেট ও ময়মনসিংহে — চারটি করে।",
      },
    },
  ],
};
