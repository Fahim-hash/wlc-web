import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Willes Literary Club — official website";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #fffaf8 0%, #f5e8e8 55%, #ead7d9 100%)",
          color: "#1c1917",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#881337",
            }}
          />
          <span style={{ fontSize: 24, letterSpacing: 5, color: "#881337" }}>
            WLC • OFFICIAL WEBSITE
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 76, lineHeight: 1.08, fontWeight: 800, maxWidth: 980 }}>
            Willes Literary Club
          </div>
          <div style={{ fontSize: 34, color: "#57534e", maxWidth: 900 }}>
            Literature, creativity, events and student voices.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24 }}>
          <span style={{ color: "#881337", fontWeight: 700 }}>Willes Little Flower School & College</span>
          <span style={{ color: "#78716c" }}>wlc.pro.bd</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
