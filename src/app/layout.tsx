import "~/styles/globals.css";

import { type Metadata } from "next";
import { IBM_Plex_Mono, Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "~/clients/trpc";
import { ThemeProvider } from "~/components/core/theme-provider";

const primary = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const code = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ETHIOCLAW \u2014 AUTONOMOUS AI AGENT",
  description:
    "EthioClaw is a secure AI agent with 1000+ tool integrations via OAuth and sandboxed execution.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "ETHIOCLAW \u2014 AUTONOMOUS AI AGENT",
    description:
      "Your AI that does things while you sleep. 1000+ integrations, sandboxed execution, full audit trails.",
    url: "https://ethioclaw.vercel.app",
    siteName: "EthioClaw",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ETHIOCLAW \u2014 Your agent works while you sleep",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ETHIOCLAW \u2014 AUTONOMOUS AI AGENT",
    description:
      "Your AI that does things while you sleep. 1000+ integrations, sandboxed execution, full audit trails.",
    images: ["/og.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${primary.variable} ${display.variable} ${code.variable}`} suppressHydrationWarning>
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
