import "regenerator-runtime/runtime";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export type MemberPdfRecord = {
  memberId?: unknown;
  name?: unknown;
  batch?: unknown;
  phone?: unknown;
};

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const HEADER_HEIGHT = 180.59 * 0.75;
const FOOTER_HEIGHT = 30.13 * 0.75;
const LEFT = 30;
const RIGHT = 30;
const TABLE_WIDTH = PAGE_WIDTH - LEFT - RIGHT;
const COLS = [
  { key: "name", label: "Name", width: 205 },
  { key: "class", label: "Class", width: 78 },
  { key: "memberId", label: "Member ID", width: 112 },
  { key: "phone", label: "Masked Number", width: TABLE_WIDTH - 205 - 78 - 112 },
] as const;
const LINE_HEIGHT = 12.4;
const FONT_SIZE = 9.4;

function clean(value: unknown) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function onlyDigits(value: unknown) {
  return clean(value).replace(/\D/g, "");
}

function maskedPhone(value: unknown) {
  const raw = onlyDigits(value);
  if (!raw || raw === "01000000000") return "";
  if (raw.length <= 5) return "x".repeat(raw.length);
  return raw.slice(0, 2) + "x".repeat(raw.length - 5) + raw.slice(-3);
}

type FontSet = { latin: PDFFont; bengali: PDFFont; boldLatin: PDFFont; boldBengali: PDFFont };

function isBengali(char: string) {
  return /[\u0980-\u09FF]/.test(char);
}

function textRuns(text: string, fonts: FontSet, bold = false) {
  const runs: Array<{ text: string; font: PDFFont }> = [];
  for (const char of Array.from(text)) {
    const useBengali = isBengali(char);
    const font = useBengali ? (bold ? fonts.boldBengali : fonts.bengali) : (bold ? fonts.boldLatin : fonts.latin);
    const previous = runs[runs.length - 1];
    if (previous && previous.font === font) previous.text += char;
    else runs.push({ text: char, font });
  }
  return runs;
}

function measureText(text: string, fonts: FontSet, size: number) {
  return textRuns(text, fonts).reduce((total, run) => total + run.font.widthOfTextAtSize(run.text, size), 0);
}

