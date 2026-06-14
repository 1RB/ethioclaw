import "~/styles/globals.css";

import { type Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Serif, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "~/clients/trpc";
import { ThemeProvider } from "~/components/core/theme-provider";

// Cache-buster: changes on every deploy so Telegram/social crawlers
// fetch a fresh OG image instead of serving a stale cached PNG.
const OG_CACHE = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "v4";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

const code = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ethioclaw.vercel.app"),
  title: {
    default: "EthioClaw — Your 24/7 AI Agent",
    template: "%s — EthioClaw",
  },
  description:
    "Your 24/7 AI assistant with 1000+ integrations via OAuth and sandboxed execution.",
  keywords: ["AI agent", "automation", "OpenClaw", "Telegram", "OAuth", "sandboxed"],
  authors: [{ name: "EthioClaw" }],
  creator: "EthioClaw",
  publisher: "EthioClaw",
  robots: "index, follow",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/favicon.ico" },
  ],
  openGraph: {
    title: "EthioClaw — Your 24/7 AI Agent",
    description:
      "Your AI that does things while you sleep. 1000+ integrations, sandboxed execution, full audit trails.",
    url: "https://ethioclaw.vercel.app",
    siteName: "EthioClaw",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `/api/og?cb=${OG_CACHE}`,
        width: 1200,
        height: 630,
        alt: "EthioClaw — Your agent works while you sleep",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EthioClaw — Your 24/7 AI Agent",
    description:
      "Your AI that does things while you sleep. 1000+ integrations, sandboxed execution, full audit trails.",
    creator: "@ethioclaw",
    images: [
      `/api/og?cb=${OG_CACHE}`,
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${code.variable}`} suppressHydrationWarning>
      <body className="bg-background min-h-screen font-sans antialiased">
        <ThemeProvider>
          <TRPCReactProvider>
            {children}
            <Toaster />
            <div id="dialog-portal" />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
