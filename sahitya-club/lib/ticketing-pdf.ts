import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage } from "pdf-lib";
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
const BLACK = rgb(0.025, 0.025, 0.025);
const PAPER = rgb(0.94, 0.94, 0.94);
const INK = rgb(0.035, 0.035, 0.035);
const MUTED = rgb(0.31, 0.31, 0.31);
const WHITE = rgb(1, 1, 1);

async function fetchImage(pdf: PDFDocument, url: string, timeout = 9000): Promise<PDFImage | null> {
  try {
    const response = await fetch(url, { cache: "force-cache", signal: AbortSignal.timeout(timeout) });
    if (!response.ok) return null;
    const bytes = new Uint8Array(await response.arrayBuffer());
    const type = response.headers.get("content-type") || "";
    if (type.includes("png") || url.toLowerCase().endsWith(".png")) return await pdf.embedPng(bytes);
    if (type.includes("jpeg") || type.includes("jpg") || /\.jpe?g(?:\?|$)/i.test(url)) return await pdf.embedJpg(bytes);
    return null;
  } catch {
    return null;
  }
}

function fitText(value: string, font: PDFFont, size: number, maxWidth: number) {
  let text = value;
  while (text.length > 1 && font.widthOfTextAtSize(text, size) > maxWidth) text = text.slice(0, -2) + "…";
  return text;
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
  const hasBengali = [data.attendeeName, data.eventTitle, data.venue, data.eventSummary || "", data.eventDescription || ""].some((value) => /[\u0980-\u09FF]/.test(value));
  let unicodeFont: PDFFont | null = null;
  if (hasBengali) {
    const bytes = await loadBengaliFont();
    if (bytes) unicodeFont = await pdf.embedFont(bytes, { subset: true });
  }
  const titleFont = unicodeFont || bold;
  const bodyFont = unicodeFont || regular;
  const nameFont = unicodeFont || bold;
  const rose = rgb(0.62, 0.07, 0.22);
  const lightGray = rgb(0.78, 0.78, 0.78);
  const page1 = pdf.addPage([PAGE_W, PAGE_H]);
  page1.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: PAPER });

  // Event banner: full-bleed top image, matching the supplied ticket reference.
  const banner = data.bannerUrl ? await fetchImage(pdf, data.bannerUrl, 12000) : null;
  if (banner) {
    const targetH = 232;
    const scale = Math.max(PAGE_W / banner.width, targetH / banner.height);
    const drawW = banner.width * scale;
    const drawH = banner.height * scale;
    page1.drawImage(banner, { x: (PAGE_W - drawW) / 2, y: PAGE_H - targetH, width: drawW, height: drawH });
  } else {
    page1.drawRectangle({ x: 0, y: PAGE_H - 232, width: PAGE_W, height: 232, color: rose });
    page1.drawText("WILLES LITERARY CLUB", { x: 32, y: PAGE_H - 48, size: 14, font: bold, color: WHITE });
    page1.drawText("EVENT ADMISSION", { x: 32, y: PAGE_H - 78, size: 9, font: bold, color: WHITE });
    let y = PAGE_H - 125;
    for (const line of wrapText(data.eventTitle, titleFont, 26, PAGE_W - 64).slice(0, 3)) {
      page1.drawText(line, { x: 32, y, size: 26, font: titleFont, color: WHITE });
      y -= 33;
    }
  }

  // Event title panel.
  page1.drawText(fitText(data.eventTitle, titleFont, 27, PAGE_W - 64), { x: 32, y: 548, size: 27, font: titleFont, color: INK });
  page1.drawLine({ start: { x: 32, y: 531 }, end: { x: PAGE_W - 32, y: 531 }, thickness: 0.7, color: lightGray });

  // Date / time / venue row.
  const eventDate = new Date(data.eventStartAt);
  const dateText = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" }).format(eventDate);
  const timeText = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit" }).format(eventDate);
  const safeVenue = unicodeFont ? data.venue : data.venue.replace(/[^\x20-\x7E]/g, "?");
  page1.drawText("DATE", { x: 32, y: 510, size: 8, font: bold, color: MUTED });
  page1.drawText(dateText, { x: 32, y: 488, size: 14, font: bold, color: INK });
  page1.drawLine({ start: { x: 190, y: 478 }, end: { x: 190, y: 520 }, thickness: 0.8, color: lightGray });
  page1.drawText("TIME", { x: 205, y: 510, size: 8, font: bold, color: MUTED });
  page1.drawText(timeText, { x: 205, y: 488, size: 14, font: bold, color: INK });
  page1.drawLine({ start: { x: 315, y: 478 }, end: { x: 315, y: 520 }, thickness: 0.8, color: lightGray });
  page1.drawText("VENUE", { x: 330, y: 510, size: 8, font: bold, color: MUTED });
  page1.drawText(fitText(safeVenue, bodyFont, 12, 230), { x: 330, y: 488, size: 12, font: bodyFont, color: INK });
  page1.drawLine({ start: { x: 32, y: 470 }, end: { x: PAGE_W - 32, y: 470 }, thickness: 0.8, color: lightGray });

  // Ticket type and price.
  page1.drawText("TICKET TYPE", { x: 32, y: 450, size: 8, font: bold, color: MUTED });
  const ticketType = data.eventSummary || "General Admission";
  const typeLines = wrapText(ticketType, bodyFont, 11, 365).slice(0, 3);
  let typeY = 428;
  for (const line of typeLines) {
    page1.drawText(line, { x: 32, y: typeY, size: 11, font: bodyFont, color: INK });
    typeY -= 14;
  }
  page1.drawText("PRICE", { x: 474, y: 450, size: 8, font: bold, color: MUTED });
  const priceText = Number(data.ticketPrice || 0) === 0 ? "FREE" : `${data.currency || "BDT"} ${Number(data.ticketPrice).toLocaleString("en-BD")}`;
  page1.drawText(fitText(priceText, bold, 17, 100), { x: 430, y: 420, size: 17, font: bold, color: INK });
  page1.drawText(`Valid for ${data.quantity} ${data.quantity === 1 ? "entry" : "entries"}`, { x: 32, y: typeY - 1, size: 9, font: regular, color: MUTED });
  page1.drawText(`Attendee: ${fitText(unicodeFont ? data.attendeeName : data.attendeeName.replace(/[^\x20-\x7E]/g, "?"), bodyFont, 9, 320)}`, { x: 32, y: typeY - 17, size: 9, font: bodyFont, color: MUTED });

  // About section.
  page1.drawText("ABOUT", { x: 32, y: 344, size: 8, font: bold, color: MUTED });
  const about = data.eventDescription || data.eventSummary || "Join us for this WLC event.";
  const aboutText = unicodeFont ? about : about.replace(/[^\x20-\x7E]/g, "?");
  let aboutY = 326;
  for (const line of wrapText(aboutText, bodyFont, 8, PAGE_W - 64).slice(0, 5)) {
    page1.drawText(line, { x: 32, y: aboutY, size: 8, font: bodyFont, color: INK });
    aboutY -= 11;
  }

  // Perforation / detachable ticket stub.
  const cutY = 255;
  for (let x = 32; x < PAGE_W - 32; x += 12) {
    page1.drawLine({ start: { x, y: cutY }, end: { x: x + 6, y: cutY }, thickness: 0.8, color: MUTED });
  }
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&format=png&margin=8&data=${encodeURIComponent(data.bookingId)}`;
  const qr = await fetchImage(pdf, qrUrl, 12000);
  if (qr) {
    page1.drawRectangle({ x: 32, y: 38, width: 198, height: 198, color: WHITE });
    drawLogo(page1, qr, 40, 46, 182, 182);
  } else {
    page1.drawRectangle({ x: 32, y: 38, width: 198, height: 198, color: WHITE });
    page1.drawText("QR UNAVAILABLE", { x: 70, y: 130, size: 11, font: bold, color: rose });
  }
  page1.drawText("TICKET NO.", { x: 260, y: 173, size: 8, font: bold, color: MUTED });
  page1.drawText(fitText(data.ticketId, bold, 16, 260), { x: 260, y: 148, size: 16, font: bold, color: INK });
  page1.drawText("ENTRY", { x: 510, y: 173, size: 8, font: bold, color: MUTED });
  page1.drawText(`×${data.quantity}`, { x: 510, y: 148, size: 16, font: bold, color: INK });
  page1.drawText("Do not share this QR code or ticket number. Both are unique", { x: 260, y: 72, size: 8, font: regular, color: MUTED });
  page1.drawText("to this ticket and are required for entry.", { x: 260, y: 60, size: 8, font: regular, color: MUTED });
  page1.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 27, color: BLACK });

  // Both partner logos sit directly on the black footer, without logo boxes.
  const wlcLogo = await fetchImage(pdf, "https://wlc.pro.bd/logo.png");
  const relaxLogo = await fetchImage(pdf, "https://wlc.pro.bd/relaxstudio.png");
  drawLogo(page1, wlcLogo, 240, 2, 54, 22);
  drawLogo(page1, relaxLogo, 301, 2, 86, 22);

  // Page two: terms & conditions sheet, matching the reference layout.
  const page2 = pdf.addPage([PAGE_W, PAGE_H]);
  page2.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: PAPER });
  page2.drawRectangle({ x: 0, y: PAGE_H - 104, width: PAGE_W, height: 104, color: BLACK });
  page2.drawText("T E R M S  &  C O N D I T I O N S", { x: 32, y: PAGE_H - 48, size: 8, font: bold, color: WHITE });
  page2.drawText(fitText(data.eventTitle, bold, 18, PAGE_W - 64), { x: 32, y: PAGE_H - 76, size: 18, font: bold, color: WHITE });
  page2.drawText("Terms & Conditions", { x: 32, y: PAGE_H - 140, size: 12, font: regular, color: INK });

  const terms = [
    "Each ticket admits one person only and is valid only for the mentioned date, time, and session.",
    "Children under 5 years may enter free when accompanied by a ticket-holding adult.",
    "Tickets are non-refundable, non-transferable, and cannot be resold.",
    "A valid photo ID must be carried; identity may be verified at entry.",
    "Security checks may be conducted. Prohibited items are not allowed inside the venue.",
    "Organizers reserve the right to change the schedule, programme, or venue when necessary.",
    "In case of event cancellation, refund or exchange arrangements will be announced by the organizers.",
    "Organizers are not responsible for loss, theft, injury, or damage to personal belongings.",
    "By entering the event premises, attendees consent to being photographed, filmed, or recorded for event-related documentation and promotion.",
    "Tickets must be obtained through official WLC ticketing channels. Fake or unauthorized tickets will not be honoured."
  ];
  let termsY = PAGE_H - 178;
  for (let i = 0; i < terms.length; i++) {
    const lines = wrapText(`* ${terms[i]}`, regular, 10, PAGE_W - 64);
    for (const line of lines) {
      if (termsY < 70) break;
      page2.drawText(line, { x: 32, y: termsY, size: 10, font: regular, color: INK });
      termsY -= 15;
    }
    termsY -= 3;
  }
  page2.drawText(fitText(`Ticket ${data.ticketId} · ${data.eventSummary || "General Admission"}`, regular, 7, PAGE_W - 64), { x: 32, y: 34, size: 7, font: regular, color: MUTED });
  page2.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 27, color: BLACK });
  drawLogo(page2, wlcLogo, 240, 2, 54, 22);
  drawLogo(page2, relaxLogo, 301, 2, 86, 22);

  return Buffer.from(await pdf.save());
}
