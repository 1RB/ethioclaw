import type { Metadata } from "next";
import Link from "next/link";
import { StatusClient } from "./_components/status-client";
import { EthioClawBrand } from "../_components/ethioclaw-brand";

export const metadata: Metadata = {
  title: "System Status — EthioClaw",
  description: "Real-time health and connectivity status for EthioClaw services.",
};

export default function StatusPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <EthioClawBrand size="md" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Status Page
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <StatusClient />
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            © 2026 EthioClaw
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            Powered by Vercel + Neon
          </span>
        </div>
      </footer>
    </div>
  );
}
