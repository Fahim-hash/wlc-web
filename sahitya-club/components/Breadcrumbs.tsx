"use client";

import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  about: "আমাদের সম্পর্কে",
  achievements: "অর্জনসমূহ",
  album: "অ্যালবাম",
  contact: "যোগাযোগ",
  contributor: "কনট্রিবিউটর",
  events: "ইভেন্টস",
  faq: "সাধারণ জিজ্ঞাসা",
  kothasokhi: "কথাসখী",
  nobinboron: "নবীনবরণ",
  panel: "প্যানেল আর্কাইভ",
  moderator: "শিক্ষক ও মডারেটর",
  "GEN-1": "জেনারেশন-১",
  "GEN-3": "জেনারেশন-৩",
  running: "চলমান প্যানেল",
  temporary: "অস্থায়ী প্যানেল",
  register: "সদস্য নিবন্ধন",
  shobdo: "বাংলা শব্দকোষ",
  writing: "মুক্ত লেখনী ডেস্ক",
  privacy: "গোপনীয়তা নীতি",
};

const HIDDEN_PREFIXES = [
  "/memberhub",
  "/member-portal",
  "/telegram-app",
  "/upload",
  "/reserve",
  "/maintenance",
  "/api",
];

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === "/" || HIDDEN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"))) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  const items = [{ label: "হোম", url: "/" }];
  let currentPath = "";

  for (const segment of segments) {
    currentPath += "/" + segment;
    const label = labels[segment] ?? decodeURIComponent(segment).replace(/-/g, " ");
    items.push({ label, url: currentPath });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.url, "https://wlc.pro.bd").toString(),
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-6xl px-4 pt-4 text-sm text-stone-500">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => (
            <li key={item.url} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {index === items.length - 1 ? (
                <span aria-current="page" className="font-medium text-stone-800">{item.label}</span>
              ) : (
                <a href={item.url} className="transition-colors hover:text-rose-800">{item.label}</a>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
