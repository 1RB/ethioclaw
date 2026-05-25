import { protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/clients/db";
import { getUsageInput } from "./getUsage.schema";

interface DayUsage {
  date: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  totalTokens: number;
  toolCalls: number;
  messages: number;
}

interface ModelUsage {
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  messages: number;
}

export const getUsage = protectedProcedure
  .input(getUsageInput)
  .query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;
    const since = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000);

    const instance = await db.composioClawInstance.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!instance) {
      return {
        daily: [] as DayUsage[],
        byModel: [] as ModelUsage[],
        totals: {
          inputTokens: 0,
          outputTokens: 0,
          cacheReadTokens: 0,
          cacheWriteTokens: 0,
          totalTokens: 0,
          toolCalls: 0,
          messages: 0,
        },
      };
    }

    const messages = await db.message.findMany({
      where: {
        instanceId: instance.id,
        createdAt: { gte: since },
        role: "assistant",
      },
      select: {
        content: true,
        inputTokens: true,
        outputTokens: true,
        cacheReadTokens: true,
        cacheWriteTokens: true,
        createdAt: true,
      },
    });

    const dailyMap = new Map<string, DayUsage>();
    const modelMap = new Map<string, ModelUsage>();

    let totalInput = 0;
    let totalOutput = 0;
    let totalCacheRead = 0;
    let totalCacheWrite = 0;
    let totalToolCalls = 0;

    for (const msg of messages) {
      const date = msg.createdAt.toISOString().split("T")[0]!;
      const day = dailyMap.get(date) ?? {
        date,
        inputTokens: 0,
        outputTokens: 0,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
        totalTokens: 0,
        toolCalls: 0,
        messages: 0,
      };

      const input = msg.inputTokens ?? 0;
      const output = msg.outputTokens ?? 0;
      const cacheRead = msg.cacheReadTokens ?? 0;
      const cacheWrite = msg.cacheWriteTokens ?? 0;

      day.inputTokens += input;
      day.outputTokens += output;
      day.cacheReadTokens += cacheRead;
      day.cacheWriteTokens += cacheWrite;
      day.totalTokens += input + output + cacheRead + cacheWrite;
      day.messages += 1;

      totalInput += input;
      totalOutput += output;
      totalCacheRead += cacheRead;
      totalCacheWrite += cacheWrite;

      // Count tool calls from content JSON
      let toolCallsInMessage = 0;
      if (Array.isArray(msg.content)) {
        for (const part of msg.content) {
          if (
            part &&
            typeof part === "object" &&
            "type" in part &&
            part.type === "dynamic-tool"
          ) {
            toolCallsInMessage += 1;
          }
        }
      }
      day.toolCalls += toolCallsInMessage;
      totalToolCalls += toolCallsInMessage;

      dailyMap.set(date, day);
    }

    const daily = Array.from(dailyMap.values()).sort(
      (a, b) => a.date.localeCompare(b.date),
    );

    return {
      daily,
      byModel: [] as ModelUsage[],
      totals: {
        inputTokens: totalInput,
        outputTokens: totalOutput,
        cacheReadTokens: totalCacheRead,
        cacheWriteTokens: totalCacheWrite,
        totalTokens: totalInput + totalOutput + totalCacheRead + totalCacheWrite,
        toolCalls: totalToolCalls,
        messages: messages.length,
      },
    };
  });
