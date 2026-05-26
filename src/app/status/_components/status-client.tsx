"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Database,
  Flame,
  MessageCircle,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  ArrowLeft,
  Server,
  Wifi,
  Zap,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";

interface ServiceStatus {
  status: "ok" | "degraded" | "error" | "unknown";
  latencyMs: number;
  message?: string;
}

interface StatusData {
  overall: string;
  timestamp: string;
  services: {
    fireworks: ServiceStatus;
    database: ServiceStatus;
    telegram: ServiceStatus;
  };
}

const SERVICE_META: Record<
  string,
  { label: string; icon: React.ElementType; description: string }
> = {
  fireworks: {
    label: "Fireworks AI",
    icon: Flame,
    description: "LLM inference and embeddings",
  },
  database: {
    label: "Database",
    icon: Database,
    description: "Neon PostgreSQL + pgvector",
  },
  telegram: {
    label: "Telegram Bot",
    icon: MessageCircle,
    description: "Webhook + messaging gateway",
  },
};

const STATUS_CONFIG: Record<
  ServiceStatus["status"],
  { color: string; bg: string; border: string; label: string }
> = {
  ok: {
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    border: "border-chart-2/20",
    label: "Operational",
  },
  degraded: {
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    label: "Degraded",
  },
  error: {
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    label: "Down",
  },
  unknown: {
    color: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border",
    label: "Unknown",
  },
};

function StatusIcon({ status }: { status: ServiceStatus["status"] }) {
  switch (status) {
    case "ok":
      return <CheckCircle2 className="h-6 w-6 text-chart-2" />;
    case "degraded":
      return <AlertTriangle className="h-6 w-6 text-amber-500" />;
    case "error":
      return <XCircle className="h-6 w-6 text-destructive" />;
    default:
      return <HelpCircle className="h-6 w-6 text-muted-foreground" />;
  }
}

function StatusBadge({ status }: { status: ServiceStatus["status"] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.unknown;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${cfg.bg} ${cfg.color} ${cfg.border}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {cfg.label}
    </span>
  );
}

function ServiceSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-12 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

function OverallSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-2 h-3 w-40 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

export function StatusClient() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as StatusData;
      setData(json);
      setLastChecked(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStatus();
    const interval = setInterval(() => void fetchStatus(), 30000);
    return () => clearInterval(interval);
  }, []);

  const overallStatus = (data?.overall as ServiceStatus["status"]) ?? "unknown";
  const overallCfg = STATUS_CONFIG[overallStatus] ?? STATUS_CONFIG.unknown;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Server className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              System Status
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time health monitoring
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastChecked && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {lastChecked.toLocaleTimeString()}
            </span>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => void fetchStatus()}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            {error}
          </div>
        </div>
      )}

      {/* Overall Status Banner */}
      {!data && !error ? (
        <OverallSkeleton />
      ) : (
        <Card
          className={`border-l-4 ${overallCfg.border} ${overallCfg.bg}`}
          style={{ borderLeftColor: "currentColor" }}
        >
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background shadow-sm">
                <StatusIcon status={overallStatus} />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Overall Status
                </p>
                <p className="text-xl font-semibold capitalize text-foreground sm:text-2xl">
                  {data?.overall ?? "Loading…"}
                </p>
              </div>
            </div>
            {data?.timestamp && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                Last check: {new Date(data.timestamp).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Service Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!data && !error ? (
          <>
            <ServiceSkeleton />
            <ServiceSkeleton />
            <ServiceSkeleton />
          </>
        ) : (
          Object.entries(data?.services ?? {}).map(([key, svc]) => {
            const meta = SERVICE_META[key];
            if (!meta) return null;
            const Icon = meta.icon;
            const cfg = STATUS_CONFIG[svc.status] ?? STATUS_CONFIG.unknown;
            return (
              <Card
                key={key}
                className={`flex flex-col transition-colors ${cfg.bg} ${cfg.border}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background shadow-sm">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div>{meta.label}</div>
                      <div className="text-xs font-normal text-muted-foreground">
                        {meta.description}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={svc.status} />
                    <span className="flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
                      <Zap className="h-3 w-3" />
                      {svc.latencyMs}ms
                    </span>
                  </div>
                  {svc.message && (
                    <p className="rounded-lg bg-background/60 p-3 text-xs leading-relaxed text-muted-foreground">
                      {svc.message}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Info footer */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Wifi className="h-3.5 w-3.5" />
          Status checks run every 30 seconds
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to EthioClaw
        </Link>
      </div>
    </div>
  );
}
