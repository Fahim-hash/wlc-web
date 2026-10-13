"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteChromeController() {
  const pathname = usePathname();

  useEffect(() => {
    const isTelegramApp = pathname === "/telegram-app";
    document.body.classList.toggle("telegram-mini-app", isTelegramApp);
    return () => document.body.classList.remove("telegram-mini-app");
  }, [pathname]);

  return null;
}
