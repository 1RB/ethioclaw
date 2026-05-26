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

export const metadata: Metadata = {
  title: "System Status — EthioClaw",
  description: "Real-time system health dashboard.",
};

const STATUS_COLOR: Record<string, string> = {
  ok: "text-chart-2",
  degraded: "text-chart-5",
  error: "text-destructive",
  unknown: "text-muted-foreground",
};

const STATUS_LABEL: Record<string, string> = {
  ok: "OPERATIONAL",
  degraded: "DEGRADED",
  error: "DOWN",
  unknown: "NOT CONFIGURED",
};

export default async function StatusPage() {
  const data = await getSystemStatus();
  const overallLabel = STATUS_LABEL[data.overall] ?? data.overall.toUpperCase();
  const overallColor = STATUS_COLOR[data.overall] ?? "text-muted-foreground";

  const services = [
    {
      key: "fireworks",
      name: "Fireworks AI",
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
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 transition-colors hover:text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-xs uppercase tracking-wider">Back</span>
          </Link>
          <EthioClawBrand size="sm" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 md:py-20">
        <div className="mb-12 flex items-center gap-3 md:mb-16">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <h1 className="font-serif-display text-2xl font-medium tracking-tight md:text-3xl">
            System Status
          </h1>
        </div>

        {/* Overall */}
        <div className="mb-10 border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Overall
              </p>
              <p className={`mt-1 text-lg font-semibold ${overallColor}`}>
                {overallLabel}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
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
            const label = STATUS_LABEL[service.status.status] ?? service.status.status.toUpperCase();
            return (
              <div
                key={service.key}
                className="border border-border bg-card p-5"
              >
                <div className="flex items-center gap-2.5">
                  <service.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {service.name}
                  </span>
                </div>
                <p className={`mt-3 text-base font-semibold ${color}`}>
                  {label}
                </p>
                <div className="mt-4 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {service.status.latencyMs} ms
                </div>
                {service.status.message && (
                  <p className="mt-2 font-mono text-xs text-muted-foreground">
                    {service.status.message}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Timestamp */}
        <p className="mt-10 font-mono text-xs text-muted-foreground">
          Last checked: {new Date(data.timestamp).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "long",
          })}
        </p>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            &copy; 2026 EthioClaw
          </span>
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            ethioclaw.vercel.app
          </Link>
        </div>
      </footer>
    </div>
  );
}
