import { z } from "zod";

export const ALLOWED_ANTHROPIC_MODELS = [] as const;

export const ALLOWED_FIREWORKS_MODELS = [
  "accounts/fireworks/models/kimi-k2p6",
  "accounts/fireworks/models/kimi-k2p5",
  "accounts/fireworks/models/deepseek-v4-pro",
  "accounts/fireworks/models/glm-5p1",
] as const;

export const ALLOWED_MODELS = [
  ...ALLOWED_ANTHROPIC_MODELS,
  ...ALLOWED_FIREWORKS_MODELS,
] as const;

export const allowedModelSchema = z.enum(ALLOWED_MODELS);

export const createInstanceInput = z.object({
  anthropicModel: allowedModelSchema.default(
    "accounts/fireworks/models/kimi-k2p6",
  ),
});
