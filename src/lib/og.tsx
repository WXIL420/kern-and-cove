import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

export function renderOg() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F4F1EA",
          color: "#191B19",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34 }}>
          <div style={{ width: 22, height: 22, borderRadius: 22, background: "#B45F43" }} />
          Kern &amp; Cove
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, lineHeight: 1.02, letterSpacing: -3, display: "flex" }}>A quieter way to work.</div>
          <div style={{ fontSize: 30, marginTop: 28, color: "#55584F", fontFamily: "sans-serif", display: "flex" }}>
            Desk accessories &amp; workspace organization
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            fontFamily: "sans-serif",
            borderTop: "2px solid #C9C2B5",
            paddingTop: 24,
            color: "#39483B",
          }}
        >
          <span>Portfolio demonstration</span>
          <span>No payment collected · Fictional brand</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
