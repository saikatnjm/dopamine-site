import { ImageResponse } from "next/og";

// Home-screen icon (iOS). Same dice tile as app/icon.svg, on the cream background.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const pip = (left: number, top: number) => (
  <div style={{ position: "absolute", left, top, width: 30, height: 30, borderRadius: 999, background: "#1a1325" }} />
);

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff3d6" }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            width: 124,
            height: 124,
            borderRadius: 32,
            background: "#ff5c93",
            border: "8px solid #1a1325",
            boxShadow: "10px 10px 0 0 #1a1325",
          }}
        >
          {pip(14, 14)}
          {pip(39, 39)}
          {pip(64, 64)}
        </div>
      </div>
    ),
    size,
  );
}
