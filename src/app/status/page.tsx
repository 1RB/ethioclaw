import { type Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  Cpu,
  Database,
  MessageCircle,
  ArrowLeft,
  Clock,
  Globe,
} from "lucide-react";
import { getSystemStatus } from "~/lib/system-status";
import { EthioClawBrand } from "~/app/_components/ethioclaw-brand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "System Status",
  description: "Real-time system health dashboard for EthioClaw services.",
};

const STATUS_COLOR: Record<string, string> = {
  ok: "text-primary",
  degraded: "text-amber-500",
  error: "text-destructive",
  unknown: "text-muted-foreground",
};

const STATUS_LABEL: Record<string, string> = {
  ok: "Operational",
  degraded: "Degraded",
  error: "Down",
  unknown: "Not Configured",
};

const STATUS_BG: Record<string, string> = {
  ok: "bg-primary/10",
  degraded: "bg-amber-500/10",
  error: "bg-destructive/10",
  unknown: "bg-muted",
};

const STATUS_DOT: Record<string, string> = {
  ok: "bg-primary",
  degraded: "bg-amber-500",
  error: "bg-destructive",
  unknown: "bg-muted-foreground",
};

export default async function StatusPage() {
  const data = await getSystemStatus();
  const overallLabel = STATUS_LABEL[data.overall] ?? data.overall;
  const overallColor = STATUS_COLOR[data.overall] ?? "text-muted-foreground";
  const overallBg = STATUS_BG[data.overall] ?? "bg-muted";
  const overallDot = STATUS_DOT[data.overall] ?? "bg-muted-foreground";

  const services = [
    {
      key: "fireworks",
      name: "AI Service",
      icon: Cpu,
      status: data.services.fireworks,
    },
    {
      key: "database",
      name: "PostgreSQL",
      icon: Database,
      status: data.services.database,
    },
    {
      key: "telegram",
      name: "Telegram Bot",
      icon: MessageCircle,
      status: data.services.telegram,
    },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <EthioClawBrand size="sm" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 md:py-20">
        <div className="mb-12 flex items-center gap-3 md:mb-16">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <h1 className="font-serif-display text-2xl font-normal tracking-tight md:text-3xl">
            System Status
          </h1>
        </div>

        {/* Overall status */}
        <div className={`mb-10 rounded-xl border border-border/40 ${overallBg} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${overallDot}`} />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Overall
                </p>
                <p className={`mt-1 text-lg font-semibold ${overallColor}`}>
                  {overallLabel}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Region
              </p>
              <p className="mt-1 flex items-center justify-end gap-1.5 text-sm font-medium text-foreground">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                {data.region}
              </p>
            </div>
          </div>
        </div>

        {/* Service grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {services.map((service) => {
            const color = STATUS_COLOR[service.status.status] ?? "text-muted-foreground";
            const label = STATUS_LABEL[service.status.status] ?? service.status.status;
            const dot = STATUS_DOT[service.status.status] ?? "bg-muted-foreground";
            return (
              <div
                key={service.key}
                className="rounded-xl border border-border/40 bg-card p-5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                    <service.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {service.name}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${dot}`} />
                  <span className={`text-sm font-semibold ${color}`}>
                    {label}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {service.status.latencyMs} ms
                </div>
                {service.status.message && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {service.status.message}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Timestamp */}
        <p className="mt-10 text-xs text-muted-foreground">
          Last checked: {new Date(data.timestamp).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "long",
          })}
        </p>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="text-xs text-muted-foreground">
            &copy; 2026 EthioClaw
          </span>
          <Link
            href="/"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            ethioclaw.vercel.app
          </Link>
        </div>
      </footer>
    </div>
  );
}
