import type { HowTo } from "@/lib/how-to";

// "How to play" for the choice simulators, the Dhaka Person quiz and the excuse generator (see lib/how-to.ts for the rules).
export const HOW_TO_STORIES: Record<string, HowTo> = {
  "x:dhaka-cng-simulator": {
    steps: [
      {
        en: "Press “Start the ride”, then pick where you're headed: Gulshan 1, Mirpur 10, Old Dhaka or one of five other stops.",
        bn: "“যাত্রা শুরু” চাপুন, তারপর গন্তব্য বাছুন: গুলশান ১, মিরপুর ১০, পুরান ঢাকা অথবা আরও পাঁচটা জায়গার যেকোনো একটা।",
      },
      {
        en: "Choose who's riding: just you, a friend, three friends with a huge bag, the whole family of six, or you and an Eid goat.",
        bn: "কে কে যাচ্ছেন বেছে নিন: শুধু আপনি, এক বন্ধু, বিশাল ব্যাগসহ তিন বন্ধু, ছয়জনের পুরো পরিবার, নাকি আপনি আর ঈদের ছাগল।",
      },
      {
        en: "Tap Next while the hunt for a CNG plays out and the driver names his terms.",
        bn: "সিএনজি খোঁজার পালা আর ড্রাইভারের শর্ত শুনতে “পরের ধাপ” চাপতে থাকুন।",
      },
      {
        en: "Make your offer: go by meter, ৳150, ৳300, or “Whatever you say, bhai”.",
        bn: "অফার দিন: মিটারে, ৳১৫০, ৳৩০০, নাকি “আপনি যা বলেন, ভাই”।",
      },
      {
        en: "Survive one last surprise on the road, then see where the ride really ended.",
        bn: "রাস্তার শেষ চমকটা পার করুন, তারপর দেখুন যাত্রা আসলে কোথায় গিয়ে থামল।",
      },
    ],
    tips: [
      {
        en: "Asking for the meter makes the walking ending likelier, and a ৳150 offer invites a mid-ride fare hike or being dropped halfway.",
        bn: "মিটারে যেতে চাইলে হেঁটে যাওয়ার শেষটা বেশি আসে, আর ৳১৫০ অফার দিলে মাঝপথে ভাড়া বাড়া বা নামিয়ে দেওয়ার আশঙ্কা বাড়ে।",
      },
      {
        en: "Bring the goat for an ending it steals; bring the family or the squad and half of you may end up walking.",
        bn: "ছাগল সঙ্গে নিলে এমন একটা শেষ আসতে পারে যেখানে ছাগলই বাজিমাত করে; পরিবার বা দল নিলে অর্ধেক লোককে হাঁটতে হতে পারে।",
      },
      {
        en: "Actually arriving is the hard one. A road with green signals everywhere helps most; “Whatever you say, bhai” helps a little.",
        bn: "সত্যিই গন্তব্যে পৌঁছানোটাই সবচেয়ে কঠিন। সব সিগন্যাল সবুজ পাওয়া রাস্তা সবচেয়ে কাজে দেয়, “আপনি যা বলেন, ভাই” একটু।",
      },
    ],
    faq: [
      {
        q: { en: "How many ways can a CNG ride end?", bn: "সিএনজি যাত্রা কত রকমভাবে শেষ হতে পারে?" },
        a: {
          en: "There are 11 endings, from Wrong Destination and Dropped Halfway to arriving by boat in the rain or a wedding invitation from the driver. Only one gets you there on time at the agreed fare.",
          bn: "মোট ১১টা শেষ আছে — ভুল গন্তব্য আর মাঝপথে নামিয়ে দেওয়া থেকে শুরু করে বৃষ্টিতে নৌকায় করে পৌঁছানো বা ড্রাইভারের বোনের বিয়ের দাওয়াত পর্যন্ত। সময়মতো, ঠিক করা ভাড়ায় পৌঁছানো যায় শুধু একটায়।",
        },
      },
      {
        q: { en: "Is the ending random, or do my choices decide it?", bn: "শেষটা কি র‍্যান্ডম, নাকি আমার পছন্দেই ঠিক হয়?" },
        a: {
          en: "Both. Your destination, passengers and offer shift the odds, and moments like the rain or a police stop push certain endings further. A seeded roll then picks one, so the same picks can end differently next ride.",
          bn: "দুটোই। গন্তব্য, যাত্রী আর অফার সম্ভাবনা বদলে দেয়, আর বৃষ্টি বা পুলিশের থামানোর মতো মুহূর্ত কিছু শেষকে আরও এগিয়ে দেয়। তারপর একটা সিডেড দান একটা শেষ বেছে নেয়, তাই একই পছন্দেও পরের বার অন্য শেষ আসতে পারে।",
        },
      },
      {
        q: { en: "What does a friend see when I share my CNG result?", bn: "সিএনজির ফলাফল শেয়ার করলে বন্ধু কী দেখে?" },
        a: {
          en: "The link opens your exact result card: the ending, its punchline and some of your picks. It's stored in the link, so it never changes. Their button reads “Can you do better?” and starts a fresh ride.",
          bn: "লিংকটা আপনার হুবহু ফলাফল কার্ড খোলে: শেষটা, তার মোক্ষম লাইন আর আপনার কিছু পছন্দ। সব লিংকের ভেতরেই রাখা, তাই কখনো বদলায় না। বন্ধুর বোতামে লেখা থাকে “আপনি এর চেয়ে ভালো পারবেন?” — চাপলেই নতুন যাত্রা।",
        },
      },
    ],
  },

  "x:food-delivery-simulator": {
    steps: [
      {
        en: "Tap “Place the order” and choose dinner: kacchi biryani, a double cheeseburger, a large pizza, fuchka, or cha with singara.",
        bn: "“অর্ডার দিন” চাপুন, তারপর রাতের খাবার বাছুন: কাচ্চি বিরিয়ানি, ডাবল চিজবার্গার, লার্জ পিৎজা, ফুচকা, নাকি চা-সিঙ্গারা।",
      },
      {
        en: "Pick how to pay: a ৳1000 note on delivery, a mobile wallet, a card, or a 50% coupon.",
        bn: "পেমেন্ট বাছুন: ডেলিভারিতে ১০০০ টাকার নোট, মোবাইল ওয়ালেট, কার্ড, নাকি ৫০% কুপন।",
      },
      {
        en: "Read the restaurant's status update and take the rider's phone call, tapping Next after each.",
        bn: "রেস্টুরেন্টের স্ট্যাটাস দেখুন আর রাইডারের ফোন ধরুন — প্রতিবার “পরের ধাপ” চাপুন।",
      },
      {
        en: "Decide how to wait: refresh the map, call the rider again, stand at the gate, or give up and make Maggi.",
        bn: "কীভাবে অপেক্ষা করবেন ঠিক করুন: ম্যাপ রিফ্রেশ, রাইডারকে আবার ফোন, গেটে দাঁড়ানো, নাকি হাল ছেড়ে ম্যাগি রান্না।",
      },
      {
        en: "Check the live-tracking moment, then find out what actually reached your door.",
        bn: "লাইভ ট্র্যাকিংয়ের মুহূর্তটা দেখুন, তারপর জানুন দরজায় আসলে কী পৌঁছাল।",
      },
    ],
    tips: [
      {
        en: "Fuchka has its own ending (Fuchka Soup), and a kacchi order can quietly turn into tehari if the restaurant runs out.",
        bn: "ফুচকার নিজস্ব একটা শেষ আছে (ফুচকা স্যুপ), আর রেস্টুরেন্টে কাচ্চি শেষ হলে অর্ডারটা চুপচাপ তেহারি হয়ে যেতে পারে।",
      },
      {
        en: "Paying with the big note sets up the no-change ending, and the coupon comes with a rejection of its own.",
        bn: "বড় নোটে পেমেন্ট দিলে খুচরা না পাওয়ার শেষটা তৈরি হয়, আর কুপনের জন্য আছে আলাদা এক প্রত্যাখ্যান।",
      },
      {
        en: "Making Maggi while you wait makes the Two Dinners ending much more likely.",
        bn: "অপেক্ষার সময় ম্যাগি বানালে “দুইবার ডিনার” শেষটার সম্ভাবনা অনেক বেড়ে যায়।",
      },
    ],
    faq: [
      {
        q: { en: "Can the food ever arrive hot, on time and correct?", bn: "খাবার কি কখনো গরম, সময়মতো আর ঠিকঠাক আসে?" },
        a: {
          en: "Yes: “Hot, On Time, Correct” is one of the 11 endings, but it's rare. A tracking dot that heads straight to you makes it much likelier, and a kitchen that's ready instantly helps a little.",
          bn: "হ্যাঁ, ১১টা শেষের একটা হলো “গরম, সময়মতো, সঠিক” — তবে খুব কম আসে। ট্র্যাকিংয়ের বিন্দু সোজা আপনার দিকে এলে সম্ভাবনা অনেক বাড়ে, আর রান্না সাথে সাথে তৈরি হলে একটু।",
        },
      },
      {
        q: { en: "Does the way I wait change anything?", bn: "অপেক্ষার ধরন কি কিছু বদলায়?" },
        a: {
          en: "Yes. Maggi points toward Two Dinners, refreshing the map makes the rider circling your building likelier, and waiting at the gate makes getting stopped at the gate slightly less likely.",
          bn: "হ্যাঁ। ম্যাগি নিয়ে যায় “দুইবার ডিনার”-এর দিকে, ম্যাপ রিফ্রেশ করলে রাইডারের বিল্ডিং ঘিরে ঘোরার সম্ভাবনা বাড়ে, আর গেটে দাঁড়ালে গেটে আটকে যাওয়ার সম্ভাবনা একটু কমে।",
        },
      },
      {
        q: { en: "Will my shared delivery result change if I play again?", bn: "আবার খেললে কি শেয়ার করা ডেলিভারি ফলাফল বদলে যাবে?" },
        a: {
          en: "No. The ending is saved inside that link, so whoever opens it sees exactly your delivery. Playing again places a brand-new order with its own link.",
          bn: "না। শেষটা ওই লিংকের ভেতরেই সংরক্ষিত, তাই যে খুলবে সে হুবহু আপনার ডেলিভারিটাই দেখবে। আবার খেললে একদম নতুন অর্ডার হয়, তার নিজের লিংকসহ।",
        },
      },
    ],
  },

  "x:dhaka-bus-simulator": {
    steps: [
      {
        en: "Start and choose a route: Mirpur → Motijheel, Uttara → Farmgate, Gabtoli → Sadarghat, or Mohakhali → Gulistan.",
        bn: "শুরু করে রুট বাছুন: মিরপুর → মতিঝিল, উত্তরা → ফার্মগেট, গাবতলী → সদরঘাট, নাকি মহাখালী → গুলিস্তান।",
      },
      {
        en: "See how the bus pulls up and hear what the helper shouts, then tap Next.",
        bn: "বাস কীভাবে এসে থামে আর হেলপার কী হাঁক দেন দেখুন, তারপর “পরের ধাপ” চাপুন।",
      },
      {
        en: "Get on board: jump on while it moves, squeeze through the door, pass your bag in through the window, or wait for the next one.",
        bn: "বাসে উঠুন: চলন্ত বাসে লাফিয়ে, দরজা দিয়ে চাপাচাপি করে, আগে জানালা দিয়ে ব্যাগ ঢুকিয়ে, নাকি পরের বাসের অপেক্ষায়।",
      },
      {
        en: "When the helper calls for the fare, pay exact, show a student ID, hand over ৳500, or pretend to be asleep.",
        bn: "হেলপার ভাড়া চাইলে ঠিক ভাড়া দিন, স্টুডেন্ট আইডি দেখান, ৫০০ টাকার নোট দিন, নাকি ঘুমের ভান করুন।",
      },
      {
        en: "Ride out a race, a detour or a long stop, and get your ending.",
        bn: "রেস, ঘুরপথ বা লম্বা বিরতি — যা-ই আসুক পার করুন, তারপর দেখুন শেষটা।",
      },
    ],
    tips: [
      {
        en: "Each fare move has its own ending: the ৳500 note starts the Change War, the student ID a half-fare debate, and fake sleep can turn real.",
        bn: "ভাড়ার প্রতিটা চালের নিজস্ব শেষ আছে: ৫০০ টাকার নোটে খুচরার যুদ্ধ, স্টুডেন্ট আইডিতে হাফ ভাড়ার তর্ক, আর ঘুমের ভান সত্যিকারের ঘুমও হয়ে যেতে পারে।",
      },
      {
        en: "Waiting for the next bus leads toward Still at the Bus Stop; jumping or squeezing on makes riding on the door likelier.",
        bn: "পরের বাসের অপেক্ষা করলে “এখনো বাস স্টপে” শেষের দিকে যাবেন; লাফিয়ে বা চাপাচাপি করে উঠলে দরজায় ঝুলে যাওয়ার সম্ভাবনা বাড়ে।",
      },
      {
        en: "If an empty bus shows up, think twice: it's on its way to the depot.",
        bn: "খালি বাস এলে একটু ভাবুন: ওটা ডিপোতে ফিরছে।",
      },
    ],
    faq: [
      {
        q: { en: "How many endings does the bus ride have?", bn: "বাস যাত্রার কয়টা শেষ আছে?" },
        a: {
          en: "Eleven, including Missed Your Stop, Formula Dhaka, Accidental Babysitter and a surprise city tour that ends in Savar. Arrived with Dignity is the rare calm one.",
          bn: "এগারোটা — এর মধ্যে আছে স্টপ মিস, ফর্মুলা ঢাকা, হঠাৎ বেবিসিটার আর সাভারে গিয়ে থামা এক সারপ্রাইজ শহর ভ্রমণ। “সম্মানের সাথে পৌঁছালেন”-ই বিরল শান্ত শেষ।",
        },
      },
      {
        q: { en: "Does the route I pick change the ending?", bn: "রুট বাছাই কি শেষটা বদলায়?" },
        a: {
          en: "Not the odds. The route sets the scene and shows on your result card, but the ending comes from how you board, how you pay, and what the bus and the ride throw at you.",
          bn: "সম্ভাবনা বদলায় না। রুট শুধু দৃশ্যটা সাজায় আর ফলাফল কার্ডে দেখা যায়; শেষটা ঠিক হয় আপনি কীভাবে উঠলেন, কীভাবে ভাড়া দিলেন আর বাস ও যাত্রাপথে কী ঘটল তার ওপর।",
        },
      },
      {
        q: { en: "Can I send my bus ending to a friend?", bn: "বাসের শেষটা কি বন্ধুকে পাঠানো যায়?" },
        a: {
          en: "Yes. Share or copy the link and your friend lands on the same card, marked as a result someone sent them. You can also copy the result as text or save it as an image for stories.",
          bn: "হ্যাঁ। লিংক শেয়ার বা কপি করুন — বন্ধু একই কার্ডে পৌঁছাবে, যেখানে লেখা থাকবে কেউ তাকে ফলাফল পাঠিয়েছে। চাইলে ফলাফল টেক্সট হিসেবে কপি বা স্টোরির জন্য ছবি হিসেবে সেভও করতে পারেন।",
        },
      },
    ],
  },

  "x:job-resignation-simulator": {
    steps: [
      {
        en: "Start and choose how you quit: a polite email, a dramatic speech in the meeting, a WhatsApp at 2 AM, or simply not showing up.",
        bn: "শুরু করে ঠিক করুন কীভাবে চাকরি ছাড়বেন: ভদ্র ইমেইল, মিটিংয়ে নাটকীয় ভাষণ, রাত ২টায় হোয়াটসঅ্যাপ, নাকি অফিসে যাওয়াই বন্ধ।",
      },
      {
        en: "Give a reason: a better offer, your own startup, farming in the village, or pure vibes.",
        bn: "কারণ জানান: ভালো অফার, নিজের স্টার্টআপ, গ্রামে গিয়ে চাষাবাদ, নাকি কোনো কারণ ছাড়াই, শুধু ভাইব।",
      },
      {
        en: "Read your boss's reply and tap Next.",
        bn: "বসের উত্তর পড়ুন, তারপর “পরের ধাপ” চাপুন।",
      },
      {
        en: "Pick a notice period: serve the full three months, negotiate down to one, or leave today.",
        bn: "নোটিশ পিরিয়ড বাছুন: পুরো তিন মাস, দরদাম করে এক মাস, নাকি আজই বিদায়।",
      },
      {
        en: "Watch HR get involved, then read how your exit really went.",
        bn: "দেখুন এইচআর কীভাবে জড়িয়ে পড়ে, তারপর পড়ুন আপনার বিদায় আসলে কেমন হলো।",
      },
    ],
    tips: [
      {
        en: "Your quitting style matters: a speech can go viral, the 2 AM message can land in the family group, and if you just stop going, nobody notices.",
        bn: "ছাড়ার ধরন গুরুত্বপূর্ণ: ভাষণ ভাইরাল হতে পারে, রাত ২টার মেসেজ চলে যেতে পারে পারিবারিক গ্রুপে, আর অফিসে যাওয়া বন্ধ করলে কেউ টেরই পায় না।",
      },
      {
        en: "Each reason opens a door: a better offer may bring a counter-offer, while the startup and the village each have their own ending.",
        bn: "প্রতিটা কারণ আলাদা দরজা খোলে: ভালো অফারের কথা বললে পাল্টা অফার আসতে পারে, আর স্টার্টআপ ও গ্রামের জন্য আছে আলাদা শেষ।",
      },
      {
        en: "Going for the Clean Exit? A polite email without leaving today helps a little; a fast, clear reply from HR helps most.",
        bn: "পরিচ্ছন্ন বিদায় চান? আজই না চলে গিয়ে ভদ্র ইমেইল দিলে একটু সাহায্য হয়; এইচআর দ্রুত আর পরিষ্কার উত্তর দিলে সবচেয়ে বেশি।",
      },
    ],
    faq: [
      {
        q: { en: "What decides whether I actually get out?", bn: "আসলেই চাকরি ছাড়তে পারব কি না, তা কীসে ঠিক হয়?" },
        a: {
          en: "Your choices plus a seeded roll. Each option, and each boss or HR moment, raises some of the 11 endings before one is picked. In several you walk out free; in a few you never quite leave.",
          bn: "আপনার পছন্দ আর একটা সিডেড দান। প্রতিটা অপশন আর বস বা এইচআরের প্রতিটা মুহূর্ত ১১টা শেষের কয়েকটাকে এগিয়ে দেয়, তারপর একটা বাছাই হয়। কয়েকটায় মুক্ত হয়ে বেরিয়ে যান; কয়েকটায় আর বেরোনোই হয় না।",
        },
      },
      {
        q: { en: "Can my boss talk me out of quitting?", bn: "বস কি আমাকে আটকে দিতে পারেন?" },
        a: {
          en: "Sometimes. “Just finish this one last project” can keep you there for years, and serving the full notice makes that likelier. Cite a better offer and the boss may match it with a ৳500 raise.",
          bn: "মাঝে মাঝে। “শুধু শেষ প্রজেক্টটা করে দাও” আপনাকে বছরের পর বছর আটকে রাখতে পারে, আর পুরো নোটিশ দিলে সেটার সম্ভাবনা বাড়ে। ভালো অফারের কথা বললে বস ৫০০ টাকা বাড়িয়ে পাল্টা অফার দিতে পারেন।",
        },
      },
      {
        q: { en: "What does my friend see from the resignation link?", bn: "পদত্যাগের লিংক থেকে বন্ধু কী দেখে?" },
        a: {
          en: "The same ending you got, with its quote and card lines, because the result travels inside the link. They can't change it, but they can resign their own way with one tap.",
          bn: "আপনি যে শেষ পেয়েছেন সেটাই, উদ্ধৃতি আর কার্ডের লাইনসহ, কারণ ফলাফলটা লিংকের ভেতরেই থাকে। বন্ধু সেটা বদলাতে পারবে না, তবে এক চাপে নিজের মতো করে পদত্যাগ করে দেখতে পারবে।",
        },
      },
    ],
  },

  "x:fake-shopping-spree": {
    steps: [
      {
        en: "Start and fill the cart: a mega-sale phone, sneakers from a social media page, a “wireless” blender, or the whole ৳99 section.",
        bn: "শুরু করে কার্ট ভরুন: মেগা সেলের ফোন, সোশ্যাল মিডিয়া পেজের স্নিকার্স, “ওয়্যারলেস” ব্লেন্ডার, নাকি পুরো ৯৯ টাকার সেকশন।",
      },
      {
        en: "Read the seller's reply and tap Next.",
        bn: "বিক্রেতার উত্তর পড়ুন, তারপর “পরের ধাপ” চাপুন।",
      },
      {
        en: "Choose payment: cash on delivery, pay in advance, or just add it all to the wishlist.",
        bn: "পেমেন্ট বাছুন: ক্যাশ অন ডেলিভারি, আগাম পেমেন্ট, নাকি সব শুধু উইশলিস্টে রাখা।",
      },
      {
        en: "Pick standard (3–5 days) or express (same day) delivery.",
        bn: "স্ট্যান্ডার্ড (৩–৫ দিন) নাকি এক্সপ্রেস (একই দিনে) ডেলিভারি, বেছে নিন।",
      },
      {
        en: "Live through delivery day and open what actually arrived, if anything did.",
        bn: "ডেলিভারির দিনটা পার করুন, তারপর খুলে দেখুন আসলে কী এলো — আদৌ কিছু এলে।",
      },
    ],
    tips: [
      {
        en: "The wishlist pulls hard toward Wishlist Millionaire and is the one payment that can never end in Exactly as Pictured.",
        bn: "উইশলিস্ট বাছলে “উইশলিস্ট কোটিপতি”-র দিকে টান অনেক বেশি, আর এটাই একমাত্র পেমেন্ট যেটায় “হুবহু ছবির মতো” কখনোই আসে না।",
      },
      {
        en: "Paying in advance risks the shop page vanishing, and standard delivery makes the endless “Out for delivery” more likely.",
        bn: "আগাম পেমেন্টে শপের পেজ উধাও হওয়ার ঝুঁকি থাকে, আর স্ট্যান্ডার্ড ডেলিভারিতে অনন্তকাল “ডেলিভারির পথে” থাকার সম্ভাবনা বাড়ে।",
      },
      {
        en: "Every cart item has a twist: the blender may turn up without a motor, and the ৳99 section can snowball into dozens of items.",
        bn: "কার্টের প্রতিটা জিনিসে একটা প্যাঁচ আছে: ব্লেন্ডার আসতে পারে মোটর ছাড়া, আর ৯৯ টাকার সেকশন জমতে জমতে ডজন ডজন জিনিস হয়ে যেতে পারে।",
      },
    ],
    faq: [
      {
        q: { en: "Can the parcel ever look like the photo?", bn: "পার্সেল কি কখনো ছবির মতো দেখতে হয়?" },
        a: {
          en: "Yes: Exactly as Pictured is one of the 11 endings. It's much likelier when delivery day goes smoothly, cash on delivery adds a touch more, and it can't happen if you only wishlisted.",
          bn: "হ্যাঁ, ১১টা শেষের একটা হলো “হুবহু ছবির মতো”। ডেলিভারির দিন ঝামেলাহীন গেলে সম্ভাবনা অনেক বাড়ে, ক্যাশ অন ডেলিভারিতে আরেকটু, আর শুধু উইশলিস্টে রাখলে এটা আসবেই না।",
        },
      },
      {
        q: { en: "Does what the seller says matter?", bn: "বিক্রেতা কী বলেন, তাতে কি কিছু যায় আসে?" },
        a: {
          en: "It does. “Inbox for price” can trap you in a 40-message loop, a “100% original” promise makes Expectation vs Reality likelier, and extra charges make the ৳99 trap even worse.",
          bn: "অবশ্যই। “দাম জানতে ইনবক্স করুন” আপনাকে ৪০টা মেসেজের চক্রে আটকে দিতে পারে, “১০০% অরিজিনাল” দাবি “প্রত্যাশা বনাম বাস্তবতা”-কে এগিয়ে দেয়, আর আলাদা চার্জে ৯৯ টাকার ফাঁদ আরও গভীর হয়।",
        },
      },
      {
        q: { en: "Is this about a real shop or page?", bn: "এটা কি কোনো আসল শপ বা পেজ নিয়ে?" },
        a: {
          en: "No. The sellers, pages and parcels are all made up. It's a comedy about familiar online-shopping moments, not a review of any store.",
          bn: "না। বিক্রেতা, পেজ, পার্সেল — সবই বানানো। এটা চেনা অনলাইন কেনাকাটার মুহূর্ত নিয়ে একটা কমেডি, কোনো দোকানের রিভিউ না।",
        },
      },
    ],
  },

  "x:house-rent-simulator": {
    steps: [
      {
        en: "Start and say who's moving in: a bachelor, four friends, a newly married couple, or a small family with one cat.",
        bn: "শুরু করে জানান কে উঠবেন: একা ব্যাচেলর, চার বন্ধু, নবদম্পতি, নাকি একটা বিড়ালসহ ছোট পরিবার।",
      },
      {
        en: "Set a monthly budget: ৳8,000, ৳15,000 or ৳30,000.",
        bn: "মাসিক বাজেট ঠিক করুন: ৳৮,০০০, ৳১৫,০০০ নাকি ৳৩০,০০০।",
      },
      {
        en: "Read the To-Let sign, sit through the landlord's interview, and tap Next after each.",
        bn: "টু-লেট সাইন পড়ুন, বাড়িওয়ালার ইন্টারভিউ সামলান, প্রতিবার “পরের ধাপ” চাপুন।",
      },
      {
        en: "Make your move: agree to everything, negotiate the advance, ask about the gas line, or walk away.",
        bn: "আপনার চাল দিন: সবকিছুতে রাজি, অ্যাডভান্স নিয়ে দরদাম, গ্যাস লাইনের কথা জিজ্ঞেস, নাকি চলে যাওয়া।",
      },
      {
        en: "Find out whether you got the flat, and what the catch is.",
        bn: "জেনে নিন বাসাটা পেলেন কি না, আর তার সাথে কী শর্ত জুড়ে আছে।",
      },
    ],
    tips: [
      {
        en: "Asking about the gas line leads to an ending of its own, and walking away keeps you house hunting.",
        bn: "গ্যাস লাইনের কথা জিজ্ঞেস করলে আলাদা একটা শেষ আসে, আর চলে গেলে বাসা খোঁজা চলতেই থাকে।",
      },
      {
        en: "Moving in with a cat? The landlord may object, and the cat may end up approved instead of you.",
        bn: "বিড়াল নিয়ে উঠছেন? বাড়িওয়ালা আপত্তি করতে পারেন, আর শেষে আপনার বদলে বিড়ালটাই পাস করে যেতে পারে।",
      },
      {
        en: "The Dream Flat is rare. A listing that looks perfect helps most and the ৳30,000 budget helps a little.",
        bn: "স্বপ্নের বাসা খুব কম আসে। একদম নিখুঁত দেখতে বিজ্ঞাপন সবচেয়ে বেশি সাহায্য করে, আর ৩০,০০০ টাকার বাজেট একটু।",
      },
    ],
    faq: [
      {
        q: { en: "Why does the landlord keep saying no to me?", bn: "বাড়িওয়ালা বারবার আমাকে না বলেন কেন?" },
        a: {
          en: "If you move in as a bachelor or as four friends, the “no bachelors” interview gets much likelier, and once it happens the Bachelor Denied ending is on the table. A couple or a family avoids that line.",
          bn: "একা ব্যাচেলর বা চার বন্ধু হিসেবে উঠতে চাইলে “ব্যাচেলর ভাড়া দিই না” ইন্টারভিউ আসার সম্ভাবনা অনেক বাড়ে, আর সেটা এলে “ব্যাচেলর নিষেধ” শেষটাও আসতে পারে। দম্পতি বা পরিবার হলে ওই কথাটা আসে না।",
        },
      },
      {
        q: { en: "How many endings are there, and do I always get a flat?", bn: "কয়টা শেষ আছে, আর বাসা কি সবসময় পাওয়া যায়?" },
        a: {
          en: "There are 11. Most hand you a flat with a catch, like a 10 PM curfew, water only from 6 to 7 AM or a lift “coming soon” since 2011. A few leave you rejected or still searching.",
          bn: "মোট ১১টা। বেশিরভাগে বাসা পান, কিন্তু সাথে একটা শর্ত — রাত ১০টার কারফিউ, সকাল ৬–৭টায় শুধু পানি, বা ২০১১ থেকে “শিগগিরই আসছে” লিফট। কয়েকটায় হয় প্রত্যাখ্যান, নয়তো খোঁজা চলতেই থাকে।",
        },
      },
      {
        q: { en: "If a friend gives the same answers, will they get my flat?", bn: "বন্ধু একই উত্তর দিলে কি আমার বাসাটাই পাবে?" },
        a: {
          en: "Not necessarily. Your link always shows your exact result, but a new run rolls its own To-Let sign, landlord and ending, so the same answers can land somewhere else.",
          bn: "জরুরি না। আপনার লিংক সবসময় আপনার হুবহু ফলাফলই দেখায়, কিন্তু নতুন খেলায় টু-লেট সাইন, বাড়িওয়ালা আর শেষ নতুন করে বাছাই হয়, তাই একই উত্তরেও অন্য জায়গায় গিয়ে ঠেকতে পারে।",
        },
      },
    ],
  },

  "x:random-life-decision": {
    steps: [
      {
        en: "Start and pick the big question: your career, moving abroad, tonight's dinner, or whether to text them back.",
        bn: "শুরু করে বড় প্রশ্নটা বাছুন: ক্যারিয়ার, বিদেশে যাওয়া, আজ রাতের খাবার, নাকি তাকে রিপ্লাই দেবেন কি না।",
      },
      {
        en: "Choose how to decide: roll a dice, flip a coin, ask your mom, or ask the internet.",
        bn: "কীভাবে সিদ্ধান্ত নেবেন বাছুন: ছক্কা গড়ানো, কয়েন টস, আম্মুকে জিজ্ঞেস, নাকি ইন্টারনেটকে।",
      },
      {
        en: "See how the universe answers, then tap Next.",
        bn: "মহাবিশ্ব কী উত্তর দেয় দেখুন, তারপর “পরের ধাপ” চাপুন।",
      },
      {
        en: "Decide what to do with it: follow it, ask again until you like it, or do the exact opposite.",
        bn: "উত্তরটা নিয়ে কী করবেন ঠিক করুন: মেনে নেবেন, পছন্দ না হওয়া পর্যন্ত আবার জিজ্ঞেস করবেন, নাকি ঠিক উল্টোটা করবেন।",
      },
      {
        en: "Wait for one last sign, from a staring crow to a meddling autocorrect, and receive your decision.",
        bn: "শেষ একটা ইঙ্গিতের অপেক্ষা করুন — তাকিয়ে থাকা কাক থেকে নাক গলানো অটোকারেক্ট পর্যন্ত — তারপর পেয়ে যান আপনার সিদ্ধান্ত।",
      },
    ],
    tips: [
      {
        en: "The question shapes the ending: career can make you a mango farmer or a YouTuber, abroad tends to bring you home for biryani, and dinner points to khichuri.",
        bn: "প্রশ্নটাই শেষের দিক ঠিক করে: ক্যারিয়ারে হতে পারেন আমচাষি বা ইউটিউবার, বিদেশ প্রায়ই বিরিয়ানির টানে ফিরিয়ে আনে, আর রাতের খাবার মানেই খিচুড়ির দিকে।",
      },
      {
        en: "Dice and coins can roll under the fridge, which has its own ending; asking the internet may end with you buying a course.",
        bn: "ছক্কা বা কয়েন ফ্রিজের নিচে গড়িয়ে যেতে পারে, যার আলাদা একটা শেষ আছে; ইন্টারনেটকে জিজ্ঞেস করলে শেষে একটা কোর্স কিনে ফেলতে পারেন।",
      },
      {
        en: "Best Decision of Your Life is the rare one: following a clear answer helps, and so does a quiet universe at the very end.",
        bn: "“জীবনের সেরা সিদ্ধান্ত” খুব কম আসে: পরিষ্কার উত্তর মেনে নিলে সাহায্য হয়, আর শেষে মহাবিশ্ব চুপ থাকলেও।",
      },
    ],
    faq: [
      {
        q: { en: "Should I trust the decision it gives me?", bn: "যে সিদ্ধান্ত দেয়, সেটা কি বিশ্বাস করা উচিত?" },
        a: {
          en: "Please don't. It's a comedy with 12 made-up endings, like Moved Abroad, Came Back for Biryani or Guided by a Crow. Enjoy the result, then make real decisions the usual way.",
          bn: "দয়া করে না। এটা ১২টা বানানো শেষওয়ালা একটা কমেডি — যেমন “বিদেশ গেলেন, বিরিয়ানির টানে ফিরলেন” বা “কাকের নির্দেশনায়”। ফলাফলটা উপভোগ করুন, আসল সিদ্ধান্ত নিন চেনা উপায়ে।",
        },
      },
      {
        q: { en: "Why did I get “Mom Already Decided”?", bn: "আমি “আম্মু আগেই ঠিক করে রেখেছেন” কেন পেলাম?" },
        a: {
          en: "That ending only appears when you choose to ask your mom, and it's even likelier when she answers before you finish the question.",
          bn: "এই শেষটা আসে শুধু তখনই, যখন আপনি আম্মুকে জিজ্ঞেস করা বাছেন — আর প্রশ্ন শেষ হওয়ার আগেই তিনি উত্তর দিয়ে দিলে সম্ভাবনা আরও বাড়ে।",
        },
      },
      {
        q: { en: "What happens if I ask again or do the opposite?", bn: "আবার জিজ্ঞেস করলে বা উল্টোটা করলে কী হয়?" },
        a: {
          en: "Each opens its own ending: asking again can turn into Asked 47 Times, and doing the opposite can lead to The Opposite Worked. Your question and method can still pull toward other endings.",
          bn: "দুটোরই নিজস্ব শেষ আছে: বারবার জিজ্ঞেস করলে হতে পারে “৪৭ বার জিজ্ঞেস”, আর উল্টোটা করলে “উল্টোটাই কাজ করল”। তবে আপনার প্রশ্ন আর পদ্ধতি অন্য শেষের দিকেও টানতে পারে।",
        },
      },
    ],
  },

  "p:dhaka-person": {
    steps: [
      {
        en: "Press “Start the quiz” and answer 10 quick questions about traffic, food, rain, money and more.",
        bn: "“কুইজ শুরু করো” চাপুন, তারপর জ্যাম, খাবার, বৃষ্টি, টাকা-পয়সা নিয়ে ১০টা ছোট প্রশ্নের উত্তর দিন।",
      },
      {
        en: "Each question has four answers; tap the one closest to what you'd really do.",
        bn: "প্রতিটা প্রশ্নে চারটা উত্তর; আপনি সত্যি যা করতেন, তার সবচেয়ে কাছেরটায় চাপুন।",
      },
      {
        en: "Changed your mind? Use “Previous question” to go back one step.",
        bn: "মত বদলেছেন? “আগের প্রশ্ন” চেপে এক ধাপ পিছিয়ে যান।",
      },
      {
        en: "Meet your Dhaka personality and see your mix: the traits that showed up most in your answers.",
        bn: "দেখে নিন আপনার ঢাকা পার্সোনালিটি আর আপনার মিশ্রণ — উত্তরে যে গুণগুলো সবচেয়ে বেশি এসেছে।",
      },
    ],
    tips: [
      {
        en: "There are 10 personalities in all; this device keeps count of the ones you've found, so retake with other answers to collect more.",
        bn: "মোট ১০টা পার্সোনালিটি আছে; এই ডিভাইস মনে রাখে আপনি কয়টা পেয়েছেন, তাই অন্য উত্তর দিয়ে আবার খেলে আরও সংগ্রহ করুন।",
      },
      {
        en: "Spread your answers across many different moods and you might land the special one, Dhaka Final Boss.",
        bn: "উত্তরগুলো নানা রকম মেজাজে ছড়িয়ে দিলে পেয়ে যেতে পারেন বিশেষটা — ঢাকার ফাইনাল বস।",
      },
    ],
    faq: [
      {
        q: { en: "How is my Dhaka personality worked out?", bn: "আমার ঢাকা পার্সোনালিটি কীভাবে ঠিক হয়?" },
        a: {
          en: "Every answer adds points to eight traits, such as haggling, food, adda and survival. Your mix is compared with each personality and the closest match wins; a very even spread across most traits gives Dhaka Final Boss.",
          bn: "প্রতিটা উত্তর আটটা গুণে পয়েন্ট যোগ করে — যেমন দরদাম, খাদ্যপ্রেম, আড্ডা আর টিকে থাকা। আপনার মিশ্রণ প্রতিটা পার্সোনালিটির সাথে মেলানো হয়, সবচেয়ে কাছেরটাই আপনার; প্রায় সব গুণ সমানভাবে থাকলে মেলে ঢাকার ফাইনাল বস।",
        },
      },
      {
        q: { en: "Will the same answers always give the same result?", bn: "একই উত্তর দিলে কি সবসময় একই ফলাফল আসবে?" },
        a: {
          en: "Yes. There's no dice roll in this quiz: the same 10 answers always lead to the same personality. It's just for fun, not science.",
          bn: "হ্যাঁ। এই কুইজে কোনো ভাগ্যের দান নেই: একই ১০টা উত্তর সবসময় একই পার্সোনালিটিতে নিয়ে যায়। এটা শুধু মজার জন্য, বিজ্ঞান না।",
        },
      },
      {
        q: { en: "What happens when a friend opens my quiz link?", bn: "বন্ধু আমার কুইজের লিংক খুললে কী হয়?" },
        a: {
          en: "They see your personality with a banner inviting them to take the quiz. When they finish, their result says whether you matched (“Dhaka twins”) or which personality you got.",
          bn: "সে আপনার পার্সোনালিটি দেখবে, সাথে কুইজ দেওয়ার আমন্ত্রণসহ একটা ব্যানার। শেষ করলে তার ফলাফলেই জানাবে আপনাদের মিলেছে কি না (“ঢাকার যমজ”), নাকি আপনি কোনটা পেয়েছিলেন।",
        },
      },
    ],
  },

  "p:excuses": {
    steps: [
      {
        en: "Pick what you need an excuse for: office, university, being late, friends, family, dating, unfinished work, or Random.",
        bn: "কীসের জন্য অজুহাত লাগবে বাছুন: অফিস, ভার্সিটি, দেরি, বন্ধু, পরিবার, ডেটিং, কাজ শেষ না হওয়া, নাকি র‍্যান্ডম।",
      },
      {
        en: "Press “Generate excuse” to build one from an opener, a reason, a twist and sometimes a closing line.",
        bn: "“EXCUSE বানাও” চাপুন — একটা শুরু, একটা কারণ, একটা মোচড় আর কখনো কখনো শেষ লাইন জুড়ে তৈরি হবে অজুহাত।",
      },
      {
        en: "Check its credibility and chaos scores, plus the verdict on whether anyone will buy it.",
        bn: "দেখুন এর বিশ্বাসযোগ্যতা আর হট্টগোলের স্কোর, সাথে রায় — কেউ বিশ্বাস করবে কি না।",
      },
      {
        en: "Not convinced? Tap “Another excuse”, or copy the one you like and send it.",
        bn: "মন ভরেনি? “আরেকটা excuse” চাপুন, নয়তো পছন্দেরটা কপি করে পাঠিয়ে দিন।",
      },
    ],
    tips: [
      {
        en: "“Another excuse” steers away from the openers, reasons and twists you've just seen, so back-to-back repeats are rare.",
        bn: "“আরেকটা excuse” সদ্য দেখা শুরু, কারণ আর মোচড় এড়িয়ে চলে, তাই পরপর একই জিনিস খুব কম আসে।",
      },
      {
        en: "Friends and Late start out more believable than Dating; the reason and the other pieces then nudge the score up or down.",
        bn: "বন্ধু আর দেরির অজুহাত শুরু থেকেই ডেটিংয়ের চেয়ে বেশি বিশ্বাসযোগ্য; তারপর কারণ আর বাকি অংশ স্কোরটা একটু ওঠায় বা নামায়।",
      },
      {
        en: "Random picks one of the seven situations for you, which helps when you can't decide what you need the excuse for.",
        bn: "র‍্যান্ডম আপনার হয়ে সাতটা পরিস্থিতির একটা বেছে নেয় — কীসের অজুহাত লাগবে ঠিক করতে না পারলে কাজে দেয়।",
      },
    ],
    faq: [
      {
        q: { en: "How is the credibility score worked out?", bn: "বিশ্বাসযোগ্যতার স্কোর কীভাবে হিসাব হয়?" },
        a: {
          en: "Each situation has a starting score, and every piece of the excuse moves it: rain helps, a goat blocking your gate does not. A small random wiggle is added, it stays between 3 and 97%, and the verdict comes from that band.",
          bn: "প্রতিটা পরিস্থিতির একটা শুরুর স্কোর আছে, আর অজুহাতের প্রতিটা অংশ সেটা নাড়ায়: বৃষ্টি সাহায্য করে, গেট আটকে দাঁড়ানো ছাগল করে না। সাথে যোগ হয় সামান্য র‍্যান্ডম ওঠানামা; স্কোর থাকে ৩ থেকে ৯৭%-এর মধ্যে, আর রায় আসে সেই ধাপ দেখে।",
        },
      },
      {
        q: { en: "What does the chaos score mean?", bn: "হট্টগোলের স্কোর মানে কী?" },
        a: {
          en: "How wild the story is, from 5 to 99%. Odd reasons, like a philosophical disagreement with your CNG driver, push it up. It's scored separately, so a chaotic excuse can still be believable.",
          bn: "গল্পটা কতটা উদ্ভট, ৫ থেকে ৯৯%-এর মধ্যে। অদ্ভুত কারণ — যেমন সিএনজি ড্রাইভারের সাথে দার্শনিক মতবিরোধ — স্কোর বাড়ায়। এটা আলাদাভাবে গোনা হয়, তাই হট্টগোলে ভরা অজুহাতও বিশ্বাসযোগ্য হতে পারে।",
        },
      },
      {
        q: { en: "Will my friend see the same excuse from my link?", bn: "আমার লিংক থেকে বন্ধু কি একই অজুহাত দেখবে?" },
        a: {
          en: "Yes. The link carries the situation and a seed that rebuild exactly the same excuse, scores and verdict included, under a “Someone sent you this excuse” banner.",
          bn: "হ্যাঁ। লিংকে থাকে পরিস্থিতি আর একটা সিড, যা হুবহু একই অজুহাত আবার তৈরি করে — স্কোর আর রায়সহ — সাথে “কেউ আপনাকে এই excuse পাঠিয়েছে” ব্যানার।",
        },
      },
    ],
  },
};
