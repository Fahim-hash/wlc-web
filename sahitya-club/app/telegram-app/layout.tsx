import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "WLC Attendance App",
  description: "Internal attendance and club management mini app.",
  robots: { index: false, follow: false },
};

export default function TelegramAppLayout({ children }: { children: ReactNode }) {
  return children;
}
