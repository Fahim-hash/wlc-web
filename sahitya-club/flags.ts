import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

/**
 * Central WLC feature flags.
 *
 * Keep operationally sensitive features disabled by default. Flags are
 * evaluated on the server and never expose provider credentials to clients.
 */
export const maintenanceMode = flag<boolean>({
  key: "maintenance_mode",
  description: "Temporarily redirect the public WLC website to the maintenance page.",
  defaultValue: false,
  options: [
    { value: false, label: "Disabled" },
    { value: true, label: "Enabled" },
  ],
  adapter: vercelAdapter,
});

export const memberPdfExport = flag<boolean>({
  key: "member_pdf_export",
  description: "Enable member PDF export features where implemented.",
  defaultValue: false,
  options: [
    { value: false, label: "Disabled" },
    { value: true, label: "Enabled" },
  ],
  adapter: vercelAdapter,
});

export const telegramAdvancedAdmin = flag<boolean>({
  key: "telegram_advanced_admin",
  description: "Enable advanced Telegram admin features where implemented.",
  defaultValue: false,
  options: [
    { value: false, label: "Disabled" },
    { value: true, label: "Enabled" },
  ],
  adapter: vercelAdapter,
});
