"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    void errorInfo;
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">
            Something went wrong
          </h2>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            {this.state.error?.message ?? "An unexpected error occurred"}
          </p>
          <Button
            variant="outline"
            onClick={() =>
              this.setState({ hasError: false, error: undefined })
            }
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
