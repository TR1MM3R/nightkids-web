import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NightKids — To the hills and back";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(circle at 50% 40%, rgba(220,38,38,0.35), rgba(0,0,0,0) 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 140,
            fontWeight: 900,
            fontStyle: "italic",
            letterSpacing: -4,
            textTransform: "uppercase",
            color: "white",
          }}
        >
          NIGHT<span style={{ color: "#dc2626" }}>KIDS</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "#9ca3af",
          }}
        >
          To the hills and back
        </div>
      </div>
    ),
    { ...size }
  );
}
