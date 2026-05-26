#!/usr/bin/env tsx
/**
 * Asset swap CLI for EthioClaw landing page.
 *
 * Usage:
 *   pnpm swap list              → show all asset slots
 *   pnpm swap backup            → copy all current assets to .backups/
 *   pnpm swap <slot> <file>     → replace an asset (backs up old)
 *   pnpm swap restore <slot>    → restore from latest backup
 *
 * Slots:
 *   rays_left, cube, quarter_circle
 *   testimonial_sarah, testimonial_palash, testimonial_soham, testimonial_karan
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const BACKUP_DIR = path.resolve(process.cwd(), ".asset-backups");

const ASSETS: Record<string, string> = {
  rays_left: "images/elements/rays_left.svg",
  cube: "images/elements/cube.svg",
  quarter_circle: "images/elements/quarter_circle.svg",
  testimonial_sarah: "images/testimonials/sarah.jpg",
  testimonial_palash: "images/testimonials/palash.jpg",
  testimonial_soham: "images/testimonials/soham.jpg",
  testimonial_karan: "images/testimonials/karan.jpg",
};

function exists(p: string): boolean {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function ensureDir(p: string) {
  if (!exists(p)) fs.mkdirSync(p, { recursive: true });
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function list() {
  console.log("\n  Asset slots:\n");
  const max = Math.max(...Object.keys(ASSETS).map((k) => k.length));
  for (const [slot, rel] of Object.entries(ASSETS)) {
    const full = path.join(PUBLIC_DIR, rel);
    const ok = exists(full) ? "✓" : "✗";
    const size = exists(full)
      ? `(${(fs.statSync(full).size / 1024).toFixed(1)} KB)`
      : "(missing)";
    console.log(`  ${ok} ${slot.padEnd(max + 2)} ${rel.padEnd(40)} ${size}`);
  }
  console.log("");
}

function backupAll() {
  ensureDir(BACKUP_DIR);
  const ts = timestamp();
  const dir = path.join(BACKUP_DIR, ts);
  ensureDir(dir);

  for (const [slot, rel] of Object.entries(ASSETS)) {
    const src = path.join(PUBLIC_DIR, rel);
    if (!exists(src)) continue;
    const dest = path.join(dir, `${slot}${path.extname(rel)}`);
    fs.copyFileSync(src, dest);
  }
  console.log(`\n  Backed up to .asset-backups/${ts}/\n`);
}

function backupSlot(slot: string) {
  const rel = ASSETS[slot];
  if (!rel) return;
  const src = path.join(PUBLIC_DIR, rel);
  if (!exists(src)) return;
  ensureDir(BACKUP_DIR);
  const dest = path.join(BACKUP_DIR, `${slot}_${timestamp()}${path.extname(rel)}`);
  fs.copyFileSync(src, dest);
}

function swap(slot: string, filePath: string) {
  const rel = ASSETS[slot];
  if (!rel) {
    console.error(`\n  Unknown slot: ${slot}`);
    console.log(`  Run 'pnpm swap list' to see available slots.\n`);
    process.exit(1);
  }

  const src = path.resolve(filePath);
  if (!exists(src)) {
    console.error(`\n  File not found: ${src}\n`);
    process.exit(1);
  }

  backupSlot(slot);

  const dest = path.join(PUBLIC_DIR, rel);
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log(`\n  ✓ ${slot} → ${rel}`);
  console.log(`  Source: ${src}\n`);
}

function restore(slot: string) {
  const rel = ASSETS[slot];
  if (!rel) {
    console.error(`\n  Unknown slot: ${slot}\n`);
    process.exit(1);
  }

  const entries = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith(`${slot}_`))
    .sort()
    .reverse();

  if (entries.length === 0) {
    console.error(`\n  No backup found for ${slot}\n`);
    process.exit(1);
  }

  const latest = path.join(BACKUP_DIR, entries[0]!);
  const dest = path.join(PUBLIC_DIR, rel);
  fs.copyFileSync(latest, dest);
  console.log(`\n  ✓ Restored ${slot} from ${entries[0]}\n`);
}

function open() {
  const url = "http://localhost:3000/admin/assets";
  console.log(`\n  Opening ${url} ...\n`);
  try {
    execSync(`open "${url}" || xdg-open "${url}" || start "${url}"`, {
      stdio: "ignore",
    });
  } catch {
    console.log(`  (Could not auto-open. Visit ${url} manually.)\n`);
  }
}

const [cmd, ...args] = process.argv.slice(2);

switch (cmd) {
  case "list":
  case "ls":
    list();
    break;
  case "backup":
    backupAll();
    break;
  case "swap":
  case "replace": {
    const [slot, file] = args;
    if (!slot || !file) {
      console.error("\n  Usage: pnpm swap <slot> <file>\n");
      process.exit(1);
    }
    swap(slot, file);
    break;
  }
  case "restore": {
    const [slot] = args;
    if (!slot) {
      console.error("\n  Usage: pnpm swap restore <slot>\n");
      process.exit(1);
    }
    restore(slot);
    break;
  }
  case "open":
    open();
    break;
  default:
    console.log(`
  Asset swap CLI

  pnpm swap list              show all slots + current files
  pnpm swap backup            snapshot everything to .asset-backups/
  pnpm swap <slot> <file>     replace asset (auto-backup)
  pnpm swap restore <slot>    roll back to latest backup
  pnpm swap open              open the asset preview page

  Examples:
    pnpm swap testimonial_sarah ~/Downloads/avatar.png
    pnpm swap cube ~/Downloads/cube.svg
`);
}
