import { NextResponse } from "next/server";
import { env } from "~/env";
import { db } from "~/server/clients/db";

interface ServiceStatus {
  status: "ok" | "degraded" | "error" | "unknown";
  latencyMs: number;
  message?: string;
  detail?: Record<string, unknown>;
}

interface StatusResponse {
  overall: string;
  timestamp: string;
  region: string;
  version: string;
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
      const data = (await res.json()) as { data?: Array<{ id: string; owned_by?: string }> };
      const models = data.data ?? [];
      return {
        status: "ok",
        latencyMs,
        message: `${models.length} models available`,
        detail: {
          modelCount: models.length,
          firstModel: models[0]?.id ?? null,
        },
      };
    }
    const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    return {
      status: res.status === 412 ? "degraded" : "error",
      latencyMs,
      message: body.error?.message ?? `HTTP ${res.status}`,
      detail: { httpStatus: res.status },
    };
  } catch (e) {
    const latencyMs = Date.now() - start;
    return {
      status: "error",
      latencyMs,
      message: e instanceof Error ? e.message : "Network error",
      detail: { type: e instanceof Error ? e.name : "Unknown" },
    };
  }
}

async function checkDatabase(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    return {
      status: "ok",
      latencyMs: Date.now() - start,
      detail: { engine: "postgresql", query: "SELECT 1" },
    };
  } catch (e) {
    return {
      status: "error",
      latencyMs: Date.now() - start,
      message: e instanceof Error ? e.message : "DB error",
      detail: { type: e instanceof Error ? e.name : "Unknown" },
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
      const data = (await res.json()) as { ok: boolean; result?: { username?: string; first_name?: string } };
      return {
        status: data.ok ? "ok" : "error",
        latencyMs,
        message: data.ok ? `@${data.result?.username ?? "bot"}` : "Telegram API error",
        detail: {
          botName: data.result?.first_name ?? null,
          botUsername: data.result?.username ?? null,
        },
      };
    }
    return {
      status: "error",
      latencyMs,
      message: `HTTP ${res.status}`,
      detail: { httpStatus: res.status },
    };
  } catch (e) {
    return {
      status: "error",
      latencyMs: Date.now() - start,
      message: e instanceof Error ? e.message : "Network error",
      detail: { type: e instanceof Error ? e.name : "Unknown" },
    };
  }
}

export async function GET(): Promise<NextResponse<StatusResponse>> {
  const [fireworks, database, telegram] = await Promise.all([
    checkFireworks(),
    checkDatabase(),
    checkTelegram(),
  ]);

  const hasError = fireworks.status === "error" || database.status === "error" || telegram.status === "error";
  const hasDegraded = fireworks.status === "degraded" || database.status === "degraded" || telegram.status === "degraded";

  const overall = hasError ? "error" : hasDegraded ? "degraded" : "ok";

  return NextResponse.json({
    overall,
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION ?? "unknown",
    version: "v1",
    services: { fireworks, database, telegram },
  });
}
