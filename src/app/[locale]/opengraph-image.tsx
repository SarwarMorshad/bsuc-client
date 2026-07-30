import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Branded Open Graph card shown when a link is shared (WhatsApp, Facebook,
 * LinkedIn…). Kept to Latin text — ImageResponse would need an embedded
 * Bengali font to render Bangla correctly.
 */
export default async function OpengraphImage() {
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
          background:
            "linear-gradient(150deg, #2A3D66 0%, #16324A 45%, #006A4E 100%)",
          color: "#F5F3EC",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* stitched border frame */}
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 36,
            right: 36,
            bottom: 36,
            border: "3px dashed rgba(245,243,236,0.35)",
            borderRadius: 12,
            display: "flex",
          }}
        />

        <div
          style={{
            fontSize: 30,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#E5A32B",
            display: "flex",
          }}
        >
          BSUC
        </div>

        <div
          style={{
            fontSize: 74,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.1,
            marginTop: 18,
            maxWidth: 940,
            display: "flex",
          }}
        >
          {siteConfig.name}
        </div>

        {/* running stitch */}
        <div style={{ display: "flex", gap: 10, marginTop: 30 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 34,
                height: 6,
                borderRadius: 3,
                background: i % 2 ? "#B23A48" : "#E5A32B",
                display: "flex",
              }}
            />
          ))}
        </div>

        <div
          style={{
            fontSize: 30,
            marginTop: 30,
            color: "rgba(245,243,236,0.85)",
            textAlign: "center",
            maxWidth: 820,
            display: "flex",
          }}
        >
          A home away from home for Bangladeshi students in Chemnitz
        </div>
      </div>
    ),
    { ...size },
  );
}
