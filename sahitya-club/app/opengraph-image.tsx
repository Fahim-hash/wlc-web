import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "উইল্‌স সাহিত্য ক্লাব — সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const letters = ["অ", "ক", "স", "শ", "ব", "ম", "ল", "র", "ত", "ন", "প", "আ"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 64px",
          background: "linear-gradient(135deg, #fffdfb 0%, #faf3f1 55%, #f0e1e2 100%)",
          color: "#1c1917",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ position: "absolute", top: -180, right: -95, width: 510, height: 510, borderRadius: 255, border: "1px solid rgba(136,19,55,0.12)", display: "flex" }} />
        <div style={{ position: "absolute", top: -125, right: -40, width: 400, height: 400, borderRadius: 200, border: "1px solid rgba(136,19,55,0.10)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -230, left: -90, width: 520, height: 520, borderRadius: 260, background: "rgba(136,19,55,0.045)", display: "flex" }} />
        {letters.map((letter, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: [70, 185, 315, 890, 1015, 1100, 80, 1030, 900, 240, 1080, 960][index],
              top: [75, 170, 40, 65, 180, 330, 470, 480, 545, 530, 85, 390][index],
              fontSize: index % 3 === 0 ? 42 : 30,
              color: "rgba(136,19,55,0.10)",
              display: "flex",
            }}
          >
            {letter}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 26 }}>
          <img
            src="https://wlc.pro.bd/logo.png"
            width="82"
            height="82"
            style={{ objectFit: "contain" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 19, letterSpacing: 3, color: "#881337", fontWeight: 700 }}>WILLES LITTLE FLOWER SCHOOL & COLLEGE</span>
            <span style={{ fontSize: 16, letterSpacing: 4, color: "#78716c" }}>OFFICIAL LITERARY CLUB</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <div style={{ fontSize: 70, lineHeight: 1.2, fontWeight: 800, color: "#1c1917" }}>
            উইল্‌স সাহিত্য ক্লাব
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 2, background: "#be7188", display: "flex" }} />
            <div style={{ fontSize: 30, color: "#881337", fontWeight: 600 }}>
              সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে
            </div>
            <div style={{ width: 48, height: 2, background: "#be7188", display: "flex" }} />
          </div>
          <div style={{ marginTop: 12, fontSize: 21, color: "#57534e" }}>
            বাংলা সাহিত্য • সৃজনশীলতা • শিক্ষার্থীদের প্রতিভা
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 30, left: 64, right: 64, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(136,19,55,0.18)", paddingTop: 17, color: "#78716c", fontSize: 18 }}>
          <span>EST. 2024</span>
          <span style={{ color: "#881337", fontWeight: 700 }}>wlc.pro.bd</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
