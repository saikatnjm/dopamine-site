import type { Accent } from "@/components/ui/styles";
import type { CategorySlug } from "@/lib/experience/types";
import type { Text } from "@/lib/i18n/core";

// Teasers for experiences in the oven. Not playable, not in the sitemap.
export type UpcomingExperience = {
  id: string;
  title: Text;
  emoji: string;
  teaser: Text;
  category: CategorySlug;
  accent: Accent;
};

export const upcoming: UpcomingExperience[] = [
  { id: "food-delivery", emoji: "🍔", category: "food", accent: "tangerine", title: { en: "Food Delivery Simulator", bn: "ফুড ডেলিভারি সিমুলেটর" }, teaser: { en: "Your rider is 2 minutes away. For 3 hours.", bn: "রাইডার ২ মিনিট দূরে। ৩ ঘণ্টা ধরে।" } },
  { id: "dhaka-bus", emoji: "🚌", category: "bangladesh", accent: "sky", title: { en: "Dhaka Bus Simulator", bn: "ঢাকা বাস সিমুলেটর" }, teaser: { en: "Board a moving bus. Mind the gap. There is no gap.", bn: "চলন্ত বাসে উঠুন। ফাঁক খেয়াল করুন। ফাঁক নেই।" } },
  { id: "resignation", emoji: "💼", category: "work", accent: "violet", title: { en: "Job Resignation Simulator", bn: "চাকরি ছাড়ার সিমুলেটর" }, teaser: { en: "Quit dramatically. Your boss replies \"ok\".", bn: "নাটকীয়ভাবে রিজাইন দিন। বস লিখলেন \"ok\"।" } },
  { id: "shopping", emoji: "🛍️", category: "shopping", accent: "chili", title: { en: "Fake Shopping Spree", bn: "ফেক শপিং" }, teaser: { en: "Add everything to cart. Pay with vibes.", bn: "সবকিছু কার্টে তুলুন। পেমেন্ট করুন ভাইব দিয়ে।" } },
  { id: "house-rent", emoji: "🏠", category: "bangladesh", accent: "lime", title: { en: "House Rent Simulator", bn: "বাসা ভাড়া সিমুলেটর" }, teaser: { en: "Landlord interview: are you married? Do you breathe?", bn: "বাড়িওয়ালার ইন্টারভিউ: বিবাহিত? শ্বাস নেন?" } },
  { id: "life-decision", emoji: "🎲", category: "random", accent: "marigold", title: { en: "Random Life Decision", bn: "র‍্যান্ডম লাইফ ডিসিশন" }, teaser: { en: "Let the dice pick your career. What could go wrong?", bn: "ক্যারিয়ার ছক্কা দিয়ে ঠিক করুন। কী আর খারাপ হবে?" } },
];
