"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteChromeController() {
  const pathname = usePathname();

  useEffect(() => {
    const isTelegramApp = pathname === "/telegram-app";
    const isMaintenancePage = pathname === "/maintenance";
    const isTicketingPlatform = pathname === "/ticketing" || pathname.startsWith("/ticketing/") || pathname === "/memberhub/ticketing";

    document.body.classList.toggle("telegram-mini-app", isTelegramApp);
    document.body.classList.toggle("maintenance-page", isMaintenancePage);
    document.body.classList.toggle("ticketing-platform", isTicketingPlatform);

    return () => {
      document.body.classList.remove("telegram-mini-app", "maintenance-page", "ticketing-platform");
    };
  }, [pathname]);

  return null;
}
