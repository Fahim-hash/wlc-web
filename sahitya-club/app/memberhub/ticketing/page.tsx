"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, CalendarPlus, ExternalLink, ShieldCheck, ScanLine, Download, RefreshCw, CheckCircle2, Camera, CameraOff, ImagePlus, Crop, Upload, X } from "lucide-react";

type EventRow = {
  id: string; slug: string; title: string; venue: string; startAt: string;
  capacity: number; reservedCount: number; ticketPrice: number; status: string; bannerUrl?: string;
};

type BookingRow = {
  bookingId: string; ticketId: string; eventId: string; eventTitle: string;
  attendeeName: string; attendeeEmail: string; attendeePhone: string;
  quantity: number; totalAmount: number; paymentStatus: string; status: string;
  checkedInCount: number; createdAt: number;
};

type BarcodeDetectorLike = {
  detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
};
type BarcodeDetectorConstructor = new (options: { formats: string[] }) => BarcodeDetectorLike;

const initial = { title: "", summary: "", description: "", venue: "", startAt: "", endAt: "", capacity: "100", ticketPrice: "0", bannerUrl: "", status: "DRAFT" };

function extractBookingId(raw: string) {
  const match = raw.trim().match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
  return match?.[0] || raw.trim();
}

export default function TicketingAdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [form, setForm] = useState(initial);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerCropX, setBannerCropX] = useState(50);
  const [bannerCropY, setBannerCropY] = useState(50);
  const [bannerZoom, setBannerZoom] = useState(1);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [scannerActive, setScannerActive] = useState(false);
  const [scanInput, setScanInput] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [lastCheckin, setLastCheckin] = useState<{ attendeeName: string; eventTitle: string; checkedInCount: number; quantity: number; remaining: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLockRef = useRef(false);

  const loadBookings = useCallback(async (eventSlug = selectedEvent) => {
    const query = eventSlug ? `?eventSlug=${encodeURIComponent(eventSlug)}` : "";
    const response = await fetch(`/api/ticketing/admin/bookings${query}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Unable to load bookings.");
    setBookings(data.bookings || []);
  }, [selectedEvent]);

  async function load() {
    const auth = await fetch("/api/memberhub/auth", { cache: "no-store" });
    const authData = await auth.json();
    setAuthenticated(Boolean(authData.authenticated));
    if (!authData.authenticated) return;
    const response = await fetch("/api/ticketing/events", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Unable to load events.");
    setEvents(data.events || []);
    await loadBookings("");
  }

  useEffect(() => { load().catch(() => setNotice("Unable to load ticketing dashboard. Please refresh and try again.")); }, []);

  useEffect(() => {
    if (authenticated && selectedEvent) {
      loadBookings(selectedEvent).catch(() => setNotice("Unable to refresh bookings."));
    }
  }, [authenticated, selectedEvent, loadBookings]);

  const performCheckIn = useCallback(async (raw: string) => {
    if (scanLockRef.current) return;
    scanLockRef.current = true;
    setScanMessage("Verifying ticket…");
    setLastCheckin(null);
    try {
      const bookingId = extractBookingId(raw);
      const response = await fetch("/api/ticketing/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Ticket check-in failed.");
      setLastCheckin(data.checkin);
      setScanMessage("Entry recorded successfully.");
      setScanInput("");
      await loadBookings();
    } catch (error) {
      setScanMessage(error instanceof Error ? error.message : "Ticket check-in failed.");
    } finally {
      window.setTimeout(() => { scanLockRef.current = false; }, 1600);
    }
  }, [loadBookings]);

  useEffect(() => {
    if (!scannerActive) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      return;
    }

    let stopped = false;
    let frame = 0;
    let lastScannedValue = "";
    let emptyFrameCount = 0;

    async function startScanner() {
      try {
        const Detector = (window as unknown as { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector;
        if (!Detector) {
          setScanMessage("Automatic QR scanning is not supported by this browser. Use the booking reference field below.");
          return;
        }
        if (!navigator.mediaDevices?.getUserMedia) {
          setScanMessage("Camera access is unavailable. Use the booking reference field below.");
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
        if (stopped) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        const detector = new Detector({ formats: ["qr_code"] });

        const scanFrame = async () => {
          if (stopped) return;
          if (video.readyState >= 2 && !scanLockRef.current) {
            try {
              const codes = await detector.detect(video);
              const rawValue = codes[0]?.rawValue;
              if (rawValue) {
                emptyFrameCount = 0;
                const scannedValue = extractBookingId(rawValue);
                if (scannedValue && scannedValue !== lastScannedValue) {
                  lastScannedValue = scannedValue;
                  await performCheckIn(rawValue);
                }
              } else {
                emptyFrameCount += 1;
                if (emptyFrameCount >= 10) {
                  lastScannedValue = "";
                  emptyFrameCount = 0;
                }
              }
            } catch {
              // Keep the camera loop alive when a frame cannot be decoded.
            }
          }
          if (!stopped) frame = window.requestAnimationFrame(scanFrame);
        };
        void scanFrame();
        setScanMessage("Camera ready. Hold the attendee QR code inside the frame.");
      } catch (error) {
        setScanMessage(error instanceof Error ? error.message : "Unable to start the camera. Check browser permissions.");
      }
    }

    void startScanner();
    return () => {
      stopped = true;
      if (frame) window.cancelAnimationFrame(frame);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [scannerActive, performCheckIn]);

  function selectBanner(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setNotice("Choose a JPG, PNG, or WEBP banner image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setNotice("Banner image must be 5 MB or smaller.");
      return;
    }
    setNotice("");
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
    setBannerCropX(50);
    setBannerCropY(50);
    setBannerZoom(1);
  }

  async function uploadCroppedBanner() {
    if (!bannerFile || !bannerPreview) return;
    setBannerUploading(true);
    setNotice("");
    try {
      const image = new Image();
      image.src = bannerPreview;
      await image.decode();
      const width = 1500;
      const height = 608;
      const targetRatio = width / height;
      let cropWidth = image.naturalWidth;
      let cropHeight = image.naturalHeight;
      if (cropWidth / cropHeight > targetRatio) cropWidth = cropHeight * targetRatio;
      else cropHeight = cropWidth / targetRatio;
      cropWidth /= bannerZoom;
      cropHeight /= bannerZoom;
      const left = (image.naturalWidth - cropWidth) * (bannerCropX / 100);
      const top = (image.naturalHeight - cropHeight) * (bannerCropY / 100);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not prepare the banner crop.");
      context.drawImage(image, left, top, cropWidth, cropHeight, 0, 0, width, height);
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Could not export the cropped banner.")), "image/jpeg", 0.9));
      const upload = new FormData();
      upload.append("file", blob, "wlc-event-banner.jpg");
      const response = await fetch("/api/ticketing/banner-upload", { method: "POST", body: upload });
      const data = await response.json();
      if (!response.ok || !data.imageUrl) throw new Error(data.message || "Banner upload failed.");
      setForm((current) => ({ ...current, bannerUrl: data.imageUrl }));
      setBannerFile(null);
      URL.revokeObjectURL(bannerPreview);
      setBannerPreview("");
      setNotice("Event banner uploaded and saved. It will be used on the event page and Event Pass.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Banner upload failed.");
    } finally {
      setBannerUploading(false);
    }
  }

  async function createEvent(event: FormEvent) {
    event.preventDefault(); setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/ticketing/events", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, capacity: Number(form.capacity), ticketPrice: Number(form.ticketPrice), endAt: form.endAt || null }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not create event.");
      setNotice(`Event created: ${data.event.title}`);
      setForm(initial);
      await load();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not create event."); }
    finally { setBusy(false); }
  }

  function exportBookings() {
    const query = selectedEvent ? `?eventSlug=${encodeURIComponent(selectedEvent)}&format=csv` : "?format=csv";
    window.location.href = `/api/ticketing/admin/bookings${query}`;
  }

  if (authenticated === null) return <main className="min-h-screen bg-[#FAFAFA] p-8 text-[#9F1239]">Loading ticketing admin…</main>;
  if (!authenticated) return <main className="min-h-screen bg-[#FAFAFA] px-4 py-16 text-[#9F1239]"><div className="mx-auto max-w-lg rounded-3xl border border-[#E5E7EB] bg-white p-8 text-center"><ShieldCheck className="mx-auto text-[#9F1239]" size={34}/><h1 className="mt-4 text-2xl font-semibold">Admin access required</h1><p className="mt-2 text-sm text-[#6B7280]">Sign in to the existing WLC Member Hub first. Ticketing uses the same secure admin session.</p><Link href="/memberhub" className="mt-6 inline-flex rounded-xl bg-[#9F1239] px-5 py-3 text-sm font-semibold text-white">Open Member Hub</Link></div></main>;

  const confirmedCount = bookings.filter((booking) => booking.status === "CONFIRMED").length;
  const checkedInCount = bookings.reduce((sum, booking) => sum + booking.checkedInCount, 0);

  return <main className="min-h-screen bg-[#FAFAFA] px-4 py-9 text-[#1C1917] sm:px-6"><div className="mx-auto max-w-6xl">
    <Link href="/memberhub" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280]"><ArrowLeft size={16}/> Member Hub</Link>
    <header className="mt-5 rounded-[2rem] bg-[#9F1239] p-7 text-white sm:p-9"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#FCE7EF]">Willes Literary Club · Admin</p><h1 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">Event Ticketing</h1><p className="mt-2 max-w-xl text-sm leading-6 text-white/70">Create events, publish registration pages, manage bookings and verify entry with QR scanning.</p></header>

    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Events</p><p className="mt-2 text-3xl font-semibold">{events.length}</p></div>
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Bookings loaded</p><p className="mt-2 text-3xl font-semibold">{confirmedCount}</p></div>
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Attendees checked in</p><p className="mt-2 text-3xl font-semibold">{checkedInCount}</p></div>
    </div>

    <div className="mt-7 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-7"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FCE7EF] text-[#9F1239]"><CalendarPlus/></div><div><h2 className="font-serif font-semibold">Create an event</h2><p className="text-xs text-[#6B7280]">Start as a draft or publish immediately.</p></div></div>
        <form onSubmit={createEvent} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">Event title<input required minLength={4} maxLength={120} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3.5 py-3 outline-none focus:border-[#9F1239]"/></label>
          <label className="block text-sm font-semibold">Short description<input maxLength={240} value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3.5 py-3 outline-none focus:border-[#9F1239]"/></label>
          <label className="block text-sm font-semibold">Full description<textarea rows={4} maxLength={5000} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3.5 py-3 outline-none focus:border-[#9F1239]"/></label>
          <div className="space-y-3 rounded-2xl border border-[#E5E7EB] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold"><ImagePlus size={17} className="text-[#9F1239]"/> Event banner</div>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#D1D5DB] bg-[#FAFAFA] px-4 py-4 text-sm font-semibold text-[#9F1239] hover:border-[#9F1239]">
              <Upload size={16}/> {bannerFile ? "Choose a different image" : "Upload banner image"}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={e=>selectBanner(e.target.files?.[0])}/>
            </label>
            <p className="text-xs font-normal leading-5 text-[#6B7280]">JPG, PNG or WEBP · up to 5 MB. Fixed Event Pass banner: 1500 × 608 px (about 2.47:1).</p>
            {bannerPreview && <div className="space-y-3">
              <div className="relative aspect-[1500/608] overflow-hidden rounded-xl bg-[#F3F4F6]">
                <img src={bannerPreview} alt="Banner crop preview" className="h-full w-full object-cover" style={{objectPosition: `${bannerCropX}% ${bannerCropY}%`, transform: `scale(${bannerZoom})`}}/>
                <span className="absolute bottom-2 left-2 rounded-md bg-black/65 px-2 py-1 text-[10px] font-semibold text-white">CROP PREVIEW · 1500 × 608</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-[#6B7280]">Horizontal position <input type="range" min="0" max="100" value={bannerCropX} onChange={e=>setBannerCropX(Number(e.target.value))} className="mt-2 w-full accent-[#9F1239]"/></label>
                <label className="block text-xs font-semibold text-[#6B7280]">Vertical position <input type="range" min="0" max="100" value={bannerCropY} onChange={e=>setBannerCropY(Number(e.target.value))} className="mt-2 w-full accent-[#9F1239]"/></label>
              </div>
              <label className="block text-xs font-semibold text-[#6B7280]">Zoom <input type="range" min="1" max="2.5" step="0.05" value={bannerZoom} onChange={e=>setBannerZoom(Number(e.target.value))} className="mt-2 w-full accent-[#9F1239]"/></label>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={bannerUploading} onClick={uploadCroppedBanner} className="inline-flex items-center gap-2 rounded-xl bg-[#9F1239] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"><Crop size={14}/>{bannerUploading ? "Uploading…" : "Crop & upload banner"}</button>
                <button type="button" disabled={bannerUploading} onClick={()=>{URL.revokeObjectURL(bannerPreview);setBannerPreview("");setBannerFile(null);}} className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-xs font-semibold"><X size={14}/> Cancel</button>
              </div>
            </div>}
            {form.bannerUrl && <div className="space-y-2"><p className="text-xs font-semibold text-[#9F1239]">Uploaded banner</p><img src={form.bannerUrl} alt="Uploaded event banner" className="aspect-[1500/608] w-full rounded-xl object-cover"/><button type="button" onClick={()=>setForm({...form,bannerUrl:""})} className="text-xs font-semibold text-[#9F1239] underline">Remove banner</button></div>}
            <label className="block text-xs font-semibold text-[#6B7280]">Or use an existing public image URL<input type="url" maxLength={1000} placeholder="https://example.com/event-banner.jpg" value={form.bannerUrl} onChange={e=>setForm({...form,bannerUrl:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3.5 py-3 text-sm font-normal outline-none focus:border-[#9F1239]"/></label>
          </div>
          <label className="block text-sm font-semibold">Venue<input required minLength={2} maxLength={180} value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3.5 py-3 outline-none focus:border-[#9F1239]"/></label>
          <div className="grid gap-3 sm:grid-cols-2"><label className="block text-sm font-semibold">Start date & time<input required type="datetime-local" value={form.startAt} onChange={e=>setForm({...form,startAt:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3 py-3 outline-none focus:border-[#9F1239]"/></label><label className="block text-sm font-semibold">End date & time<input type="datetime-local" value={form.endAt} onChange={e=>setForm({...form,endAt:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3 py-3 outline-none focus:border-[#9F1239]"/></label></div>
          <div className="grid gap-3 sm:grid-cols-2"><label className="block text-sm font-semibold">Ticket capacity<input required type="number" min="1" max="100000" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3.5 py-3 outline-none focus:border-[#9F1239]"/></label><label className="block text-sm font-semibold">Price per ticket (BDT)<input required type="number" min="0" max="10000000" value={form.ticketPrice} onChange={e=>setForm({...form,ticketPrice:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3.5 py-3 outline-none focus:border-[#9F1239]"/></label></div>
          <label className="block text-sm font-semibold">Visibility<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3.5 py-3 outline-none focus:border-[#9F1239]"><option value="DRAFT">Draft — only admins can see</option><option value="PUBLISHED">Published — public can book</option></select></label>
          <button disabled={busy} className="w-full rounded-xl bg-[#9F1239] px-4 py-3.5 text-sm font-bold text-white hover:bg-[#BE123C] disabled:opacity-50">{busy?"Creating…":"Create event"}</button>
        </form>
        {notice&&<p role="status" className="mt-4 rounded-xl bg-[#FCE7EF] p-3 text-sm text-[#9F1239]">{notice}</p>}
      </section>

      <div className="space-y-6">
        <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">QR entry check-in</h2><p className="mt-1 text-xs text-[#6B7280]">Scan an attendee ticket or enter its booking reference.</p></div><button type="button" onClick={()=>{setScannerActive(!scannerActive);setScanMessage("");}} className="inline-flex items-center gap-2 rounded-xl bg-[#9F1239] px-4 py-2.5 text-xs font-bold text-white">{scannerActive?<CameraOff size={15}/>:<Camera size={15}/>} {scannerActive?"Stop camera":"Start camera"}</button></div>
          {scannerActive&&<div className="mt-5 overflow-hidden rounded-2xl bg-black"><video ref={videoRef} playsInline muted className="aspect-video w-full object-cover"/></div>}
          <form onSubmit={e=>{e.preventDefault();if(scanInput.trim())void performCheckIn(scanInput);}} className="mt-5 flex flex-col gap-2 sm:flex-row"><input value={scanInput} onChange={e=>setScanInput(e.target.value)} placeholder="Paste or type booking reference" className="min-w-0 flex-1 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 text-sm outline-none focus:border-[#9F1239]"/><button disabled={!scanInput.trim()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#BE123C] px-5 py-3 text-sm font-bold text-[#1C1917] disabled:opacity-50"><ScanLine size={16}/> Verify & check in</button></form>
          {scanMessage&&<p role="status" className="mt-3 rounded-xl bg-[#FDF2F5] p-3 text-sm text-[#9F1239]">{scanMessage}</p>}
          {lastCheckin&&<div className="mt-3 flex items-start gap-3 rounded-xl border border-[#FBCFE8] bg-[#FDF2F5] p-4"><CheckCircle2 className="mt-0.5 shrink-0 text-[#9F1239]" size={20}/><div><p className="font-semibold text-[#9F1239]">{lastCheckin.attendeeName}</p><p className="mt-1 text-xs text-[#6B7280]">{lastCheckin.eventTitle} · Entry {lastCheckin.checkedInCount} of {lastCheckin.quantity} · {lastCheckin.remaining} remaining</p></div></div>}
          <p className="mt-3 text-[11px] leading-5 text-[#6B7280]">Camera scanning requires HTTPS and a browser with native QR detection support. Manual booking-reference verification remains available as a fallback.</p>
        </section>

        <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-7"><div className="flex items-center justify-between gap-3"><div><h2 className="font-semibold">Event directory</h2><p className="mt-1 text-xs text-[#6B7280]">All drafts and published events.</p></div><span className="rounded-full bg-[#FCE7EF] px-3 py-1.5 text-xs font-bold text-[#9F1239]">{events.length} total</span></div>
          {events.length===0?<div className="mt-8 rounded-2xl border border-dashed border-[#D1D5DB] p-10 text-center text-sm text-[#6B7280]">No events created yet.</div>:<div className="mt-5 space-y-3">{events.map(item=><article key={item.id} className="rounded-2xl border border-[#E5E7EB] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{item.title}</h3><p className="mt-1 text-xs text-[#6B7280]">{item.venue} · {new Date(item.startAt).toLocaleString("en-BD")}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.status==="PUBLISHED"?"bg-[#FCE7EF] text-[#9F1239]":"bg-[#f1f3f1] text-[#6c817b]"}`}>{item.status}</span></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#F3F4F6] pt-3 text-xs text-[#6B7280]"><span>{item.reservedCount}/{item.capacity} reserved · {item.ticketPrice===0?"Free":`৳${item.ticketPrice} per ticket`}</span>{item.status==="PUBLISHED"&&<Link href={`/ticketing/${item.slug}`} target="_blank" className="inline-flex items-center gap-1 font-semibold text-[#9F1239]">Open page <ExternalLink size={13}/></Link>}</div></article>)}</div>}
        </section>
      </div>
    </div>

    <section className="mt-7 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Booking management</h2><p className="mt-1 text-xs text-[#6B7280]">Latest 500 bookings. Contact details are visible to authenticated admins only.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={()=>loadBookings().catch(()=>setNotice("Unable to refresh bookings."))} className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-xs font-semibold"><RefreshCw size={14}/> Refresh</button><button type="button" onClick={exportBookings} className="inline-flex items-center gap-2 rounded-xl bg-[#9F1239] px-3 py-2.5 text-xs font-semibold text-white"><Download size={14}/> Export CSV</button></div></div>
      <div className="mt-5"><label className="text-xs font-semibold text-[#6B7280]">Filter by event<select value={selectedEvent} onChange={e=>setSelectedEvent(e.target.value)} className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-3.5 py-3 text-sm sm:max-w-sm"><option value="">All events</option>{events.map(event=><option key={event.id} value={event.slug}>{event.title}</option>)}</select></label></div>
      {bookings.length===0?<div className="mt-5 rounded-2xl border border-dashed border-[#D1D5DB] p-10 text-center text-sm text-[#6B7280]">No bookings found for this selection.</div>:<div className="mt-5 overflow-x-auto"><table className="w-full min-w-[780px] text-left text-xs"><thead className="border-b border-[#F3F4F6] text-[#6B7280]"><tr><th className="px-3 py-3 font-semibold">Attendee</th><th className="px-3 py-3 font-semibold">Event</th><th className="px-3 py-3 font-semibold">Ticket</th><th className="px-3 py-3 font-semibold">Payment</th><th className="px-3 py-3 font-semibold">Entry</th><th className="px-3 py-3 font-semibold">Status</th></tr></thead><tbody>{bookings.map(booking=><tr key={booking.bookingId} className="border-b border-[#F3F4F6] last:border-0"><td className="px-3 py-3"><p className="font-semibold text-[#9F1239]">{booking.attendeeName}</p><p className="mt-1 text-[#6B7280]">{booking.attendeeEmail}</p><p className="text-[#6B7280]">{booking.attendeePhone}</p></td><td className="px-3 py-3">{booking.eventTitle}</td><td className="px-3 py-3"><p>{booking.quantity} × {booking.ticketId}</p><p className="mt-1 text-[#6B7280]">{booking.bookingId.slice(0,8)}…</p></td><td className="px-3 py-3">{booking.paymentStatus}{booking.totalAmount>0&&<p className="mt-1 text-[#6B7280]">৳{booking.totalAmount}</p>}</td><td className="px-3 py-3 font-semibold">{booking.checkedInCount}/{booking.quantity}</td><td className="px-3 py-3">{booking.status}</td></tr>)}</tbody></table></div>}
    </section>
    <p className="mt-7 text-xs leading-5 text-[#6B7280]">Free-ticket reservations and staff QR check-in are enabled. Paid checkout is intentionally blocked until a payment provider and settlement workflow are configured.</p>
  </div></main>;
}
