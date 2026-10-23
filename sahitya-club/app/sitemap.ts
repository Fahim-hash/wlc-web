import type { MetadataRoute } from "next";

const BASE_URL = "https://wlc.pro.bd";

// Only canonical, public pages belong in the sitemap. Private portals, APIs,
// temporary utility pages and submission flows are intentionally excluded.
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/achievements",
  "/album",
  "/contact",
  "/contributor",
  "/events",
  "/faq",
  "/kothasokhi",
  "/nobinboron",
  "/panel",
  "/panel/moderator",
  "/panel/GEN-1",
  "/panel/GEN-3",
  "/panel/running",
  "/panel/temporary",
  "/register",
  "/shobdo",
  "/writing",
  "/privacy",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: new URL(route, BASE_URL).toString(),
  }));
}
