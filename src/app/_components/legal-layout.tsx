"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { EthioClawBrand } from "./ethioclaw-brand";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="bg-background flex min-h-screen flex-col overflow-x-hidden text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back
          </Link>
          <EthioClawBrand size="sm" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 md:px-8 md:py-24">
        <div className="mb-12 md:mb-16">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            {title}
          </h1>
        </div>

        <article className="prose-custom">
          {children}
        </article>
      </main>

      <footer className="border-t border-border/60 px-6 py-6 md:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <EthioClawBrand size="sm" />
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="transition-colors hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">Terms</Link>
            <Link href="/status" className="transition-colors hover:text-foreground">Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
