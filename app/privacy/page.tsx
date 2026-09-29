import type { Metadata } from "next";
import { PageShell } from "@/components/ui/page-shell";
import { getGaId } from "@/lib/analytics";
import { getI18n } from "@/lib/i18n/server";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `What ${siteConfig.name} collects (very little) and why.`,
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const { lang, d } = await getI18n();
  const analyticsOn = getGaId() !== null;
  const email = siteConfig.contactEmail;

  if (lang === "bn") {
    return (
      <PageShell emoji="🔒" title={d.footerPrivacy} intro="সংক্ষেপে: কোনো অ্যাকাউন্ট নেই, নাম নেই, ইমেইল নেই, আপনি কে তা ট্র্যাক করা হয় না।">
        <h2>যা আমরা সংগ্রহ করি না</h2>
        <ul>
          <li>কোনো অ্যাকাউন্ট, লগইন বা পাসওয়ার্ড নেই।</li>
          <li>আমরা আপনার নাম, ইমেইল, ফোন নম্বর বা সঠিক লোকেশন চাই না।</li>
          <li>খেলা শেষ না হওয়া পর্যন্ত আপনার সিদ্ধান্তগুলো আপনার ব্রাউজারেই থাকে।</li>
        </ul>
        <h2>শেয়ার লিংক</h2>
        <p>
          খেলা শেষ হলে আপনার ফলাফলের নিজস্ব একটা লিংক তৈরি হয়। লিংকটিতে আপনার সিদ্ধান্ত আর ফলাফল থাকে (যেমন গন্তব্য আর
          আপনার অফার করা ভাড়া), যাতে যে-ই খুলুক সে একই ফলাফল দেখে। এতে আপনার সম্পর্কে কিছু থাকে না। অন্যরা এগুলো দেখুক
          এতে আপত্তি না থাকলে তবেই শেয়ার করুন।
        </p>
        <h2>অ্যানালিটিক্স</h2>
        {analyticsOn ? (
          <>
            <p>
              কোন খেলা মানুষ খেলছে, শেষ করছে আর শেয়ার করছে তা বুঝতে আমরা Google Analytics 4 ব্যবহার করি। এটি দেখা পেজ, আনুমানিক
              অঞ্চল, ডিভাইসের ধরন আর &quot;খেলা শেষ&quot;-এর মতো ইভেন্ট রেকর্ড করে। ভিজিট গোনার জন্য এটি কুকি (যেমন{" "}
              <code>_ga</code>) ব্যবহার করে। বিজ্ঞাপন সংক্রান্ত ফিচার বন্ধ রাখা আছে।
            </p>
            <p>
              Google এই ডেটা তাদের নিজস্ব নীতিমালা অনুযায়ী প্রসেস করে। ব্রাউজার এক্সটেনশন বা Google-এর অপ্ট-আউট অ্যাড-অন দিয়ে
              এটি ব্লক করতে পারেন; তাতেও সাইট ঠিক একইভাবে চলবে।
            </p>
          </>
        ) : (
          <p>অ্যানালিটিক্স এখন বন্ধ আছে। চালু হলে আগে এই পেজ আপডেট করা হবে।</p>
        )}
        <h2>ভাষা</h2>
        <p>আপনার বেছে নেওয়া ভাষা মনে রাখতে আমরা একটা ছোট কুকি (<code>lang</code>) রাখি। এতে আর কিছু থাকে না।</p>
        <h2>হোস্টিং</h2>
        <p>যেকোনো ওয়েবসাইটের মতো, নিরাপত্তা ও নির্ভরযোগ্যতার জন্য আমাদের হোস্টিং প্রোভাইডার সাধারণ সার্ভার লগ (যেমন IP ঠিকানা ও ব্রাউজারের ধরন) রাখতে পারে।</p>
        <h2>পরিবর্তন ও যোগাযোগ</h2>
        <p>এই নীতিমালা বদলালে আমরা এই পেজ আপডেট করব।</p>
        {email && (
          <p>
            প্রশ্ন থাকলে: <a href={`mailto:${email}`}>{email}</a>
          </p>
        )}
      </PageShell>
    );
  }

  return (
    <PageShell emoji="🔒" title={d.footerPrivacy} intro="Short version: no accounts, no names, no emails, no tracking of who you are.">
      <h2>What we don&apos;t collect</h2>
      <ul>
        <li>No accounts, logins or passwords.</li>
        <li>We don&apos;t ask for your name, email, phone number or precise location.</li>
        <li>Your choices in an experience stay in your browser until you finish.</li>
      </ul>
      <h2>Share links</h2>
      <p>
        When you finish an experience, your result gets its own link. That link contains your choices and the ending (for
        example your destination and the fare you offered) so anyone who opens it sees the same result. It contains
        nothing about you. Only share it if you&apos;re happy for others to see those choices.
      </p>
      <h2>Analytics</h2>
      {analyticsOn ? (
        <>
          <p>
            We use Google Analytics 4 to understand which experiences people play, finish and share. It records things
            like pages viewed, approximate region, device type and events such as &quot;experience completed&quot;. It
            uses cookies (such as <code>_ga</code>) to count visits. Advertising features are turned off.
          </p>
          <p>
            Google processes this data under its own policies. You can block it with a browser extension or Google&apos;s
            opt-out add-on; the site works exactly the same without it.
          </p>
        </>
      ) : (
        <p>Analytics are currently turned off. If that changes, this page will be updated first.</p>
      )}
      <h2>Language</h2>
      <p>We store one small cookie (<code>lang</code>) to remember your language choice. It contains nothing else.</p>
      <h2>Hosting</h2>
      <p>
        Like any website, our hosting provider may keep standard server logs (such as IP address and browser type) for
        security and reliability.
      </p>
      <h2>Changes and contact</h2>
      <p>If this policy changes, we&apos;ll update this page.</p>
      {email && (
        <p>
          Questions: <a href={`mailto:${email}`}>{email}</a>
        </p>
      )}
    </PageShell>
  );
}
