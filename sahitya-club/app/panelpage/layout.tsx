import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Internal Panel Sign-in | Willes Literary Club",
  description: "Legacy internal sign-in route. Use the protected MemberHub portal.",
  robots: { index: false, follow: false },
};

export default function LegacyPanelLayout({ children }: { children: ReactNode }) {
  return children;
}
