"use client";

import { useState } from "react";
import { BarChart3, Cpu, Hammer, MessageSquare } from "lucide-react";
import { trpc } from "~/clients/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { SettingsPageSkeleton } from "./settings-page.skeleton";

const DAYS_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
] as const;

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function UsageSettings() {
  const [days, setDays] = useState<"7" | "30" | "90">("30");
  const { data, isLoading } = trpc.trustclaw.getUsage.useQuery({
    days: Number(days),
  });

  if (isLoading) {
    return <SettingsPageSkeleton />;
  }

  const totals = data?.totals ?? {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    totalTokens: 0,
    toolCalls: 0,
    messages: 0,
  };

  const daily = data?.daily ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Usage</CardTitle>
            <CardDescription>
              Token burn and tool calls across your sessions
            </CardDescription>
          </div>
          <Select value={days} onValueChange={(v) => setDays(v as typeof days)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Totals */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={<Cpu className="h-4 w-4" />}
            label="Input tokens"
            value={formatNumber(totals.inputTokens)}
          />
          <StatCard
            icon={<Cpu className="h-4 w-4" />}
            label="Output tokens"
            value={formatNumber(totals.outputTokens)}
          />
          <StatCard
            icon={<Hammer className="h-4 w-4" />}
            label="Tool calls"
            value={formatNumber(totals.toolCalls)}
          />
          <StatCard
            icon={<MessageSquare className="h-4 w-4" />}
            label="Messages"
            value={formatNumber(totals.messages)}
          />
        </div>

        {totals.cacheReadTokens > 0 || totals.cacheWriteTokens > 0 ? (
          <div className="flex flex-wrap gap-2">
            {totals.cacheReadTokens > 0 && (
              <Badge variant="secondary">
                Cache read: {formatNumber(totals.cacheReadTokens)}
              </Badge>
            )}
            {totals.cacheWriteTokens > 0 && (
              <Badge variant="secondary">
                Cache write: {formatNumber(totals.cacheWriteTokens)}
              </Badge>
            )}
          </div>
        ) : null}

        {/* Daily breakdown */}
        {daily.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Messages</TableHead>
                  <TableHead className="text-right">Tool calls</TableHead>
                  <TableHead className="text-right">Input</TableHead>
                  <TableHead className="text-right">Output</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...daily].reverse().map((day) => (
                  <TableRow key={day.date}>
                    <TableCell className="font-medium">
                      {new Date(day.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(day.messages)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(day.toolCalls)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatNumber(day.inputTokens)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatNumber(day.outputTokens)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatNumber(day.totalTokens)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <BarChart3 className="mr-2 h-4 w-4" />
            No usage data yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col rounded-lg border p-3">
      <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}
