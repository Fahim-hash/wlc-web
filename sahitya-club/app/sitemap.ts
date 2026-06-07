// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://wlc.pro.bd'; // তোমার অরিজিনাল ডোমেইন বা ভার্সেল লিংক

  // তোমার সাইটের সব কটি সচল রাউটের লিস্ট
  const routes = ['', '/about', '/nobinboron', '/panel', '/panel/moderator', '/panel/GEN-1', '/panel/running'];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0], // আজকের ডেট জেনারেট করবে
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8, // হোমপেজকে সর্বোচ্চ প্রায়োরিটি (১.০) দেওয়া হয়েছে
  }));
}
