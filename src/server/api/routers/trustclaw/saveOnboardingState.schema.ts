import { z } from "zod";
import { allowedModelSchema } from "./createInstance.schema";

export const saveOnboardingStateInput = z.object({
  currentStep: z.string(),
  name: z.string().optional(),
  writingStyle: z.string().optional(),
  personality: z.string().optional(),
  emoji: z.string().optional(),
  lore: z.string().optional(),
  anthropicModel: allowedModelSchema.optional(),
});
