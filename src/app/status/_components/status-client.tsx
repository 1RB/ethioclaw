"use client";

import { useEffect, useState, useCallback } from "react";
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

const SERVICE_META: Record<string, { label: string; description: string }> = {
  fireworks: {
    label: "FIREWORKS AI",
    description: "LLM inference API",
  },
  database: {
    label: "NEON POSTGRESQL",
    description: "Primary datastore",
  },
  telegram: {
    label: "TELEGRAM BOT",
    description: "Webhook messaging",
  },
};

const HISTORY_KEY = "ethioclaw-status-history";
const MAX_HISTORY = 90;

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

function fmtTime(d = new Date()): string {
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function ago(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function uptimePct(history: HistoryEntry[], key: string): number {
  if (history.length === 0) return 100;
  const ok = history.filter((h) => h.services[key]?.status === "ok").length;
  return Math.round((ok / history.length) * 100);
}

function statusColor(status: string): string {
  switch (status) {
    case "ok":
      return "#39ff14";
    case "degraded":
      return "#ff6b00";
    case "error":
      return "#ff0033";
    default:
      return "#737373";
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case "ok":
      return "OPERATIONAL";
    case "degraded":
      return "DEGRADED";
    case "error":
      return "DOWN";
    default:
      return "UNKNOWN";
  }
}

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

  useEffect(() => {
    setHistory(loadHistory());
    void fetchStatus();
    const interval = setInterval(() => void fetchStatus(), 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  useEffect(() => {
    const tick = setInterval(() => setNextRefresh((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(tick);
  }, []);

  const overallColor = statusColor(data?.overall ?? "unknown");
  const metaEntries = Object.entries(data?.services ?? {});

  return (
    <div className="flex flex-col gap-0">
      {/* Title + Controls */}
      <div className="flex flex-col justify-between gap-4 border-b-2 border-border py-4 sm:flex-row sm:items-baseline">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-foreground sm:text-2xl">
            System Status
          </h1>
          <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
            Infrastructure health monitor
          </p>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          {lastChecked && (
            <>
              <span>NEXT: {nextRefresh}s</span>
              <span>{ago(Date.now() - lastChecked.getTime())} AGO</span>
            </>
          )}
          <button
            onClick={() => void fetchStatus()}
            disabled={loading}
            className="border-2 border-border px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
          >
            {loading ? "..." : "REFRESH"}
          </button>
        </div>
      </div>

      {/* Overall */}
      <div className="border-b-2 border-border py-6 sm:py-8">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3" style={{ backgroundColor: overallColor }} />
          <span
            className="text-lg font-bold uppercase tracking-tight sm:text-xl"
            style={{ color: overallColor }}
          >
            {data?.overall === "ok"
              ? "ALL SYSTEMS OPERATIONAL"
              : data?.overall === "degraded"
                ? "PARTIAL OUTAGE"
                : data?.overall === "error"
                  ? "MAJOR OUTAGE"
                  : "CHECKING STATUS..."}
          </span>
        </div>
        {data && (
          <p className="mt-2 text-[10px] text-muted-foreground">
            {fmtTime(new Date(data.timestamp))} UTC · REGION {data.region.toUpperCase()}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="border-b-2 border-[#ff0033] py-3" style={{ backgroundColor: "#1a0005" }}>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff0033]">
            ERROR: {error}
          </div>
        </div>
      )}

      {/* Services */}
      <div className="border-b-2 border-border py-4">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Services
          </span>
          <span className="text-[10px] text-muted-foreground">
            {history.length} CHECKS
          </span>
        </div>

        {!data && !error ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            LOADING...
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Table Header */}
            <div className="hidden grid-cols-[1fr_140px_100px_80px] gap-4 border-b border-border pb-2 text-[10px] uppercase tracking-wider text-muted-foreground sm:grid">
              <span>Service</span>
              <span>Status</span>
              <span className="text-right">Latency</span>
              <span className="text-right">Uptime</span>
            </div>

            {metaEntries.map(([key, svc]) => {
              const meta = SERVICE_META[key];
              const pct = uptimePct(history, key);
              const color = statusColor(svc.status);

              return (
                <div
                  key={key}
                  className="grid grid-cols-1 gap-2 border-b border-border py-3 last:border-b-0 sm:grid-cols-[1fr_140px_100px_80px] sm:items-center sm:gap-4"
                >
                  {/* Service Name */}
                  <div>
                    <div className="text-sm font-bold uppercase tracking-tight text-foreground">
                      {meta?.label ?? key}
                    </div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {meta?.description ?? ""}
                    </div>
                    {svc.message && (
                      <div className="mt-1 truncate text-[10px] text-muted-foreground">
                        {svc.message}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2" style={{ backgroundColor: color }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
                      {statusLabel(svc.status)}
                    </span>
                  </div>

                  {/* Latency */}
                  <div className="text-right text-xs tabular-nums text-muted-foreground">
                    {svc.latencyMs}ms
                  </div>

                  {/* Uptime */}
                  <div className="text-right text-xs tabular-nums text-muted-foreground">
                    {pct}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Response Times */}
      {history.length > 1 && (
        <div className="border-b-2 border-border py-4">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Response Times
          </div>
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
            {["fireworks", "database", "telegram"].map((key) => {
              const meta = SERVICE_META[key];
              const recent = history.slice(-20).map((h) => h.services[key]?.latencyMs ?? 0);
              const avg = Math.round(recent.reduce((a, b) => a + b, 0) / recent.length) || 0;
              const max = Math.max(...recent, 1);
              return (
                <div
                  key={key}
                  className="border-b border-border p-4 last:border-b-0 sm:border-b-0 sm:border-r-2 sm:border-border sm:last:border-r-0"
                >
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      {meta?.label ?? key}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      AVG {avg}ms
                    </span>
                  </div>
                  <div className="flex items-end gap-[1px]" style={{ height: 32 }}>
                    {recent.map((ms, i) => {
                      const h = Math.max(3, Math.min(32, (ms / max) * 32));
                      const aboveAvg = ms > avg * 1.5;
                      return (
                        <div
                          key={i}
                          className="flex-1"
                          style={{
                            height: h,
                            backgroundColor: aboveAvg ? "#ff6b00" : "#39ff14",
                            opacity: 0.5,
                          }}
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

      {/* Incidents */}
      <div className="border-b-2 border-border py-4">
        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Incident History
        </div>
        {(() => {
          const incidents = history.filter((h) => h.overall !== "ok").reverse();
          if (incidents.length === 0) {
            return (
              <div className="py-4 text-xs text-muted-foreground">
                <span className="text-primary">NO INCIDENTS</span> — All services stable during monitoring window
              </div>
            );
          }
          return (
            <div className="flex flex-col">
              {incidents.slice(0, 10).map((entry, i) => {
                const bad = Object.entries(entry.services).filter(([, s]) => s.status !== "ok");
                return (
                  <div
                    key={i}
                    className="border-b border-border py-3 last:border-b-0"
                  >
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-foreground">
                      {bad.map(([name, svc]) => {
                        const meta = SERVICE_META[name];
                        return (
                          <span key={name} className="flex items-center gap-1.5">
                            <span
                              className="inline-block h-1.5 w-1.5"
                              style={{ backgroundColor: statusColor(svc.status) }}
                            />
                            {meta?.label ?? name}: {svc.message ?? statusLabel(svc.status)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {incidents.length > 10 && (
                <p className="py-2 text-center text-[10px] text-muted-foreground">
                  +{incidents.length - 10} MORE
                </p>
              )}
            </div>
          );
        })()}
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center justify-between gap-2 py-4 sm:flex-row">
        <span className="text-[10px] text-muted-foreground">
          AUTO-REFRESH 30s · {history.length} DATA POINTS
        </span>
        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
        >
          ← BACK TO ETHIOCLAW
        </Link>
      </div>
    </div>
  );
}
