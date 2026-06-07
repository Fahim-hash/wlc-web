// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'], // যদি কোনো গোপন বা প্যানেল পেজ ক্রল করাতে না চাও
    },
    sitemap: 'https://wlc.pro.bd', // তোমার লাইভ ইউআরএলটি এখানে দেবে
  };
}
