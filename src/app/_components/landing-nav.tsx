"use client";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "~/components/core/theme-toggle";
import { EthioClawBrand } from "./ethioclaw-brand";

export function LandingNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b-2 border-border bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8">
        <EthioClawBrand size="md" logoLink="/" />
        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button
              size="sm"
              className="h-8 rounded-none border border-border bg-transparent px-3 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-foreground hover:text-background md:h-9 md:px-4"
            >
              ENTER
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
