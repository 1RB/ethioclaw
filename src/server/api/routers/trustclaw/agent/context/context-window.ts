const CONTEXT_WINDOWS: Record<string, number> = {
  // Anthropic (legacy, fallback)
  "claude-opus-4-6": 200_000,
  "claude-sonnet-4-5-20250929": 200_000,
  "claude-haiku-4-5-20251001": 200_000,
  // Fireworks
  "accounts/fireworks/models/kimi-k2p6": 262_144,
  "accounts/fireworks/models/kimi-k2p5": 262_144,
  "accounts/fireworks/models/deepseek-v4-pro": 64_000,
  "accounts/fireworks/models/glm-5p1": 202_752,
};

export function getContextWindow(modelId: string): number {
  return CONTEXT_WINDOWS[modelId] ?? 128_000;
}
