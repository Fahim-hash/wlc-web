import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Willes Literary Club logo";
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
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <img
          src="https://wlc.pro.bd/logo.png"
          alt="Willes Literary Club logo"
          width="360"
          height="360"
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size }
  );
}
