import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

interface OgOptions {
  title?: string;
  kicker?: string;
  footerLeft?: string;
  footerRight?: string;
}

export function renderOg({
  title = "A quieter way to work.",
  kicker = "Desk accessories & workspace organization",
  footerLeft = "Portfolio demonstration",
  footerRight = "Fictional brand · Nothing is for sale",
}: OgOptions = {}) {
  return new ImageResponse(
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
        <div
          style={{
            fontSize: title.length > 24 ? 96 : 120,
            lineHeight: 1.02,
            letterSpacing: -3,
            display: "flex",
          }}
        >
          {title}
        </div>
        <div
          style={{ fontSize: 30, marginTop: 28, color: "#55584F", fontFamily: "sans-serif", display: "flex" }}
        >
          {kicker}
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
        <span>{footerLeft}</span>
        <span>{footerRight}</span>
      </div>
    </div>,
    ogSize,
  );
}
