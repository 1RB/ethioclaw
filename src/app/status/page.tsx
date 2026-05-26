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
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/">
            <EthioClawBrand size="md" />
          </Link>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            System Status
          </span>
        </div>
      </header>
      <main className="flex-1 px-4 py-10 md:px-6 md:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <StatusClient />
        </div>
      </main>
    </div>
  );
}
