import { env } from "~/env";
import { db } from "~/server/clients/db";

export interface ServiceStatus {
  status: "ok" | "degraded" | "error" | "unknown";
  latencyMs: number;
  message?: string;
}

export interface SystemStatus {
  overall: "ok" | "degraded" | "error";
  timestamp: string;
  region: string;
  services: {
    fireworks: ServiceStatus;
    database: ServiceStatus;
    telegram: ServiceStatus;
  };
}

async function checkFireworks(): Promise<ServiceStatus> {
  if (!env.FIREWORKS_API_KEY) {
    return { status: "unknown", latencyMs: 0, message: "No API key configured" };
  }
  const start = Date.now();
  try {
    const res = await fetch("https://api.fireworks.ai/inference/v1/models", {
      method: "GET",
      headers: { Authorization: `Bearer ${env.FIREWORKS_API_KEY}` },
      signal: AbortSignal.timeout(8000),
    });
    const latencyMs = Date.now() - start;
    if (res.ok) {
      return { status: "ok", latencyMs };
    }
    return {
      status: res.status === 412 ? "degraded" : "error",
      latencyMs,
      message: "Service unavailable",
    };
  } catch (e) {
    return {
      status: "error",
      latencyMs: Date.now() - start,
      message: e instanceof Error ? e.message : "Network error",
    };
  }
}

async function checkDatabase(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    return { status: "ok", latencyMs: Date.now() - start };
  } catch (e) {
    return {
      status: "error",
      latencyMs: Date.now() - start,
      message: e instanceof Error ? e.message : "DB error",
    };
  }
}

async function checkTelegram(): Promise<ServiceStatus> {
  if (!env.TELEGRAM_BOT_TOKEN) {
    return { status: "unknown", latencyMs: 0, message: "Not configured" };
  }
  const start = Date.now();
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getMe`,
      { signal: AbortSignal.timeout(8000) },
    );
    const latencyMs = Date.now() - start;
    if (res.ok) {
      const data = (await res.json()) as { ok: boolean };
      return {
        status: data.ok ? "ok" : "error",
        latencyMs,
      };
    }
    return {
      status: "error",
      latencyMs,
      message: `HTTP ${res.status}`,
    };
  } catch (e) {
    return {
      status: "error",
      latencyMs: Date.now() - start,
      message: e instanceof Error ? e.message : "Network error",
    };
  }
}

export async function getSystemStatus(): Promise<SystemStatus> {
  const [fireworks, database, telegram] = await Promise.all([
    checkFireworks(),
    checkDatabase(),
    checkTelegram(),
  ]);

  const hasError = fireworks.status === "error" || database.status === "error" || telegram.status === "error";
  const hasDegraded = fireworks.status === "degraded" || database.status === "degraded" || telegram.status === "degraded";
  const overall = hasError ? "error" : hasDegraded ? "degraded" : "ok";

  return {
    overall,
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION ?? "unknown",
    services: { fireworks, database, telegram },
  };
}