function wrapText(text: string, fonts: FontSet, size: number, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [""];
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? line + " " + word : word;
    if (measureText(candidate, fonts, size) <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = "";
    for (const char of Array.from(word)) {
      if (line && measureText(line + char, fonts, size) > maxWidth) {
        lines.push(line);
        line = char;
      } else line += char;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawTopText(page: PDFPage, text: string, x: number, top: number, fonts: FontSet, size: number, color = rgb(0.16, 0.13, 0.13), bold = false) {
  let cursorX = x;
  for (const run of textRuns(text, fonts, bold)) {
    page.drawText(run.text, { x: cursorX, y: PAGE_HEIGHT - top - size, font: run.font, size, color });
    cursorX += run.font.widthOfTextAtSize(run.text, size);
  }
}

function drawPageFrame(page: PDFPage, header: Awaited<ReturnType<PDFDocument["embedPng"]>>, footer: Awaited<ReturnType<PDFDocument["embedPng"]>>) {
  page.drawImage(header, { x: 0, y: PAGE_HEIGHT - HEADER_HEIGHT, width: PAGE_WIDTH, height: HEADER_HEIGHT });
  page.drawImage(footer, { x: 0, y: 0, width: PAGE_WIDTH, height: FOOTER_HEIGHT });
}

export async function generateMemberDirectoryPdf(records: MemberPdfRecord[]) {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "https://wlc.pro.bd")).replace(/\/$/, "");
  const [headerResponse, footerResponse] = await Promise.all([
    fetch(origin + "/Header@500x.png", { cache: "no-store" }),
    fetch(origin + "/Footer@500x.png", { cache: "no-store" }),
  ]);
  if (!headerResponse.ok || !footerResponse.ok) {
    throw new Error("WLC PDF header/footer images could not be loaded. Check the public Header@500x.png and Footer@500x.png assets.");
  }
  const [headerBytes, footerBytes, regularBytes] = await Promise.all([
    headerResponse.arrayBuffer(),
    footerResponse.arrayBuffer(),
    readFile(join(process.cwd(), "node_modules/@fontsource/noto-sans-bengali/files/noto-sans-bengali-bengali-400-normal.woff2")),
  ]);

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const bengaliBoldBytes = await readFile(join(process.cwd(), "node_modules/@fontsource/noto-sans-bengali/files/noto-sans-bengali-bengali-700-normal.woff2"));
  const latinRegularBytes = await readFile(join(process.cwd(), "node_modules/@fontsource/noto-sans-bengali/files/noto-sans-bengali-latin-400-normal.woff2"));
  const latinBoldBytes = await readFile(join(process.cwd(), "node_modules/@fontsource/noto-sans-bengali/files/noto-sans-bengali-latin-700-normal.woff2"));
  const fonts: FontSet = {
    bengali: await pdf.embedFont(regularBytes, { subset: true }),
    boldBengali: await pdf.embedFont(bengaliBoldBytes, { subset: true }),
    latin: await pdf.embedFont(latinRegularBytes, { subset: true }),
    boldLatin: await pdf.embedFont(latinBoldBytes, { subset: true }),
  };
  const header = await pdf.embedPng(headerBytes);
  const footer = await pdf.embedPng(footerBytes);

  const contentTop = HEADER_HEIGHT + 19;
  const contentBottom = FOOTER_HEIGHT + 31;
  const tableHeaderHeight = 27;
  let page: PDFPage = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let cursorTop = 0;
  const pages: PDFPage[] = [];

  const addPage = (first = false) => {
    if (!first) page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);
    drawPageFrame(page, header, footer);
    cursorTop = contentTop;
    page.drawRectangle({
      x: LEFT, y: PAGE_HEIGHT - cursorTop - tableHeaderHeight, width: TABLE_WIDTH, height: tableHeaderHeight,
      color: rgb(0.34, 0.09, 0.15),
    });
    let x = LEFT;
    for (const col of COLS) {
      drawTopText(page, col.label, x + 8, cursorTop + 8, fonts, 9, rgb(1, 1, 1), true);
      x += col.width;
    }
    cursorTop += tableHeaderHeight;
  };

  addPage(true);
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    const name = clean(record.name) || "Name not provided";
    const className = clean(record.batch) || "—";
    const phone = maskedPhone(record.phone);
    const memberId = clean(record.memberId) || "WLC-03-" + String(index + 1).padStart(3, "0");
    const nameLines = wrapText(name, fonts, FONT_SIZE, COLS[0].width - 16);
    const classLines = wrapText(className, fonts, FONT_SIZE, COLS[1].width - 16);
    const memberIdLines = wrapText(memberId, fonts, FONT_SIZE, COLS[2].width - 16);
    const phoneLines = wrapText(phone, fonts, FONT_SIZE, COLS[3].width - 16);
    const lineCount = Math.max(1, nameLines.length, classLines.length, memberIdLines.length, phoneLines.length);
    const rowHeight = Math.max(29, lineCount * LINE_HEIGHT + 12);

    if (cursorTop + rowHeight > PAGE_HEIGHT - contentBottom) addPage();

    const rowTop = cursorTop;
    page.drawRectangle({
      x: LEFT, y: PAGE_HEIGHT - rowTop - rowHeight, width: TABLE_WIDTH, height: rowHeight,
      color: index % 2 === 0 ? rgb(0.985, 0.976, 0.965) : rgb(1, 1, 1),
      borderColor: rgb(0.88, 0.85, 0.82), borderWidth: 0.45,
    });
    const allCells = [nameLines.join("\n"), classLines.join("\n"), memberIdLines.join("\n"), phoneLines.join("\n")];
    let x = LEFT;
    for (let colIndex = 0; colIndex < COLS.length; colIndex += 1) {
      const col = COLS[colIndex];
      const lines = allCells[colIndex].split("\n");
      const usedHeight = lines.length * LINE_HEIGHT;
      let top = rowTop + Math.max(5, (rowHeight - usedHeight) / 2);
      for (const line of lines) {
        drawTopText(page, line, x + 8, top, fonts, FONT_SIZE, undefined, colIndex === 0);
        top += LINE_HEIGHT;
      }
      x += col.width;
    }
    cursorTop += rowHeight;
  }

  pages.forEach((currentPage, index) => {
    const label = "Page " + (index + 1) + " of " + pages.length;
    const width = measureText(label, fonts, 8);
    currentPage.drawText(label, {
      x: PAGE_WIDTH - RIGHT - width,
      y: FOOTER_HEIGHT + 8,
      font: fonts.latin,
      size: 8,
      color: rgb(0.35, 0.31, 0.29),
    });
  });

  return Buffer.from(await pdf.save());
}
