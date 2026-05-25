import { z } from "zod";

export const getUsageInput = z.object({
  days: z.number().min(1).max(90).default(30),
});

export type GetUsageInput = z.infer<typeof getUsageInput>;
