import type { BlogPost } from "@/lib/blog";

// Researched 2026-10-26 from the sources listed below (all opened). Rules
// differ by area; where the sources disagree, the text says so. Always
// "লাটিম" (owner). The owner reviews, verifies and publishes.

export const latimKhelaRules: BlogPost = {
  slug: "latim-khela-rules",
  status: "needs_review",
  published: "",
  topic: "traditional-games",
  title: {
    en: "How Latim Is Played in Bangladesh: Bella Par and Ghor Kop",
    bn: "বাংলাদেশে লাটিম খেলা হয় যেভাবে: বেল্লা পার ও ঘর কোপ",
  },
  seo: {
    en: {
      title: "Latim Khela Rules: Bella Par and Ghor Kop Explained",
      description:
        "How the traditional latim game works in Bangladesh: the string, drawing the circle, who throws first, and the two classic styles, bella par and ghor kop.",
    },
    bn: {
      title: "লাটিম খেলার নিয়ম: লেত্তি, বৃত্ত, বেল্লা পার ও ঘর কোপ",
      description:
        "লাটিম খেলার নিয়ম সহজ ভাষায়: লেত্তি দিয়ে বৃত্ত আঁকা, কে আগে খেলবে, বেল্লা পার আর ঘর কোপ খেলার ধরন, আর পুরোনো খেলায় সাবধান থাকার কথা।",
    },
  },
  lead: {
    en: "A wooden top, a length of string and a circle scratched into the dirt: that was all a para needed for an afternoon of latim. Here is how the game is played, drawn from newspaper features and folk-game write-ups, including the two styles people still name, বেল্লা পার and ঘর কোপ.",
    bn: "একটা কাঠের লাটিম, এক টুকরো সুতলি আর মাটিতে আঁচড়ে আঁকা একটা বৃত্ত, পাড়ার একটা বিকেল জমাতে আর কিছু লাগত না। পত্রিকার ফিচার আর লোকখেলার লেখা ঘেঁটে এখানে সাজানো হলো লাটিম খেলার নিয়ম, সঙ্গে দুই চেনা ধরন: বেল্লা পার আর ঘর কোপ।",
  },
  cover: { emoji: "🌀", accent: "tangerine" },
  body: [
    { kind: "h2", text: { en: "What a latim is made of", bn: "লাটিম কী দিয়ে তৈরি" } },
    {
      kind: "p",
      text: {
        en: "A latim is a wooden spinning top with an iron point fixed to the bottom and a groove around the body where the string is wound. Older features describe village carpenters carving them for boys, often from the wood of guava or gab trees. Latims sold in shops today are usually turned from a softer wood.",
        bn: "লাটিম হলো কাঠের তৈরি ঘোরানোর খেলনা। এর নিচে লোহার একটা সূঁচালো আল লাগানো থাকে, আর গায়ে থাকে খাঁজ, যেখানে সুতলি পেঁচানো হয়। পুরোনো লেখাগুলো বলে, গ্রামের ছুতার মিস্ত্রিরা ছেলেদের জন্য লাটিম বানিয়ে দিতেন, প্রায়ই পেয়ারা বা গাবগাছের কাঠ দিয়ে। এখন দোকানে যে লাটিম পাওয়া যায়, সেগুলো সাধারণত নরম কাঠের।",
      },
    },
    {
      kind: "p",
      text: {
        en: "The string goes by more than one name. Kishor Alo and Bhorer Kagoj call it লতি or ফিতা, Bhorer Kagoj also writes লেত্তি, and a kishorgonj.com article notes that some regions say লেতি. It was traditionally twisted from jute; newer strings are cloth, and Bangla Wikipedia mentions strips of old vest fabric and a length of about two to three হাত.",
        bn: "সুতলিটার নাম একেক জায়গায় একেক রকম। কিশোর আলো আর ভোরের কাগজ একে বলেছে লতি বা ফিতা, ভোরের কাগজে লেত্তি নামটাও আছে, আর kishorgonj.com-এর একটি লেখা জানায় কোনো কোনো অঞ্চলে একে লেতি বলে। আগে এটা পাট পাকিয়ে বানানো হতো; এখন কাপড়ের ফিতাই বেশি, আর বাংলা উইকিপিডিয়া গেঞ্জির কাপড়ের ফালির কথা বলে, লম্বায় মোটামুটি দুই-তিন হাত।",
      },
    },
    {
      kind: "p",
      text: {
        en: "To spin it, you wind the string tightly around the lower half, then throw the latim down from a height, guiding it mostly with the index finger and thumb, so that it lands on its point and keeps turning on the ground.",
        bn: "ঘোরাতে হলে লাটিমের নিচের অর্ধেকে সুতলি শক্ত করে পেঁচিয়ে নিতে হয়, তারপর ওপর থেকে ছুড়ে দিতে হয়, মূলত তর্জনী আর বুড়ো আঙুলের কায়দায়, যাতে লাটিম আলের ওপর নেমে মাটিতে ঘুরতে থাকে।",
      },
    },
    {
      kind: "callout",
      tone: "tip",
      text: {
        en: "A trick that several sources mention: skilled players scoop a latim off the ground onto their palm, and it keeps spinning there. Learn it from someone who already can.",
        bn: "কয়েকটি লেখায় একটা কেরামতির কথা আছে: দক্ষ খেলোয়াড় মাটিতে ঘুরতে থাকা লাটিম হাতের তালুতে তুলে নেন, আর সেটা সেখানেও ঘুরতে থাকে। যিনি পারেন, তাঁর কাছ থেকেই শিখে নেওয়া ভালো।",
      },
    },
    { kind: "h2", text: { en: "Alone or with friends", bn: "একা, নাকি বন্ধুদের সঙ্গে" } },
    {
      kind: "p",
      text: {
        en: "On your own, latim is a simple test: how long can you keep it spinning? With four or five players it turns into a real contest, and in the versions described by Kishor Alo and kishorgonj.com, a latim knocked out by another player is won by that player.",
        bn: "একা খেললে লাটিম মানে একটাই পরীক্ষা: কতক্ষণ ঘোরাতে পারেন? চার-পাঁচজন মিলে খেললে সেটা আসল প্রতিযোগিতা, আর কিশোর আলো ও kishorgonj.com-এর বর্ণনায় যে খেলোয়াড় অন্যের লাটিম মেরে বের করে দেন, লাটিমটা তাঁরই হয়ে যায়।",
      },
    },
    { kind: "h2", text: { en: "Drawing the circle with the string", bn: "সুতলি দিয়ে বৃত্ত আঁকা" } },
    {
      kind: "p",
      text: {
        en: "The game needs flat ground and a circle. According to kishorgonj.com, one player presses one end of the string firmly to the ground; another pulls the string tight with the latim tied to it and swings it round, so the iron point scratches a neat circle into the soil. The string works like a compass.",
        bn: "খেলার জন্য লাগে সমতল মাটি আর একটা বৃত্ত। kishorgonj.com-এর বর্ণনা অনুযায়ী, একজন সুতলির এক মাথা মাটিতে শক্ত করে চেপে ধরেন; আরেকজন লাটিম বাঁধা অন্য মাথা টানটান করে ঘুরিয়ে আনেন, আর লাটিমের আল মাটিতে একটা গোল দাগ কেটে দেয়। সুতলিটা তখন কম্পাসের কাজ করে।",
      },
    },
    { kind: "h2", text: { en: "Who goes first: the order throw", bn: "কে আগে খেলবে: আগে-পরের দান" } },
    {
      kind: "p",
      text: {
        en: "Before the real game, players settle the order. In the kishorgonj.com description, everyone spins a latim from inside the circle, and the one whose latim spins out and travels farthest takes first place, the next farthest second, and so on. Kishor Alo instead describes the result depending on how close each latim gets to the circle's edge. So the measure differs from area to area, and it is worth agreeing on it before anyone throws.",
        bn: "আসল খেলার আগে ঠিক হয় কে কার পরে খেলবেন। kishorgonj.com-এর বর্ণনায় সবাই বৃত্তের ভেতর থেকে লাটিম ঘোরান, আর যাঁর লাটিম ঘুরতে ঘুরতে বৃত্ত পেরিয়ে সবচেয়ে দূরে যায়, তিনি প্রথম, তার পরের জন দ্বিতীয়, এভাবে। কিশোর আলো আবার বলেছে, কার লাটিম বৃত্তের কিনারার কত কাছ ঘেঁষে যায়, সেটাই আসল। অর্থাৎ মাপকাঠি এলাকাভেদে আলাদা, তাই ছোড়ার আগেই সবাই মিলে ঠিক করে নেওয়া ভালো।",
      },
    },
    {
      kind: "p",
      text: {
        en: "With four players, the kishorgonj.com account then runs from the bottom of the order upward:",
        bn: "চারজন খেললে kishorgonj.com-এর বর্ণনায় এরপর খেলা চলে নিচের ক্রম থেকে ওপরের দিকে:",
      },
    },
    {
      kind: "list",
      ordered: true,
      items: [
        {
          en: "The fourth-placed player spins a latim inside the circle.",
          bn: "চতুর্থ জন বৃত্তের ভেতরে লাটিম ঘোরান।",
        },
        {
          en: "The third-placed player throws to hit it out of the circle. If it goes out, the third player wins it.",
          bn: "তৃতীয় জন নিজের লাটিম ছুড়ে সেটাকে বৃত্তের বাইরে ফেলার চেষ্টা করেন। বের হয়ে গেলে লাটিমটা তৃতীয় জনের।",
        },
        {
          en: "Then the third-placed player spins, and the second-placed player tries the same.",
          bn: "এরপর তৃতীয় জন ঘোরান, আর দ্বিতীয় জন একই চেষ্টা করেন।",
        },
        {
          en: "Finally the first-placed player takes aim at the second-placed player's latim, and the rounds carry on in this pattern.",
          bn: "শেষে প্রথম জন নিশানা করেন দ্বিতীয় জনের লাটিমে, আর এভাবেই খেলা চলতে থাকে।",
        },
      ],
    },
    { kind: "h2", text: { en: "বেল্লা পার: knock it past the line", bn: "বেল্লা পার: দাগের বাইরে পাঠানো" } },
    {
      kind: "p",
      text: {
        en: "Kishor Alo and Bhorer Kagoj both say latim is usually played in two styles, বেল্লা পার and ঘর কোপ. In বেল্লা পার, a line is scratched to mark the boundary. The player who loses the deciding rounds has to put a latim down, and the others strike it with their own latims to drive it beyond the line. According to Bangla Wikipedia, some players even strike while holding a still-spinning latim in the hand.",
        bn: "কিশোর আলো আর ভোরের কাগজ দুটোই বলছে, লাটিম সাধারণত দুই নিয়মে খেলা হয়: বেল্লা পার আর ঘর কোপ। বেল্লা পারে একটা দাগ কেটে সীমানা ঠিক করা হয়। বাছাইয়ের দানগুলোতে যিনি হারেন, তাঁর লাটিম মাটিতে রাখতে হয়, আর বাকিরা নিজেদের লাটিম দিয়ে মেরে সেটাকে দাগের ওপারে পাঠানোর চেষ্টা করেন। বাংলা উইকিপিডিয়া বলছে, কেউ কেউ হাতে ধরা ঘুরন্ত লাটিম দিয়েও মারেন।",
      },
    },
    {
      kind: "p",
      text: {
        en: "A miss doesn't end it. Bhorer Kagoj and Bangla Wikipedia describe the latim being set down again where it stopped (Wikipedia says this is when “বেল্লা পার” is called), and the strikes repeat until it crosses the line. A latim that has crossed the boundary can then be given a kop, as agreed beforehand.",
        bn: "একবার ফসকালে খেলা শেষ নয়। ভোরের কাগজ আর বাংলা উইকিপিডিয়ার বর্ণনায়, লাটিম যেখানে থামে সেখানেই আবার বসানো হয় (উইকিপিডিয়া বলছে, তখনই “বেল্লা পার” ডাকা হয়), আর দাগ পার না হওয়া পর্যন্ত মারা চলতে থাকে। সীমানা পার হওয়া লাটিমে এরপর আগে থেকে ঠিক করা নিয়মমতো কোপ দেওয়া যায়।",
      },
    },
    { kind: "h2", text: { en: "ঘর কোপ: the latim in the circle", bn: "ঘর কোপ: বৃত্তের ভেতরের লাটিম" } },
    {
      kind: "p",
      text: {
        en: "ঘর কোপ starts with a circle drawn with the string and a latim. By agreement, a latim is placed inside it, and the other players strike at it from outside with their spinning latims. Kop means a strike. Kishor Alo, Bhorer Kagoj and kishorgonj.com all mention that a good hit can crack the other latim, and that cracking one earns the player plenty of praise. That is why, as kishorgonj.com and Bhorer Kagoj note, players like to keep the point sharp.",
        bn: "ঘর কোপের শুরু একটা বৃত্ত দিয়ে, যা আঁকা হয় সুতলি আর লাটিম দিয়ে। নিয়মমতো একটা লাটিম ঘরের ভেতরে রাখা হয়, আর বাকিরা বাইরে থেকে ঘুরন্ত লাটিম দিয়ে সেটাতে আঘাত করেন। কোপ মানে আঘাত করা। কিশোর আলো, ভোরের কাগজ আর kishorgonj.com তিনটিতেই আছে, জুতসই মার পড়লে অন্যের লাটিম ফেটে যেতে পারে, আর ফাটাতে পারলে খেলোয়াড় বেশ বাহবা পান। kishorgonj.com আর ভোরের কাগজ জানায়, এজন্যই খেলোয়াড়রা আল সূঁচালো রাখতে পছন্দ করেন।",
      },
    },
    {
      kind: "p",
      text: {
        en: "Bangla Wikipedia also lists a third style, ঘুরতি কোপ, where one player spins a latim and the others take turns spinning theirs to hit it, one throw each.",
        bn: "বাংলা উইকিপিডিয়ায় তৃতীয় একটা ধরনও আছে, ঘুরতি কোপ: একজন লাটিম ঘোরান, আর বাকিরা পালা করে একবার করে নিজের লাটিম ঘুরিয়ে সেটাকে মারার চেষ্টা করেন।",
      },
    },
    {
      kind: "table",
      head: [
        { en: "Style", bn: "ধরন" },
        { en: "Where the target sits", bn: "নিশানার লাটিম কোথায়" },
        { en: "What you try to do", bn: "লক্ষ্য কী" },
      ],
      rows: [
        [
          { en: "বেল্লা পার", bn: "বেল্লা পার" },
          { en: "On the ground, behind a scratched boundary line", bn: "মাটিতে, দাগ কাটা সীমানার এ পাশে" },
          { en: "Drive it past the line; after a miss it is set down again", bn: "দাগের ওপারে পাঠানো; ফসকালে আবার বসানো হয়" },
        ],
        [
          { en: "ঘর কোপ", bn: "ঘর কোপ" },
          { en: "Inside a circle drawn with the string", bn: "সুতলি দিয়ে আঁকা বৃত্তের ভেতরে" },
          { en: "Strike it from outside; cracking it wins praise", bn: "বাইরে থেকে মারা; ফাটাতে পারলে বাহবা" },
        ],
        [
          { en: "ঘুরতি কোপ", bn: "ঘুরতি কোপ" },
          { en: "Spinning wherever its owner threw it", bn: "যেখানে ছোড়া হয়েছে, সেখানেই ঘুরছে" },
          { en: "Hit it with your own spinning latim, one throw per turn", bn: "নিজের ঘুরন্ত লাটিম দিয়ে মারা, পালায় একবার" },
        ],
      ],
    },
    {
      kind: "callout",
      tone: "note",
      text: {
        en: "Rules vary by area. The sources agree on the broad shape (a circle or a line, an order throw, winning the latim you knock out) but differ on details, so the local version you grew up with may be just as right.",
        bn: "নিয়ম এলাকাভেদে আলাদা। মূল কাঠামোয় (বৃত্ত বা দাগ, আগে-পরের দান, বের করে দেওয়া লাটিম জিতে নেওয়া) লেখাগুলো একমত, কিন্তু খুঁটিনাটিতে মেলে না। তাই আপনি ছোটবেলায় যে নিয়মে খেলেছেন, সেটাও সমান ঠিক হতে পারে।",
      },
    },
    { kind: "h2", text: { en: "Playing it safely", bn: "সাবধানে খেলা" } },
    {
      kind: "p",
      text: {
        en: "The sources describe iron points that players sharpen and latims that crack when they are hit, and a thrown latim moves fast. None of them lists safety rules, so treat this as plain common sense: play on open ground, stand to the side rather than in front of a thrower, keep watching younger children back from the circle, and let small kids learn with an older player nearby.",
        bn: "লেখাগুলোতে আছে সূঁচালো করা লোহার আল আর আঘাতে ফেটে যাওয়া লাটিমের কথা, আর ছোড়া লাটিম চলেও বেশ জোরে। কোনো লেখায় আলাদা করে সাবধানতার নিয়ম নেই, তাই এগুলোকে সাধারণ বুদ্ধির পরামর্শ হিসেবেই নিন: খোলা জায়গায় খেলুন, যিনি ছুড়ছেন তাঁর সামনে নয়, পাশে দাঁড়ান, দর্শক ছোটদের বৃত্ত থেকে একটু দূরে রাখুন, আর একেবারে ছোটরা শিখুক বড় কারও পাশে থেকে।",
      },
    },
    {
      kind: "p",
      text: {
        en: "kishorgonj.com also notes that in many areas the game has almost disappeared, though it can still be seen now and then in rural Bangladesh. If there is a latim at home, an afternoon of teaching someone the string and the circle keeps it going.",
        bn: "kishorgonj.com আরও জানায়, অনেক এলাকা থেকে লাটিম খেলার চল প্রায় উঠে গেছে, যদিও গ্রামবাংলায় এখনো মাঝেমধ্যে দেখা যায়। বাসায় একটা লাটিম থাকলে কাউকে সুতলি পেঁচানো আর বৃত্ত আঁকা শিখিয়ে দিন, খেলাটা তাতেই বেঁচে থাকবে।",
      },
    },
    { kind: "h2", text: { en: "How our online লাটিম যুদ্ধ adapts it", bn: "আমাদের অনলাইন লাটিম যুদ্ধে যেভাবে খেলাটা এসেছে" } },
    {
      kind: "p",
      text: {
        en: "[লাটিম যুদ্ধ](/games/latim-fight) is a two-player take on the circle game: you against the computer, with three opponents from the para to pick from. It keeps the order throw: both latims are thrown outward from the middle of the circle, and whichever ends farther away attacks first.",
        bn: "[লাটিম যুদ্ধ](/games/latim-fight) হলো বৃত্তের খেলাটার দুজনের সংস্করণ: আপনি বনাম কম্পিউটার, পাড়ার তিনজন প্রতিপক্ষের যেকোনো একজন। আগে-পরের দানটা এখানেও আছে: বৃত্তের মাঝখান থেকে দুজনেই বাইরের দিকে লাটিম ছোড়েন, যাঁরটা বেশি দূরে থামে, তিনিই আগে আক্রমণ করেন।",
      },
    },
    {
      kind: "list",
      items: [
        {
          en: "Each bout, the defender spins a latim into the circle and the attacker throws at it.",
          bn: "প্রতি দানে ডিফেন্ডার বৃত্তে লাটিম ঘোরান, আর আক্রমণকারী সেটাকে নিশানা করে ছোড়েন।",
        },
        {
          en: "It counts as a knockout when the attacker touches the defender's latim and its centre ends up outside the circle. The attacker wins that latim and attacks again.",
          bn: "আক্রমণকারীর লাটিম ছুঁয়ে দিলে আর ডিফেন্ডারের লাটিমের মাঝখান বৃত্তের বাইরে গিয়ে থামলে সেটা নকআউট। লাটিমটা আক্রমণকারীর, আর তিনি আবার আক্রমণ করেন।",
        },
        {
          en: "No knockout means the roles swap, except when the defender's latim has stopped spinning and is stuck inside: then the attacker gets one extra throw.",
          bn: "নকআউট না হলে ভূমিকা বদল, তবে ডিফেন্ডারের লাটিম ঘোরা থামিয়ে ভেতরে আটকে গেলে আক্রমণকারী একটা বাড়তি দান পান।",
        },
        {
          en: "The first to win three latims takes the match; after eight bouts, whoever has won more wins, and an equal count is a draw.",
          bn: "যিনি আগে তিনটা লাটিম জেতেন, ম্যাচ তাঁর; আট দান শেষ হলে যাঁর জেতা লাটিম বেশি, তিনি জেতেন, সমান হলে ড্র।",
        },
      ],
    },
    {
      kind: "p",
      text: {
        en: "The ঘর কোপ becomes a finisher. After each latim you knock out, a ring closes in on the beaten latim, and you tap at the moment it meets the latim: a perfect kop adds 50 points, a good one 20. Like the praise in the old game, it is a bonus, so a missed kop simply adds nothing and you never lose the latim you won. No sharpened points, nothing to crack for real.",
        bn: "ঘর কোপ এখানে শেষ চমক। আপনি প্রতিটা লাটিম বের করে দেওয়ার পর হেরে যাওয়া লাটিমের দিকে একটা রিং ছোট হয়ে আসে, আর রিং লাটিমে মেলার মুহূর্তে চাপ দিতে হয়: নিখুঁত কোপে ৫০ পয়েন্ট, ভালো কোপে ২০। পুরোনো খেলার বাহবার মতোই এটা বাড়তি পাওনা, তাই কোপ ফসকালে শুধু কিছু যোগ হয় না, জেতা লাটিম কখনো হাতছাড়া হয় না। সূঁচালো আল নেই, সত্যি সত্যি কিছু ফাটেও না।",
      },
    },
    { kind: "activity", key: "g:latim-fight" },
    {
      kind: "p",
      text: {
        en: "If marbles were more your thing than tops, read how the other para classic works in [our guide to kacher guti](/blog/kacher-guti-rules).",
        bn: "লাটিমের চেয়ে মার্বেলে বেশি হাত পাকা ছিল? তাহলে পাড়ার আরেক পুরোনো খেলার নিয়ম পড়ে নিন [কাচের গুটি নিয়ে আমাদের লেখায়](/blog/kacher-guti-rules)।",
      },
    },
  ],
  play: ["g:latim-fight"],
  sources: [
    { title: "Kishor Alo: লাটিম খেলা (Mehnaz Mumtahina, 2021)", url: "https://www.kishoralo.com/%E0%A6%B2%E0%A6%BE%E0%A6%9F%E0%A6%BF%E0%A6%AE-%E0%A6%96%E0%A7%87%E0%A6%B2%E0%A6%BE" },
    {
      title: "Bhorer Kagoj: জানা অজানা : লাটিম বা লাট্টু (25 Jan 2022)",
      url: "https://www.bhorerkagoj.net/print-edition/2022/01/25/%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%BE-%E0%A6%85%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%BE-%E0%A6%B2%E0%A6%BE%E0%A6%9F%E0%A6%BF%E0%A6%AE-%E0%A6%AC%E0%A6%BE-%E0%A6%B2%E0%A6%BE%E0%A6%9F%E0%A7%8D%E0%A6%9F",
    },
    { title: "kishorgonj.com: লাটিম খেলা (2010)", url: "https://www.kishorgonj.com/%E0%A6%B2%E0%A6%BE%E0%A6%9F%E0%A6%BF%E0%A6%AE-%E0%A6%96%E0%A7%87%E0%A6%B2%E0%A6%BE/" },
    { title: "Bangla Wikipedia: লাটিম", url: "https://bn.wikipedia.org/wiki/%E0%A6%B2%E0%A6%BE%E0%A6%9F%E0%A6%BF%E0%A6%AE" },
  ],
  faq: [
    {
      q: { en: "What is the latim string called?", bn: "লাটিমের সুতলিকে কী বলে?" },
      a: {
        en: "It depends on where you grew up. The sources use লতি, ফিতা, লেত্তি and লেতি. It was once made of jute; today it is usually cloth.",
        bn: "কোথায় বড় হয়েছেন, তার ওপর নির্ভর করে। লেখাগুলোতে লতি, ফিতা, লেত্তি আর লেতি, সব নামই আছে। আগে পাট দিয়ে বানানো হতো, এখন সাধারণত কাপড়ের।",
      },
    },
    {
      q: { en: "What is the difference between বেল্লা পার and ঘর কোপ?", bn: "বেল্লা পার আর ঘর কোপের পার্থক্য কী?" },
      a: {
        en: "বেল্লা পার uses a boundary line: the target latim is struck until it crosses it. ঘর কোপ uses a circle: a latim placed inside is struck from outside, and cracking it earns praise.",
        bn: "বেল্লা পারে থাকে সীমানার দাগ: নিশানার লাটিম দাগ পার না হওয়া পর্যন্ত মারা হয়। ঘর কোপে থাকে বৃত্ত: ভেতরে রাখা লাটিমে বাইরে থেকে মারা হয়, আর ফাটাতে পারলে বাহবা।",
      },
    },
    {
      q: { en: "Who throws first in latim?", bn: "লাটিমে কে আগে খেলেন?" },
      a: {
        en: "Players settle it with an order throw. In one common description, the latim that spins out of the circle and goes farthest ranks first; other accounts judge by the circle's edge, so agree on it before you start.",
        bn: "আগে-পরের দান দিয়ে ঠিক হয়। একটি প্রচলিত বর্ণনায় যাঁর লাটিম বৃত্ত পেরিয়ে সবচেয়ে দূরে যায়, তিনি প্রথম; অন্য বর্ণনায় বিচার হয় বৃত্তের কিনারা দেখে, তাই শুরুর আগেই ঠিক করে নিন।",
      },
    },
  ],
};
