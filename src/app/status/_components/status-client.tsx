"use client";

import { useEffect, useState, useCallback } from "react";
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
  Zap,
  Globe,
  TrendingUp,
  Wifi,
  ServerCrash,
  Signal,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

interface ServiceStatus {
  status: "ok" | "degraded" | "error" | "unknown";
  latencyMs: number;
  message?: string;
}

interface StatusData {
  overall: string;
  timestamp: string;
  region: string;
  services: {
    fireworks: ServiceStatus;
    database: ServiceStatus;
    telegram: ServiceStatus;
  };
}

interface HistoryEntry {
  timestamp: number;
  overall: string;
  services: Record<string, ServiceStatus>;
}

/* ------------------------------------------------------------------ */
/*  CONFIG                                                            */
/* ------------------------------------------------------------------ */

const SERVICE_META: Record<
  string,
  { label: string; short: string; icon: React.ElementType; description: string }
> = {
  fireworks: {
    label: "Fireworks AI",
    short: "LLM API",
    icon: Flame,
    description: "Inference & embeddings",
  },
  database: {
    label: "Database",
    short: "PostgreSQL",
    icon: Database,
    description: "Neon PostgreSQL + pgvector",
  },
  telegram: {
    label: "Telegram Bot",
    short: "Telegram",
    icon: MessageCircle,
    description: "Webhook & messaging",
  },
};

const STATUS_META: Record<
  ServiceStatus["status"],
  {
    label: string;
    dot: string;
    text: string;
    bg: string;
    border: string;
    icon: React.ElementType;
  }
> = {
  ok: {
    label: "Operational",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  degraded: {
    label: "Degraded",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50/50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-800",
    icon: AlertTriangle,
  },
  error: {
    label: "Down",
    dot: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-50/50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800",
    icon: XCircle,
  },
  unknown: {
    label: "Unknown",
    dot: "bg-slate-400",
    text: "text-slate-500 dark:text-slate-400",
    bg: "bg-slate-50/50 dark:bg-slate-950/20",
    border: "border-slate-200 dark:border-slate-700",
    icon: HelpCircle,
  },
};

const HISTORY_KEY = "ethioclaw-status-history";
const MAX_HISTORY = 90;

/* ------------------------------------------------------------------ */
/*  HELPERS                                                           */
/* ------------------------------------------------------------------ */

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(-MAX_HISTORY)));
  } catch {
    /* ignore */
  }
}

function nowLabel(d = new Date()): string {
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function ago(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function uptimePct(history: HistoryEntry[], key: string): number {
  if (history.length === 0) return 100;
  const ok = history.filter((h) => h.services[key]?.status === "ok").length;
  return Math.round((ok / history.length) * 100);
}

/* ------------------------------------------------------------------ */
/*  COMPONENTS                                                        */
/* ------------------------------------------------------------------ */

function StatusDot({ status, pulse = false }: { status: ServiceStatus["status"]; pulse?: boolean }) {
  const meta = STATUS_META[status] ?? STATUS_META.unknown;
  return (
    <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${meta.dot}`}>
      {pulse && status === "ok" && (
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-30 ${meta.dot}`} />
      )}
    </span>
  );
}

function LatencyBar({ ms, max = 2000 }: { ms: number; max?: number }) {
  const pct = Math.min(100, Math.round((ms / max) * 100));
  let color = "bg-emerald-500";
  if (pct > 50) color = "bg-amber-500";
  if (pct > 80) color = "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%`, transition: "width 0.4s ease" }} />
      </div>
      <span className="w-12 text-right font-mono text-[11px] tabular-nums text-muted-foreground">{ms}ms</span>
    </div>
  );
}

function UptimeBars({ history, key }: { history: HistoryEntry[]; key: string }) {
  // Show last 30 entries as tiny bars
  const entries = history.slice(-30);
  const padding = 30 - entries.length;
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 24 }}>
      {Array.from({ length: padding }).map((_, i) => (
        <div key={`pad-${i}`} className="w-1 rounded-sm bg-muted/50" style={{ height: 6 }} />
      ))}
      {entries.map((h, i) => {
        const s = h.services[key]?.status ?? "unknown";
        const h2 = s === "ok" ? 20 : s === "degraded" ? 14 : 8;
        const bg =
          s === "ok"
            ? "bg-emerald-500"
            : s === "degraded"
              ? "bg-amber-500"
              : "bg-red-500";
        return (
          <div
            key={i}
            className={`w-1 rounded-sm ${bg} opacity-80`}
            style={{ height: h2, transition: "height 0.3s ease" }}
            title={`${nowLabel(new Date(h.timestamp))} — ${STATUS_META[s]?.label ?? s}`}
          />
        );
      })}
    </div>
  );
}

