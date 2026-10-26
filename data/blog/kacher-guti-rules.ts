import type { BlogPost } from "@/lib/blog";

// Draft for the owner's review. Every rule below comes from the sources listed
// at the bottom (opened 2026-10-26). Where they disagree, the text says so.

export const kacherGutiRules: BlogPost = {
  slug: "kacher-guti-rules",
  status: "needs_review",
  published: "",
  topic: "traditional-games",
  title: {
    en: "Kacher Guti: The Traditional Rules of Bangladesh's Marble Game",
    bn: "কাচের গুটি: বাংলাদেশের মার্বেল খেলার প্রচলিত নিয়ম",
  },
  seo: {
    en: {
      title: "Kacher Guti Rules: How Marbles Are Played in Bangladesh",
      description:
        "Traditional marble game rules from Bangladesh: the জল্লা line, the কেপ hole, who plays first, the stake, the বাদ marble, hits, fines and clay-ball history.",
    },
    bn: {
      title: "মার্বেল খেলার নিয়ম: কাচের গুটি কীভাবে খেলা হয়",
      description:
        "জল্লা দাগ, কেপ গর্ত, কে আগে খেলে, কয়টা গুটি জমা পড়ে, ‘বাদ’ গুটি আর ফাইনের নিয়ম, সঙ্গে কাচের আগে মাটির গুলির গল্প: গ্রামবাংলার মার্বেল খেলা।",
    },
  },
  lead: {
    en: "A line scratched in the dirt, a hole the size of one marble and a pocket full of glass: that is all a game of marbles needs. Here is how kacher guti is traditionally played in Bangladesh, what the line and the hole are called, and where the rules change from one area to the next.",
    bn: "মাটিতে টানা একটা দাগ, একটা মার্বেল বসার মতো ছোট্ট গর্ত আর পকেটভর্তি কাচের গুটি: মার্বেল খেলায় এর বেশি কিছু লাগে না। বাংলাদেশে কাচের গুটি সাধারণত কীভাবে খেলা হয়, দাগ আর গর্তকে কী নামে ডাকা হয়, আর এলাকাভেদে নিয়ম কোথায় বদলে যায়, সেটাই এই লেখায়।",
  },
  cover: { emoji: "🔮", accent: "sky" },
  body: [
    { kind: "h2", text: { en: "A game with many names", bn: "এক খেলার অনেক নাম" } },
    {
      kind: "p",
      text: {
        en: "In Bangladesh the small glass balls are called marbles, guli or kacher guti, and Banglapedia lists the game among the country's folk games as Gulikhela, the game of marbles. Bangla Wikipedia notes that some areas call it বিঘত খেলা, and it describes marbles as one of the most attractive games for teenage boys in rural Bangladesh. Banglapedia adds that the game is probably played in every country, but the version below, with its line, its hole and its named marble, is the one children in Bangladeshi villages and neighbourhoods grew up with.",
        bn: "বাংলাদেশে কাচের ছোট গোল বলগুলোকে কেউ বলে মার্বেল, কেউ গুলি, কেউ কাচের গুটি। বাংলাপিডিয়া দেশের লোকক্রীড়ার তালিকায় খেলাটিকে ‘গুলিখেলা’ নামে রেখেছে। বাংলা উইকিপিডিয়া বলছে, কোনো কোনো অঞ্চলে একে বিঘত খেলাও বলা হয়, আর গ্রামের কিশোর ছেলেদের কাছে এটি সবচেয়ে আকর্ষণীয় খেলাগুলোর একটি। বাংলাপিডিয়ার মতে খেলাটা সম্ভবত সব দেশেই খেলা হয়, তবে দাগ, গর্ত আর ‘বাদ’ গুটির যে ধরনটা নিচে বলা হলো, সেটাই বাংলাদেশের গ্রাম আর পাড়ার শিশু-কিশোরদের চেনা খেলা।",
      },
    },
    { kind: "h2", text: { en: "Before glass: clay balls", bn: "কাচের আগে: মাটির গুলি" } },
    {
      kind: "p",
      text: {
        en: "Glass marbles are not as old as the game. According to Banglapedia, marbles were first imported during the British period, and before that children played with balls made of earth. Banglapedia also notes that boys in rural areas still play with earthen balls today, so the game never really depended on buying anything from a shop.",
        bn: "খেলাটা যত পুরোনো, কাচের মার্বেল তত পুরোনো নয়। বাংলাপিডিয়া জানায়, মার্বেল প্রথম আমদানি হয় ব্রিটিশ আমলে, আর তার আগে খেলা হতো মাটির তৈরি গুলি দিয়ে। বাংলাপিডিয়া এটাও বলছে যে গ্রামের ছেলেরা এখনও মাটির গুলি দিয়ে খেলে। মানে, দোকান থেকে কিছু না কিনেও এই খেলা চলতে পারত, এখনও পারে।",
      },
    },
    { kind: "h2", text: { en: "The ground, the line and the hole", bn: "মাঠ, দাগ আর গর্ত" } },
    {
      kind: "p",
      text: {
        en: "You need a patch of clean, flat ground and at least two players; Bangla Wikipedia mentions games of three, four, five or even seven. First a line is drawn, then a hole just big enough for one marble to sit in is dug some distance in front of it. Bangla Wikipedia puts the hole four or five হাত (the old forearm measure) from the line, while Banglapedia describes players standing on a line nine to ten feet from the hole. One bdnews24 writer remembers the most popular version in his village using two lines: you stood behind one and threw toward a hole just past the other.",
        bn: "দরকার এক টুকরো পরিষ্কার সমতল মাটি আর অন্তত দুজন খেলোয়াড়। বাংলা উইকিপিডিয়া বলছে তিন, চার, পাঁচ, এমনকি সাতজন মিলেও খেলা যায়। প্রথমে একটা দাগ টানা হয়, তারপর তার সামনে কিছুটা দূরে এমন একটা গর্ত খোঁড়া হয়, যেখানে একটা মার্বেল বসতে পারে। বাংলা উইকিপিডিয়ার হিসাবে গর্তটা দাগ থেকে চার-পাঁচ হাত দূরে, আর বাংলাপিডিয়া লিখেছে খেলোয়াড়রা গর্ত থেকে নয়-দশ ফুট দূরের একটা দাগে দাঁড়ায়। bdnews24-এর এক লেখক মনে করেন, তাঁর গ্রামে সবচেয়ে জনপ্রিয় খেলাটা হতো দুটো দাগ দিয়ে: একটা দাগের পেছনে দাঁড়িয়ে অন্য দাগের সামনের গর্তের দিকে মার্বেল ফেলতে হতো।",
      },
    },
    {
      kind: "p",
      text: {
        en: "The words change from place to place. These are the ones the sources actually record:",
        bn: "জায়গাভেদে শব্দগুলোও বদলায়। সূত্রগুলোতে যে নামগুলো সত্যিই পাওয়া যায়, সেগুলো এখানে:",
      },
    },
    {
      kind: "table",
      head: [
        { en: "Word", bn: "শব্দ" },
        { en: "Meaning", bn: "মানে" },
        { en: "Source", bn: "সূত্র" },
      ],
      rows: [
        [
          { en: "জল্লা (জই in some places)", bn: "জল্লা (কোথাও জই)" },
          { en: "The line you throw from", bn: "যে দাগ থেকে মার্বেল ছোড়া হয়" },
          { en: "Bangla Wikipedia", bn: "বাংলা উইকিপিডিয়া" },
        ],
        [
          { en: "কেপ", bn: "কেপ" },
          { en: "The hole", bn: "গর্ত" },
          { en: "Bangla Wikipedia", bn: "বাংলা উইকিপিডিয়া" },
        ],
        [
          { en: "দান", bn: "দান" },
          { en: "A turn, and the stake that goes with it", bn: "পালা, আর সেই পালার জমা গুটি" },
          { en: "Bangla Wikipedia, bdnews24", bn: "বাংলা উইকিপিডিয়া, bdnews24" },
        ],
        [
          { en: "বাদ (or পচা)", bn: "বাদ (বা পচা)" },
          { en: "A marble that is out of play or off-limits", bn: "খেলার বাইরে বা ছোঁয়া নিষেধ এমন গুটি" },
          { en: "Bangla Wikipedia, bdnews24", bn: "বাংলা উইকিপিডিয়া, bdnews24" },
        ],
        [
          { en: "ডাগা or ডাগ / চুই", bn: "ডাগা বা ডাগ / চুই" },
          { en: "The biggest and the smallest marble", bn: "সবচেয়ে বড় আর সবচেয়ে ছোট মার্বেল" },
          { en: "bdnews24 (one writer's village)", bn: "bdnews24 (এক লেখকের গ্রাম)" },
        ],
      ],
    },
    { kind: "h2", text: { en: "Who goes first", bn: "কে আগে খেলবে" } },
    {
      kind: "list",
      ordered: true,
      items: [
        {
          en: "Every player stands behind the line, feet outside it, and throws one marble toward the hole.",
          bn: "সবাই দাগের পেছনে পা রেখে দাঁড়ায় এবং একটা করে মার্বেল গর্তের দিকে ছোড়ে।",
        },
        {
          en: "A marble that drops into the hole wins the first turn outright.",
          bn: "যার মার্বেল সরাসরি গর্তে পড়ে, প্রথম দান তার।",
        },
        {
          en: "If nobody gets in, the marble that stops closest to the hole plays first. Bangla Wikipedia and kishorgonj.com give this rule, and the bdnews24 writer remembers the closest marble going first too.",
          bn: "কেউ গর্তে ফেলতে না পারলে, যার মার্বেল গর্তের সবচেয়ে কাছে থামে, সে আগে খেলে। বাংলা উইকিপিডিয়া আর kishorgonj.com-এ এই নিয়মই আছে, আর bdnews24-এর লেখকের মনেও আছে যে সবচেয়ে কাছের মার্বেলই আগে চাল পেত।",
        },
      ],
    },
    { kind: "h2", text: { en: "The stake and the scatter", bn: "জমা গুটি আর ছিটানো" } },
    {
      kind: "p",
      text: {
        en: "Next comes the stake. In the version described by Bangla Wikipedia and kishorgonj.com, every other player hands the first player two, three or four marbles. He sits outside the playing area and gently scatters them forward, around the hole. Banglapedia describes the same moment a little differently: the player whose turn it is takes everyone's marbles and throws them toward the hole, and any that go in are his to keep. Either way, the spread of the marbles decides how hard the rest of the turn will be.",
        bn: "এরপর আসে জমার পালা। বাংলা উইকিপিডিয়া আর kishorgonj.com-এর বর্ণনায়, বাকি সবাই প্রথম খেলোয়াড়ের হাতে দুই, তিন বা চারটা করে মার্বেল জমা দেয়। সে ছকের বাইরে বসে মার্বেলগুলো সামনে গর্তের আশপাশে আলতো করে ছড়িয়ে দেয়। বাংলাপিডিয়া একই মুহূর্তটা একটু অন্যভাবে লিখেছে: যার পালা, সে সবার মার্বেল নিয়ে গর্তের দিকে ছোড়ে, আর যেগুলো গর্তে পড়ে সেগুলো তার। যেভাবেই হোক, গুটিগুলো কতটা ছড়াল তার ওপরই নির্ভর করে পালার বাকিটা কতটা কঠিন হবে।",
      },
    },
    { kind: "h2", text: { en: "Naming the marble: hits and fines", bn: "গুটি দেখানো: লাগানো আর ফাইন" } },
    {
      kind: "p",
      text: {
        en: "This is the heart of the game, and also where the sources differ most. In the version recorded by Bangla Wikipedia and kishorgonj.com, the other players point at one particular marble and call it বাদ. That marble is off-limits. The shooter has to flick a marble so that it touches any one of the other marbles. If he manages it, he wins the দান; if he can't, the next player gets the same chance. Touching the বাদ marble earns a fine, and the next player scatters the fined marbles along with the rest and carries on.",
        bn: "খেলার আসল জায়গা এটাই, আর সূত্রগুলোর মধ্যে সবচেয়ে বেশি অমিলও এখানে। বাংলা উইকিপিডিয়া আর kishorgonj.com-এর বর্ণনায়, অন্য খেলোয়াড়রা একটা নির্দিষ্ট মার্বেল দেখিয়ে বলে ‘বাদ’। ওই গুটি ছোঁয়া নিষেধ। খেলোয়াড়কে আরেকটা মার্বেল ছেড়ে বাকিগুলোর যেকোনো একটাকে ছুঁতে হয়। পারলে দানটা তার; না পারলে পরের জন একই সুযোগ পায়। আর ‘বাদ’ গুটিতে লাগলে ফাইন দিতে হয়, তখন পরের খেলোয়াড় ফাইনের গুটিসহ সব ছড়িয়ে দিয়ে খেলা চালিয়ে যায়।",
      },
    },
    {
      kind: "p",
      text: {
        en: "The bdnews24 writer remembers it the same way: the set-aside marble is usually one that sits close enough to touch easily, and touching it by mistake costs one more marble, a penalty he calls ডোন or দণ্ড. Banglapedia's account has no named marble at all. The shooter tries to hit the scattered marbles one by one; every hit marble becomes his, but a miss, or touching other marbles, costs him one marble and passes the turn to the next player.",
        bn: "bdnews24-এর লেখকের স্মৃতিও একই রকম: যে গুটিটা বাদ রাখা হয়, সেটা সাধারণত এমন জায়গায় থাকে যে সহজেই ছুঁয়ে ফেলা যায়, আর ভুল করে ছুঁলে দণ্ড হিসেবে আরও একটা মার্বেল দিতে হয়। এই দণ্ডকে তিনি বলেছেন ‘ডোন’ বা ‘দণ্ড’। বাংলাপিডিয়ার বর্ণনায় আবার কোনো গুটি দেখানোর নিয়মই নেই। খেলোয়াড় ছড়ানো মার্বেলগুলোকে একটা একটা করে মারার চেষ্টা করে; যেটায় লাগে সেটা তার, কিন্তু মিস করলে বা অন্য মার্বেলে লাগলে একটা মার্বেল দিতে হয় এবং পালা চলে যায় পরের জনের কাছে।",
      },
    },
    {
      kind: "table",
      head: [
        { en: "Source", bn: "সূত্র" },
        { en: "A good shot", bn: "ঠিকঠাক লাগলে" },
        { en: "A bad shot", bn: "ভুল হলে" },
      ],
      rows: [
        [
          { en: "Bangla Wikipedia, kishorgonj.com", bn: "বাংলা উইকিপিডিয়া, kishorgonj.com" },
          { en: "Touch any marble except the বাদ one: you win the whole দান", bn: "‘বাদ’ ছাড়া যেকোনো গুটিতে লাগানো: পুরো দান জেতা" },
          { en: "Miss: the turn passes. Touch the বাদ marble: pay a fine", bn: "মিস: পালা যায় পরের জনের। ‘বাদ’ গুটিতে লাগলে: ফাইন" },
        ],
        [
          { en: "bdnews24", bn: "bdnews24" },
          { en: "Touch one of the other marbles: the দান is yours", bn: "অন্য কোনো গুটি ছুঁলে: দান তার" },
          { en: "Touch the set-aside marble: one more marble as a penalty", bn: "বাদ রাখা গুটি ছুঁলে: দণ্ড হিসেবে আরও একটা মার্বেল" },
        ],
        [
          { en: "Banglapedia", bn: "বাংলাপিডিয়া" },
          { en: "Hit a marble: you own it and keep shooting at the others", bn: "যে গুটিতে লাগে সেটা নিজের, তারপর বাকিগুলোর দিকে" },
          { en: "Miss, or touch other marbles: give one marble, lose the turn", bn: "মিস বা অন্য গুটিতে লাগলে: একটা গুটি দেওয়া, পালা হারানো" },
        ],
      ],
    },
    {
      kind: "callout",
      tone: "note",
      text: {
        en: "Rules vary by area. The sources above disagree on the size of the stake, on whether there is an off-limits marble and on whether a good shot wins one marble or the whole দান, so settle these before the first throw. If your para played it differently, your version is just as traditional.",
        bn: "এলাকাভেদে নিয়ম আলাদা। কয়টা গুটি জমা পড়বে, ছোঁয়া নিষেধ এমন গুটি থাকবে কি না, আর ঠিকঠাক লাগলে একটা গুটি মিলবে নাকি পুরো দান, এসব নিয়ে ওপরের সূত্রগুলোই একমত নয়। তাই প্রথম ছোড়ার আগেই ঠিক করে নিন। আপনার পাড়ায় যদি অন্যভাবে খেলা হতো, সেটাও সমান ঐতিহ্যের।",
      },
    },
    { kind: "h2", text: { en: "When the game ends", bn: "খেলা শেষ হয় কখন" } },
    {
      kind: "p",
      text: {
        en: "There is no clock and no fixed score. According to Bangla Wikipedia, the turns simply keep going until one side gives up or runs out of marbles. The bdnews24 writer also recalls that in his village, children only ever won marbles from each other, while some adults played for money, which is one reason many parents frowned on the game. Bangla Wikipedia even suggests that those bans may have made marbles all the more tempting.",
        bn: "কোনো ঘড়ি নেই, নির্দিষ্ট স্কোরও নেই। বাংলা উইকিপিডিয়া অনুযায়ী, পালা চলতেই থাকে যতক্ষণ না প্রতিপক্ষ হার মানে বা তার কাছের মার্বেল ফুরিয়ে যায়। bdnews24-এর লেখক আরও মনে করেন, তাঁর গ্রামে ছোটরা মার্বেলের বদলে মার্বেলই নিত, তবে বড়দের কেউ কেউ টাকা দিয়েও খেলত; অনেক অভিভাবক খেলাটা পছন্দ না করার এটাও একটা কারণ। বাংলা উইকিপিডিয়ার ধারণা, হয়তো সেই নিষেধাজ্ঞাই কিশোরদের কাছে মার্বেলকে আরও লোভনীয় করে তুলেছিল।",
      },
    },
    { kind: "h2", text: { en: "Eid, school bags and tiffin breaks", bn: "ঈদ, স্কুলব্যাগ আর টিফিনের ঘণ্টা" } },
    {
      kind: "p",
      text: {
        en: "Marbles belong to particular memories. kishorgonj.com writes that Eid once hardly felt complete for village children without a game of marbles, and that marbles travelled to school in bags and pockets to be played at tiffin time, out of the teacher's sight. The bdnews24 writer remembers village grocery shops stocking new marbles before Eid, and children spending their Eid salami on them. Other games crowd it out today, but kishorgonj.com notes that marbles are still played in villages at Eid.",
        bn: "মার্বেলের সঙ্গে জড়িয়ে আছে কিছু নির্দিষ্ট স্মৃতি। kishorgonj.com লিখেছে, একসময় মার্বেল না খেললে গ্রামের শিশু-কিশোরদের ঈদ যেন পূর্ণই হতো না, আর স্কুলব্যাগ বা পকেটে করে মার্বেল যেত স্কুলে, টিফিনের সময় শিক্ষকের চোখ এড়িয়ে খেলার জন্য। bdnews24-এর লেখক মনে করেন, ঈদের আগে গ্রামের মুদি দোকানে নতুন নতুন মার্বেল আসত, আর ছোটরা ঈদের সালামির টাকায় সেগুলো কিনত। এখন অন্য খেলার ভিড়ে মার্বেল কিছুটা পিছিয়ে পড়েছে, তবে kishorgonj.com বলছে ঈদে গ্রামে এখনও খেলা হয়।",
      },
    },
    { kind: "h2", text: { en: "How our online version adapts the rules", bn: "আমাদের অনলাইন সংস্করণে নিয়ম যেভাবে সাজানো" } },
    {
      kind: "p",
      text: {
        en: "Our [Kacher Guti game](/games/kacher-guti) keeps the line, the hole, the opening throw and the stake, but it is played one against one, you versus the computer, so a few things had to be fixed in place:",
        bn: "আমাদের [কাচের গুটি গেমে](/games/kacher-guti) দাগ, গর্ত, শুরুর ছোড়া আর জমা গুটি সবই আছে, তবে খেলাটা একজনের বিরুদ্ধে একজন, আপনি বনাম কম্পিউটার। তাই কয়েকটা নিয়ম নির্দিষ্ট করে দিতে হয়েছে:",
      },
    },
    {
      kind: "list",
      items: [
        {
          en: "Each side starts with 10 marbles, and a match lasts 3 rounds, or less if one side runs out.",
          bn: "দুই পক্ষ শুরু করে ১০টা করে মার্বেল নিয়ে; খেলা ৩ দানের, তবে কারও গুটি ফুরালে আগেই শেষ।",
        },
        {
          en: "Every round opens with both shooters thrown from the line: in the hole or closest plays first, and an exact tie goes to you.",
          bn: "প্রতি দানের শুরুতে দুই পক্ষই দাগ থেকে নিজের খেলার গুটি ছোড়ে: গর্তে পড়লে বা সবচেয়ে কাছে গেলে আগে খেলা, একদম সমান হলে সুযোগ আপনার।",
        },
        {
          en: "Both sides put up to 3 marbles in the pot, the first player scatters them, and any that drop into the hole go to the scatterer.",
          bn: "দুই পক্ষ ৩টা পর্যন্ত গুটি জমা দেয়, প্রথম খেলোয়াড় সেগুলো ছিটায়, আর ছিটানোর সময় যেগুলো গর্তে পড়ে সেগুলো তার।",
        },
        {
          en: "One deliberate change: instead of naming a marble to avoid, the opponent names the marble you must hit. It has to be the first marble your shooter touches, and your shooter must stay out of the hole. Do that and you win it and shoot again.",
          bn: "একটা ইচ্ছাকৃত বদল: এখানে ছোঁয়া নিষেধ এমন গুটি দেখানো হয় না, বরং প্রতিপক্ষ দেখিয়ে দেয় কোন গুটিটা মারতে হবে। আপনার গুটি প্রথমে সেটাতেই লাগতে হবে, আর নিজের গুটি গর্তে পড়া চলবে না। পারলে গুটিটা আপনার, আবার মারার সুযোগও।",
        },
        {
          en: "A miss, hitting another marble first or dropping your shooter in the hole is a foul: you pay one marble and the turn passes.",
          bn: "মিস করা, আগে অন্য গুটিতে লাগা বা নিজের গুটি গর্তে ফেলা মানে ফাউল: একটা গুটি দিতে হয়, পালা চলে যায় অন্য পক্ষে।",
        },
      ],
    },
    {
      kind: "p",
      text: {
        en: "In the game, marbles are only a count on the screen. When you have had enough of flicking glass, the same childhood rivals are waiting in [Latim Fight](/games/latim-fight), and the rest of our [games](/games) are a tap away.",
        bn: "গেমে মার্বেল শুধু পর্দার একটা হিসাব। গুটি মারতে মারতে মন ভরে গেলে, ছোটবেলার সেই একই প্রতিপক্ষরা অপেক্ষা করছে [লাটিম ফাইটে](/games/latim-fight), আর আমাদের বাকি [গেমগুলোও](/games) এক ট্যাপ দূরে।",
      },
    },
    { kind: "activity", key: "g:kacher-guti" },
  ],
  play: ["g:kacher-guti"],
  sources: [
    { title: "Banglapedia: Folk Games (Gulikhela)", url: "https://en.banglapedia.org/index.php/Folk_Games" },
    { title: "বাংলা উইকিপিডিয়া: মার্বেল খেলা", url: "https://bn.wikipedia.org/wiki/%E0%A6%AE%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A7%87%E0%A6%B2_%E0%A6%96%E0%A7%87%E0%A6%B2%E0%A6%BE" },
    { title: "kishorgonj.com: মার্বেল খেলা", url: "https://www.kishorgonj.com/%E0%A6%AE%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A7%87%E0%A6%B2-%E0%A6%96%E0%A7%87%E0%A6%B2%E0%A6%BE/" },
    { title: "bdnews24 Kidz: মার্বেল খেলার দিন (মো. ইয়াকুব আলী)", url: "https://bangla.bdnews24.com/kidz/article1941165.bdnews" },
  ],
  faq: [
    {
      q: { en: "What do জল্লা and কেপ mean in marbles?", bn: "মার্বেল খেলায় জল্লা আর কেপ মানে কী?" },
      a: {
        en: "According to Bangla Wikipedia, জল্লা (called জই in some places) is the regional word for the line players throw from, and কেপ is the small hole in front of it. Other areas may use different words.",
        bn: "বাংলা উইকিপিডিয়া অনুযায়ী, জল্লা (কোথাও জই) হলো যে দাগ থেকে মার্বেল ছোড়া হয় তার আঞ্চলিক নাম, আর কেপ হলো সামনের ছোট গর্তটা। অন্য এলাকায় অন্য শব্দও চলে।",
      },
    },
    {
      q: { en: "Who plays first in a marble game?", bn: "মার্বেল খেলায় কে আগে খেলে?" },
      a: {
        en: "Everyone throws one marble from behind the line toward the hole. Whoever lands in the hole, or stops closest to it, takes the first turn and receives the stake from the others.",
        bn: "সবাই দাগের পেছন থেকে একটা করে মার্বেল গর্তের দিকে ছোড়ে। যার মার্বেল গর্তে পড়ে বা সবচেয়ে কাছে থামে, প্রথম দান তার, আর বাকিরা তার হাতেই গুটি জমা দেয়।",
      },
    },
    {
      q: { en: "Were marbles always made of glass?", bn: "মার্বেল কি সবসময় কাচেরই ছিল?" },
      a: {
        en: "No. Banglapedia says glass marbles were first imported during the British period. Before that the game was played with clay balls, and some village boys still use them.",
        bn: "না। বাংলাপিডিয়া বলছে, কাচের মার্বেল প্রথম আমদানি হয় ব্রিটিশ আমলে। তার আগে খেলা হতো মাটির গুলি দিয়ে, আর গ্রামের কিছু ছেলে এখনও সেগুলো দিয়েই খেলে।",
      },
    },
  ],
};
