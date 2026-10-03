"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "wlc-global-push-status";
const SW_PATH = "/wlc-push-sw.js";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default function GlobalPushPrompt() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      return;
    }

    if (localStorage.getItem(STORAGE_KEY) === "enabled") return;
    if (Notification.permission === "denied") return;

    const timer = window.setTimeout(() => setVisible(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  async function enableNotifications() {
    if (busy) return;
    setBusy(true);

    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setVisible(false);
        return;
      }

      const configResponse = await fetch("/api/push/config", { cache: "no-store" });
      const config = await configResponse.json();

      if (!config?.enabled || !config?.publicKey) {
        throw new Error("Push service is not configured.");
      }

      const registration = await navigator.serviceWorker.register(SW_PATH, {
        scope: "/",
      });

      await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(config.publicKey),
        });
      }

      const saveResponse = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      });

      if (!saveResponse.ok) {
        throw new Error("Subscription could not be saved.");
      }

      localStorage.setItem(STORAGE_KEY, "enabled");
      setVisible(false);
    } catch (error) {
      console.error("WLC push setup failed:", error);
    } finally {
      setBusy(false);
    }
  }

  if (!visible) return null;

  return (
    <aside
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:w-[360px] z-[100] rounded-2xl border border-stone-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl"
      aria-label="WLC notifications"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-950 text-white">
          🔔
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-stone-950">উইল্‌স সাহিত্য ক্লাবের আপডেট পেতে চান?</p>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            গুরুত্বপূর্ণ ঘোষণা ও ইভেন্ট আপডেট সরাসরি আপনার ব্রাউজারে পেতে
            notifications চালু করুন।
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={enableNotifications}
              disabled={busy}
              className="rounded-xl bg-stone-950 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-stone-800 disabled:cursor-wait disabled:opacity-60"
            >
              {busy ? "চালু হচ্ছে..." : "Notifications চালু করুন"}
            </button>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-stone-500 hover:bg-stone-100"
            >
              এখন নয়
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
