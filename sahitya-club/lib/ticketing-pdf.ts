import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

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
  eventSummary?: string;
  eventDescription?: string;
  eventStartAt: string;
  venue: string;
  ticketPrice?: number;
  currency?: string;
  attendeeName: string;
  attendeeEmail?: string;
  attendeePhone?: string;
  quantity: number;
  ticketId: string;
  bookingId: string;
  bannerUrl?: string;
};

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const BLACK = rgb(0.035, 0.035, 0.035);
const PAPER = rgb(0.985, 0.98, 0.97);
const INK = rgb(0.07, 0.07, 0.07);
const MUTED = rgb(0.36, 0.36, 0.36);
const WHITE = rgb(1, 1, 1);
const ROSE = rgb(0.62, 0.07, 0.22);
const LINE = rgb(0.82, 0.82, 0.80);

async function fetchImage(pdf: PDFDocument, url: string, timeout = 9000): Promise<PDFImage | null> {
  try {
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(timeout) });
    if (!response.ok) return null;
    const bytes = Buffer.from(await response.arrayBuffer());
    const type = response.headers.get("content-type") || "";
    if (type.includes("png") || url.toLowerCase().split("?")[0].endsWith(".png")) return await pdf.embedPng(bytes);
    if (type.includes("jpeg") || type.includes("jpg") || /\\.jpe?g(?:\\?|$)/i.test(url)) return await pdf.embedJpg(bytes);
    return await pdf.embedPng(await sharp(bytes).rotate().png().toBuffer());
  } catch {
    return null;
  }
}

async function loadPublicPng(pdf: PDFDocument, filename: string): Promise<PDFImage | null> {
  try {
    return await pdf.embedPng(await readFile(join(process.cwd(), "public", filename)));
  } catch {
    return null;
  }
}

function fitText(value: string, font: PDFFont, size: number, maxWidth: number) {
  let text = value || "";
  while (text.length > 1 && font.widthOfTextAtSize(text, size) > maxWidth) text = text.slice(0, -2) + "…";
  return text;
}

