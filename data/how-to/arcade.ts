import type { HowTo } from "@/lib/how-to";

// "How to play" for the arcade reflex games (see lib/how-to.ts for the rules).
export const HOW_TO_ARCADE: Record<string, HowTo> = {
  "g:cng-catch": {
    steps: [
      {
        en: "Press “Start hailing” and wait out the Ready… Steady… countdown. A CNG then zooms across the road from one side.",
        bn: "“সিএনজি ডাকা শুরু” চাপুন, রেডি… স্টেডি… গোনা শেষ হওয়া পর্যন্ত অপেক্ষা করুন। তারপর রাস্তার এক পাশ থেকে একটা সিএনজি ছুটে আসবে।",
      },
      {
        en: "Watch the green STOP zone. When the CNG is inside it, tap or click the road, or press Space or Enter, to hail it.",
        bn: "সবুজ স্টপ জোনের দিকে চোখ রাখুন। সিএনজি জোনের ভেতরে এলেই রাস্তায় ট্যাপ বা ক্লিক করুন, অথবা Space বা Enter চেপে থামান।",
      },
      {
        en: "You get one hail per CNG. Tapping outside the zone, or letting it drive off, is a miss and breaks your combo.",
        bn: "প্রতিটা সিএনজির জন্য একবারই ডাকতে পারবেন। জোনের বাইরে চাপলে বা সিএনজি চলে গেলে সেটা মিস, কম্বোও ভেঙে যায়।",
      },
      {
        en: "The run stops when the 30-second clock hits zero or on your third miss, whichever comes first.",
        bn: "৩০ সেকেন্ডের ঘড়ি শূন্যে নামলে অথবা তৃতীয় মিস হলে — যেটা আগে হয় — খেলা শেষ।",
      },
      {
        en: "Your score earns a title from “Missed It Again” up to “CNG Magnet”, shown with your catches, perfects and best combo.",
        bn: "স্কোর অনুযায়ী টাইটেল পাবেন, “আবারও মিস” থেকে “সিএনজি চুম্বক” পর্যন্ত — সাথে কতগুলো ধরেছেন, পারফেক্ট আর সেরা কম্বো।",
      },
    ],
    tips: [
      {
        en: "Aim for the middle of the zone, not its edge: a dead-centre tap counts as perfect and earns 20 extra points.",
        bn: "জোনের কিনারায় নয়, ঠিক মাঝখানে চাপার চেষ্টা করুন: একদম মাঝে চাপলে পারফেক্ট, সাথে ২০ পয়েন্ট বাড়তি।",
      },
      {
        en: "From the fifth CNG on, some drivers slow down halfway as if thinking about stopping. Don’t let the slowdown fool you into tapping early.",
        bn: "পঞ্চম সিএনজি থেকে কিছু ড্রাইভার মাঝপথে গতি কমায়, যেন থামবে কি না ভাবছে। এই ধীরগতি দেখে আগেভাগে চেপে বসবেন না।",
      },
      {
        en: "A safe “good” catch beats a risky perfect attempt that misses, because a miss wipes the combo multiplier you built.",
        bn: "ঝুঁকি নিয়ে পারফেক্টের চেষ্টায় মিস করার চেয়ে নিরাপদ “গুড” ক্যাচ ভালো — মিস হলেই এত কষ্টের কম্বো মাল্টিপ্লায়ার শূন্য।",
      },
    ],
    faq: [
      {
        q: { en: "How are CNG Catch points worked out?", bn: "সিএনজি ক্যাচে পয়েন্ট কীভাবে হিসাব হয়?" },
        a: {
          en: "Each catch is worth 30 to 100 points depending on how central your tap was, plus 20 for a perfect. That is multiplied by your combo: x1, rising by one for every 3 catches in a row, up to x5.",
          bn: "প্রতিটা ক্যাচে ৩০ থেকে ১০০ পয়েন্ট, নির্ভর করে কতটা মাঝখানে চেপেছেন তার ওপর; পারফেক্ট হলে আরও ২০। এরপর কম্বো দিয়ে গুণ: শুরুতে x1, টানা প্রতি ৩টা ক্যাচে এক করে বাড়ে, সর্বোচ্চ x5।",
        },
      },
      {
        q: { en: "Why does each CNG feel harder than the last?", bn: "প্রতিটা সিএনজি আগেরটার চেয়ে কঠিন লাগে কেন?" },
        a: {
          en: "Every new CNG crosses a bit faster and the stop zone gets narrower. The traffic is built from a seed, so the traffic code on your result replays exactly the same CNGs.",
          bn: "প্রতিটা নতুন সিএনজি একটু বেশি জোরে যায়, আর স্টপ জোন একটু সরু হয়। ট্রাফিক একটা সিড থেকে তৈরি, তাই ফলাফলের ট্রাফিক কোড দিয়ে হুবহু একই সিএনজিগুলো আবার আসে।",
        },
      },
      {
        q: { en: "Is CNG Catch ever the Daily Hottogol?", bn: "সিএনজি ক্যাচ কি কখনো ডেইলি হট্টগোল হয়?" },
        a: {
          en: "Yes. The /daily challenge rotates between CNG Catch and Traffic Dodge. On a CNG Catch day everyone gets the same traffic, and your first score is kept as today’s score.",
          bn: "হ্যাঁ। /daily চ্যালেঞ্জ সিএনজি ক্যাচ আর ট্রাফিক ডজের মধ্যে ঘুরে ঘুরে আসে। সিএনজি ক্যাচের দিনে সবাই একই ট্রাফিক পায়, আর আপনার প্রথম স্কোরটাই হয় আজকের স্কোর।",
        },
      },
    ],
  },

  "g:traffic-dodge": {
    steps: [
      {
        en: "Tap “Start the engine”. After the 3-2-GO countdown your motorbike rides up a four-lane Dhaka road.",
        bn: "“ইঞ্জিন চালু করুন” চাপুন। ৩-২-চলো গোনার পর আপনার মোটরবাইক চার লেনের ঢাকার রাস্তা ধরে এগোবে।",
      },
      {
        en: "Change lanes by tapping the left or right half of the road, swiping, using the ◀ ▶ buttons, or pressing ← → or A D.",
        bn: "লেন বদলাতে রাস্তার বাঁ বা ডান অর্ধেকে ট্যাপ করুন, সোয়াইপ করুন, ◀ ▶ বোতাম চাপুন, অথবা ← → বা A D চাপুন।",
      },
      {
        en: "Rickshaws, CNGs, cars, buses, goats, cows and potholes come at you. Touching any one of them ends the ride.",
        bn: "রিকশা, সিএনজি, গাড়ি, বাস, ছাগল, গরু আর গর্ত সামনে থেকে আসবে। যেকোনো একটার সাথে ছোঁয়া লাগলেই যাত্রা শেষ।",
      },
      {
        en: "The road only gets faster, so stay alive as long as you can and slip past traffic closely for near-miss points.",
        bn: "রাস্তার গতি শুধু বাড়তেই থাকে, তাই যতক্ষণ পারেন টিকে থাকুন, আর গাড়ির গা ঘেঁষে বেরিয়ে নিয়ার-মিস পয়েন্ট তুলুন।",
      },
      {
        en: "After the crash you see your title, seconds survived, near-misses, best combo and top speed.",
        bn: "ধাক্কার পর দেখবেন আপনার টাইটেল, কত সেকেন্ড টিকেছেন, নিয়ার-মিস, সেরা কম্বো আর সর্বোচ্চ গতি।",
      },
    ],
    tips: [
      {
        en: "Every row of traffic leaves at least one open lane, and it is never more than one lane away from the previous gap. Look for it early.",
        bn: "প্রতিটা সারির ট্রাফিকে অন্তত একটা লেন খোলা থাকে, আর সেটা আগের ফাঁকা লেন থেকে এক লেনের বেশি দূরে থাকে না। আগে থেকেই খুঁজে রাখুন।",
      },
      {
        en: "A bus covers two lanes at once. Start moving the moment one appears at the top instead of waiting until it is close.",
        bn: "একটা বাস একসাথে দুই লেন জুড়ে থাকে। ওপরে বাস দেখা মাত্রই সরতে শুরু করুন, কাছে আসা পর্যন্ত বসে থাকবেন না।",
      },
      {
        en: "The near-miss combo drops if 4 seconds pass without another close call, so keep brushing past traffic to hold the multiplier.",
        bn: "৪ সেকেন্ডের মধ্যে আরেকটা নিয়ার-মিস না হলে কম্বো পড়ে যায়, তাই মাল্টিপ্লায়ার ধরে রাখতে বারবার গাড়ির পাশ ঘেঁষে যান।",
      },
    ],
    faq: [
      {
        q: { en: "How is the Traffic Dodge score calculated?", bn: "ট্রাফিক ডজের স্কোর কীভাবে হিসাব হয়?" },
        a: {
          en: "You earn points for distance covered, plus 40 for each near-miss times a combo multiplier that goes up by one every 2 near-misses in a row, up to x5. Titles run from “Crashed Before Farmgate” to “Dhaka Road Legend”.",
          bn: "যতটা পথ গেছেন তার জন্য পয়েন্ট, সাথে প্রতিটা নিয়ার-মিসে ৪০ — কম্বো মাল্টিপ্লায়ার দিয়ে গুণ, যেটা টানা প্রতি ২টা নিয়ার-মিসে এক করে বাড়ে, সর্বোচ্চ x5। টাইটেল “ফার্মগেটের আগেই ধাক্কা” থেকে “ঢাকার রাস্তার কিংবদন্তি” পর্যন্ত।",
        },
      },
      {
        q: { en: "What do the road event banners mean?", bn: "রাস্তার ইভেন্ট ব্যানারগুলোর মানে কী?" },
        a: {
          en: "Every few seconds an event changes the road: a VIP convoy leaves a single open lane, goats and cows cross, two buses race, a rickshaw wave rolls in, Eid empties the road for a moment, and rain makes everyone faster.",
          bn: "কিছুক্ষণ পরপর একটা ইভেন্ট রাস্তা বদলে দেয়: ভিআইপি মুভমেন্টে একটাই লেন খোলা, ছাগল-গরু পার হয়, দুই বাসের রেস, রিকশার ঢেউ, ঈদের ছুটিতে কিছুক্ষণ ফাঁকা রাস্তা, আর বৃষ্টিতে সবাই জোরে চালায়।",
        },
      },
      {
        q: { en: "Can my friend ride the exact same traffic?", bn: "বন্ধু কি হুবহু একই ট্রাফিকে চালাতে পারবে?" },
        a: {
          en: "Yes. The challenge link on your result opens your traffic seed for them with your score as the target. The score lives only in the link, so there is no ranking, just you versus them.",
          bn: "হ্যাঁ। ফলাফলের চ্যালেঞ্জ লিংক খুললে বন্ধু আপনার ট্রাফিক সিডটাই পাবে, লক্ষ্য হিসেবে থাকবে আপনার স্কোর। স্কোরটা শুধু লিংকেই থাকে, কোনো র‍্যাঙ্কিং নেই — শুধু আপনি বনাম সে।",
        },
      },
    ],
  },

  "g:tea-balance": {
    steps: [
      {
        en: "Tap “Pour the tea” to start pushing a cha cart up a Dhaka road with one cup filled right to the brim.",
        bn: "“চা ঢালুন” চাপুন — কানায় কানায় ভরা এক কাপ চা নিয়ে চায়ের কার্ট ঠেলে ঢাকার রাস্তা ধরে এগোতে শুরু করবেন।",
      },
      {
        en: "Steer by dragging on the road, moving the mouse over it, holding the ◀ ▶ buttons, or pressing ← → or A D.",
        bn: "চালাতে রাস্তায় আঙুল টানুন, মাউস নাড়ুন, ◀ ▶ বোতাম চেপে ধরুন, অথবা ← → বা A D চাপুন।",
      },
      {
        en: "Avoid potholes, manholes, puddles and wandering goats. Speed breakers span the whole road, so you can only take them calmly.",
        bn: "গর্ত, ম্যানহোল, জমা পানি আর হাঁটতে থাকা ছাগল এড়িয়ে চলুন। স্পিড ব্রেকার পুরো রাস্তা জুড়ে, ওটা শুধু শান্তভাবে পার হওয়া যায়।",
      },
      {
        en: "Keep an eye on the wobble meter: tea spills while it sits in the red, and the run ends when the cup is empty.",
        bn: "দোলার মিটারে নজর রাখুন: লাল ঘরে থাকলে চা পড়তে থাকে, আর কাপ খালি হলেই খেলা শেষ।",
      },
      {
        en: "Last the full 60 seconds and the tea is delivered, with a bonus for whatever is still in the cup.",
        bn: "পুরো ৬০ সেকেন্ড টিকলে চা পৌঁছে যায়, আর কাপে যতটা চা বাকি থাকে তার জন্য বোনাস।",
      },
    ],
    tips: [
      {
        en: "Make small, smooth moves. The tea sloshes whenever the cart speeds up or stops, so a sharp swerve can spill as much as a pothole.",
        bn: "ছোট ছোট, মসৃণভাবে সরুন। কার্টের গতি বাড়লে বা থামলেই চা ছলকায়, তাই হঠাৎ মোড় নিলে গর্তের মতোই চা পড়ে যেতে পারে।",
      },
      {
        en: "After a bump, hold still for a moment. The tea swings like a spring and settles on its own if you stop jolting it.",
        bn: "ঝাঁকি খাওয়ার পর একটু স্থির থাকুন। চা স্প্রিংয়ের মতো দোলে, আর নতুন করে ঝাঁকি না দিলে নিজে থেকেই থিতিয়ে যায়।",
      },
      {
        en: "The cup gets wobblier the longer you go, so save your calmest hands for the last stretch before delivery.",
        bn: "যত সময় যায়, কাপ তত বেশি দোলে — তাই সবচেয়ে শান্ত হাতটা ডেলিভারির আগের শেষ অংশের জন্য রেখে দিন।",
      },
    ],
    faq: [
      {
        q: { en: "How is the Tea Balance score worked out?", bn: "টি ব্যালেন্সের স্কোর কীভাবে হিসাব হয়?" },
        a: {
          en: "You get 10 points for every second you last. Deliver after 60 seconds and each percent of tea left adds 5 more, which is why a full cup at the finish matters. Titles go from “Spilled Before the First Sip” to “Ustad Cha-wala”.",
          bn: "প্রতি সেকেন্ড টিকে থাকার জন্য ১০ পয়েন্ট। ৬০ সেকেন্ড পর ডেলিভারি দিলে বাকি চায়ের প্রতি শতাংশে আরও ৫ — তাই শেষে ভরা কাপ এত জরুরি। টাইটেল “প্রথম চুমুকের আগেই শেষ” থেকে “ওস্তাদ চা-ওয়ালা” পর্যন্ত।",
        },
      },
      {
        q: { en: "What happens during the surprise events?", bn: "হঠাৎ আসা ইভেন্টগুলোতে কী হয়?" },
        a: {
          en: "Now and then a passing bus blows a gust that pushes the tea, WASA digs up the road so hazards bunch together, a colleague takes a sip (−7% tea), or a hydraulic horn makes you flinch.",
          bn: "মাঝে মাঝে পাশ দিয়ে বাস গিয়ে বাতাসে চা দুলিয়ে দেয়, ওয়াসা রাস্তা খুঁড়ে ফেলায় বাধা গাদাগাদি হয়ে আসে, কলিগ এক চুমুক নিয়ে নেন (−৭% চা), কিংবা হাইড্রোলিক হর্নে চমকে ওঠেন।",
        },
      },
      {
        q: { en: "Does hitting a pothole end the game?", bn: "গর্তে পড়লেই কি খেলা শেষ?" },
        a: {
          en: "No. A hit only sets the tea swinging hard. Tea spills only while the wobble stays past the red line, and the run ends only when the cup runs dry, so a bad bump can still be saved.",
          bn: "না। ধাক্কা লাগলে শুধু চা জোরে দুলে ওঠে। দোলা লাল দাগ পেরিয়ে থাকলে তবেই চা পড়ে, আর কাপ পুরো খালি হলে তবেই খেলা শেষ — তাই খারাপ ঝাঁকি খেয়েও সামলে নেওয়া যায়।",
        },
      },
    ],
  },

  "g:dont-tap": {
    steps: [
      {
        en: "Press “Start (don't tap yet)”. The big button now says DON'T TAP, and it means it.",
        bn: "“শুরু (এখনই চাপবেন না)” চাপুন। বড় বোতামে এখন লেখা “চাপবেন না” — এবং কথাটা সত্যি।",
      },
      {
        en: "Wait until the button is green AND says TAP!, then hit it as fast as you can: tap, click, Space or Enter.",
        bn: "বোতাম যখন সবুজ হবে আর লেখা থাকবে “চাপুন!”, তখন যত দ্রুত পারেন চাপুন: ট্যাপ, ক্লিক, Space বা Enter।",
      },
      {
        en: "Ignore the fakes: green with other words, TAP! on another colour, “TAB!”, “TAP?” and “TAP… not”.",
        bn: "নকলগুলো এড়িয়ে যান: সবুজ কিন্তু অন্য লেখা, অন্য রঙে “চাপুন!”, “ছাপুন!”, “চাপুন?” আর “চাপুন… না”।",
      },
      {
        en: "Tapping too early restarts that round with fresh timing. Get through all 5 rounds.",
        bn: "খুব আগে চাপলে সেই রাউন্ড নতুন সময় নিয়ে আবার শুরু হয়। মোট ৫টা রাউন্ড পার করুন।",
      },
      {
        en: "The result lists each round’s reaction time in milliseconds, plus your average, fastest and false starts.",
        bn: "ফলাফলে প্রতিটা রাউন্ডের রিঅ্যাকশন টাইম মিলিসেকেন্ডে, সাথে গড়, সবচেয়ে দ্রুত আর কতবার আগে চেপেছেন।",
      },
    ],
    tips: [
      {
        en: "Read the word, not only the colour. Several decoys are green, and one shows TAP! on red.",
        bn: "শুধু রং নয়, লেখাটাও পড়ুন। কয়েকটা নকল সিগন্যাল সবুজ, আর একটায় লালের ওপর “চাপুন!” লেখা থাকে।",
      },
      {
        en: "Later rounds throw more decoys at you, and they flash only briefly. The real signal never lands right on top of one.",
        bn: "পরের রাউন্ডগুলোতে নকল সিগন্যাল বাড়ে, আর সেগুলো এক ঝলক দেখা দিয়েই সরে যায়। আসল সিগন্যাল কখনো নকলের ঠিক গায়ে গায়ে আসে না।",
      },
      {
        en: "A false start costs 150 points, the same as reacting 150 ms slower. When unsure, wait a blink.",
        bn: "একবার আগে চাপলে ১৫০ পয়েন্ট কাটা যায় — ১৫০ মিলিসেকেন্ড দেরিতে চাপার সমান। সন্দেহ হলে এক পলক অপেক্ষা করুন।",
      },
    ],
    faq: [
      {
        q: { en: "How does Don't Tap turn reaction time into points?", bn: "ডোন্ট ট্যাপ রিঅ্যাকশন টাইমকে কীভাবে পয়েন্টে বদলায়?" },
        a: {
          en: "Each round scores 600 minus your reaction time in milliseconds, never below zero, so 250 ms earns 350. Every false start then takes 150 off the total.",
          bn: "প্রতি রাউন্ডে ৬০০ থেকে আপনার রিঅ্যাকশন টাইম (মিলিসেকেন্ডে) বাদ, শূন্যের নিচে নামে না — যেমন ২৫০ মি.সে. মানে ৩৫০ পয়েন্ট। তারপর প্রতিবার আগে চাপার জন্য মোট থেকে ১৫০ কাটা।",
        },
      },
      {
        q: { en: "What happens if I keep tapping too early?", bn: "বারবার আগে চাপলে কী হয়?" },
        a: {
          en: "Each early tap restarts the round. A third one in the same round ends it with a 1-second penalty worth no points, and 4 or more false starts in a game earn the title “Professional Signal Jumper”.",
          bn: "প্রতিবার আগে চাপলে রাউন্ড আবার শুরু। একই রাউন্ডে তৃতীয়বার হলে ১ সেকেন্ড পেনাল্টি দিয়ে রাউন্ড শেষ, পয়েন্ট শূন্য। পুরো খেলায় ৪ বা তার বেশিবার হলে টাইটেল “পেশাদার সিগন্যাল জাম্পার”।",
        },
      },
      {
        q: { en: "What if I'm too slow to react?", bn: "রিঅ্যাকশন খুব ধীর হলে কী হয়?" },
        a: {
          en: "If you haven’t tapped 1.5 seconds after the real green TAP!, the round is marked 💤, scores nothing, and the next round begins.",
          bn: "আসল সবুজ “চাপুন!” আসার ১.৫ সেকেন্ডের মধ্যে না চাপলে রাউন্ডটা 💤 চিহ্ন পায়, কোনো পয়েন্ট হয় না, আর পরের রাউন্ড শুরু হয়।",
        },
      },
    ],
  },

  "g:chicken-crossing": {
    steps: [
      {
        en: "Press “START CROSSING”. Your chicken starts on the footpath at the bottom of a seven-column Dhaka street.",
        bn: "“পার হওয়া শুরু” চাপুন। আপনার মুরগি সাত কলামের ঢাকার রাস্তার একদম নিচে, ফুটপাতে দাঁড়িয়ে আছে।",
      },
      {
        en: "Tap or swipe up to hop forward; swipe left, right or down to sidestep. Keys: arrows or WASD, and Space also hops forward.",
        bn: "সামনে লাফাতে ট্যাপ করুন বা উপরে সোয়াইপ; পাশে বা পেছনে সরতে বামে, ডানে বা নিচে সোয়াইপ। কিবোর্ডে অ্যারো বা WASD, Space দিলেও সামনে লাফ।",
      },
      {
        en: "Cross roads full of rickshaws, cars, CNGs, buses and bikes. On footpaths, mind people glued to phones and street dogs.",
        bn: "রিকশা, গাড়ি, সিএনজি, বাস আর বাইকে ভরা রাস্তা পার হন। ফুটপাতেও সাবধান — ফোনে মগ্ন পথচারী আর রাস্তার কুকুর আছে।",
      },
      {
        en: "Keep moving. A few seconds in, the screen starts creeping forward, and slipping off its bottom edge ends the run.",
        bn: "থামবেন না। কয়েক সেকেন্ড পর স্ক্রিন নিজে থেকেই সামনে এগোতে থাকে, আর নিচের কিনারা দিয়ে বেরিয়ে গেলে খেলা শেষ।",
      },
      {
        en: "One bump from anything also ends it. You then see your score, metres crossed, near misses and the level reached.",
        bn: "যেকোনো কিছুর সাথে একবার ধাক্কা লাগলেও শেষ। তারপর দেখবেন স্কোর, কত মিটার পার হয়েছেন, নিয়ার মিস আর কোন লেভেলে পৌঁছেছেন।",
      },
    ],
    tips: [
      {
        en: "Only your furthest row scores, so hopping back to dodge a bus costs you nothing but a little time.",
        bn: "শুধু সবচেয়ে দূরের সারিটাই পয়েন্ট দেয়, তাই বাস এড়াতে পেছনে লাফালে একটু সময় ছাড়া কিছুই হারান না।",
      },
      {
        en: "Dividers never have traffic on them, which makes them the safest spot to read the next lanes — just don’t linger there.",
        bn: "ডিভাইডারে কখনো গাড়ি চলে না, তাই পরের লেনগুলো দেখে নেওয়ার সবচেয়ে নিরাপদ জায়গা ওটাই — তবে বেশিক্ষণ দাঁড়াবেন না।",
      },
      {
        en: "Landing right beside a moving vehicle is a near miss. Chain them within 3 seconds to push the multiplier up to x4.",
        bn: "চলন্ত গাড়ির একদম পাশে নামলে নিয়ার মিস। ৩ সেকেন্ডের মধ্যে টানা করলে মাল্টিপ্লায়ার উঠবে x4 পর্যন্ত।",
      },
    ],
    faq: [
      {
        q: { en: "How is the Chicken Crossing score calculated?", bn: "চিকেন ক্রসিংয়ের স্কোর কীভাবে হিসাব হয়?" },
        a: {
          en: "You get 10 points per row of your furthest progress, plus 20 per near miss multiplied by x2, x3 or x4 as the combo grows. In the distance stat each row counts as 3 metres.",
          bn: "সবচেয়ে দূরে যতগুলো সারি গেছেন, প্রতিটার জন্য ১০ পয়েন্ট; সাথে প্রতিটা নিয়ার মিসে ২০, কম্বো বাড়লে x2, x3 বা x4 দিয়ে গুণ। দূরত্বের হিসাবে প্রতিটা সারি ৩ মিটার।",
        },
      },
      {
        q: { en: "What is Dhaka Mode?", bn: "ঢাকা মোড কী?" },
        a: {
          en: "From level 3 on, Dhaka Mode can strike: for 9 seconds traffic moves 1.5× faster, the screen creeps faster and events arrive twice as often. Other events bring surprise U-turns, buses stopping mid-road, rain, sudden CNGs and dogs.",
          bn: "লেভেল ৩ থেকে ঢাকা মোড আসতে পারে: ৯ সেকেন্ড ধরে গাড়ি দেড়গুণ জোরে চলে, স্ক্রিন দ্রুত এগোয়, ইভেন্টও আসে দ্বিগুণ ঘনঘন। অন্য ইভেন্টে আছে হঠাৎ ইউ-টার্ন, রাস্তার মাঝে থামা বাস, বৃষ্টি, আচমকা সিএনজি আর কুকুর।",
        },
      },
      {
        q: { en: "How do the levels work?", bn: "লেভেলগুলো কীভাবে কাজ করে?" },
        a: {
          en: "Every 20 rows is a new level with its own name, starting with “Gully Warm-up”. Higher levels bring faster traffic, more roads in a row (never more than 4), more buses and bikes, and a quicker-creeping screen.",
          bn: "প্রতি ২০ সারিতে নতুন লেভেল, প্রতিটার আলাদা নাম — শুরু “গলির ওয়ার্ম-আপ” দিয়ে। লেভেল বাড়লে গাড়ি জোরে চলে, পরপর রাস্তা বাড়ে (তবে ৪টার বেশি না), বাস-বাইক বেশি আসে, আর স্ক্রিনও দ্রুত এগোয়।",
        },
      },
    ],
  },

  "g:traffic-controller": {
    steps: [
      {
        en: "Press “START SHIFT” to take over a four-way junction where traffic keeps left, with one light for each side.",
        bn: "“ডিউটি শুরু” চাপুন — চার রাস্তার এক মোড়ের দায়িত্ব আপনার, গাড়ি চলে বাঁ দিক দিয়ে, প্রতিটা দিকের জন্য আলাদা লাইট।",
      },
      {
        en: "Tap a light to switch it between green and red. Keys: arrows or WASD toggle each side; Space or the ⇄ button flips every light.",
        bn: "লাইটে ট্যাপ করে সবুজ-লাল বদলান। কিবোর্ডে অ্যারো বা WASD দিয়ে প্রতিটা দিক বদলায়; Space বা ⇄ বোতাম সব লাইট একসাথে উল্টে দেয়।",
      },
      {
        en: "Never let north–south and east–west traffic into the middle together: two crossing vehicles touching in the box is a crash.",
        bn: "উত্তর-দক্ষিণ আর পূর্ব-পশ্চিমের গাড়ি যেন একসাথে মাঝখানে না ঢোকে: মোড়ের মাঝে আড়াআড়ি দুই গাড়ি ছুঁলেই ধাক্কা।",
      },
      {
        en: "Keep the queues short too. If congestion sits at 100% for 2.5 seconds, the junction locks up and your shift ends.",
        bn: "লাইনও ছোট রাখতে হবে। জ্যাম ১০০%-এ ২.৫ সেকেন্ড আটকে থাকলে পুরো মোড় অচল, ডিউটিও শেষ।",
      },
      {
        en: "Survive the 60-second shift for a bonus. The result shows vehicles handled, longest flow, chaos level and time on duty.",
        bn: "৬০ সেকেন্ডের ডিউটি টিকলে বোনাস। ফলাফলে দেখবেন কতগুলো গাড়ি পার করালেন, সবচেয়ে লম্বা ফ্লো, হট্টগোল লেভেল আর কতক্ষণ ডিউটিতে ছিলেন।",
      },
    ],
    tips: [
      {
        en: "Opposite sides never hit each other, so run north + south green together, then east + west. With that set up, one Space swaps the whole junction.",
        bn: "মুখোমুখি দুই দিকের গাড়ি কখনো ধাক্কা খায় না, তাই উত্তর+দক্ষিণ একসাথে সবুজ রাখুন, তারপর পূর্ব+পশ্চিম। এভাবে সাজালে একবার Space চাপলেই পুরো মোড় বদলে যায়।",
      },
      {
        en: "Swap before anyone waits too long. A driver stuck over 6 seconds starts honking, and that, or congestion of 70% or more, resets your flow.",
        bn: "কেউ বেশিক্ষণ দাঁড়িয়ে থাকার আগেই দিক বদলান। ৬ সেকেন্ডের বেশি আটকে থাকলে হর্ন শুরু, আর সেটা বা ৭০% বা তার বেশি জ্যাম হলেই ফ্লো আবার শূন্য থেকে।",
      },
      {
        en: "Read the event banners: a VIP car ignores red, and crossing pedestrians hold one side still for a few seconds even on green.",
        bn: "ইভেন্ট ব্যানার পড়ুন: ভিআইপি গাড়ি লাল মানে না, আর পথচারী পার হওয়ার সময় সবুজ থাকলেও এক দিক কয়েক সেকেন্ড থেমে থাকে।",
      },
    ],
    faq: [
      {
        q: { en: "How is the traffic control score worked out?", bn: "ট্রাফিক কন্ট্রোল স্কোর কীভাবে হিসাব হয়?" },
        a: {
          en: "Each vehicle that leaves the junction earns 10 points times your flow multiplier: x1.5 at 5 in a row, then x2, x3 and x4 at 10, 20 and 35. Finishing the shift adds 300, plus more the emptier your queues are at the end.",
          bn: "মোড় পার হয়ে যাওয়া প্রতিটা গাড়িতে ১০ পয়েন্ট, ফ্লো মাল্টিপ্লায়ার দিয়ে গুণ: টানা ৫টায় x1.5, তারপর ১০, ২০ আর ৩৫-এ x2, x3, x4। ডিউটি শেষ করতে পারলে ৩০০ বাড়তি, আর শেষে লাইন যত ফাঁকা, তত বেশি।",
        },
      },
      {
        q: { en: "What do the junction events do?", bn: "মোড়ের ইভেন্টগুলো কী করে?" },
        a: {
          en: "A VIP car runs the red, a bus stops in its lane to load, a rickshaw parks at the line, a car U-turns in the middle, pedestrians hold up one side, rain slows everyone, and a rush sends vehicles from all four sides at once.",
          bn: "ভিআইপি গাড়ি লাল লাইট পেরিয়ে যায়, বাস লেনেই থেমে যাত্রী তোলে, রিকশা লাইনে দাঁড়িয়ে যায়, কেউ মাঝখানে ইউ-টার্ন নেয়, পথচারী এক দিক আটকে রাখে, বৃষ্টিতে সব ধীর হয়, আর রাশে চার দিক থেকে একসাথে গাড়ি আসে।",
        },
      },
      {
        q: { en: "What is the chaos level on my result?", bn: "ফলাফলের হট্টগোল লেভেল কী?" },
        a: {
          en: "It reflects how many events hit your shift and how high congestion peaked. It doesn’t change your score; it just shows how wild that shift was.",
          bn: "আপনার ডিউটিতে কতগুলো ইভেন্ট এসেছিল আর জ্যাম সর্বোচ্চ কতটা উঠেছিল, তা থেকে এটা হিসাব হয়। স্কোরে এর কোনো প্রভাব নেই — শুধু দেখায় ডিউটিটা কতটা এলোমেলো ছিল।",
        },
      },
    ],
  },

  "g:traffic-boss": {
    steps: [
      {
        en: "Open /boss to meet this week’s boss, the Dhaka Traffic Boss, and press “⚔️ FIGHT THE BOSS”.",
        bn: "/boss খুলে এই সপ্তাহের বস — ঢাকা ট্রাফিক বস — এর সামনে দাঁড়ান, তারপর “⚔️ বসের সাথে লড়ুন” চাপুন।",
      },
      {
        en: "Ride a bike across five lanes. Dodge with the ◀ ▶ buttons, a swipe, a tap on either half of the road, or ← → / A D.",
        bn: "পাঁচ লেনের রাস্তায় বাইক চালান। এড়াতে ◀ ▶ বোতাম, সোয়াইপ, রাস্তার বাঁ বা ডান অর্ধেকে ট্যাপ, অথবা ← → / A D ব্যবহার করুন।",
      },
      {
        en: "You have 3 lives. A hit takes one and gives you a short shield; lose all three and the boss wins.",
        bn: "আপনার ৩টা জীবন। প্রতি ধাক্কায় একটা যায়, বদলে অল্প সময়ের শিল্ড পান; তিনটাই গেলে বস জিতে যায়।",
      },
      {
        en: "Hold on for 60 seconds through three phases (Morning Jam, Rush Hour, Total Hottogol) while the boss’s HP drains to zero.",
        bn: "তিনটা পর্যায় — সকালের যানজট, অফিস ছুটির ভিড়, সম্পূর্ণ হট্টগোল — পেরিয়ে ৬০ সেকেন্ড টিকে থাকুন, ততক্ষণে বসের এইচপি শূন্যে নামবে।",
      },
      {
        en: "The result shows win or loss, score, rank and hits. Retry as often as you like that week, or send a friend a challenge link.",
        bn: "ফলাফলে দেখবেন জিতলেন কি না, স্কোর, র‍্যাঙ্ক আর কতবার ধাক্কা খেলেন। সপ্তাহজুড়ে যতবার খুশি আবার লড়ুন, বা বন্ধুকে চ্যালেঞ্জ লিংক পাঠান।",
      },
    ],
    tips: [
      {
        en: "A CNG that starts blinking is about to swerve one lane. Clear the lanes beside it before it moves, not after.",
        bn: "যে সিএনজির ইন্ডিকেটর জ্বলছে, সেটা এক লেন সরে আসবে। ওটা সরার আগেই পাশের লেনগুলো থেকে সরে যান, পরে নয়।",
      },
      {
        en: "During rain the road runs faster and your bike changes lanes more slowly, so start every move earlier than feels natural.",
        bn: "বৃষ্টিতে রাস্তা জোরে ছোটে আর বাইক লেন বদলায় ধীরে, তাই প্রতিটা সরে যাওয়া স্বাভাবিকের চেয়ে একটু আগে শুরু করুন।",
      },
      {
        en: "Lives left are worth 300 points each when you win, so a clean, careful fight often beats chasing risky near misses.",
        bn: "জিতলে বাকি থাকা প্রতিটা জীবনের জন্য ৩০০ পয়েন্ট, তাই ঝুঁকিপূর্ণ নিয়ার মিসের পেছনে না ছুটে সাবধানে লড়াই অনেক সময় বেশি লাভের।",
      },
    ],
    faq: [
      {
        q: { en: "What makes it a weekly boss?", bn: "এটাকে সাপ্তাহিক বস বলা হয় কেন?" },
        a: {
          en: "Each Bangladesh week, starting Saturday, the boss gets a new seed, so everyone faces the same traffic all week. Your weekly best, attempts and whether you beat it are saved on this device only; there is no global leaderboard.",
          bn: "বাংলাদেশ সময়ে প্রতি শনিবার থেকে নতুন সপ্তাহ, বসও পায় নতুন সিড — তাই পুরো সপ্তাহ সবাই একই ট্রাফিকের মুখোমুখি। সপ্তাহের সেরা স্কোর, প্রচেষ্টা আর বসকে হারিয়েছেন কি না, সব শুধু এই ডিভাইসে থাকে; কোনো গ্লোবাল লিডারবোর্ড নেই।",
        },
      },
      {
        q: { en: "How is the boss score worked out?", bn: "বস স্কোর কীভাবে হিসাব হয়?" },
        a: {
          en: "You earn 25 points per second survived, plus 30 per near miss times a combo multiplier up to x5. Defeating the boss adds 1,000 more, plus 300 for each life you still have.",
          bn: "প্রতি সেকেন্ড টিকে থাকায় ২৫ পয়েন্ট, সাথে প্রতিটা নিয়ার মিসে ৩০ — কম্বো মাল্টিপ্লায়ার দিয়ে গুণ, সর্বোচ্চ x5। বসকে হারালে আরও ১,০০০, আর বাকি থাকা প্রতিটা জীবনে ৩০০।",
        },
      },
      {
        q: { en: "What do the boss ranks mean?", bn: "বসের র‍্যাঙ্কগুলোর মানে কী?" },
        a: {
          en: "Win with all 3 lives and you are a “Boss Slayer”; win with fewer and you are a “Boss Survivor”. Go down after 40 seconds and it’s “Almost Had It”; earlier than that, you were a “Boss Snack”.",
          bn: "৩টা জীবন নিয়েই জিতলে “বস শিকারি”, কম জীবন নিয়ে জিতলে “বস সারভাইভার”। ৪০ সেকেন্ডের পর হারলে “প্রায় হয়ে গিয়েছিল”, তার আগে হারলে আপনি “বসের নাস্তা”।",
        },
      },
    ],
  },
};
