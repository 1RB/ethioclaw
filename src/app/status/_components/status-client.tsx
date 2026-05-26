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
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

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
  { label: string; icon: React.ElementType }
> = {
  fireworks: { label: "Fireworks AI", icon: Flame },
  database: { label: "Database", icon: Database },
  telegram: { label: "Telegram Bot", icon: MessageCircle },
};

function StatusIcon({ status }: { status: ServiceStatus["status"] }) {
  switch (status) {
    case "ok":
      return <CheckCircle2 className="h-5 w-5 text-chart-2" />;
    case "degraded":
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case "error":
      return <XCircle className="h-5 w-5 text-destructive" />;
    default:
      return <HelpCircle className="h-5 w-5 text-muted-foreground" />;
  }
}

function StatusBadge({ status }: { status: ServiceStatus["status"] }) {
  const map: Record<string, string> = {
    ok: "bg-chart-2/10 text-chart-2",
    degraded: "bg-amber-500/10 text-amber-500",
    error: "bg-destructive/10 text-destructive",
    unknown: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${map[status] ?? map.unknown}`}
    >
      {status}
    </span>
  );
}

export function StatusClient() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as StatusData;
      setData(json);
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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            System Status
          </h1>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchStatus}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Overall
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <StatusIcon
              status={
                (data?.overall as ServiceStatus["status"]) ?? "unknown"
              }
            />
            <span className="text-lg font-semibold capitalize text-foreground">
              {data?.overall ?? "Loading…"}
            </span>
          </div>
          {data?.timestamp && (
            <p className="mt-2 text-xs text-muted-foreground">
              Last updated: {new Date(data.timestamp).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Object.entries(data?.services ?? {}).map(([key, svc]) => {
          const meta = SERVICE_META[key];
          if (!meta) return null;
          const Icon = meta.icon;
          return (
            <Card key={key} className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {meta.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3">
                <div className="flex items-center justify-between">
                  <StatusBadge status={svc.status} />
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {svc.latencyMs}ms
                  </span>
                </div>
                {svc.message && (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {svc.message}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!data && !error && (
        <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Checking services...
        </div>
      )}
    </div>
  );
}