function wrapText(value: string, font: PDFFont, size: number, maxWidth: number) {
  const words = value.split(/\\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) line = next;
    else { if (line) lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines;
}

function drawLogo(page: ReturnType<PDFDocument["addPage"]>, logo: PDFImage | null, x: number, y: number, maxW: number, maxH: number) {
  if (!logo) return;
  const scale = Math.min(maxW / logo.width, maxH / logo.height);
  const w = logo.width * scale;
  const h = logo.height * scale;
  page.drawImage(logo, { x: x + (maxW - w) / 2, y: y + (maxH - h) / 2, width: w, height: h });
}

export async function createTicketPdf(data: TicketPdfData) {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const hasBengali = [data.attendeeName, data.eventTitle, data.venue, data.eventSummary || "", data.eventDescription || ""].some((value) => /[\\u0980-\\u09FF]/.test(value));
  let unicodeFont: PDFFont | null = null;
  if (hasBengali) {
    const bytes = await loadBengaliFont();
    if (bytes) unicodeFont = await pdf.embedFont(bytes, { subset: true });
  }
  const heading = unicodeFont || bold;
  const body = unicodeFont || regular;
  const safe = (value: string) => unicodeFont ? value : value.replace(/[^\\x20-\\x7E]/g, "?");
  const eventDate = new Date(data.eventStartAt);
  const dateText = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "2-digit", month: "long", year: "numeric" }).format(eventDate);
  const timeText = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit" }).format(eventDate);

  const [wlcLogo, relaxLogo] = await Promise.all([
    loadPublicPng(pdf, "logo.png"),
    loadPublicPng(pdf, "relaxstudio.png"),
  ]);

  // PAGE 1 — event pass, following the supplied reference's information hierarchy.
  const page1 = pdf.addPage([PAGE_W, PAGE_H]);
  page1.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: PAPER });

  const banner = data.bannerUrl ? await fetchImage(pdf, data.bannerUrl, 12000) : null;
  const bannerH = 248;
  if (banner) {
    const scale = Math.max(PAGE_W / banner.width, bannerH / banner.height);
    const drawW = banner.width * scale;
    const drawH = banner.height * scale;
    page1.drawImage(banner, { x: (PAGE_W - drawW) / 2, y: PAGE_H - bannerH, width: drawW, height: drawH });
  } else {
    page1.drawRectangle({ x: 0, y: PAGE_H - bannerH, width: PAGE_W, height: bannerH, color: ROSE });
    page1.drawText("WILLES LITERARY CLUB", { x: 30, y: PAGE_H - 58, size: 11, font: bold, color: WHITE });
    let titleY = PAGE_H - 115;
    for (const line of wrapText(safe(data.eventTitle), heading, 26, PAGE_W - 60).slice(0, 3)) {
      page1.drawText(line, { x: 30, y: titleY, size: 26, font: heading, color: WHITE });
      titleY -= 32;
    }
  }

  // Strong category strip — no extra card or decorative container.
  const stripY = PAGE_H - bannerH - 50;
  page1.drawRectangle({ x: 0, y: stripY, width: 170, height: 42, color: rgb(0.08, 0.20, 0.20) });
  page1.drawText("TICKET CATEGORY", { x: 18, y: stripY + 16, size: 10, font: bold, color: WHITE });
  page1.drawRectangle({ x: 170, y: stripY, width: PAGE_W - 170, height: 42, color: WHITE, borderColor: LINE, borderWidth: 0.7 });
  page1.drawText("EVENT PASS", { x: 186, y: stripY + 21, size: 12, font: bold, color: INK });
  page1.drawText(fitText(safe(data.eventTitle), body, 8, PAGE_W - 210), { x: 186, y: stripY + 8, size: 8, font: body, color: MUTED });

  // Event details — plain, aligned rows.
  const infoTop = stripY - 28;
  page1.drawText("EVENT DETAILS", { x: 28, y: infoTop, size: 8, font: bold, color: ROSE });
  page1.drawText("DATE", { x: 28, y: infoTop - 24, size: 7, font: bold, color: MUTED });
  page1.drawText(fitText(dateText, bold, 10, 150), { x: 28, y: infoTop - 42, size: 10, font: bold, color: INK });
  page1.drawLine({ start: { x: 192, y: infoTop - 48 }, end: { x: 192, y: infoTop - 16 }, thickness: 0.6, color: LINE });
  page1.drawText("TIME", { x: 210, y: infoTop - 24, size: 7, font: bold, color: MUTED });
  page1.drawText(timeText, { x: 210, y: infoTop - 42, size: 10, font: bold, color: INK });
  page1.drawLine({ start: { x: 330, y: infoTop - 48 }, end: { x: 330, y: infoTop - 16 }, thickness: 0.6, color: LINE });
  page1.drawText("VENUE", { x: 348, y: infoTop - 24, size: 7, font: bold, color: MUTED });
  page1.drawText(fitText(safe(data.venue), body, 9, 218), { x: 348, y: infoTop - 42, size: 9, font: body, color: INK });
  page1.drawLine({ start: { x: 28, y: infoTop - 62 }, end: { x: PAGE_W - 28, y: infoTop - 62 }, thickness: 0.6, color: LINE });

  // Ticket category / quantity / price.
  const categoryY = infoTop - 88;
  page1.drawText("TICKET TYPE", { x: 28, y: categoryY, size: 7, font: bold, color: MUTED });
  page1.drawText(fitText(safe(data.eventSummary || "General"), body, 10, 290), { x: 28, y: categoryY - 19, size: 10, font: body, color: INK });
  page1.drawText("QUANTITY", { x: 354, y: categoryY, size: 7, font: bold, color: MUTED });
  page1.drawText(String(data.quantity), { x: 354, y: categoryY - 19, size: 11, font: bold, color: INK });
  page1.drawText("PRICE", { x: 438, y: categoryY, size: 7, font: bold, color: MUTED });
  const price = Number(data.ticketPrice || 0) === 0 ? "FREE" : `${data.currency || "BDT"} ${Number(data.ticketPrice).toLocaleString("en-BD")}`;
  page1.drawText(fitText(price, bold, 11, 125), { x: 438, y: categoryY - 19, size: 11, font: bold, color: ROSE });

  // Attendee details and QR are the visual anchor of the lower pass.
  const detailTop = categoryY - 58;
  page1.drawLine({ start: { x: 28, y: detailTop + 14 }, end: { x: PAGE_W - 28, y: detailTop + 14 }, thickness: 0.6, color: LINE });
  page1.drawText("PASS HOLDER", { x: 28, y: detailTop - 4, size: 7, font: bold, color: ROSE });
  page1.drawText(fitText(safe(data.attendeeName), heading, 13, 330), { x: 28, y: detailTop - 28, size: 13, font: heading, color: INK });
  if (data.attendeeEmail) page1.drawText(fitText(data.attendeeEmail, regular, 8, 340), { x: 28, y: detailTop - 47, size: 8, font: regular, color: MUTED });
  if (data.attendeePhone) page1.drawText(fitText(data.attendeePhone, regular, 8, 340), { x: 28, y: detailTop - 63, size: 8, font: regular, color: MUTED });
  page1.drawText("PASS ID", { x: 28, y: detailTop - 91, size: 7, font: bold, color: MUTED });
  page1.drawText(fitText(data.ticketId, bold, 10, 300), { x: 28, y: detailTop - 108, size: 10, font: bold, color: INK });

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&format=png&margin=8&data=${encodeURIComponent(data.bookingId)}`;
  const qr = await fetchImage(pdf, qrUrl, 12000);
  if (qr) drawLogo(page1, qr, PAGE_W - 170, detailTop - 160, 132, 132);
  else {
    page1.drawRectangle({ x: PAGE_W - 170, y: detailTop - 160, width: 132, height: 132, color: WHITE, borderColor: LINE, borderWidth: 0.6 });
    page1.drawText("QR UNAVAILABLE", { x: PAGE_W - 158, y: detailTop - 94, size: 8, font: bold, color: ROSE });
  }
  page1.drawText("SCAN FOR EVENT ENTRY", { x: PAGE_W - 174, y: detailTop - 174, size: 7, font: bold, color: MUTED });
  page1.drawText("Keep this pass private.", { x: PAGE_W - 174, y: detailTop - 188, size: 7, font: regular, color: MUTED });

  // Brand footer — logos directly on the dark strip, no logo tiles.
  page1.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 30, color: BLACK });
  drawLogo(page1, wlcLogo, 235, 3, 54, 24);
  drawLogo(page1, relaxLogo, 296, 3, 90, 24);

  // PAGE 2 — Terms & Conditions, kept separate and easy to read.
  const page2 = pdf.addPage([PAGE_W, PAGE_H]);
  page2.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: PAPER });
  page2.drawRectangle({ x: 0, y: PAGE_H - 116, width: PAGE_W, height: 116, color: BLACK });
  page2.drawText("EVENT PASS  /  WILLES LITERARY CLUB", { x: 32, y: PAGE_H - 43, size: 8, font: bold, color: WHITE });
  page2.drawText("Terms & Conditions", { x: 32, y: PAGE_H - 78, size: 24, font: bold, color: WHITE });
  page2.drawText(fitText(safe(data.eventTitle), heading, 10, PAGE_W - 64), { x: 32, y: PAGE_H - 99, size: 10, font: heading, color: rgb(0.88, 0.82, 0.82) });

  const terms = [
    "Each event pass is valid only for the event, date, time and session stated on the pass.",
    "The pass is issued to the named holder and must not be transferred, resold or duplicated.",
    "A valid photo ID may be requested by the event team to verify the pass holder.",
    "The QR code must be presented at the entry desk. Entry is subject to successful verification.",
    "Screenshots, altered copies or unauthorized reproductions may be rejected.",
    "Attendees must follow instructions from the event organizers, venue staff and security personnel.",
    "Prohibited items, disruptive conduct, harassment or unsafe behaviour may result in refusal of entry or removal.",
    "The organizers may make reasonable changes to the programme, schedule or venue when necessary.",
    "If the event is cancelled or rescheduled, the organizers will communicate the applicable arrangements through official channels.",
    "The organizers are not responsible for personal belongings that are lost, stolen or damaged at the venue.",
    "By attending, participants acknowledge that event photography or video recording may take place for documentation and promotion.",
    "The pass holder agrees to comply with all applicable venue rules and event safety requirements."
  ];
  let y = PAGE_H - 158;
  for (let i = 0; i < terms.length; i++) {
    page2.drawText(String(i + 1).padStart(2, "0"), { x: 34, y, size: 8, font: bold, color: ROSE });
    const lines = wrapText(terms[i], regular, 9, PAGE_W - 100);
    for (const line of lines) {
      page2.drawText(line, { x: 66, y, size: 9, font: regular, color: INK });
      y -= 14;
    }
    y -= 12;
  }
  page2.drawLine({ start: { x: 32, y: 72 }, end: { x: PAGE_W - 32, y: 72 }, thickness: 0.6, color: LINE });
  page2.drawText(fitText(`Pass ID: ${data.ticketId}`, regular, 7, 250), { x: 32, y: 52, size: 7, font: regular, color: MUTED });
  page2.drawText("Willes Literary Club  ·  wlc.pro.bd", { x: PAGE_W - 210, y: 52, size: 7, font: regular, color: MUTED });
  page2.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 30, color: BLACK });
  drawLogo(page2, wlcLogo, 235, 3, 54, 24);
  drawLogo(page2, relaxLogo, 296, 3, 90, 24);

  return Buffer.from(await pdf.save());
}
