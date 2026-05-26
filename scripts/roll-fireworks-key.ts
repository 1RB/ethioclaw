#!/usr/bin/env node
/**
 * Roll your Fireworks API key end-to-end:
 *   update .env → test the key → push to Vercel → deploy
 *
 * Usage:
 *   pnpm key:roll <new-key>           # full roll
 *   pnpm key:roll <new-key> --local  # only update .env + test
 *   pnpm key:test                     # test current key without rolling
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ENV_PATH = path.resolve(process.cwd(), ".env");
const FIREWORKS_MODELS_URL = "https://api.fireworks.ai/inference/v1/models";

function readEnv(): string {
  if (!fs.existsSync(ENV_PATH)) {
    console.error("\n  \u2717 .env not found at", ENV_PATH);
    process.exit(1);
  }
  return fs.readFileSync(ENV_PATH, "utf-8");
}

function writeEnv(content: string) {
  fs.writeFileSync(ENV_PATH, content);
}

function updateEnv(key: string, value: string): string {
  let env = readEnv();
  const regex = new RegExp(`^${key}=.*$`, "m");
  if (regex.test(env)) {
    env = env.replace(regex, `${key}=${value}`);
  } else {
    env += `\n${key}=${value}\n`;
  }
  writeEnv(env);
  return env;
}

function mask(key: string): string {
  if (key.length <= 8) return "***";
  return key.slice(0, 4) + "..." + key.slice(-4);
}

async function testKey(key: string): Promise<{
  ok: boolean;
  status: number;
  statusText: string;
  latencyMs: number;
  body?: unknown;
}> {
  const start = Date.now();
  try {
    const res = await fetch(FIREWORKS_MODELS_URL, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const latencyMs = Date.now() - start;
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      /* ignore */
    }
    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      latencyMs,
      body,
    };
  } catch (err) {
    const latencyMs = Date.now() - start;
    return {
      ok: false,
      status: 0,
      statusText: String(err),
      latencyMs,
    };
  }
}

function printResult(result: Awaited<ReturnType<typeof testKey>>) {
  const icon = result.ok ? "\u2713" : "\u2717";
  const color = result.ok ? "" : ""; // no colors, keep it clean
  console.log(
    `  ${icon} Fireworks responded ${result.status} ${result.statusText} (${result.latencyMs}ms)`
  );
  if (!result.ok && result.body) {
    const msg = (result.body as Record<string, unknown>)?.error || result.body;
    console.log(`    ${JSON.stringify(msg)}`);
  }
}

function pushToVercel(key: string) {
  console.log("  \u2192 Pushing to Vercel env...");
  try {
    execSync(
      `echo "${key}" | npx vercel env add FIREWORKS_API_KEY production --yes`,
      {
        stdio: "pipe",
        cwd: process.cwd(),
      }
    );
    console.log("  \u2713 Vercel env updated");
  } catch (err) {
    console.error("  \u2717 Failed to push to Vercel:", String(err));
    console.log("    Run manually:  vercel env add FIREWORKS_API_KEY");
    process.exit(1);
  }
}

function deploy() {
  console.log("  \u2192 Deploying...");
  try {
    execSync("npx vercel deploy --prod", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
  } catch {
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd === "test" || cmd === "--test") {
    const env = readEnv();
    const match = env.match(/^FIREWORKS_API_KEY=(.+)$/m);
    const current = match?.[1]?.trim();
    if (!current) {
      console.error("\n  \u2717 FIREWORKS_API_KEY not found in .env\n");
      process.exit(1);
    }
    console.log(`\n  Testing current key: ${mask(current)}`);
    const result = await testKey(current);
    printResult(result);
    console.log("");
    process.exit(result.ok ? 0 : 1);
  }

  const newKey = args.find((a) => !a.startsWith("-"));
  if (!newKey) {
    console.log(`
  Fireworks key roll

  Usage:
    pnpm key:roll <new-key>           update .env, test, push to Vercel, deploy
    pnpm key:roll <new-key> --local  update .env + test only (no Vercel/deploy)
    pnpm key:test                     test current key in .env

  Example:
    pnpm key:roll fw_xxxxxxxxxx
`);
    process.exit(0);
  }

  const localOnly = args.includes("--local") || args.includes("-l");

  console.log(`\n  Rolling Fireworks key...`);
  console.log(`  New key: ${mask(newKey)}`);

  // 1. Update .env
  updateEnv("FIREWORKS_API_KEY", newKey);
  console.log(`  \u2713 .env updated`);

  // 2. Test key
  console.log(`  \u2192 Testing against ${FIREWORKS_MODELS_URL}...`);
  const result = await testKey(newKey);
  printResult(result);

  if (!result.ok) {
    console.error("\n  \u2717 Key test failed. .env was updated but not deployed.\n");
    console.log("  Fix the key and re-run.");
    process.exit(1);
  }

  if (localOnly) {
    console.log("\n  \u2713 Key works. Skipping Vercel deploy (--local).\n");
    process.exit(0);
  }

  // 3. Push to Vercel
  pushToVercel(newKey);

  // 4. Deploy
  deploy();
}

main();
