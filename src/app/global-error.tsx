"use client";

import type Error from "next/error";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;
  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen flex items-center justify-center p-6">
        <div className="mx-auto max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <h1 className="mb-2 text-xl font-bold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            We encountered an unexpected error. Try refreshing the page, or contact support if the issue persists.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