function ServiceRow({
  name,
  svc,
  history,
}: {
  name: string;
  svc: ServiceStatus;
  history: HistoryEntry[];
}) {
  const meta = SERVICE_META[name];
  const status = STATUS_META[svc.status] ?? STATUS_META.unknown;
  const Icon = meta?.icon ?? ServerCrash;
  const pct = uptimePct(history, name);

  return (
    <div
      className={`group flex flex-col gap-3 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center sm:gap-6 sm:p-5 ${status.bg} ${status.border}`}
    >
      {/* Icon + Name */}
      <div className="flex items-center gap-3 sm:w-48 sm:shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background shadow-sm">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{meta?.label ?? name}</div>
          <div className="text-xs text-muted-foreground">{meta?.description ?? ""}</div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 sm:w-32 sm:shrink-0">
        <StatusDot status={svc.status} pulse={svc.status === "ok"} />
        <span className={`text-sm font-medium ${status.text}`}>{status.label}</span>
      </div>

      {/* Latency bar */}
      <div className="flex-1">
        <LatencyBar ms={svc.latencyMs} />
        {svc.message && (
          <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">{svc.message}</p>
        )}
      </div>

      {/* Uptime bars */}
      <div className="sm:w-32 sm:shrink-0">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Uptime</span>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{pct}%</span>
        </div>
        <UptimeBars history={history} key={name} />
      </div>
    </div>
  );
}

