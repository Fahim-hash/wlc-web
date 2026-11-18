"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteChromeController() {
  const pathname = usePathname();

  useEffect(() => {
    const isTelegramApp = pathname === "/telegram-app";
    const isMaintenancePage = pathname === "/maintenance";

    document.body.classList.toggle("telegram-mini-app", isTelegramApp);
    document.body.classList.toggle("maintenance-page", isMaintenancePage);

    return () => {
      document.body.classList.remove("telegram-mini-app", "maintenance-page");
    };
  }, [pathname]);

  return null;
}
