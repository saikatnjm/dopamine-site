import type { Metadata } from "next";
import { PageShell } from "@/components/ui/page-shell";
import { getI18n } from "@/lib/i18n/server";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `The simple rules for using ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const { lang, d } = await getI18n();

  if (lang === "bn") {
    return (
      <PageShell emoji="📜" title={d.footerTerms} intro="সহজ কিছু নিয়ম। পড়তে লাগবে ঢাকার একটা সিগন্যালের চেয়েও কম সময়।">
        <h2>এটা শুধু বিনোদন</h2>
        <p>
          {siteConfig.name}-এর সবকিছু কাল্পনিক আর মজার জন্য। ফলাফলগুলো র‍্যান্ডম কৌতুক — কোনো ভবিষ্যদ্বাণী, পরামর্শ বা
          বাস্তব কোনো মানুষ, প্রতিষ্ঠান বা জায়গা সম্পর্কে বক্তব্য নয়।
        </p>
        <h2>সাইট ব্যবহার</h2>
        <ul>
          <li>খেলা আর শেয়ার করা ফ্রি। কোনো অ্যাকাউন্ট লাগে না।</li>
          <li>সাইট ভাঙা, ওভারলোড করা বা অপব্যবহারের চেষ্টা করবেন না।</li>
          <li>শেয়ার করা ফলাফলকে সত্যি ঘটনা হিসেবে উপস্থাপন করবেন না।</li>
        </ul>
        <h2>আমাদের কনটেন্ট</h2>
        <p>সিমুলেটর, লেখা আর ডিজাইন আমাদের। আপনার ফলাফলের লিংক আর স্ক্রিনশট শেয়ার করা খুবই স্বাগত।</p>
        <h2>কোনো গ্যারান্টি নেই</h2>
        <p>
          সাইটটি যেমন আছে তেমনভাবেই দেওয়া হচ্ছে। আমরা যেকোনো সময় খেলা বদলাতে, বন্ধ রাখতে বা সরিয়ে ফেলতে পারি, আর সাইট সবসময়
          চালু বা ত্রুটিমুক্ত থাকবে এমন প্রতিশ্রুতি দিতে পারি না।
        </p>
        <h2>পরিবর্তন</h2>
        <p>আমরা এই শর্তাবলি আপডেট করতে পারি। সাইট ব্যবহার চালিয়ে যাওয়া মানে আপনি বর্তমান সংস্করণ মেনে নিচ্ছেন।</p>
      </PageShell>
    );
  }

  return (
    <PageShell emoji="📜" title={d.footerTerms} intro="The simple rules. Reading time: less than a Dhaka traffic signal.">
      <h2>It&apos;s entertainment</h2>
      <p>
        Everything on {siteConfig.name} is fictional and for fun. Outcomes are random jokes, not predictions, advice or
        statements about real people, businesses or places.
      </p>
      <h2>Using the site</h2>
      <ul>
        <li>It&apos;s free to play and share. No account needed.</li>
        <li>Don&apos;t try to break, overload or misuse the site.</li>
        <li>Don&apos;t present shared results as real events.</li>
      </ul>
      <h2>Our content</h2>
      <p>The simulators, writing and design are ours. Sharing links and screenshots of your results is very welcome.</p>
      <h2>No guarantees</h2>
      <p>
        The site is provided as is. We may change, pause or remove experiences at any time, and we can&apos;t promise it
        will always be available or error-free.
      </p>
      <h2>Changes</h2>
      <p>We may update these terms. Continuing to use the site means you accept the current version.</p>
    </PageShell>
  );
}
