import { createFireworks } from "@ai-sdk/fireworks";
import { env } from "~/env";

const fireworksProvider = createFireworks({
  apiKey: env.FIREWORKS_API_KEY,
});

export function resolveModel(modelId: string) {
  if (modelId.startsWith("accounts/fireworks/models/")) {
    return fireworksProvider(modelId);
  }

  // Unknown / legacy models fall back to Kimi K2.6
  console.warn(
    `[resolveModel] Unknown model "${modelId}" — falling back to Kimi K2.6`,
  );
  return fireworksProvider("accounts/fireworks/models/kimi-k2p6");
}
