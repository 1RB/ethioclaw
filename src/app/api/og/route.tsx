import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const CRAWLER_UA =
  /bot|crawler|spider|twitterbot|facebookexternalhit|linkedinbot|discordbot|slackbot|whatsapp|pinterest|googlebot|bingbot|yandex|applebot|telegrambot|embedly|quora|outbrain/i;

export async function GET(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  if (!CRAWLER_UA.test(ua)) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    });
  }

  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "EthioClaw";
  const description = searchParams.get("description") ?? "";

  // Fetch Playfair Display bold from a reliable CDN
  let fontData: ArrayBuffer | null = null;
  try {
    const fontRes = await fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-700-normal.ttf",
      { cache: "no-store" },
    );
    if (fontRes.ok) {
      fontData = await fontRes.arrayBuffer();
    }
  } catch {
    // fallback below
  }

  // If jsdelivr fails, try google fonts CSS API
  if (!fontData) {
    try {
      const cssRes = await fetch(
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap",
        { cache: "no-store" },
      );
      const css = await cssRes.text();
      const match = /src:\s*url\(([^)]+)\)/.exec(css);
      if (match?.[1]) {
        const fontRes = await fetch(match[1], { cache: "no-store" });
        if (fontRes.ok) {
          fontData = await fontRes.arrayBuffer();
        }
      }
    } catch {
      // will use fallback
    }
  }

  const fonts: { name: string; data: ArrayBuffer; weight: 700; style: "normal" }[] = [];
  if (fontData) {
    fonts.push({
      name: "Playfair Display",
      data: fontData,
      weight: 700,
      style: "normal",
    });
  }

  const isDefault = title === "EthioClaw" && !description;

  if (isDefault) {
    try {
      const imageRes = await fetch(new URL("/og-default.jpg", request.url));
      if (imageRes.ok) {
        const buffer = await imageRes.arrayBuffer();
        return new Response(buffer, {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "no-store, max-age=0, must-revalidate",
            "CDN-Cache-Control": "no-store",
            "Vercel-CDN-Cache-Control": "no-store",
          },
        });
      }
    } catch {
      // fall through to dynamic fallback
    }
  }

  // Custom title variant
  const titleSize =
    title.length > 40 ? "56px" : title.length > 20 ? "72px" : "88px";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#161412",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 100px",
          position: "relative",
        }}
      >
        {/* Brand mark top-left */}
        <div
          style={{
            position: "absolute",
            top: "52px",
            left: "100px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderTop: "2px solid #D97B58",
              borderLeft: "2px solid #D97B58",
              transform: "rotate(12deg)",
            }}
          />
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#E8E4DF",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            EthioClaw
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "900px",
            marginTop: "24px",
          }}
        >
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              color: "#E8E4DF",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              fontFamily: fontData ? "Playfair Display" : "serif",
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: "120px",
              height: "2px",
              backgroundColor: "#D97B58",
              marginTop: "28px",
            }}
          />
          {description && (
            <div
              style={{
                fontSize: "20px",
                color: "#6B6560",
                lineHeight: 1.4,
                marginTop: "16px",
                maxWidth: "680px",
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Right: halftone dot fade — explicit SVG circles */}
        <svg
          width="540"
          height="630"
          style={{
            position: "absolute",
            right: "0px",
            top: "0px",
          }}
        >
          {Array.from({ length: 45 }).map((_, row) =>
            Array.from({ length: 39 }).map((_, col) => {
              const x = col * 14 + 7;
              const y = row * 14 + 7;
              const fade = Math.max(0, Math.min(1, (x / 540 - 0.35) / 0.65));
              return fade > 0.05 ? (
                <circle
                  key={`${row}-${col}`}
                  cx={x}
                  cy={y}
                  r="1.3"
                  fill="#D97B58"
                  opacity={fade * 0.45}
                />
              ) : null;
            })
          )}
        </svg>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    },
  );
}
