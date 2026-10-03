// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/memberhub"],
    },
    sitemap: "https://wlc.pro.bd/sitemap.xml",
  };
}
