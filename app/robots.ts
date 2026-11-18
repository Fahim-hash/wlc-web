import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/memberhub",
          "/member-portal",
          "/telegram-app",
          "/upload",
          "/reserve",
          "/maintenance",
        ],
      },
    ],
    sitemap: "https://wlc.pro.bd/sitemap.xml",
  };
}
