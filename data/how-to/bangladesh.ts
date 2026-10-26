import type { HowTo } from "@/lib/how-to";

// "How to play" for the Bangladesh, language and flick games (see lib/how-to.ts for the rules).
export const HOW_TO_BANGLADESH: Record<string, HowTo> = {
  "g:guess-district": {
    steps: [
      { en: "Open today's puzzle and press Start. Everyone gets the same 10 questions today.", bn: "আজকের ধাঁধা খুলে ‘শুরু করো’ চাপো। আজ সবাই একই ১০টা প্রশ্ন পাবে।" },
      { en: "The first 4 questions colour one district on the map. Pick its name from 4 choices.", bn: "প্রথম ৪টা প্রশ্নে ম্যাপে একটা জেলা রং করা থাকে। ৪টা অপশন থেকে তার নাম বাছো।" },
      { en: "Next you get a district's outline on its own, and sometimes a written clue. Tap an answer, or press 1–4 on a keyboard.", bn: "এরপর আসে শুধু জেলার আকৃতি, কখনো লেখা সূত্র। উত্তরে ট্যাপ করো, কী-বোর্ডে ১–৪ চাপলেও চলবে।" },
      { en: "After each answer the map shows where the district really is. Press Next or Enter to move on.", bn: "প্রতিটা উত্তরের পর ম্যাপে আসল জেলাটা দেখায়। এগোতে ‘পরের প্রশ্ন’ বা Enter চাপো।" },
      { en: "See your score out of 10 and your title, then share the spoiler-free 🟩🟥 grid or send a friend the same round.", bn: "১০-এ কত পেলে আর কোন টাইটেল, দেখে নাও। তারপর উত্তর ফাঁস না করা 🟩🟥 গ্রিড শেয়ার করো, বা বন্ধুকে একই রাউন্ড পাঠাও।" },
    ],
    tips: [
      { en: "On map questions the three wrong choices always come from other divisions, so knowing the division often gives the answer away.", bn: "ম্যাপের প্রশ্নে ভুল তিনটা অপশন সবসময় অন্য বিভাগের। তাই বিভাগটা চিনলেই অনেক সময় উত্তর বেরিয়ে আসে।" },
      { en: "In shape questions one wrong choice is a nearby district, so study the outline's edges before you tap.", bn: "আকৃতির প্রশ্নে একটা ভুল অপশন আশেপাশের কোনো জেলা। ট্যাপের আগে সীমানার খাঁজগুলো ভালো করে দেখো।" },
      { en: "Practice rounds bring fresh questions and never touch today's score, so warm up as often as you like.", bn: "প্র্যাকটিস রাউন্ডে নতুন প্রশ্ন আসে, আজকের স্কোরে হাত পড়ে না। যতবার খুশি হাত গরম করো।" },
    ],
    faq: [
      {
        q: { en: "When does a new daily puzzle come out?", bn: "নতুন দৈনিক ধাঁধা কখন আসে?" },
        a: {
          en: "At midnight Bangladesh time (UTC+6). If you're mid-round when the date changes, your round stays as it is, and a banner lets you load the new puzzle when you're ready.",
          bn: "বাংলাদেশ সময় রাত ১২টায় (UTC+6)। তারিখ বদলানোর সময় খেলা চললে রাউন্ডটা বদলায় না; একটা ব্যানার আসে, তৈরি হলে সেখান থেকে নতুন ধাঁধা খুলতে পারো।",
        },
      },
      {
        q: { en: "Can I replay today's puzzle for a better score?", bn: "ভালো স্কোরের জন্য আজকের ধাঁধা আবার খেলা যায়?" },
        a: {
          en: "Yes, but your first attempt stays as today's official score. Your best of the day is kept too, and both are saved only in this browser.",
          bn: "যায়, তবে প্রথমবারের স্কোরটাই আজকের অফিশিয়াল স্কোর। দিনের সেরাটাও রাখা হয়, আর দুটোই শুধু এই ব্রাউজারে সেভ থাকে।",
        },
      },
      {
        q: { en: "Where do the clue questions come from?", bn: "সূত্রের প্রশ্নগুলো কোথা থেকে আসে?" },
        a: {
          en: "Each clue is a sourced fact about a place, and the source is shown after you answer. Only clues a person has checked are used; while there are few, the round uses extra shape questions instead.",
          bn: "প্রতিটা সূত্র কোনো জায়গা নিয়ে সূত্রসহ তথ্য, উত্তর দেওয়ার পর সূত্রটাও দেখায়। শুধু মানুষের যাচাই করা সূত্রই আসে; সেগুলো কম থাকলে রাউন্ডে আকৃতির প্রশ্ন বেশি থাকে।",
        },
      },
    ],
  },

  "g:my-bangladesh": {
    steps: [
      { en: "Tap every district you've been to, either on the map or in the division list under it.", bn: "যেসব জেলায় গেছো, ম্যাপে বা নিচের বিভাগভিত্তিক তালিকায় সেগুলোতে ট্যাপ করো।" },
      { en: "Watch the counter: districts out of 64, divisions out of 8, and how much of the map you've coloured.", bn: "কাউন্টারে চোখ রাখো: ৬৪-এর মধ্যে কয়টা জেলা, ৮-এর মধ্যে কয়টা বিভাগ, আর ম্যাপের কতটা রং হলো।" },
      { en: "Press See my title to get your traveller title and any badges you've earned.", bn: "‘আমার টাইটেল দেখাও’ চাপলে তোমার ভ্রমণ-টাইটেল আর পাওয়া ব্যাজগুলো দেখবে।" },
      { en: "Save the 9:16 poster for your story, or send the link and ask friends how many they've been to.", bn: "স্টোরির জন্য ৯:১৬ পোস্টার সেভ করো, বা লিংক পাঠিয়ে বন্ধুদের জিজ্ঞেস করো তারা কয়টায় গেছে।" },
    ],
    tips: [
      { en: "On a small phone screen, the division list is easier to tap than the tiniest districts on the map.", bn: "ছোট ফোন স্ক্রিনে ম্যাপের খুদে জেলাগুলোর চেয়ে বিভাগের তালিকায় ট্যাপ করা সহজ।" },
      { en: "Badges reward the route, not just the count: one district in every division, a whole division, or all three hill districts.", bn: "ব্যাজ শুধু সংখ্যা দেখে না, পথও দেখে: প্রতিটা বিভাগে অন্তত একটা জেলা, পুরো একটা বিভাগ, বা পাহাড়ের তিন জেলাই।" },
      { en: "Opened a friend's link? Make your own map on the same page to see yours, theirs and the districts you share.", bn: "বন্ধুর লিংক খুলেছো? একই পেজে নিজের ম্যাপ বানাও, দেখবে কোনগুলো তোমার, কোনগুলো তার, আর কোনগুলো দুজনেরই।" },
    ],
    faq: [
      {
        q: { en: "Is my map uploaded anywhere?", bn: "আমার ম্যাপ কি কোথাও আপলোড হয়?" },
        a: {
          en: "No. Your marked districts are saved only on this device. The share link itself carries them so a friend can compare, so send it only to people you're happy to show your map.",
          bn: "না। তোমার বাছাই করা জেলাগুলো শুধু এই ডিভাইসেই সেভ থাকে। তবে শেয়ার লিংকের ভেতরেই জেলাগুলো থাকে, যাতে বন্ধু মিলিয়ে দেখতে পারে, তাই যাকে ম্যাপ দেখাতে চাও শুধু তাকেই পাঠাও।",
        },
      },
      {
        q: { en: "What does the % of the map mean?", bn: "ম্যাপের % মানে কী?" },
        a: {
          en: "It's the share of the drawn map's area that your districts cover, so a big district adds more than a small one. It describes the map on screen, not the country itself.",
          bn: "আঁকা ম্যাপের যতটা জায়গা তোমার জেলাগুলো জুড়ে আছে, সেই ভাগ। তাই বড় জেলা ছোট জেলার চেয়ে বেশি যোগ করে। এটা স্ক্রিনের ম্যাপের হিসাব, দেশের নয়।",
        },
      },
      {
        q: { en: "How are the titles decided?", bn: "টাইটেল কীভাবে ঠিক হয়?" },
        a: {
          en: "By the count alone: 1 district, 2–5, 6–12, 13–24, 25–40, 41–63 and all 64 each have their own title, from Never Left Home up to All 64. Legend.",
          bn: "শুধু সংখ্যা দিয়ে: ১টা জেলা, ২–৫, ৬–১২, ১৩–২৪, ২৫–৪০, ৪১–৬৩ আর পুরো ৬৪, প্রতিটার আলাদা টাইটেল। শুরু ‘বাড়ির বাইরে পা রাখোনি’ দিয়ে, শেষ ‘৬৪-তে ৬৪। কিংবদন্তি।’ দিয়ে।",
        },
      },
    ],
  },

  "g:kacher-guti": {
    steps: [
      { en: "Pick your opponent: Little Brother, Para Boro Bhai or Mohollar Champion.", bn: "প্রতিপক্ষ বাছো: ছোট ভাই, পাড়ার বড় ভাই, নাকি মহল্লার চ্যাম্পিয়ন।" },
      { en: "Throw your shooter from the line toward the hole. Whoever lands in the hole, or closest to it, plays first.", bn: "দাগ থেকে খেলার গুটি গর্তের দিকে ছোড়ো। যার গুটি গর্তে পড়ে বা সবচেয়ে কাছে থামে, সে আগে খেলবে।" },
      { en: "Each side stakes up to 3 marbles, and the first player stops a meter to scatter them around the hole.", bn: "দুই পক্ষ ৩টা পর্যন্ত গুটি দানে দেয়। যে আগে খেলবে, সে মিটার থামিয়ে গুটিগুলো গর্তের চারপাশে ছিটায়।" },
      { en: "Hit the ringed marble your opponent names: drag back on the ground like a slingshot and let go. Keys: ←/→ to aim, hold Space for power.", bn: "প্রতিপক্ষ যে গুটিতে দাগ দেয়, সেটা মারো: মাটিতে গুলতির মতো পেছনে টেনে ছেড়ে দাও। কী-বোর্ডে ←/→ নিশানা, Space চেপে শক্তি।" },
      { en: "When the computer shoots, tap the marble it must hit. After 3 rounds, whoever holds more of the 20 marbles wins.", bn: "কম্পিউটারের পালায় তুমি ট্যাপ করে দেখাও সে কোন গুটি মারবে। ৩ দান শেষে ২০টা গুটির বেশিরভাগ যার, জয় তার।" },
    ],
    tips: [
      { en: "Your shooter must touch the named marble before any other, so choose a clear line even if it means a longer shot.", bn: "দেখানো গুটিতেই আগে লাগতে হবে, অন্যটায় না। তাই একটু লম্বা শট হলেও ফাঁকা পথ বেছে নাও।" },
      { en: "The hole only catches slow marbles: a fast shot skips over it, but a soft one rolling to the rim can drop in and cost you a foul.", bn: "গর্ত শুধু ধীর গুটি ধরে: জোরে গেলে টপকে যায়, কিন্তু আস্তে গড়িয়ে কিনারায় গেলে পড়ে গিয়ে ফাউল হতে পারে।" },
      { en: "Scatter gently to keep the pot bunched near the hole, harder to spread it out. Marbles that drop in while you scatter are yours.", bn: "আস্তে ছিটালে গুটি গর্তের কাছে জটলা করে থাকে, জোরে ছিটালে ছড়িয়ে যায়। ছিটানোর সময় যেগুলো গর্তে পড়ে, সেগুলো তোমার।" },
    ],
    faq: [
      {
        q: { en: "What's the difference between a clean hit and a foul?", bn: "ঠিক নিশানা আর ফাউলের পার্থক্য কী?" },
        a: {
          en: "A clean hit means the named marble is the first thing your shooter touches and your shooter stays out of the hole: you win it and shoot again. Missing, hitting another marble first or falling in is a foul: you pay 1 marble and the turn passes.",
          bn: "দেখানো গুটিটাই যদি তোমার গুটি প্রথমে ছোঁয় আর তোমার গুটি গর্তে না পড়ে, সেটা ঠিক নিশানা: গুটিটা তোমার, আবার মারো। কিছুতে না লাগা, আগে অন্য গুটিতে লাগা বা গর্তে পড়া হলো ফাউল: ১টা গুটি দাও, পালা বদল।",
        },
      },
      {
        q: { en: "Why did I get marbles I wasn't aiming at?", bn: "নিশানা না করেও গুটি পেলাম কেন?" },
        a: {
          en: "Any pot marble that rolls into the hole during your shot goes to you, even when the shot itself is a foul. The game calls it ভাগ্য ভালো!",
          bn: "তোমার শটের সময় দানের যে গুটি গর্তে গড়িয়ে পড়ে, সেটা তোমার, শটটা ফাউল হলেও। খেলায় একে বলে ‘ভাগ্য ভালো!’",
        },
      },
      {
        q: { en: "What happens when evening falls?", bn: "সন্ধ্যা হয়ে গেলে কী হয়?" },
        a: {
          en: "A round can last 16 shots. If marbles are still in the pot by then, they're split evenly between you, and an odd one goes to whoever has fewer. The match also ends early if a side runs out of marbles.",
          bn: "এক দানে সর্বোচ্চ ১৬টা শট। তখনো দানে গুটি থাকলে দুজনের মধ্যে সমান ভাগ হয়, বিজোড় একটা পায় যার গুটি কম। কোনো পক্ষের গুটি শেষ হয়ে গেলে ম্যাচ আগেই শেষ।",
        },
      },
    ],
  },

  "g:latim-fight": {
    steps: [
      { en: "Pick your opponent and watch the circle being drawn. After your first match you can skip it.", bn: "প্রতিপক্ষ বাছো, তারপর বৃত্ত আঁকা দেখো। প্রথম ম্যাচের পর চাইলে স্কিপ করতে পারো।" },
      { en: "Order throw: throw your latim outward from the middle. Whoever's latim ends farther away attacks first.", bn: "আগে-পরে ঠিক করার থ্রো: মাঝখান থেকে লাটিম বাইরের দিকে ছোড়ো। যার লাটিম বেশি দূরে থামে, সে আগে আক্রমণ করবে।" },
      { en: "To throw, press and hold the ground to wind the string, drag back to aim and set power, then let go. Keys: hold Space, ←/→ aim, ↑/↓ power.", bn: "ছুড়তে মাটিতে চেপে ধরে লেত্তি পেঁচাও, পেছনে টেনে নিশানা আর শক্তি ঠিক করো, তারপর ছাড়ো। কী-বোর্ডে Space ধরে রাখো, ←/→ নিশানা, ↑/↓ শক্তি।" },
      { en: "As defender, spin your latim into the circle. As attacker, hit it until its centre ends outside: that wins it, and you attack again. Otherwise roles swap.", bn: "ডিফেন্ডার হলে লাটিম বৃত্তের ভেতরে ঘোরাও। আক্রমণকারী হলে মেরে সেটার মাঝখান বৃত্তের বাইরে ফেলো: লাটিম তোমার, আবার আক্রমণ। না পারলে পালা বদল।" },
      { en: "After each of your knockouts, tap KOP (or Space/Enter) when the shrinking ring meets the latim. First to 3 latims, or most after 8 bouts, wins.", bn: "তুমি বাইরে ফেললে ছোট হতে থাকা রিং লাটিমে মিললেই কোপ (বা Space/Enter) চাপো। আগে ৩টা লাটিম, বা ৮ দান শেষে যার বেশি, সে জেতে।" },
    ],
    tips: [
      { en: "Release the wind meter inside the green band for full spin. The band shifts a little every throw, so check it each time.", bn: "পুরো ঘূর্ণির জন্য মিটার সবুজ অংশে ছাড়ো। প্রতি থ্রোতে সবুজ অংশ একটু সরে যায়, তাই প্রতিবার দেখে নিও।" },
      { en: "A fast-spinning latim loses less spin and gets pushed less when it's hit, so a well-wound throw is also your best defence.", bn: "জোরে ঘুরতে থাকা লাটিম ধাক্কা খেলে কম ঘূর্ণি হারায়, কম সরে। তাই ভালো করে পেঁচানো থ্রো ডিফেন্সেও কাজে দেয়।" },
      { en: "When attacking, landing just short of the defender and sliding into it tends to hit harder than dropping right on top of it.", bn: "আক্রমণের সময় ডিফেন্ডারের একটু আগে নেমে পিছলে গিয়ে ধাক্কা দিলে, ঠিক ওপরে পড়ার চেয়ে সাধারণত জোরে লাগে।" },
    ],
    faq: [
      {
        q: { en: "What is the ঘর কোপ?", bn: "ঘর কোপ কী?" },
        a: {
          en: "A finisher from the traditional game: after a knockout, you try to crack the beaten latim. Here it's a timing tap. Perfect adds 50 points, good adds 20, and a miss adds nothing but never costs you the latim you won.",
          bn: "পুরোনো খেলার শেষ চমক: লাটিম বাইরে ফেলার পর সেটাকে ফাটানোর চেষ্টা। এখানে এটা সময় মিলিয়ে ট্যাপ। নিখুঁত হলে +৫০, ভালো হলে +২০, ফসকালে কিছু যোগ হয় না, তবে জেতা লাটিমটা তোমারই থাকে।",
        },
      },
      {
        q: { en: "What happens if a latim stops spinning inside the circle?", bn: "লাটিম বৃত্তের ভেতরে থেমে গেলে কী হয়?" },
        a: {
          en: "A latim falls over when its spin runs out. If the defender's latim falls and is stuck inside, the attacker gets one extra throw at it in that bout before the roles swap.",
          bn: "ঘূর্ণি ফুরোলে লাটিম পড়ে যায়। ডিফেন্ডারের লাটিম পড়ে গিয়ে ভেতরে আটকে থাকলে, পালা বদলের আগে আক্রমণকারী সেই দানে আরেকবার ছোড়ার সুযোগ পায়।",
        },
      },
      {
        q: { en: "How is my score counted?", bn: "স্কোর কীভাবে গোনা হয়?" },
        a: {
          en: "Every latim you win is 100 points, plus your kop bonuses. The winner is decided by latims won; the score is what a friend has to beat when you send a challenge.",
          bn: "জেতা প্রতিটা লাটিমে ১০০ পয়েন্ট, সাথে কোপের বোনাস। ম্যাচ জেতা ঠিক হয় লাটিমের হিসাবে; বন্ধুকে চ্যালেঞ্জ পাঠালে তাকে এই স্কোরটা ভাঙতে হয়।",
        },
      },
    ],
  },

  "g:word-map": {
    steps: [
      { en: "Pick an everyday word or phrase from the list at the top.", bn: "ওপরের তালিকা থেকে প্রতিদিনের একটা শব্দ বা কথা বেছে নাও।" },
      { en: "The map labels each dialect region with what it's called there, and a line counts how many names turned up in how many regions.", bn: "ম্যাপে প্রতিটা এলাকায় সেখানকার নাম বসে যায়, আর একটা লাইনে দেখায় কয়টা এলাকায় কয়টা নাম পাওয়া গেছে।" },
      { en: "Tap a region in the list below to see other spellings, where it's used, an example and the source.", bn: "নিচের তালিকায় কোনো এলাকায় ট্যাপ করলে অন্য বানান, কোথায় বলে, উদাহরণ আর সূত্র দেখবে।" },
      { en: "Open a region's page for all its sourced words, or save the 9:16 poster and ask friends what they call it.", bn: "কোনো এলাকার পেজ খুলে তার সব সূত্রসহ শব্দ দেখো, বা ৯:১৬ পোস্টার সেভ করে বন্ধুদের জিজ্ঞেস করো তারা কী বলে।" },
    ],
    tips: [
      { en: "“Not known yet” means no sourced word has turned up for that region so far, not that people there have no word for it.", bn: "‘এখনো জানা নেই’ মানে ওই এলাকার সূত্রসহ শব্দ এখনো পাওয়া যায়নি, এমন না যে সেখানে এর কোনো নাম নেই।" },
      { en: "One spelling can cover several regions, and neighbouring districts often blend, so a word from next door may sound like home.", bn: "একই বানান কয়েক এলাকায় চলতে পারে, পাশের জেলার ভাষাও মিশে যায়। তাই পাশের এলাকার শব্দও নিজের মনে হতে পারে।" },
      { en: "The chosen word stays in the page link, so a friend you send it to lands on the same map.", bn: "বাছাই করা শব্দটা পেজের লিংকে থেকে যায়, তাই বন্ধুকে পাঠালে সে একই ম্যাপে পৌঁছাবে।" },
    ],
    faq: [
      {
        q: { en: "Where do the words come from?", bn: "শব্দগুলো কোথা থেকে নেওয়া?" },
        a: {
          en: "From cited research: dictionaries, papers, government and newspaper pages. Words no local has reviewed yet carry the label “from sources, not yet checked by locals”.",
          bn: "সূত্রসহ গবেষণা থেকে: অভিধান, গবেষণাপত্র, সরকারি ও পত্রিকার পাতা। এলাকার কেউ এখনো যেসব শব্দ যাচাই করেননি, সেগুলোর পাশে লেখা থাকে ‘সূত্র থেকে নেওয়া, এলাকার মানুষ এখনো যাচাই করেননি’।",
        },
      },
      {
        q: { en: "Why isn't every researched word on the map?", bn: "গবেষণার সব শব্দ ম্যাপে নেই কেন?" },
        a: {
          en: "Only words with a Bangla spelling taken from the source and good confidence are shown. Low-confidence or romanised entries stay hidden until a person checks them.",
          bn: "শুধু সেসব শব্দই দেখায় যেগুলোর বাংলা বানান সূত্রেই আছে আর যেগুলো নিয়ে আস্থা ভালো। কম আস্থার বা ইংরেজি হরফে লেখা শব্দ কেউ যাচাই না করা পর্যন্ত লুকানো থাকে।",
        },
      },
      {
        q: { en: "I spotted a wrong word. What should I do?", bn: "একটা শব্দ ভুল মনে হচ্ছে। কী করব?" },
        a: {
          en: "Spelling and usage really do change from village to village, and these words are from sources, not yet checked by locals. Each word lists the source it came from.",
          bn: "গ্রামভেদে বানান আর ব্যবহার সত্যিই বদলায়, আর এই শব্দগুলো সূত্র থেকে নেওয়া, স্থানীয়রা এখনো যাচাই করেননি। প্রতিটা শব্দের পাশে তার সূত্র লেখা থাকে।",
        },
      },
    ],
  },

  "g:which-region": {
    steps: [
      { en: "Press Start to get 10 everyday words or phrases, one at a time.", bn: "‘শুরু করো’ চাপলে একে একে ১০টা চেনা শব্দ বা কথা আসবে।" },
      { en: "For each, pick what people say where you grew up. If nothing fits, choose “Something else / not sure”.", bn: "প্রতিটায় বেছে নাও তোমার বড় হওয়ার জায়গায় লোকে কী বলে। কিছু না মিললে ‘অন্য কিছু / জানি না’।" },
      { en: "Changed your mind? Go back with Previous word and pick again.", bn: "মত বদলেছো? ‘আগের শব্দ’ চেপে ফিরে গিয়ে আবার বাছো।" },
      { en: "Read Hottogol's guess, how many of your words matched it, and which regions came close behind.", bn: "দেখো হট্টগোলের আন্দাজ কী, তোমার কয়টা শব্দ মিলেছে, আর কোন এলাকাগুলো কাছাকাছি ছিল।" },
      { en: "Share the result or poster to see what it guesses for your friends. Play again brings new words.", bn: "রেজাল্ট বা পোস্টার শেয়ার করো, দেখো বন্ধুদের বেলায় কী আন্দাজ করে। আবার খেললে নতুন শব্দ আসে।" },
    ],
    tips: [
      { en: "A word used in only one region says more than one heard everywhere, so the rare words steer the guess most.", bn: "যে শব্দ শুধু এক এলাকায় চলে, সেটা সব জায়গার শব্দের চেয়ে বেশি কিছু বলে। তাই বিরল শব্দই আন্দাজ বেশি ঘোরায়।" },
      { en: "Pick what you really say, not what sounds most local. “Something else” is a fine answer and simply casts no vote.", bn: "যেটা সত্যিই বলো সেটাই বাছো, সবচেয়ে আঞ্চলিক শোনায় সেটা না। ‘অন্য কিছু’ বাছাও ঠিক আছে, ওটা কোনো ভোট দেয় না।" },
    ],
    faq: [
      {
        q: { en: "How does it make the guess?", bn: "আন্দাজটা কীভাবে করে?" },
        a: {
          en: "Each pick votes for the regions that use that word, split between them. A region's votes are weighed against how many questions offered it a word, and the top one wins. It's a playful guess from a few words, not a fact about you.",
          bn: "প্রতিটা বাছাই সেই শব্দ যেসব এলাকায় চলে তাদের মধ্যে ভাগ হয়ে ভোট দেয়। কোনো এলাকা কয়টা প্রশ্নে সুযোগ পেয়েছিল তার সাথে তুলনা করে ভোট মাপা হয়, সবচেয়ে ওপরেরটা জেতে। কয়েকটা শব্দ দেখে মজার আন্দাজ, তোমাকে নিয়ে কোনো দাবি না।",
        },
      },
      {
        q: { en: "Why did I get “You're a mystery”?", bn: "‘তুমি এক রহস্যময় মানুষ’ এলো কেন?" },
        a: {
          en: "That shows when every answer was “Something else”, so there was nothing to vote with. The words come from sources not yet checked by locals, and they may simply miss how your area talks.",
          bn: "সব উত্তর ‘অন্য কিছু’ হলে এটা আসে, কারণ ভোট দেওয়ার মতো কিছু থাকে না। শব্দগুলো সূত্র থেকে নেওয়া, এলাকার মানুষ এখনো যাচাই করেননি; তোমার এলাকার বলার ধরন হয়তো এখনো তালিকায় নেই।",
        },
      },
      {
        q: { en: "What does a friend see from my link?", bn: "আমার লিংক খুললে বন্ধু কী দেখে?" },
        a: {
          en: "Only the region guessed for you, or the mystery result. Your answers aren't in the link. Then they can take it themselves and compare.",
          bn: "শুধু তোমার জন্য আন্দাজ করা এলাকা, বা রহস্যময় রেজাল্ট। তোমার উত্তরগুলো লিংকে থাকে না। এরপর সে নিজে খেলে মিলিয়ে দেখতে পারে।",
        },
      },
    ],
  },

  "g:ancholik-quiz": {
    steps: [
      { en: "Pick a region, or Mixed Bangladesh to draw from every district.", bn: "একটা এলাকা বাছো, বা সব জেলা মিলিয়ে খেলতে ‘মিশ্র বাংলাদেশ’।" },
      { en: "Pick a level: Easy, Medium or Hard. The Start button shows how many questions are ready.", bn: "লেভেল বাছো: সহজ, মাঝারি বা কঠিন। শুরুর বোতামে লেখা থাকে কয়টা প্রশ্ন তৈরি।" },
      { en: "Each question shows a regional word. Choose its standard Bangla meaning from 4 options.", bn: "প্রতিটা প্রশ্নে একটা আঞ্চলিক শব্দ থাকে। ৪টা অপশন থেকে তার প্রমিত বাংলা মানে বাছো।" },
      { en: "After each pick you see the right answer and a short explanation, with a link to that word on the word map.", bn: "প্রতিটা উত্তরের পর সঠিক উত্তর আর ছোট ব্যাখ্যা আসে, সাথে শব্দের মানচিত্রে শব্দটা দেখার লিংক।" },
      { en: "Finish to get your score and title, then send the exact same round to a friend as a challenge.", bn: "শেষ করে স্কোর আর টাইটেল দেখো, তারপর ঠিক একই রাউন্ড বন্ধুকে চ্যালেঞ্জ হিসেবে পাঠাও।" },
    ],
    tips: [
      { en: "When a level runs short, easier questions fill the gap, so a Hard round isn't always hard all the way through.", bn: "কোনো লেভেলে প্রশ্ন কম পড়লে সহজ প্রশ্ন দিয়ে ফাঁক ভরানো হয়। তাই কঠিন রাউন্ডের সব প্রশ্ন কঠিন না-ও হতে পারে।" },
      { en: "You can leave mid-round: the unfinished round is saved on this device and offered when you come back.", bn: "মাঝপথে চলে গেলেও চিন্তা নেই: অসমাপ্ত রাউন্ড এই ডিভাইসে সেভ থাকে, ফিরে এলে চালিয়ে যেতে বলে।" },
      { en: "Titles go by the share you got right, so shorter rounds are judged the same way: 9 out of 10 or better is legend level.", bn: "টাইটেল ঠিক হয় কত ভাগ ঠিক হলো তা দেখে, তাই ছোট রাউন্ডও একইভাবে বিচার হয়: ১০-এ ৯ বা তার বেশি মানে কিংবদন্তি।" },
    ],
    faq: [
      {
        q: { en: "Why does it say প্রশ্ন তৈরি হচ্ছে?", bn: "‘প্রশ্ন তৈরি হচ্ছে!’ দেখাচ্ছে কেন?" },
        a: {
          en: "The quiz only uses words a person has checked, and a region and level need at least 5 checked questions before a round can start. Until then, try another region, Mixed Bangladesh, the word map or the region detective.",
          bn: "কুইজে শুধু মানুষের যাচাই করা শব্দ আসে, আর কোনো এলাকা ও লেভেলে রাউন্ড শুরু করতে অন্তত ৫টা যাচাই করা প্রশ্ন লাগে। ততক্ষণ অন্য এলাকা, মিশ্র বাংলাদেশ, শব্দের মানচিত্র বা এলাকা-গোয়েন্দা চেষ্টা করো।",
        },
      },
      {
        q: { en: "How is this different from the word map?", bn: "শব্দের মানচিত্রের সাথে এর পার্থক্য কী?" },
        a: {
          en: "The map also shows sourced words no local has checked yet. Scored questions here come only from words a person has verified, though spellings can still differ from village to village.",
          bn: "মানচিত্রে এমন সূত্রসহ শব্দও থাকে যা এলাকার কেউ এখনো যাচাই করেননি। এখানে স্কোরের প্রশ্ন আসে শুধু মানুষের যাচাই করা শব্দ থেকে, যদিও গ্রামভেদে বানান আলাদা হতে পারে।",
        },
      },
      {
        q: { en: "What does a challenge link send?", bn: "চ্যালেঞ্জ লিংকে কী যায়?" },
        a: {
          en: "The same region, level, questions and option order, plus your score to beat. If more words get checked later, an old link may draw a slightly different set. Scores stay on each device.",
          bn: "একই এলাকা, লেভেল, প্রশ্ন আর অপশনের ক্রম, সাথে তোমার স্কোর যেটা ভাঙতে হবে। পরে আরও শব্দ যাচাই হলে পুরোনো লিংকে প্রশ্ন একটু বদলাতে পারে। স্কোর যার যার ডিভাইসেই থাকে।",
        },
      },
    ],
  },

  "g:personality": {
    steps: [
      { en: "Press Start the test and answer 8 quick questions about adda, guests, rain and Eid holidays.", bn: "‘টেস্ট শুরু করো’ চেপে আড্ডা, মেহমান, বৃষ্টি আর ঈদের ছুটি নিয়ে ৮টা ঝটপট প্রশ্নের উত্তর দাও।" },
      { en: "Each question has 4 options. Previous question lets you change an earlier answer.", bn: "প্রতিটা প্রশ্নে ৪টা অপশন। ‘আগের প্রশ্ন’ চেপে আগের উত্তর বদলাতে পারো।" },
      { en: "Get one of 7 types, from Emperor of Adda to Dawat Champion, with your strongest traits as percentages.", bn: "৭টা টাইপের একটা পাবে, ‘আড্ডার সম্রাট’ থেকে ‘দাওয়াতের চ্যাম্পিয়ন’ পর্যন্ত, সাথে তোমার সবচেয়ে বড় গুণগুলোর শতাংশ।" },
      { en: "Send it to the group: your link shows friends your type, and once they finish they see if you match.", bn: "গ্রুপে পাঠাও: লিংক খুললে বন্ধুরা তোমার টাইপ দেখবে, আর নিজে শেষ করলে জানবে তোমার সাথে মিলল কি না।" },
    ],
    tips: [
      { en: "There are no right answers. Pick what you'd actually do rather than the coolest option, and the result feels more like you.", bn: "ঠিক-ভুল নেই। সবচেয়ে কুল অপশনটা না, যা সত্যিই করো সেটা বাছো, রেজাল্ট তখন বেশি নিজের মতো লাগবে।" },
      { en: "Retake it with different answers to collect more types. This device keeps count of how many of the 7 you've found.", bn: "অন্যভাবে উত্তর দিয়ে আবার খেলো, আরও টাইপ জমাও। ৭টার কয়টা পেলে, এই ডিভাইস সেই হিসাব রাখে।" },
    ],
    faq: [
      {
        q: { en: "How is my type worked out?", bn: "আমার টাইপ কীভাবে বের হয়?" },
        a: {
          en: "Each answer adds points to one or more of 7 traits. Every trait is compared with the most it could score, and the strongest decides your type; ties go to raw points, then a fixed order. The same answers always give the same type.",
          bn: "প্রতিটা উত্তর ৭টা গুণের এক বা একাধিকটায় পয়েন্ট যোগ করে। প্রতিটা গুণকে তার সর্বোচ্চ সম্ভাব্য পয়েন্টের সাথে তুলনা করা হয়, সবচেয়ে এগিয়ে থাকাটা টাইপ ঠিক করে; সমান হলে মোট পয়েন্ট, তারপর একটা নির্দিষ্ট ক্রম। একই উত্তর মানে সবসময় একই টাইপ।",
        },
      },
      {
        q: { en: "Is this a real personality test?", bn: "এটা কি সত্যিকারের পার্সোনালিটি টেস্ট?" },
        a: {
          en: "No. It's just for fun, not science, and it says nothing about where anyone is from.",
          bn: "না। এটা শুধু মজার জন্য, বিজ্ঞান না, আর কে কোন এলাকার সে বিষয়েও কিছু বলে না।",
        },
      },
      {
        q: { en: "What does my share link include?", bn: "আমার শেয়ার লিংকে কী থাকে?" },
        a: {
          en: "Your answer letters and your type, so a friend sees the same result card you got. Nothing else about you is in it.",
          bn: "তোমার উত্তরের অক্ষরগুলো আর টাইপ, যাতে বন্ধু তোমার পাওয়া রেজাল্ট কার্ডটাই দেখে। তোমার সম্পর্কে আর কিছু এতে থাকে না।",
        },
      },
    ],
  },
};
