"use client";

import { useState } from "react";
import type { z } from "zod";
import { Loader2 } from "lucide-react";
import { trpc } from "~/clients/trpc";
import { allowedModelSchema } from "~/server/api/routers/trustclaw/createInstance.schema";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  showSuccessToast,
  trpcToastOnError,
} from "~/components/core/toast-notifications";

const MODELS = [
  {
    value: "accounts/fireworks/models/kimi-k2p6",
    label: "Kimi K2.6",
    description: "Most capable",
  },
  {
    value: "accounts/fireworks/models/kimi-k2p5",
    label: "Kimi K2.5",
    description: "Fast & capable",
  },
  {
    value: "accounts/fireworks/models/deepseek-v4-pro",
    label: "DeepSeek V4 Pro",
    description: "Reasoning specialist",
  },
  {
    value: "accounts/fireworks/models/glm-5p1",
    label: "GLM 5.1",
    description: "Efficient & versatile",
  },
] as const;

type AllowedModel = z.infer<typeof allowedModelSchema>;

interface ModelSettingsProps {
  currentModel: string;
}

export function ModelSettings({ currentModel }: ModelSettingsProps) {
  const parsed = allowedModelSchema.catch("accounts/fireworks/models/kimi-k2p6").parse(currentModel);
  const [selectedModel, setSelectedModel] = useState<AllowedModel>(parsed);
  const utils = trpc.useUtils();

  const updateSettings = trpc.trustclaw.updateSettings.useMutation({
    onSuccess: () => {
      showSuccessToast("Model updated");
      void utils.trustclaw.getInstance.invalidate();
    },
    onError: trpcToastOnError,
  });

  const hasChanges = selectedModel !== currentModel;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model</CardTitle>
        <CardDescription>
          Choose which model powers your assistant
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Model</Label>
          <Select
            value={selectedModel}
            onValueChange={(val) => {
              const model = allowedModelSchema.safeParse(val);
              if (model.success) setSelectedModel(model.data);
            }}
          >
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  <span>{m.label}</span>
                  <span className="ml-2 text-muted-foreground">
                    - {m.description}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          disabled={!hasChanges || updateSettings.isPending}
          onClick={() =>
            void updateSettings.mutateAsync({ anthropicModel: selectedModel })
          }
        >
          {updateSettings.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}