"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type WlcEvent = { id: string; title: string; date: string };
type MiniAppWindow = Window & {
  Telegram?: { WebApp?: { initData?: string; ready?: () => void; expand?: () => void; close?: () => void; colorScheme?: string; themeParams?: Record<string, string> } };
  BarcodeDetector?: new (options?: { formats?: string[] }) => { detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue?: string }>> };
};

function memberIdFromQr(value: string) {
  const raw = value.trim();
  try {
    const url = new URL(raw);
    return (url.searchParams.get("id") || url.searchParams.get("memberId") || "").trim().toUpperCase();
  } catch {
    return raw.toUpperCase();
  }
}

export default function TelegramAttendanceApp() {
  const [initData, setInitData] = useState("");
  const [events, setEvents] = useState<WlcEvent[]>([]);
  const [eventId, setEventId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberLookupBusy, setMemberLookupBusy] = useState(false);
  const lastScannedRef = useRef("");
  const [status, setStatus] = useState<"PRESENT" | "LATE">("PRESENT");
  const [adminName, setAdminName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Wait for Telegram's WebApp SDK before deciding whether initData is missing.
    let attempts = 0;
    let intervalId: number | undefined;
    let timeoutId: number | undefined;

    const initialize = () => {
      const webApp = (window as MiniAppWindow).Telegram?.WebApp;
      if (!webApp) return false;
      webApp.ready?.();
      webApp.expand?.();
      setInitData(webApp.initData || "");
      if (intervalId !== undefined) window.clearInterval(intervalId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      return true;
    };

    if (initialize()) return;

    intervalId = window.setInterval(() => {
      attempts += 1;
      if (initialize() || attempts >= 30) {
        if (intervalId !== undefined) window.clearInterval(intervalId);
        intervalId = undefined;
      }
    }, 100);

    timeoutId = window.setTimeout(() => {
      if (intervalId !== undefined) window.clearInterval(intervalId);
      intervalId = undefined;
      if (!(window as MiniAppWindow).Telegram?.WebApp) setInitData("");
    }, 3500);

    return () => {
      if (intervalId !== undefined) window.clearInterval(intervalId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!initData) { setLoading(false); return; }
    fetch("/api/telegram-app/attendance", { headers: { "x-telegram-init-data": initData }, cache: "no-store" })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not verify Telegram admin.");
        setEvents(data.events || []);
        setAdminName(data.admin?.firstName || "WLC Admin");
        if (data.events?.length) setEventId(data.events[0].id);
      })
      .catch(error => setMessage(error instanceof Error ? error.message : "Unable to load events."))
      .finally(() => setLoading(false));
  }, [initData]);

  const stopCamera = useCallback(() => {
    if (scanTimerRef.current !== null) window.clearInterval(scanTimerRef.current);
    scanTimerRef.current = null;
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setScanning(false);
  }, []);

  useEffect(() => {
    if (initData && !loading && events.length > 0 && !scanning && !cameraError) void startCamera();
  }, [initData, loading, events.length, scanning, cameraError, startCamera]);

  useEffect(() => () => {
    if (scanTimerRef.current !== null) window.clearInterval(scanTimerRef.current);
    streamRef.current?.getTracks().forEach(track => track.stop());
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError("");
    const Detector = (window as MiniAppWindow).BarcodeDetector;
    if (!Detector) {
      setCameraError("এই ডিভাইসের ব্রাউজারে QR camera scanning নেই। নিচে Member ID লিখুন অথবা ফোনের Camera দিয়ে QR খুলে ID কপি করুন।");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      streamRef.current = stream;
      setScanning(true);
      requestAnimationFrame(() => { if (videoRef.current) { videoRef.current.srcObject = stream; void videoRef.current.play(); } });
      const detector = new Detector({ formats: ["qr_code"] });
      scanTimerRef.current = window.setInterval(async () => {
        const video = videoRef.current;
        if (!video || video.readyState < 2 || !streamRef.current) return;
        try {
          const codes = await detector.detect(video);
          const value = codes.find(code => code.rawValue)?.rawValue;
          if (value) {
            const id = memberIdFromQr(value);
            if (id && id !== lastScannedRef.current) {
              lastScannedRef.current = id;
              setMemberId(id);
              setMemberName("");
              setMemberLookupBusy(true);
              setMessage("QR scanned. Looking up member…");
              void fetch("/api/telegram-app/attendance?memberId=" + encodeURIComponent(id), {
                headers: { "x-telegram-init-data": initData }, cache: "no-store"
              }).then(async response => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Member not found.");
                setMemberName(data.member.name || "Name not available");
                setMessage("Member verified. Confirm check-in below.");
              }).catch(error => {
                setMemberName("");
                setMessage(error instanceof Error ? error.message : "Could not look up member.");
              }).finally(() => setMemberLookupBusy(false));
            }
            else setCameraError("QR-এ WLC Member ID পাওয়া যায়নি।");
          }
        } catch { /* Wait for the next camera frame. */ }
      }, 450);
    } catch {
      setCameraError("Camera চালু করা যায়নি। Telegram-এ camera permission দিন, অথবা Member ID হাতে লিখুন।");
    }
  }, [stopCamera, initData]);

  async function recordAttendance(event?: React.FormEvent) {
    event?.preventDefault();
    setMessage("");
    if (!initData) { setMessage("Telegram-এর ভেতর থেকে WLC bot-এর Attendance App খুলুন।"); return; }
    if (!eventId) { setMessage("আগে একটি published event নির্বাচন করুন।"); return; }
    if (!memberId.trim()) { setMessage("QR scan করুন অথবা Member ID লিখুন।"); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/telegram-app/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-telegram-init-data": initData },
        body: JSON.stringify({ memberId: memberIdFromQr(memberId), eventId, status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Attendance could not be saved.");
      setMessage("✓ " + data.member.name + " (" + data.member.memberId + ") — " + data.event + ": " + data.status + " saved.");
      setMemberId("");
      setMemberName("");
      lastScannedRef.current = "";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="min-h-screen bg-[#f7f4f0] px-4 py-5 text-stone-900 sm:px-6">
    <div className="mx-auto max-w-lg">
      <header className="rounded-[2rem] bg-[#5b1725] p-6 text-white shadow-lg">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-100">Willes Literary Club</p>
        <h1 className="mt-3 text-3xl font-bold">Attendance Desk</h1>
        <p className="mt-2 text-sm text-rose-100">Telegram Mini App · Member check-in</p>
        {adminName && <p className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs">Signed in as {adminName}</p>}
      </header>

      {loading ? <section className="mt-5 rounded-3xl bg-white p-6 text-center text-stone-500">Verifying Telegram admin…</section> : !initData ? <section className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-5"><h2 className="font-bold">Open inside Telegram</h2><p className="mt-2 text-sm leading-6">Security verification requires Telegram. Open the WLC Control Hub bot and tap “📷 Attendance App”.</p></section> : <form onSubmit={recordAttendance} className="mt-5 space-y-4">
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <label className="block text-sm font-semibold">Event to take attendance</label>
          <select value={eventId} onChange={e => setEventId(e.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 p-3.5 outline-none focus:border-[#5b1725]" required>
            <option value="">Choose published event</option>
            {events.map(event => <option key={event.id} value={event.id}>{event.title}{event.date ? " · " + event.date : ""}</option>)}
          </select>
          {!events.length && <p className="mt-3 text-sm text-amber-800">No published events found. Publish an event on the WLC website first.</p>}
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="font-bold">Scan member QR</h2><p className="mt-1 text-sm text-stone-500">Camera starts automatically and keeps scanning while this app is open.</p></div>
            <span className="rounded-2xl bg-rose-50 p-3 text-xl">▦</span>
          </div>
          {<div className="mt-4 overflow-hidden rounded-2xl bg-black"><video ref={videoRef} playsInline muted className="max-h-72 w-full object-cover" /><div className="bg-stone-900 px-3 py-2 text-center text-xs font-semibold text-white">{scanning ? "● CAMERA LIVE · CONTINUOUS SCANNING" : "Camera not active"}</div><button type="button" onClick={stopCamera} className="w-full bg-stone-800 p-3 text-sm font-semibold text-white">Stop camera</button></div>}
          {!scanning && <button type="button" onClick={() => void startCamera()} className="mt-4 w-full rounded-xl border border-[#5b1725] px-4 py-3.5 font-semibold text-[#5b1725]">Start camera</button>}
          {cameraError && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-900">{cameraError}</p>}
          {memberId && <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-emerald-800">Scanned member</p><p className="mt-2 text-lg font-bold text-stone-900">{memberLookupBusy ? "Looking up name…" : memberName || "Member name unavailable"}</p><p className="mt-1 font-mono text-sm text-stone-700">{memberId}</p><button type="button" onClick={() => { setMemberId(""); setMemberName(""); setMessage(""); lastScannedRef.current = ""; }} className="mt-3 text-sm font-semibold text-[#5b1725]">Clear / scan next member</button></div>}
          <div className="my-4 flex items-center gap-3 text-xs text-stone-400"><span className="h-px flex-1 bg-stone-200" />OR ENTER MANUALLY<span className="h-px flex-1 bg-stone-200" /></div>
          <label className="block text-sm font-semibold">WLC Member ID</label>
          <input value={memberId} onChange={e => setMemberId(e.target.value.toUpperCase())} placeholder="e.g. WLC-GEN2-001" autoCapitalize="characters" autoComplete="off" className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 p-3.5 font-mono outline-none focus:border-[#5b1725]" />
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold">Attendance status</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(["PRESENT", "LATE"] as const).map(value => <button key={value} type="button" onClick={() => setStatus(value)} className={"rounded-xl border p-3.5 font-semibold " + (status === value ? "border-[#5b1725] bg-[#5b1725] text-white" : "border-stone-200 bg-white text-stone-600")}>{value === "PRESENT" ? "✓ Present" : "◷ Late"}</button>)}
          </div>
          <button disabled={busy || memberLookupBusy || !events.length || !eventId || !memberId.trim() || !memberName} type="submit" className="mt-4 w-full rounded-xl bg-[#5b1725] p-4 font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40">{busy ? "Saving attendance…" : "Confirm check-in"}</button>
        </section>
      </form>}

      {message && <div role="status" className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-6 shadow-sm">{message}</div>}
      <footer className="px-3 py-6 text-center text-xs leading-5 text-stone-500">WLC · Attendance is saved to the existing member attendance registry. Duplicate check-ins are blocked.</footer>
    </div>
  </main>;
}
