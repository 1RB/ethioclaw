"use client";

export function BrutalistOverlay() {
  return (
    <>
      {/* Scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03] mix-blend-multiply dark:mix-blend-screen"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
        }}
        aria-hidden
      />
      {/* Subtle noise texture */}
      <div
        className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
        aria-hidden
      />
    </>
  );
}
