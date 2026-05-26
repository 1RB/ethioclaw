import type { Metadata } from "next";
import Link from "next/link";
import { StatusClient } from "./_components/status-client";
import { EthioClawBrand } from "../_components/ethioclaw-brand";

export const metadata: Metadata = {
  title: "System Status — EthioClaw",
  description: "Real-time infrastructure health for EthioClaw services.",
};

export default function StatusPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b-2 border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="transition-opacity hover:opacity-70">
            <EthioClawBrand size="md" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              STATUS
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-5xl">
          <StatusClient />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-border">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            © 2026 ETHIOCLAW
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            VERCEL + NEON
          </span>
        </div>
      </footer>
    </div>
  );
}
