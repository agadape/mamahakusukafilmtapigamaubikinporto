import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Untitled Project";
    const techString = searchParams.get("tech") || "";
    const tech = techString ? techString.split(",").filter(Boolean) : [];

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 40,
            background: "linear-gradient(135deg, #14181c 0%, #1a2228 100%)",
            border: "8px solid #00E054", // Aksen hijau khas Letterboxd
          }}
        >
          {/* Decorative Top Elements */}
          <div style={{ position: "absolute", top: 40, left: 40, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF8000" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#00E054" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#40BCF4" }} />
          </div>
          <div style={{ position: "absolute", top: 40, right: 40, color: "#8a949e", fontSize: 24, fontWeight: "bold" }}>
            A FILM BY AGADAPE
          </div>

          <div
            style={{
              fontSize: 64,
              color: "white",
              fontWeight: 800,
              fontFamily: "sans-serif",
              letterSpacing: "-0.05em",
              lineHeight: 1.1,
              textTransform: "uppercase",
              textShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            {title}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            {tech.map((t) => (
              <div
                key={t}
                style={{
                  fontSize: 24,
                  color: "#00E054",
                  background: "rgba(0, 224, 84, 0.1)",
                  border: "2px solid rgba(0, 224, 84, 0.3)",
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      ),
      {
        width: 600,
        height: 900, // Format vertikal seperti poster film
      }
    );
  } catch (e: any) {
    return new Response("Failed to generate image", { status: 500 });
  }
}
