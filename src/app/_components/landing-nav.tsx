"use client";

import Link from "next/link";
import { ThemeToggle } from "~/components/core/theme-toggle";
import { EthioClawBrand } from "./ethioclaw-brand";

export function LandingNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 md:px-8">
        <EthioClawBrand size="md" logoLink="/" />
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-5 text-xs font-medium text-muted-foreground sm:flex">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/status" className="transition-colors hover:text-foreground">
              Status
            </Link>
          </nav>
          <ThemeToggle />
          <Link
            href="/login"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Launch Agent
          </Link>
        </div>
      </div>
    </header>
  );
}
