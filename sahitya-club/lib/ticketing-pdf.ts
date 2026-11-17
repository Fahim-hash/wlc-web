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
};

export async function createTicketPdf(data: TicketPdfData) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const hasBengali = [data.attendeeName, data.eventTitle, data.venue].some((value) => /[\u0980-\u09FF]/.test(value));
  let unicodeFont: PDFFont | null = null;
  if (hasBengali) {
    const bengaliBytes = await loadBengaliFont();
    if (bengaliBytes) {
      pdf.registerFontkit(fontkit);
      unicodeFont = await pdf.embedFont(bengaliBytes, { subset: true });
    }
  }
  const attendeeFont = unicodeFont || bold;
  const titleFont = unicodeFont || bold;
  const venueFont = unicodeFont || regular;
  const rose = rgb(0.624, 0.071, 0.224);
  const ink = rgb(0.11, 0.098, 0.09);
  const muted = rgb(0.42, 0.43, 0.45);
  const pale = rgb(0.992, 0.949, 0.961);
  const white = rgb(1, 1, 1);
  const left = 48;
  const width = 499;

  page.drawRectangle({ x: 0, y: 590, width: 595.28, height: 251.89, color: rose });
  page.drawText("WILLES LITERARY CLUB", { x: left, y: 790, size: 11, font: bold, color: white, characterSpacing: 2 });
  page.drawText("EVENT ADMISSION", { x: left, y: 752, size: 10, font: bold, color: rgb(1, 0.82, 0.88), characterSpacing: 1.6 });
  let titleSize = 27;
  let titleLines = wrapText(data.eventTitle, titleFont, titleSize, 430);
  while (titleLines.length > 3 && titleSize > 17) {
    titleSize -= 2;
    titleLines = wrapText(data.eventTitle, titleFont, titleSize, 430);
  }
  titleLines = titleLines.slice(0, 3);
  let titleY = 708;
  for (const line of titleLines) {
    page.drawText(line, { x: left, y: titleY, size: 27, font: titleFont, color: white });
    titleY -= 34;
  }
  const date = new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Dhaka" }).format(new Date(data.eventStartAt));
  page.drawText(date, { x: left, y: 620, size: 10, font: regular, color: white });
  page.drawText(unicodeFont ? data.venue.slice(0, 90) : data.venue.slice(0, 90).replace(/[^\x20-\x7E]/g, "?"), { x: left, y: 600, size: 10, font: venueFont, color: rgb(1, 0.88, 0.91) });

  page.drawText("ATTENDEE", { x: left, y: 548, size: 9, font: bold, color: muted, characterSpacing: 1.5 });
  const name = data.attendeeName.length > 42 ? data.attendeeName.slice(0, 39) + "…" : data.attendeeName;
  const safeName = unicodeFont ? name : name.replace(/[^\x20-\x7E]/g, "?");\n  page.drawText(safeName, { x: left, y: 518, size: 21, font: attendeeFont, color: ink });
  page.drawText(`${data.quantity} ${data.quantity === 1 ? "ticket" : "tickets"} · FREE ADMISSION`, { x: left, y: 493, size: 10, font: regular, color: muted });
  page.drawRectangle({ x: left, y: 380, width, height: 82, color: pale, borderColor: rgb(0.98, 0.66, 0.81), borderWidth: 1 });
  page.drawText("TICKET ID", { x: left + 18, y: 437, size: 8, font: bold, color: muted, characterSpacing: 1.4 });
  page.drawText(data.ticketId, { x: left + 18, y: 408, size: 17, font: bold, color: rose });
  page.drawText(`Booking reference: ${data.bookingId}`, { x: left + 18, y: 390, size: 8, font: regular, color: muted });

  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&format=png&margin=8&data=${encodeURIComponent(data.bookingId)}`;
    const response = await fetch(qrUrl, { cache: "no-store", signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error("QR image service unavailable.");
    const qr = await pdf.embedPng(new Uint8Array(await response.arrayBuffer()));
    page.drawImage(qr, { x: 65, y: 158, width: 142, height: 142 });
  } catch {
    page.drawRectangle({ x: 65, y: 158, width: 142, height: 142, borderColor: rose, borderWidth: 1 });
    page.drawText("QR unavailable", { x: 91, y: 226, size: 10, font: bold, color: rose });
  }
  page.drawText("ENTRY VERIFICATION", { x: 230, y: 276, size: 9, font: bold, color: rose, characterSpacing: 1 });
  page.drawText("Present this QR code at the event desk.", { x: 230, y: 252, size: 9, font: regular, color: ink });
  page.drawText("Staff will scan it to verify your booking.", { x: 230, y: 236, size: 9, font: regular, color: ink });
  page.drawText("Keep this ticket private.", { x: 230, y: 210, size: 9, font: bold, color: muted });
  page.drawLine({ start: { x: left, y: 112 }, end: { x: 547, y: 112 }, thickness: 1, color: rgb(0.9, 0.9, 0.9) });
  page.drawText("Willes Literary Club · wlc.pro.bd", { x: left, y: 88, size: 9, font: bold, color: rose });
  page.drawText("This ticket is valid only for the event shown above.", { x: left, y: 70, size: 8, font: regular, color: muted });
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
