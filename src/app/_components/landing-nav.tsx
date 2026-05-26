"use client";

import Link from "next/link";
import { ThemeToggle } from "~/components/core/theme-toggle";
import { EthioClawBrand } from "./ethioclaw-brand";

export function LandingNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b-2 border-border bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <EthioClawBrand size="md" />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="border-2 border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
