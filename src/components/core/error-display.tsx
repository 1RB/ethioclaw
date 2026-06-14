"use client";

import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";

interface ErrorDisplayProps {
  message: string;
  retryText: string;
  onRetry: (() => void) | Omit<string, "refresh"> | "refresh";
}

export function ErrorDisplay({
  message,
  retryText,
  onRetry,
}: ErrorDisplayProps) {
  const router = useRouter();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
        <AlertCircle className="h-5 w-5 text-destructive" />
      </div>
      <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
        {message}
      </p>
      {typeof onRetry === "function" && (
        <Button variant="outline" onClick={onRetry}>
          {retryText}
        </Button>
      )}
      {typeof onRetry === "string" && onRetry !== "refresh" && (
        <Button variant="outline" onClick={() => router.push(onRetry)}>
          {retryText}
        </Button>
      )}
      {onRetry === "refresh" && (
        <Button variant="outline" onClick={() => router.refresh()}>
          {retryText}
        </Button>
      )}
    </div>
  );
}
