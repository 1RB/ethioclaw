"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUp, Square, ImagePlus, Mic, MicOff, X } from "lucide-react";
import type { ChatStatus } from "ai";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

interface ChatInputProps {
  onSend: (message: string, attachments?: Attachment[]) => void;
  onStop: () => void;
  status: ChatStatus;
}

export interface Attachment {
  type: "image" | "voice";
  url: string;
  name: string;
  mimeType: string;
}

const MAX_MESSAGE_LENGTH = 50_000;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ChatInput({ onSend, onStop, status }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const isStreaming = status === "streaming" || status === "submitted";
  const isTooLong = input.length > MAX_MESSAGE_LENGTH;
  const canSend = (input.trim().length > 0 || attachments.length > 0) && !isStreaming && !isTooLong;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = useCallback(() => {
    if (!canSend) return;
    onSend(input.trim(), attachments.length > 0 ? attachments : undefined);
    setInput("");
    setAttachments([]);
  }, [canSend, input, attachments, onSend]);

  const handleStop = useCallback(() => {
    onStop();
  }, [onStop]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isStreaming) return;
      handleSubmit();
    }
  };

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      for (const file of Array.from(files)) {
        if (file.size > MAX_FILE_SIZE) {
          continue;
        }
        if (!file.type.startsWith("image/")) {
          continue;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setAttachments((prev) => [
            ...prev,
            {
              type: "image",
              url: result,
              name: file.name,
              mimeType: file.type,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }

      // Reset input
      e.target.value = "";
    },
    [],
  );

  const removeAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setAttachments((prev) => [
            ...prev,
            {
              type: "voice",
              url: result,
              name: `Recording ${prev.length + 1}`,
              mimeType: "audio/webm",
            },
          ]);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      // Permission denied or no mic
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  return (
    <div className="border-border bg-background border-t p-3 md:p-4">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="mx-auto mb-2 flex max-w-2xl gap-2 overflow-x-auto pb-2">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="relative shrink-0 rounded-lg border border-border/60 bg-muted/50 p-1"
            >
              {attachment.type === "image" ? (
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="h-16 w-16 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
                  <Mic className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <button
                onClick={() => removeAttachment(index)}
                className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white shadow-sm"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mx-auto flex max-w-2xl items-end gap-2">
        {/* Image upload button */}
        <Button
          variant="ghost"
          size="icon"
          className="size-10 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => fileInputRef.current?.click()}
          disabled={isStreaming || isRecording}
        >
          <ImagePlus className="size-5" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Voice button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-10 shrink-0",
            isRecording
              ? "animate-pulse text-destructive"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isStreaming}
        >
          {isRecording ? <MicOff className="size-5" /> : <Mic className="size-5" />}
        </Button>

        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isStreaming
              ? "Waiting for response..."
              : isRecording
                ? "Recording..."
                : "Ask me anything..."
          }
          disabled={isStreaming || isRecording}
          rows={1}
          className={cn(
            "border-border bg-muted/50 max-h-[200px] min-h-[44px] resize-none text-base md:text-sm",
            "placeholder:text-muted-foreground/50",
            "focus-visible:ring-ring focus-visible:ring-1",
          )}
        />

        {isStreaming ? (
          <Button
            variant="default"
            size="icon"
            className="size-10 shrink-0"
            onClick={handleStop}
          >
            <Square className="size-4 fill-current" />
          </Button>
        ) : (
          <Button
            variant="default"
            size="icon"
            className={cn(
              "size-10 shrink-0",
              !canSend && "opacity-50",
            )}
            onClick={handleSubmit}
            disabled={!canSend}
          >
            <ArrowUp className="size-4" />
          </Button>
        )}
      </div>
      {isTooLong && (
        <p className="text-destructive mx-auto max-w-2xl text-xs">
          Message is too long ({input.length.toLocaleString()}/
          {MAX_MESSAGE_LENGTH.toLocaleString()})
        </p>
      )}
    </div>
  );
}
