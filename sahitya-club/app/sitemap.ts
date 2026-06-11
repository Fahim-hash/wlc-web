// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://wlc.pro.bd';

  // আপনার সাইটের সব সচল রাউটের লিস্ট
  const routes = [
    '', 
    '/about',  
    '/register', 
    '/nobinboron', 
    '/panel', 
    '/panel/moderator', 
    '/panel/GEN-1', 
    '/panel/running'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(), // Next.js এটি অটোমেটিক ISO ফরমেটে কনভার্ট করবে
    changeFrequency: route === '' ? 'daily' : 'weekly', // হোমপেজ বেশি আপডেট হয় বলে daily দিতে পারেন
    priority: route === '' ? 1.0 : (route.startsWith('/panel') ? 0.8 : 0.6), // প্যানেল পেজগুলো গুরুত্বপূর্ণ বলে ০.৮
  }));
}
