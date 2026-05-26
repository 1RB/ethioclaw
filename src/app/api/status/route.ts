import { NextResponse } from "next/server";
import { env } from "~/env";
import { db } from "~/server/clients/db";

interface ServiceStatus {
  status: "ok" | "degraded" | "error" | "unknown";
  latencyMs: number;
  message?: string;
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
      const data = (await res.json()) as { data?: unknown[] };
      return {
        status: "ok",
        latencyMs,
        message: `${data.data?.length ?? 0} models available`,
      };
    }
    const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    return {
      status: res.status === 412 ? "degraded" : "error",
      latencyMs,
      message: body.error?.message ?? `HTTP ${res.status}`,
    };
  } catch (e) {
    const latencyMs = Date.now() - start;
    return {
      status: "error",
      latencyMs,
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
      const data = (await res.json()) as { ok: boolean; result?: { username?: string } };
      return {
        status: data.ok ? "ok" : "error",
        latencyMs,
        message: data.ok ? `@${data.result?.username ?? "bot"}` : "Telegram API error",
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

export async function GET() {
  const [fireworks, database, telegram] = await Promise.all([
    checkFireworks(),
    checkDatabase(),
    checkTelegram(),
  ]);

  const hasError = fireworks.status === "error" || database.status === "error" || telegram.status === "error";
  const hasDegraded = fireworks.status === "degraded" || database.status === "degraded" || telegram.status === "degraded";

  const overall = hasError ? "degraded" : hasDegraded ? "degraded" : "ok";

  return NextResponse.json({
    overall,
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION ?? "unknown",
    services: { fireworks, database, telegram },
  });
}
