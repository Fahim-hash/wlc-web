import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Reserved",
  description: "Reserved utility page.",
  robots: { index: false, follow: false },
};

export default function ReserveLayout({ children }: { children: ReactNode }) {
  return children;
}
