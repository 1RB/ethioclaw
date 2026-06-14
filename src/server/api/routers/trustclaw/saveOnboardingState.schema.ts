import { z } from "zod";
import { allowedModelSchema } from "./createInstance.schema";

export const saveOnboardingStateInput = z.object({
  currentStep: z.string().max(50),
  name: z.string().max(100).optional(),
  writingStyle: z.string().max(50).optional(),
  personality: z.string().max(50).optional(),
  emoji: z.string().max(20).optional(),
  lore: z.string().max(5000).optional(),
  anthropicModel: allowedModelSchema.optional(),
});
