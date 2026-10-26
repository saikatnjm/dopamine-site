import type { HowTo } from "@/lib/how-to";

// "How to play" for the turn-based and choice games (see lib/how-to.ts for the rules).
export const HOW_TO_TURN: Record<string, HowTo> = {
  "g:bazar-bargain": {
    steps: [
      {
        en: "Tap “Go to the bazar”. You get Amma's list of 5 items, a budget, and one stall per item, each with its own vendor.",
        bn: "“বাজারে চলুন” চাপুন। আম্মার ৫টা জিনিসের লিস্ট, একটা বাজেট আর প্রতিটা জিনিসের জন্য আলাদা দোকানি পাবেন।",
      },
      {
        en: "Each vendor opens high. Pay it, pick one of three lower offers, or try “I'm a regular” or “Next shop is cheaper”.",
        bn: "প্রতিটা দোকানি শুরুতে বেশি দাম চায়। সেটাই দিন, তিনটা কম দামের অফারের একটা বলুন, নয়তো “আমি তো রোজ আসি” বা “পাশের দোকানে কম” চালান।",
      },
      {
        en: "An offer under the vendor's hidden lowest price uses up patience (watch the mood face). When it runs out, they refuse to sell.",
        bn: "দোকানির গোপন সর্বনিম্ন দামের নিচে বললে তার ধৈর্য কমে (মেজাজের মুখটা খেয়াল করুন)। ধৈর্য ফুরালে আর বিক্রিই করবে না।",
      },
      {
        en: "Walk away to gamble on being called back at a better price, or skip the item, then head to the next stall.",
        bn: "চলে যাওয়ার ভান করলে দোকানি কম দামে পেছন থেকে ডাকতেও পারে। চাইলে জিনিসটা বাদ দিন, তারপর পরের দোকানে যান।",
      },
      {
        en: "After the fifth stall, go home to see one of 8 endings, your score, the money you saved and your bargaining skill.",
        bn: "পঞ্চম দোকানের পর বাসায় ফিরুন: ৮টা এন্ডিংয়ের একটা, স্কোর, বাঁচানো টাকা আর দরদামের দক্ষতা দেখবেন।",
      },
    ],
    tips: [
      {
        en: "When the vendor says “Final word” or “Take it or leave it”, you've hit the lowest price at that stall. Going lower only burns patience, so pay.",
        bn: "দোকানি “শেষ কথা” বা “নিলে নেন না নিলে যান” বললে বুঝবেন ওটাই সর্বনিম্ন দাম। এর কম বললে শুধু ধৈর্য কমবে, তাই দিয়ে দিন।",
      },
      {
        en: "“I'm a regular” and “Next shop is cheaper” can each work only once per stall. Saying one a second time just costs patience.",
        bn: "“আমি তো রোজ আসি” আর “পাশের দোকানে কম” প্রতি দোকানে একবারই কাজে লাগতে পারে। দ্বিতীয়বার বললে শুধু ধৈর্য খরচ হয়।",
      },
      {
        en: "Walk away while the price is still well above the bottom. Near the lowest price vendors rarely call you back, and the odds shrink after every walk.",
        bn: "দাম যখন এখনো অনেক বেশি, তখনই হাঁটা দিন। সর্বনিম্নের কাছাকাছি এলে দোকানি খুব কমই ডাকে, আর প্রতিবার হাঁটলে সম্ভাবনা আরও কমে।",
      },
    ],
    faq: [
      {
        q: { en: "How is the Bazar Bargain score worked out?", bn: "বাজার বার্গেইনের স্কোর কীভাবে হিসাব হয়?" },
        a: {
          en: "You get the taka saved against each opening price, 120 points per item bought, and up to 100 more per item for how close you got to that vendor's lowest price. A free extra adds 150; each vendor who refuses to sell takes 60 off.",
          bn: "প্রতিটা শুরুর দাম থেকে যত টাকা বাঁচালেন, প্রতিটা কেনা জিনিসে ১২০ পয়েন্ট, আর দোকানির সর্বনিম্ন দামের যত কাছে গেলেন সেজন্য জিনিসপ্রতি আরও ১০০ পর্যন্ত। ফ্রি কিছু পেলে +১৫০; কোনো দোকানি বিক্রি করতে না চাইলে −৬০।",
        },
      },
      {
        q: { en: "What are the two legendary endings?", bn: "দুটো কিংবদন্তি এন্ডিং কী কী?" },
        a: {
          en: "Amma-Approved Bazar: all 5 items bought at (almost) every vendor's lowest price, with no refusals. The Free Lemon Legend: a vendor gives you something free, you buy at least 4 items and bargain fairly well. Freebies are a small chance, so both are rare.",
          bn: "আম্মা-অনুমোদিত বাজার: ৫টা জিনিসই প্রায় প্রত্যেক দোকানির সর্বনিম্ন দামে কেনা, কেউ বিক্রি করতে অস্বীকার করেনি। ফ্রি লেবুর কিংবদন্তি: দোকানি কিছু ফ্রি দিল, আপনি অন্তত ৪টা কিনলেন আর ভালোই দরদাম করলেন। ফ্রি পাওয়ার সুযোগ কম, তাই দুটোই বিরল।",
        },
      },
      {
        q: { en: "Does a challenge link give my friend the same vendors?", bn: "চ্যালেঞ্জ লিংকে বন্ধু কি একই দোকানি পাবে?" },
        a: {
          en: "Yes. The link carries your bazar's seed, so your friend gets the same list, budget, vendors, opening prices and hidden lowest prices, plus your score to beat. The same moves get the same replies. Scores stay on each device; there's no leaderboard.",
          bn: "হ্যাঁ। লিংকে আপনার বাজারের সিড থাকে, তাই বন্ধু একই লিস্ট, বাজেট, দোকানি, শুরুর দাম আর গোপন সর্বনিম্ন দাম পাবে, সাথে হারানোর মতো আপনার স্কোর। একই চালে দোকানির উত্তরও একই। স্কোর যার যার ডিভাইসে থাকে, কোনো লিডারবোর্ড নেই।",
        },
      },
    ],
  },

  "g:chaos-machine": {
    steps: [
      {
        en: "Tap “Create my chaos”. The machine rolls 9 ingredients: vehicle, destination, budget, weather, time, a mood, traffic, a mission and a chaos modifier.",
        bn: "“আমার হট্টগোল বানাও” চাপুন। মেশিন ৯টা উপাদান ঘোরাবে: বাহন, গন্তব্য, বাজেট, আবহাওয়া, সময়, মেজাজ, ট্রাফিক, একটা মিশন আর একটা হট্টগোল মডিফায়ার।",
      },
      {
        en: "Not feeling this trip? Tap “Different chaos” for a new roll. Happy with it? Hit “Start chaos”.",
        bn: "যাত্রাটা পছন্দ হয়নি? “অন্য হট্টগোল” চাপলে নতুন রোল। পছন্দ হলে “হট্টগোল শুরু” চাপুন।",
      },
      {
        en: "The trip has 5 stops. At each, pick one of 3 reactions; only afterwards do you see what it cost in minutes, taka and sanity.",
        bn: "যাত্রায় ৫টা ধাপ। প্রতিটায় ৩টা প্রতিক্রিয়ার একটা বাছুন; বাছার পরেই দেখবেন কত মিনিট, কত টাকা আর কতটা মাথা ঠান্ডা খরচ হলো।",
      },
      {
        en: "Keep your mission in mind: on time, under budget, dry, eggs intact or calm. On the last stretch you can even give up and go home.",
        bn: "মিশনটা মাথায় রাখুন: সময়মতো, বাজেটের মধ্যে, শুকনো, ডিম আস্ত, নাকি মাথা ঠান্ডা। শেষ ধাপে চাইলে হাল ছেড়ে বাসায়ও ফেরা যায়।",
      },
      {
        en: "At the end you get one of 10 outcomes, a Chaos Score boosted by how wild your roll was, and a rank.",
        bn: "শেষে ১০টা ফলাফলের একটা পাবেন, সাথে রোল যত এলোমেলো তত বাড়তি হট্টগোল স্কোর, আর একটা র‍্যাঙ্ক।",
      },
    ],
    tips: [
      {
        en: "Traffic multiplies every delay, so in gridlock the slow, patient options cost far more minutes than they would on empty roads.",
        bn: "ট্রাফিক প্রতিটা দেরিকে গুণ করে বাড়ায়, তাই জ্যামে ধীর-স্থির পথগুলো ফাঁকা রাস্তার চেয়ে অনেক বেশি মিনিট খায়।",
      },
      {
        en: "Sanity starts at 55. At 10 or below the trip ends in a meltdown no matter the mission, so take a calming option when it runs low.",
        bn: "মাথা ঠান্ডা শুরু হয় ৫৫ থেকে। ১০ বা তার নিচে নামলে মিশন যা-ই হোক, মাথা পুরো গরম। কমে এলে শান্ত হওয়ার অপশন নিন।",
      },
      {
        en: "Options you can't pay for are greyed out. Keep a little taka for the last stretch, where one way through costs money.",
        bn: "যে অপশনের টাকা নেই, সেটা ধূসর হয়ে যায়। শেষ ধাপের জন্য কিছু টাকা রাখুন, ওখানে একটা পথে টাকা লাগে।",
      },
    ],
    faq: [
      {
        q: { en: "What does the chaos level do?", bn: "হট্টগোল লেভেল কী কাজ করে?" },
        a: {
          en: "Every roll gets a chaos level from 0 to 6, built from the traffic, bad weather and a VIP movement or WASA dig. Each level adds 12% to your final score, so surviving a stormy gridlock is worth more than a breezy ride.",
          bn: "প্রতিটা রোলের একটা হট্টগোল লেভেল থাকে, ০ থেকে ৬, যা আসে ট্রাফিক, খারাপ আবহাওয়া আর ভিআইপি মুভমেন্ট বা ওয়াসার খোঁড়াখুঁড়ি থেকে। প্রতি লেভেলে স্কোর ১২% বাড়ে, তাই ঝড়ের জ্যাম পার হওয়া আরামের যাত্রার চেয়ে বেশি দামি।",
        },
      },
      {
        q: { en: "How do I get “Arrived EARLY. In Dhaka.”?", bn: "“আগেভাগে পৌঁছালেন। ঢাকায়।” কীভাবে পাব?" },
        a: {
          en: "It's the machine's only legendary outcome. Complete your mission with at least 30% of your time left, sanity at 75 or more and at least half your budget still in your pocket.",
          bn: "এটাই মেশিনের একমাত্র কিংবদন্তি ফলাফল। মিশন সফল করুন অন্তত ৩০% সময় হাতে রেখে, মাথা ঠান্ডা ৭৫ বা বেশি, আর বাজেটের অন্তত অর্ধেক পকেটে রেখে।",
        },
      },
      {
        q: { en: "What does “Retry this chaos” do?", bn: "“একই হট্টগোল আবার” চাপলে কী হয়?" },
        a: {
          en: "It replays the exact same 9 ingredients and the same 5 events, so you can test other choices; identical choices always give identical results. A challenge link hands your friend this same trip along with your score to beat.",
          bn: "একই ৯টা উপাদান আর একই ৫টা ঘটনা আবার আসে, তাই অন্য সিদ্ধান্ত নিয়ে দেখতে পারবেন; একই সিদ্ধান্তে ফলও হুবহু একই। চ্যালেঞ্জ লিংকে বন্ধুও এই যাত্রাটাই পায়, সাথে হারানোর মতো আপনার স্কোর।",
        },
      },
    ],
  },

  "g:delivery-sim": {
    steps: [
      {
        en: "Tap “Find an order” to see the restaurant, food, area, distance, pay, weather and promised time. Don't like it? Skip to another.",
        bn: "“অর্ডার খোঁজো” চাপুন: রেস্টুরেন্ট, খাবার, এলাকা, দূরত্ব, পেমেন্ট, আবহাওয়া আর প্রতিশ্রুত সময় দেখবেন। পছন্দ না হলে আরেকটা নিন।",
      },
      {
        en: "Start riding. The order goes through 7 stages: accept, restaurant, pickup, finding the address, traffic, calling the customer, delivering.",
        bn: "রাইড শুরু করুন। অর্ডারটা ৭টা ধাপ পার হবে: অ্যাকসেপ্ট, রেস্টুরেন্ট, পিকআপ, ঠিকানা খোঁজা, ট্রাফিক, কাস্টমারকে কল, ডেলিভারি।",
      },
      {
        en: "Every stage throws one problem at you with 3 choices. Some are gambles that come back “Lucky!” or “Unlucky!”.",
        bn: "প্রতিটা ধাপে একটা ঝামেলা আর ৩টা উপায়। কিছু উপায় জুয়া, ফল আসে “কপাল ভালো!” বা “কপাল খারাপ!”।",
      },
      {
        en: "As you ride, track the clock against the promised time, plus the food and chaos meters.",
        bn: "চালাতে চালাতে প্রতিশ্রুত সময়ের সাথে ঘড়ি মেলান, আর খাবার ও হট্টগোলের মিটারে চোখ রাখুন।",
      },
      {
        en: "At the door you get one of 8 endings, a Delivery Score, your earnings with tip, the chaos level and a rating out of 5 stars.",
        bn: "দরজায় পৌঁছে পাবেন ৮টা এন্ডিংয়ের একটা, ডেলিভারি স্কোর, টিপসহ আয়, হট্টগোলের মাত্রা আর ৫-এ কত তারা রেটিং।",
      },
    ],
    tips: [
      {
        en: "Birthday cake, fuchka and pizza take more damage than kacchi, tehari or burgers. With a fragile order, skip the bumpy options.",
        bn: "জন্মদিনের কেক, ফুচকা আর পিৎজা কাচ্চি, তেহারি বা বার্গারের চেয়ে বেশি নষ্ট হয়। নাজুক অর্ডার হলে ঝাঁকুনির পথ এড়িয়ে চলুন।",
      },
      {
        en: "Keep chaos below 60% and food above 60%. Cross either line and that decides your ending before lateness even counts.",
        bn: "হট্টগোল ৬০%-এর নিচে আর খাবার ৬০%-এর ওপরে রাখুন। যেকোনো একটা সীমা পেরোলে দেরির হিসাবের আগেই এন্ডিং ঠিক হয়ে যায়।",
      },
      {
        en: "Rain starts your chaos at 20% and a heatwave at 12%, so on those orders there's less room for wild shortcuts.",
        bn: "বর্ষায় হট্টগোল শুরুই হয় ২০% থেকে, তীব্র গরমে ১২% থেকে। তাই ওই অর্ডারে উল্টাপাল্টা শর্টকাটের জায়গা কম।",
      },
    ],
    faq: [
      {
        q: { en: "How are the star rating and the tip decided?", bn: "তারা রেটিং আর টিপ কীভাবে ঠিক হয়?" },
        a: {
          en: "Stars follow the customer's mood at the end (late arrival and damaged food pull it down) and the state of the food. A vanished customer or wrong address is always 1 star. No tip below 3 stars; it grows at 3, 4 and 5.",
          bn: "তারা নির্ভর করে শেষে কাস্টমারের মেজাজের ওপর (দেরি আর নষ্ট খাবারে মেজাজ নামে) আর খাবারের অবস্থার ওপর। কাস্টমার উধাও বা ভুল ঠিকানা মানেই ১ তারা। ৩ তারার নিচে টিপ নেই; ৩, ৪ আর ৫ তারায় টিপ বাড়ে।",
        },
      },
      {
        q: { en: "What does a Legendary Delivery need?", bn: "কিংবদন্তি ডেলিভারির জন্য কী লাগে?" },
        a: {
          en: "Arrive at least 10 minutes early with the food at 92% or better, a delighted customer and chaos at 25% or lower. It comes with an extra tip and the biggest score bonus in the game.",
          bn: "প্রতিশ্রুত সময়ের অন্তত ১০ মিনিট আগে পৌঁছান, খাবার ৯২% বা বেশি ভালো, কাস্টমার দারুণ খুশি, আর হট্টগোল ২৫% বা কম। সাথে মেলে বাড়তি টিপ আর গেমের সবচেয়ে বড় স্কোর বোনাস।",
        },
      },
      {
        q: { en: "Can an order end before the seventh stage?", bn: "সাত নম্বর ধাপের আগেই কি অর্ডার শেষ হতে পারে?" },
        a: {
          en: "Yes. If the customer stops answering and you gamble on waiting, they may vanish: the run ends right there as “Customer Disappeared” and you only keep part of the pay.",
          bn: "হ্যাঁ। কাস্টমার ফোন না ধরলে অপেক্ষার জুয়া খেললে উনি উধাও হয়ে যেতে পারেন: তখনই খেলা শেষ, এন্ডিং “কাস্টমার উধাও”, আর পেমেন্টের কিছু অংশই শুধু পাবেন।",
        },
      },
    ],
  },

  "g:queue-sim": {
    steps: [
      {
        en: "Tap “Join a queue” to see where you are, how many people stand ahead of you (12 to 18) and how many counters are open.",
        bn: "“লাইনে দাঁড়াও” চাপুন: কোথায় দাঁড়ালেন, সামনে কতজন (১২ থেকে ১৮) আর কয়টা কাউন্টার খোলা, দেখবেন।",
      },
      {
        en: "Start waiting. Every round brings one queue event, like a line-cutter, a closing counter or a “2 minutes” break, with 3 ways to react.",
        bn: "অপেক্ষা শুরু করুন। প্রতি রাউন্ডে একটা ঘটনা আসে, যেমন লাইন-কাটার, বন্ধ হয়ে যাওয়া কাউন্টার বা “আর ২ মিনিট”, সাথে ৩টা উপায়।",
      },
      {
        en: "Some reactions are gambles that work or backfire. After your pick the line moves: each open counter serves one or two people.",
        bn: "কিছু উপায় জুয়া, কাজ হতেও পারে, উল্টোও হতে পারে। বাছার পর লাইন এগোয়: প্রতিটা খোলা কাউন্টারে একজন বা দুজনের কাজ শেষ হয়।",
      },
      {
        en: "Reach the counter within 8 rounds before patience hits zero. Patience also slips a little every round on its own.",
        bn: "৮ রাউন্ডের মধ্যে, ধৈর্য শূন্য হওয়ার আগে কাউন্টারে পৌঁছান। প্রতি রাউন্ডে ধৈর্য এমনিতেই একটু করে কমে।",
      },
      {
        en: "The result shows your ending, Queue Score, waiting time, people outlasted, patience left, cutters caught and your queue rank.",
        bn: "রেজাল্টে দেখবেন এন্ডিং, কিউ স্কোর, অপেক্ষার সময়, যাদের পেরিয়ে এলেন, বাকি ধৈর্য, ধরা লাইন-কাটার আর আপনার লাইন র‍্যাঙ্ক।",
      },
    ],
    tips: [
      {
        en: "Every open counter speeds up the line, so a choice that keeps a counter open or gets a new one going pays off over several rounds.",
        bn: "প্রতিটা খোলা কাউন্টার লাইন দ্রুত করে, তাই কাউন্টার খোলা রাখা বা নতুন কাউন্টার চালু করার সিদ্ধান্ত কয়েক রাউন্ড ধরে কাজে দেয়।",
      },
      {
        en: "Each line-cutter you catch adds points and you need two for the legendary ending, but a confrontation that fails costs places and patience.",
        bn: "প্রতিটা ধরা লাইন-কাটারে পয়েন্ট বাড়ে, আর কিংবদন্তি এন্ডিংয়ে দুজন লাগে। তবে ধরতে গিয়ে ব্যর্থ হলে জায়গা আর ধৈর্য দুটোই যায়।",
      },
      {
        en: "Watch the minutes as well as the line: if you reach the front after 58 minutes, the window shuts for lunch.",
        bn: "লাইনের সাথে মিনিটও খেয়াল করুন: ৫৮ মিনিটের পরে সামনে পৌঁছালে জানালা লাঞ্চের জন্য বন্ধ।",
      },
    ],
    faq: [
      {
        q: { en: "What is the legendary queue ending?", bn: "লাইনের কিংবদন্তি এন্ডিং কোনটা?" },
        a: {
          en: "“Front of the Line, Legendary”: reach the counter within 45 minutes with patience at 55 or more, having caught at least two line-cutters. It also brings a big score bonus.",
          bn: "“লাইনের সামনে, কিংবদন্তি হয়ে”: ৪৫ মিনিটের মধ্যে কাউন্টারে পৌঁছান, ধৈর্য ৫৫ বা বেশি, আর অন্তত দুজন লাইন-কাটার ধরা চাই। সাথে বড় স্কোর বোনাসও মেলে।",
        },
      },
      {
        q: { en: "How can I end up in the wrong queue?", bn: "ভুল লাইনে পড়ে যাই কীভাবে?" },
        a: {
          en: "When a counter closes you can run to the other line. If that gamble backfires you lose places, and even if you then reach the front, it turns out to be the wrong queue.",
          bn: "কাউন্টার বন্ধ হলে অন্য লাইনে দৌড় দিতে পারেন। জুয়াটা উল্টো হলে জায়গা হারাবেন, আর পরে সামনে পৌঁছালেও দেখা যাবে লাইনটাই ভুল।",
        },
      },
      {
        q: { en: "Does a challenge give my friend the same queue?", bn: "চ্যালেঞ্জে বন্ধু কি একই লাইন পায়?" },
        a: {
          en: "Yes: the same place, the same people ahead, the same counters and the same order of events (one that needs a certain number of counters is skipped if choices changed them). Gamble luck is seeded too, so identical picks play out identically.",
          bn: "হ্যাঁ: একই জায়গা, সামনে একই মানুষ, একই কাউন্টার আর একই ক্রমে ঘটনা (কাউন্টারের সংখ্যার ওপর নির্ভর করা ঘটনা বাদ পড়তে পারে, যদি সিদ্ধান্তে কাউন্টার বদলায়)। ঝুঁকির ভাগ্যও সিডে বাঁধা, তাই একই সিদ্ধান্তে একই ফল।",
        },
      },
    ],
  },

  "g:programmer-rage": {
    steps: [
      {
        en: "Tap “Press deploy” to get your deploy ticket: the day (Friday is possible), the start time and a failed deploy with a hidden root cause.",
        bn: "“ডিপ্লয় চাপো” চাপুন, ডিপ্লয় টিকিট আসবে: কোন দিন (শুক্রবারও হতে পারে), কখন শুরু, আর একটা ফেইল করা ডিপ্লয় যার মূল কারণ লুকানো।",
      },
      {
        en: "Start debugging. You get up to 8 moves, each offering 4 actions, and “Deploy again” is always one of them.",
        bn: "ডিবাগিং শুরু করুন। সর্বোচ্চ ৮টা চাল, প্রতিটায় ৪টা কাজের অপশন, আর “আবার ডিপ্লয়” সবসময় তার একটা।",
      },
      {
        en: "Each action costs time and shifts your rage; the right ones push debug progress up. Then a twist may add a new problem, or everything suddenly works.",
        bn: "প্রতিটা কাজে সময় যায়, রাগও ওঠানামা করে; ঠিক কাজগুলো ডিবাগ অগ্রগতি বাড়ায়। তারপর হঠাৎ নতুন ঝামেলা আসতে পারে, কিংবা সব নিজে থেকেই চলতে শুরু করে।",
      },
      {
        en: "Win by landing a successful deploy, or bail out with a rollback (offered from move 5). Rage at 100 ends the night.",
        bn: "সফল ডিপ্লয় করলেই জয়, নয়তো রোলব্যাক করে বেরিয়ে আসুন (৫ নম্বর চাল থেকে পাওয়া যায়)। রাগ ১০০ হলে রাত শেষ।",
      },
      {
        en: "The result shows your ending, Deploy Score, rage, debugging skill, time lost, coffees and what the root cause really was.",
        bn: "রেজাল্টে দেখবেন এন্ডিং, ডিপ্লয় স্কোর, রাগের মাত্রা, ডিবাগিং দক্ষতা, নষ্ট সময়, কয় কাপ কফি আর আসল কারণটা কী ছিল।",
      },
    ],
    tips: [
      {
        en: "Check the logs early (move 1 always offers it). It reveals the root cause, and actions that match it make 50% more progress afterwards.",
        bn: "শুরুতেই লগ দেখুন (প্রথম চালে এটা সবসময় থাকে)। এতে মূল কারণ জানা যায়, আর এরপর কারণের সাথে মেলে এমন কাজে ৫০% বেশি অগ্রগতি হয়।",
      },
      {
        en: "“Deploy again” gets safer as debug progress climbs and is certain at 100%. Every failed attempt adds rage and costs points.",
        bn: "ডিবাগ অগ্রগতি যত বাড়ে, “আবার ডিপ্লয়” তত নিরাপদ; ১০০% হলে নিশ্চিত। প্রতিটা ব্যর্থ চেষ্টায় রাগ বাড়ে, পয়েন্টও কাটে।",
      },
      {
        en: "Blaming frontend or backend calms your rage but fixes nothing. Save it for when the rage bar is close to full.",
        bn: "ফ্রন্টএন্ড বা ব্যাকএন্ডের দোষ দিলে রাগ কমে, কিন্তু কিছুই ঠিক হয় না। রাগের বার প্রায় ভরে গেলে তখন কাজে লাগান।",
      },
    ],
    faq: [
      {
        q: { en: "How do I get the Legendary 3 AM Fix?", bn: "কিংবদন্তি রাত ৩টার ফিক্স কীভাবে পাব?" },
        a: {
          en: "Ship a successful deploy while the in-game clock reads between 2:30 and 4:30 AM. Tickets that start late at night make this reachable, and it scores more than an ordinary success.",
          bn: "গেমের ঘড়িতে রাত ২:৩০ থেকে ৪:৩০-এর মধ্যে সফল ডিপ্লয় করুন। গভীর রাতে শুরু হওয়া টিকিটে এটা নাগালে আসে, আর সাধারণ সাফল্যের চেয়ে বেশি স্কোর দেয়।",
        },
      },
      {
        q: { en: "Why is a Friday deploy harder?", bn: "শুক্রবারের ডিপ্লয় কঠিন কেন?" },
        a: {
          en: "On a Friday you start angrier, and two failed deploys, maxed-out rage or running out of moves without a fix all end in a Friday Production Disaster. Any Friday ticket adds 150 points to your score.",
          bn: "শুক্রবারে শুরু থেকেই রাগ বেশি, আর দুবার ডিপ্লয় ফেইল, রাগ ১০০, বা ফিক্স ছাড়াই চাল শেষ — যেকোনোটাতেই শুক্রবারের প্রোডাকশন বিপর্যয়। তবে শুক্রবারের যেকোনো টিকিটে স্কোরে ১৫০ পয়েন্ট বাড়তি।",
        },
      },
      {
        q: { en: "What does “It works on my machine” do?", bn: "“আমার মেশিনে তো চলে” বাছলে কী হয়?" },
        a: {
          en: "It ends the night on the spot. With debug progress already at 100% it counts as a success; otherwise you get the “Works on My Machine” ending. It can turn up from move 3. All of it is fictional comedy, no real commands.",
          bn: "সাথে সাথে রাত শেষ। ডিবাগ অগ্রগতি তখন ১০০% হলে সেটা সাফল্য; না হলে এন্ডিং “আমার মেশিনে তো চলে”। ৩ নম্বর চাল থেকে এটা আসতে পারে। পুরোটাই কাল্পনিক কমেডি, কোনো আসল কমান্ড নেই।",
        },
      },
    ],
  },

  "g:book-cricket": {
    steps: [
      {
        en: "Tap “Start the chase”. The Back Bench XI has set a target, and you have 2 overs (12 balls) and 3 wickets to beat it.",
        bn: "“চেজ শুরু করো” চাপো। লাস্ট বেঞ্চ একাদশ একটা টার্গেট দিয়েছে, হারাতে তোমার হাতে ২ ওভার (১২ বল) আর ৩ উইকেট।",
      },
      {
        en: "For each ball pick 🛡️ Defend or 💥 Slog (keys D/← or S/→). The book flips open and the page's last digit decides the ball.",
        bn: "প্রতি বলে 🛡️ ডিফেন্ড বা 💥 স্লগ বেছে নাও (কী-বোর্ডে D/← বা S/→)। বই খুলে যায়, আর পাতার শেষ অঙ্কটাই ঠিক করে বলের ফল।",
      },
      {
        en: "Score more than the target to win. The innings never stops early: you bat all 12 balls unless you lose 3 wickets.",
        bn: "জিততে টার্গেটের চেয়ে বেশি রান করো। ইনিংস আগে থামে না: ৩ উইকেট না পড়লে পুরো ১২ বলই খেলবে।",
      },
      {
        en: "Once a match, Sir walks in. Tap “Hide it!” (or press Space/Enter) within 1.2 seconds, or that ball becomes a dot.",
        bn: "ম্যাচে একবার স্যার ক্লাসে ঢোকেন। ১.২ সেকেন্ডের মধ্যে “লুকাও!” চাপো (বা Space/Enter), নইলে বলটা ডট।",
      },
      {
        en: "Check your ending, runs and wickets against the target, sixes and strike rate, then bat again or challenge a friend.",
        bn: "দেখে নাও এন্ডিং, টার্গেটের পাশে তোমার রান আর উইকেট, ছক্কা আর স্ট্রাইক রেট, তারপর আবার ব্যাট করো বা বন্ধুকে চ্যালেঞ্জ দাও।",
      },
    ],
    tips: [
      {
        en: "Slog scores 2, 4 or 6 on pages ending 2, 4, 6 and is out on 0; Defend scores 1, 1 or 2 and is out only on pages ending 00. Most targets need slogging.",
        bn: "স্লগে ২, ৪, ৬-এ শেষ হওয়া পাতায় ২, ৪, ৬ রান, ০-তে আউট; ডিফেন্ডে ১, ১, ২ রান, আউট শুধু ০০-তে শেষ হলে। বেশিরভাগ টার্গেটে স্লগ লাগবেই।",
      },
      {
        en: "After a no ball comes a free hit: a 0 page can't get you out, so slog without fear.",
        bn: "নো বলের পরের বলটা ফ্রি হিট: ০ পাতাতেও আউট হবে না, তাই নির্ভয়ে স্লগ চালাও।",
      },
      {
        en: "On your last wicket and needing only a run or two, Defend is the safer call: it scores on every page ending 2, 4 or 6.",
        bn: "শেষ উইকেটে মাত্র এক-দুই রান দরকার হলে ডিফেন্ডই নিরাপদ: ২, ৪ বা ৬-এ শেষ হওয়া প্রতিটা পাতায় রান আসে।",
      },
    ],
    faq: [
      {
        q: { en: "What happens on a page ending in 8?", bn: "৮-এ শেষ হওয়া পাতা এলে কী হয়?" },
        a: {
          en: "It's a no ball: +1 run, it doesn't count as one of your 12 balls, and the next ball is a free hit. After 6 no balls Sir confiscates the extra pages and an 8 is just a dot.",
          bn: "ওটা নো বল: +১ রান, তোমার ১২ বলের হিসাবে ধরা হয় না, আর পরের বল ফ্রি হিট। ৬টা নো বলের পর স্যার বাড়তি পাতা বাজেয়াপ্ত করেন, তখন ৮ মানে শুধুই ডট।",
        },
      },
      {
        q: { en: "What decides my book cricket title?", bn: "বই ক্রিকেটে আমার টাইটেল কীসে ঠিক হয়?" },
        a: {
          en: "Your runs set the rank, from Duck at 0 up to Book Cricket Legend at 40 or more. The ending follows the chase: passing the target on the very last ball, passing it earlier, a tie, all out, or falling short.",
          bn: "রান দিয়ে র‍্যাঙ্ক: ০ রানে “শূন্য রানে আউট” থেকে ৪০ বা বেশিতে “বই ক্রিকেটের কিংবদন্তি”। এন্ডিং ঠিক হয় চেজ দেখে: একদম শেষ বলে টার্গেট পার, আগেই পার, টাই, অল আউট, নাকি অল্পের জন্য হলো না।",
        },
      },
      {
        q: { en: "Is a book cricket challenge fair for both players?", bn: "বই ক্রিকেটের চ্যালেঞ্জ কি দুজনের জন্যই ন্যায্য?" },
        a: {
          en: "Yes. The link replays the same target and the same page on every ball, whatever anyone picks, so only your Defend/Slog calls and how fast you hide the book differ. Your friend sees your runs to beat.",
          bn: "হ্যাঁ। লিংকে একই টার্গেট আর প্রতি বলে একই পাতা আসে, কে কী বাছল তাতে কিছু বদলায় না। পার্থক্য শুধু ডিফেন্ড/স্লগের সিদ্ধান্ত আর কত দ্রুত বই লুকালে। বন্ধু দেখবে হারানোর মতো তোমার রান।",
        },
      },
    ],
  },
};
