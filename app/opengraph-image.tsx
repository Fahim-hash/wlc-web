import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Willes Literary Club logo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function getLogoDataUrl() {
  const response = await fetch("https://wlc.pro.bd/logo.png", {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error(`Unable to load WLC logo: ${response.status}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = "";

  // Convert in chunks to avoid exceeding the argument limit on large images.
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }

  return `data:${response.headers.get("content-type") || "image/png"};base64,${btoa(binary)}`;
}

export default async function OpenGraphImage() {
  const logo = await getLogoDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#073c2d",
        }}
      >
        <img
          src={logo}
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
