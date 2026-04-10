import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

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
          background:
            "linear-gradient(180deg, rgba(31,41,55,1) 0%, rgba(17,24,39,1) 100%)",
          color: "#f3f4f6",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 24,
            color: "#fbbf24",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
          }}
        >
          <span>Dean Lennard</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.1,
              fontWeight: 700,
              maxWidth: "900px",
            }}
          >
            Full-Stack Developer and Technical Delivery Specialist
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              color: "#d1d5db",
              maxWidth: "920px",
            }}
          >
            Web applications, technical SEO, platform delivery, and structured
            support for startups, agencies, and growing businesses.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#d1d5db",
          }}
        >
          <span>www.deanlennard.com</span>
          <span>Outbreak LTD</span>
        </div>
      </div>
    ),
    size
  );
}