function HeroStatus({ status, timestamp }: { status: string; timestamp: string }) {
  const s = (status as ServiceStatus["status"]) ?? "unknown";
  const meta = STATUS_META[s] ?? STATUS_META.unknown;
  const Icon = meta.icon;

  return (
    <div className="flex flex-col items-center gap-5 py-8 sm:py-12">
      <div className={`relative flex h-16 w-16 items-center justify-center rounded-full border-2 ${meta.bg} ${meta.border} sm:h-20 sm:w-20`}>
        <Icon className={`h-8 w-8 sm:h-10 sm:w-10 ${meta.text}`} />
        {s === "ok" && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-20 ${meta.dot}`} />
        )}
      </div>
      <div className="text-center">
        <h2 className={`text-2xl font-bold tracking-tight sm:text-3xl ${meta.text}`}>
          {s === "ok" ? "All Systems Operational" : s === "degraded" ? "Partial System Outage" : "Major System Outage"}
        </h2>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          Last updated: {nowLabel(new Date(timestamp))} UTC
        </p>
      </div>
    </div>
  );
}

function IncidentRow({ entry }: { entry: HistoryEntry }) {
  const badServices = Object.entries(entry.services).filter(([, s]) => s.status !== "ok");
  if (badServices.length === 0) return null;

  return (
    <div className="border-l-2 border-red-200 pl-4 dark:border-red-800">
      <div className="font-mono text-[11px] text-muted-foreground">
        {new Date(entry.timestamp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div className="mt-1 text-sm text-foreground">
        {badServices.map(([name, svc]) => {
          const meta = SERVICE_META[name];
          const sm = STATUS_META[svc.status];
          return (
            <span key={name} className="mr-2 inline-flex items-center gap-1.5">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${sm?.dot ?? "bg-slate-400"}`} />
              {meta?.label ?? name}: {svc.message ?? sm?.label ?? svc.status}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function MetaPill({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs">
      <Icon className="h-3 w-3 text-muted-foreground" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-mono font-medium text-foreground">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export function StatusClient() {
  const [data, setData] = useState<StatusData | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [nextRefresh, setNextRefresh] = useState(30);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as StatusData;
      setData(json);
      setLastChecked(new Date());
      setNextRefresh(30);

      // Save to history
      const entry: HistoryEntry = {
        timestamp: Date.now(),
        overall: json.overall,
        services: json.services,
      };
      setHistory((prev) => {
        const next = [...prev, entry].slice(-MAX_HISTORY);
        saveHistory(next);
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch status");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + polling
  useEffect(() => {
    // Load persisted history
    setHistory(loadHistory());
    void fetchStatus();
    const interval = setInterval(() => void fetchStatus(), 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Countdown tick
  useEffect(() => {
    const tick = setInterval(() => setNextRefresh((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(tick);
  }, []);

  // Incident history = all non-ok entries, newest first
  const incidents = history.filter((h) => h.overall !== "ok").reverse();

  return (
    <div className="flex flex-col gap-10">
      {/* ── Header ── */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/50">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">System Status</h1>
            <p className="text-xs text-muted-foreground">Real-time infrastructure health</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastChecked && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="hidden font-mono sm:inline">Next: {nextRefresh}s</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {ago(Date.now() - lastChecked.getTime())}
              </span>
            </div>
          )}
          <Button size="sm" variant="outline" onClick={() => void fetchStatus()} disabled={loading} className="gap-2">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
          <div className="flex items-center gap-2">
            <ServerCrash className="h-4 w-4" />
            {error}
          </div>
        </div>
      )}

      {/* ── Hero Status ── */}
      {data ? (
        <HeroStatus status={data.overall} timestamp={data.timestamp} />
      ) : (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="h-16 w-16 animate-pulse rounded-full bg-muted sm:h-20 sm:w-20" />
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        </div>
      )}

      {/* ── Meta Pills ── */}
      {data && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <MetaPill icon={Globe} label="Region" value={data.region} />
          <MetaPill icon={Signal} label="Checks" value={`${history.length}`} />
          <MetaPill icon={TrendingUp} label="Uptime" value={`${uptimePct(history, "fireworks")}%`} />
        </div>
      )}

      {/* ── Services ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Services</h3>
          <span className="font-mono text-[10px] text-muted-foreground">{history.length} checks recorded</span>
        </div>
        {!data && !error ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
                <div className="flex items-center gap-3 sm:w-48">
                  <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                  </div>
                </div>
                <div className="h-4 w-20 animate-pulse rounded bg-muted sm:w-32" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </>
        ) : (
          Object.entries(data?.services ?? {}).map(([key, svc]) => (
            <ServiceRow key={key} name={key} svc={svc} history={history} />
          ))
        )}
      </div>

      {/* ── Response Times ── */}
      {history.length > 1 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Response Times</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {["fireworks", "database", "telegram"].map((key) => {
              const meta = SERVICE_META[key];
              const recent = history.slice(-20).map((h) => h.services[key]?.latencyMs ?? 0);
              const avg = Math.round(recent.reduce((a, b) => a + b, 0) / recent.length) || 0;
              const max = Math.max(...recent, 1);
              return (
                <div key={key} className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{meta?.short ?? meta?.label ?? key}</span>
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">avg {avg}ms</span>
                  </div>
                  <div className="flex items-end gap-[2px]" style={{ height: 40 }}>
                    {recent.map((ms, i) => {
                      const h = Math.max(4, Math.min(40, (ms / max) * 40));
                      const color = ms > avg * 1.5 ? "bg-amber-500" : "bg-emerald-500";
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-sm ${color} opacity-70`}
                          style={{ height: h, transition: "height 0.3s ease" }}
                          title={`${ms}ms`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Past Incidents ── */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Past Incidents</h3>
        {incidents.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
            <p className="text-sm font-medium text-foreground">No incidents recorded</p>
            <p className="text-xs text-muted-foreground">All services have been stable during the monitoring window.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
            {incidents.slice(0, 10).map((entry, i) => (
              <IncidentRow key={i} entry={entry} />
            ))}
            {incidents.length > 10 && (
              <p className="text-center text-xs text-muted-foreground">+ {incidents.length - 10} more incidents</p>
            )}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Wifi className="h-3.5 w-3.5" />
          <span>Auto-refreshes every 30 seconds</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden font-mono sm:inline">{history.length} data points</span>
        </div>
        <Link href="/" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to EthioClaw
        </Link>
      </div>
    </div>
  );
}
