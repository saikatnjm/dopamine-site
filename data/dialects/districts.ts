import type { District } from "@/lib/dialects/types";

// All 64 districts of Bangladesh (official spellings, lowercase ids). Used by
// dialect regions and the map (data/dialects/map.ts has one shape per id).

export const DISTRICTS: readonly District[] = [
  // Dhaka division
  { id: "dhaka", name: { en: "Dhaka", bn: "ঢাকা" } },
  { id: "faridpur", name: { en: "Faridpur", bn: "ফরিদপুর" } },
  { id: "gazipur", name: { en: "Gazipur", bn: "গাজীপুর" } },
  { id: "gopalganj", name: { en: "Gopalganj", bn: "গোপালগঞ্জ" } },
  { id: "kishoreganj", name: { en: "Kishoreganj", bn: "কিশোরগঞ্জ" } },
  { id: "madaripur", name: { en: "Madaripur", bn: "মাদারীপুর" } },
  { id: "manikganj", name: { en: "Manikganj", bn: "মানিকগঞ্জ" } },
  { id: "munshiganj", name: { en: "Munshiganj", bn: "মুন্সীগঞ্জ" } },
  { id: "narayanganj", name: { en: "Narayanganj", bn: "নারায়ণগঞ্জ" } },
  { id: "narsingdi", name: { en: "Narsingdi", bn: "নরসিংদী" } },
  { id: "rajbari", name: { en: "Rajbari", bn: "রাজবাড়ী" } },
  { id: "shariatpur", name: { en: "Shariatpur", bn: "শরীয়তপুর" } },
  { id: "tangail", name: { en: "Tangail", bn: "টাঙ্গাইল" } },
  // Mymensingh division
  { id: "mymensingh", name: { en: "Mymensingh", bn: "ময়মনসিংহ" } },
  { id: "jamalpur", name: { en: "Jamalpur", bn: "জামালপুর" } },
  { id: "netrokona", name: { en: "Netrokona", bn: "নেত্রকোণা" } },
  { id: "sherpur", name: { en: "Sherpur", bn: "শেরপুর" } },
  // Chattogram division
  { id: "chattogram", name: { en: "Chattogram", bn: "চট্টগ্রাম" } },
  { id: "coxsbazar", name: { en: "Cox's Bazar", bn: "কক্সবাজার" } },
  { id: "cumilla", name: { en: "Cumilla", bn: "কুমিল্লা" } },
  { id: "brahmanbaria", name: { en: "Brahmanbaria", bn: "ব্রাহ্মণবাড়িয়া" } },
  { id: "chandpur", name: { en: "Chandpur", bn: "চাঁদপুর" } },
  { id: "feni", name: { en: "Feni", bn: "ফেনী" } },
  { id: "lakshmipur", name: { en: "Lakshmipur", bn: "লক্ষ্মীপুর" } },
  { id: "noakhali", name: { en: "Noakhali", bn: "নোয়াখালী" } },
  { id: "rangamati", name: { en: "Rangamati", bn: "রাঙ্গামাটি" } },
  { id: "khagrachhari", name: { en: "Khagrachhari", bn: "খাগড়াছড়ি" } },
  { id: "bandarban", name: { en: "Bandarban", bn: "বান্দরবান" } },
  // Khulna division
  { id: "khulna", name: { en: "Khulna", bn: "খুলনা" } },
  { id: "bagerhat", name: { en: "Bagerhat", bn: "বাগেরহাট" } },
  { id: "chuadanga", name: { en: "Chuadanga", bn: "চুয়াডাঙ্গা" } },
  { id: "jashore", name: { en: "Jashore", bn: "যশোর" } },
  { id: "jhenaidah", name: { en: "Jhenaidah", bn: "ঝিনাইদহ" } },
  { id: "kushtia", name: { en: "Kushtia", bn: "কুষ্টিয়া" } },
  { id: "magura", name: { en: "Magura", bn: "মাগুরা" } },
  { id: "meherpur", name: { en: "Meherpur", bn: "মেহেরপুর" } },
  { id: "narail", name: { en: "Narail", bn: "নড়াইল" } },
  { id: "satkhira", name: { en: "Satkhira", bn: "সাতক্ষীরা" } },
  // Barishal division
  { id: "barishal", name: { en: "Barishal", bn: "বরিশাল" } },
  { id: "barguna", name: { en: "Barguna", bn: "বরগুনা" } },
  { id: "bhola", name: { en: "Bhola", bn: "ভোলা" } },
  { id: "jhalokati", name: { en: "Jhalokati", bn: "ঝালকাঠি" } },
  { id: "patuakhali", name: { en: "Patuakhali", bn: "পটুয়াখালী" } },
  { id: "pirojpur", name: { en: "Pirojpur", bn: "পিরোজপুর" } },
  // Sylhet division
  { id: "sylhet", name: { en: "Sylhet", bn: "সিলেট" } },
  { id: "habiganj", name: { en: "Habiganj", bn: "হবিগঞ্জ" } },
  { id: "moulvibazar", name: { en: "Moulvibazar", bn: "মৌলভীবাজার" } },
  { id: "sunamganj", name: { en: "Sunamganj", bn: "সুনামগঞ্জ" } },
  // Rangpur division
  { id: "rangpur", name: { en: "Rangpur", bn: "রংপুর" } },
  { id: "dinajpur", name: { en: "Dinajpur", bn: "দিনাজপুর" } },
  { id: "gaibandha", name: { en: "Gaibandha", bn: "গাইবান্ধা" } },
  { id: "kurigram", name: { en: "Kurigram", bn: "কুড়িগ্রাম" } },
  { id: "lalmonirhat", name: { en: "Lalmonirhat", bn: "লালমনিরহাট" } },
  { id: "nilphamari", name: { en: "Nilphamari", bn: "নীলফামারী" } },
  { id: "panchagarh", name: { en: "Panchagarh", bn: "পঞ্চগড়" } },
  { id: "thakurgaon", name: { en: "Thakurgaon", bn: "ঠাকুরগাঁও" } },
  // Rajshahi division
  { id: "rajshahi", name: { en: "Rajshahi", bn: "রাজশাহী" } },
  { id: "bogura", name: { en: "Bogura", bn: "বগুড়া" } },
  { id: "chapainawabganj", name: { en: "Chapainawabganj", bn: "চাঁপাইনবাবগঞ্জ" } },
  { id: "joypurhat", name: { en: "Joypurhat", bn: "জয়পুরহাট" } },
  { id: "naogaon", name: { en: "Naogaon", bn: "নওগাঁ" } },
  { id: "natore", name: { en: "Natore", bn: "নাটোর" } },
  { id: "pabna", name: { en: "Pabna", bn: "পাবনা" } },
  { id: "sirajganj", name: { en: "Sirajganj", bn: "সিরাজগঞ্জ" } },
];
