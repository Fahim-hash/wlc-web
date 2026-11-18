import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

let bengaliFontBytes: Promise<Uint8Array | null> | null = null;
async function loadBengaliFont() {
  if (!bengaliFontBytes) {
    bengaliFontBytes = fetch("https://raw.githubusercontent.com/google/fonts/main/ofl/notosansbengali/NotoSansBengali%5Bwdth%2Cwght%5D.ttf", { cache: "force-cache", signal: AbortSignal.timeout(12000) })
      .then(async (response) => response.ok ? new Uint8Array(await response.arrayBuffer()) : null)
      .catch(() => null);
  }
  return bengaliFontBytes;
}

export type TicketPdfData = {
  eventTitle: string;
  eventStartAt: string;
  venue: string;
  attendeeName: string;
  attendeeEmail?: string;
  attendeePhone?: string;
  quantity: number;
  ticketId: string;
  bookingId: string;
  bannerUrl?: string;
};

export async function createTicketPdf(data: TicketPdfData) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  pdf.registerFontkit(fontkit);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const hasBengali = [data.attendeeName, data.eventTitle, data.venue].some((value) => /[\u0980-\u09FF]/.test(value));
  let unicodeFont: PDFFont | null = null;
  if (hasBengali) {
    const bytes = await loadBengaliFont();
    if (bytes) unicodeFont = await pdf.embedFont(bytes, { subset: true });
  }
  const titleFont = unicodeFont || bold;
  const attendeeFont = unicodeFont || bold;
  const venueFont = unicodeFont || regular;
  const rose = rgb(0.624, 0.071, 0.224);
  const ink = rgb(0.11, 0.098, 0.09);
  const muted = rgb(0.42, 0.43, 0.45);
  const pale = rgb(0.992, 0.949, 0.961);
  const white = rgb(1, 1, 1);
  const left = 38;
  const width = 519;

  let bannerDrawn = false;
  if (data.bannerUrl) {
    try {
      const response = await fetch(data.bannerUrl, { cache: "no-store", signal: AbortSignal.timeout(12000) });
      if (response.ok) {
        const bytes = new Uint8Array(await response.arrayBuffer());
        const type = response.headers.get("content-type") || "";
        const banner = type.includes("png") ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const scale = Math.max(595.28 / banner.width, 250 / banner.height);
        page.drawImage(banner, { x: (595.28 - banner.width * scale) / 2, y: 591, width: banner.width * scale, height: banner.height * scale });
        bannerDrawn = true;
      }
    } catch { /* use branded fallback */ }
  }
  if (!bannerDrawn) {
    page.drawRectangle({ x: 0, y: 591, width: 595.28, height: 250.89, color: rose });
    page.drawText("WILLES LITERARY CLUB", { x: left, y: 795, size: 11, font: bold, color: white });
    page.drawText("EVENT ADMISSION", { x: left, y: 760, size: 10, font: bold, color: rgb(1, 0.82, 0.88) });
    let y = 713;
    for (const line of wrapText(data.eventTitle, titleFont, 26, 490).slice(0, 3)) {
      page.drawText(line, { x: left, y, size: 26, font: titleFont, color: white });
      y -= 34;
    }
  }

  page.drawRectangle({ x: 0, y: 520, width: 595.28, height: 71, color: white });
  let titleY = 563;
  for (const line of wrapText(data.eventTitle, titleFont, 18, 510).slice(0, 2)) {
    page.drawText(line, { x: left, y: titleY, size: 18, font: titleFont, color: ink });
    titleY -= 22;
  }
  const date = new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Dhaka" }).format(new Date(data.eventStartAt));
  page.drawText(date, { x: left, y: 530, size: 9, font: regular, color: muted });
  const venue = unicodeFont ? data.venue : data.venue.replace(/[^\x20-\x7E]/g, "?");
  page.drawText(venue.slice(0, 100), { x: 330, y: 530, size: 9, font: venueFont, color: muted });

  page.drawText("ATTENDEE DETAILS", { x: left, y: 482, size: 9, font: bold, color: rose });
  const name = unicodeFont ? data.attendeeName : data.attendeeName.replace(/[^\x20-\x7E]/g, "?");
  let nameY = 450;
  for (const line of wrapText(name, attendeeFont, 19, 500).slice(0, 2)) {
    page.drawText(line, { x: left, y: nameY, size: 19, font: attendeeFont, color: ink });
    nameY -= 24;
  }
  if (data.attendeeEmail) page.drawText(data.attendeeEmail.slice(0, 70), { x: left, y: 400, size: 9, font: regular, color: muted });
  if (data.attendeePhone) page.drawText(data.attendeePhone.slice(0, 40), { x: left, y: 383, size: 9, font: regular, color: muted });
  page.drawText(`${data.quantity} ${data.quantity === 1 ? "ticket" : "tickets"} · ENTRY PASS`, { x: left, y: 353, size: 10, font: bold, color: rose });

  page.drawRectangle({ x: left, y: 265, width, height: 62, color: pale, borderColor: rgb(0.98, 0.66, 0.81), borderWidth: 1 });
  page.drawText("TICKET ID", { x: left + 16, y: 306, size: 8, font: bold, color: muted });
  page.drawText(data.ticketId, { x: left + 16, y: 282, size: 16, font: bold, color: rose });
  page.drawText(`BOOKING REF.  ${data.bookingId.slice(0, 18).toUpperCase()}`, { x: 325, y: 289, size: 8, font: bold, color: ink });

  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&format=png&margin=8&data=${encodeURIComponent(data.bookingId)}`;
    const response = await fetch(qrUrl, { cache: "no-store", signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error("QR image service unavailable.");
    const qr = await pdf.embedPng(new Uint8Array(await response.arrayBuffer()));
    page.drawImage(qr, { x: left + 8, y: 83, width: 154, height: 154 });
  } catch {
    page.drawRectangle({ x: left + 8, y: 83, width: 154, height: 154, borderColor: rose, borderWidth: 1 });
    page.drawText("QR unavailable", { x: left + 35, y: 156, size: 10, font: bold, color: rose });
  }
  page.drawText("SCAN FOR ENTRY", { x: 220, y: 214, size: 10, font: bold, color: rose });
  page.drawText("Present this QR code at the event desk.", { x: 220, y: 190, size: 9, font: regular, color: ink });
  page.drawText("Your ticket will be verified on arrival.", { x: 220, y: 174, size: 9, font: regular, color: ink });
  page.drawText("Keep your QR code and ticket ID private.", { x: 220, y: 150, size: 8, font: regular, color: muted });

  try {
    const response = await fetch("https://wlc.pro.bd/relaxstudio.png", { cache: "force-cache", signal: AbortSignal.timeout(8000) });
    if (response.ok) {
      const bytes = new Uint8Array(await response.arrayBuffer());
      const type = response.headers.get("content-type") || "";
      const logo = type.includes("png") ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
      const scale = Math.min(96 / logo.width, 28 / logo.height);
      page.drawImage(logo, { x: 595.28 - left - logo.width * scale, y: 35, width: logo.width * scale, height: logo.height * scale });
    }
  } catch { /* text credit remains */ }
  page.drawText("POWERED BY", { x: left, y: 43, size: 7, font: regular, color: muted });
  page.drawText("RelaxStudio", { x: left, y: 27, size: 11, font: bold, color: rose });
  return Buffer.from(await pdf.save());
}

function wrapText(value: string, font: PDFFont, size: number, maxWidth: number) {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) line = next;
    else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}
