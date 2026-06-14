"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, Check, Mic } from "lucide-react";
import type { UIMessage } from "@ai-sdk/react";

interface UserMessageProps {
  message: UIMessage;
}

interface ImagePart {
  type: "image";
  image: string;
}

function isImagePart(part: unknown): part is ImagePart {
  return (
    typeof part === "object" &&
    part !== null &&
    "type" in part &&
    (part as { type: string }).type === "image" &&
    "image" in part &&
    typeof (part as { image: string }).image === "string"
  );
}

export function UserMessage({ message }: UserMessageProps) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const textParts = message.parts.filter(
    (p): p is { type: "text"; text: string } => p.type === "text",
  );

  const unknownParts = message.parts.map((p) => p as unknown);
  const imageParts = unknownParts.filter(isImagePart);
  const hasAudio = unknownParts.some(
    (p): boolean =>
      typeof p === "object" &&
      p !== null &&
      "type" in p &&
      (p as { type: string }).type === "audio",
  );

  const textContent = textParts.map((p) => p.text).join("\n");

  const handleCopy = () => {
    void navigator.clipboard.writeText(textContent);
    setCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const hasImages = imageParts.length > 0;

  return (
    <div className="flex flex-col items-end">
      <div className="relative max-w-[80%]">
        <div className="rounded-2xl bg-muted px-3 py-2 text-sm text-foreground">
          {/* Images */}
          {hasImages && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {imageParts.map((part, i) => (
                <img
                  key={i}
                  src={part.image}
                  alt="Uploaded image"
                  className="max-h-48 max-w-full rounded-lg object-cover"
                />
              ))}
            </div>
          )}

          {/* Text */}
          {textContent && <p className="whitespace-pre-wrap">{textContent}</p>}

          {/* Voice indicator */}
          {hasAudio && (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mic className="h-3 w-3" />
              <span>Voice message</span>
            </div>
          )}
        </div>
      </div>

      {textContent && (
        <button
          onClick={handleCopy}
          className="mt-1 mr-1 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      )}
    </div>
  );
}
