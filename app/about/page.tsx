import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";
import { getI18n } from "@/lib/i18n/server";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `What ${siteConfig.name} is, who makes it, and how to get in touch.`,
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const { lang, d } = await getI18n();
  const email = siteConfig.contactEmail;
  const mail = email && <a href={`mailto:${email}`}>{email}</a>;

  if (lang === "bn") {
    return (
      <PageShell emoji="🧠" title={d.footerAbout} intro={d.tagline}>
        <h2>এটা কী?</h2>
        <p>
          {siteConfig.name} হলো প্রতিদিনের হট্টগোল নিয়ে ছোট্ট ছোট্ট ইন্টারঅ্যাকটিভ সিমুলেটরের সংগ্রহ। প্রতিটা মাত্র এক
          মিনিটের, কোনো অ্যাকাউন্ট লাগে না, আর শেষটা হয় অপ্রত্যাশিত — সাধারণত আপনি যেখানে যেতে চেয়েছিলেন সেখানে না।
        </p>
        <p>
          প্রতিটা শেষ ঠিক হয় আপনার সিদ্ধান্ত আর একটু র‍্যান্ডমনেস দিয়ে, তাই ফলাফল শেয়ার করলে আপনার বন্ধু ঠিক একই জিনিস
          দেখবে। তারপর ও হারানোর চেষ্টা করবে। সাধারণত পারে না।
        </p>
        <h2>এর কিছু কি সত্যি?</h2>
        <p>
          না। এখানকার সবকিছু কাল্পনিক, মজা করা হয়েছে পরিস্থিতি নিয়ে — কোনো মানুষকে নিয়ে না। কোনো সিএনজি ড্রাইভার যদি
          সত্যিই মিটারে যেতে রাজি হন, আমরা জানতে চাই।
        </p>
        <h2 id="contact">যোগাযোগ</h2>
        {mail ? <p>আইডিয়া, বাগ, বা নতুন সিমুলেটরের অনুরোধ? ইমেইল করুন: {mail}</p> : <p>যোগাযোগের ঠিকানা শিগগিরই আসছে।</p>}
        <p>
          এখনই কিছু করতে চান? <Link href="/experiences">একটা খেলা বেছে নিন</Link>।
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell emoji="🧠" title={d.footerAbout} intro={d.tagline}>
      <h2>What is this?</h2>
      <p>
        {siteConfig.name} is a collection of tiny interactive simulators about everyday chaos. Each one takes about a
        minute, needs no account, and ends somewhere unexpected — usually not where you wanted to go.
      </p>
      <p>
        Every ending is decided by your choices plus a bit of seeded randomness, so when you share a result, your friend
        sees exactly what you got. Then they try to beat it. They usually can&apos;t.
      </p>
      <h2>Is any of this real?</h2>
      <p>
        No. Everything here is fiction and comedy about situations, not about real people. If a CNG driver ever agreed to
        go by meter, we would like to hear about it.
      </p>
      <h2 id="contact">Contact</h2>
      {mail ? <p>Ideas, bugs, or a simulator you want to see? Email {mail}.</p> : <p>A contact address is coming soon.</p>}
      <p>
        Want something to do right now? <Link href="/experiences">Pick an experience</Link>.
      </p>
    </PageShell>
  );
}
