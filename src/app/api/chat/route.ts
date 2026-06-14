import { smoothStream, UI_MESSAGE_STREAM_HEADERS } from "ai";
import { z } from "zod";
import { auth } from "~/server/auth";
import { db } from "~/server/clients/db";
import { prepareAgentRun } from "~/server/api/routers/trustclaw/agent/setup";
import {
  setStreamingMessage,
  getStreamingMessage,
} from "~/server/clients/redis";
import { getStreamContext } from "./stream-store";
import { TRPCError } from "@trpc/server";

const chatRequestBody = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().optional(),
      parts: z.array(z.record(z.unknown())).optional(),
    }),
  ),
});

async function getAuthenticatedInstance(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const userId = session.user.id;
  const instance = await db.composioClawInstance.findUnique({
    where: { userId },
    select: { id: true, userId: true },
  });

  if (!instance) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  return { userId, instanceId: instance.id };
}

export const maxDuration = 60;

export async function POST(request: Request) {
  const authResult = await getAuthenticatedInstance(request);
  if (!authResult) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { instanceId } = authResult;

  const body = chatRequestBody.safeParse(await request.json());
  if (!body.success) {
    return new Response("Invalid request body", { status: 400 });
  }

  const lastUserMessage = [...body.data.messages]
    .reverse()
    .find((m) => m.role === "user");

  // Extract text and image parts from the message
  let userText = "";
  const userContentParts: Array<
    { type: "text"; text: string } | { type: "image"; image: string } | { type: "audio"; audio: string }
  > = [];

  if (lastUserMessage?.parts) {
    for (const part of lastUserMessage.parts) {
      if (
        typeof part === "object" &&
        part !== null &&
        "type" in part
      ) {
        if (part.type === "text" && "text" in part && typeof part.text === "string") {
          userText += part.text + "\n";
          userContentParts.push({ type: "text", text: part.text });
        } else if (part.type === "image" && "image" in part && typeof part.image === "string") {
          userContentParts.push({ type: "image", image: part.image });
        } else if (part.type === "audio" && "audio" in part && typeof part.audio === "string") {
          userContentParts.push({ type: "audio", audio: part.audio });
        }
      }
    }
  }

  // Fallback to legacy content field
  if (!userText.trim() && lastUserMessage?.content) {
    userText = lastUserMessage.content;
  }

  if (!userText.trim() && userContentParts.length === 0) {
    return new Response("Empty message", { status: 400 });
  }

  const prepareResult = await prepareAgentRun({
    instanceId,
    userMessage: userText.trim(),
    userContentParts,
    source: "web",
  });

  const { agent, messages } = prepareResult.result;

  const streamId = crypto.randomUUID();
  await setStreamingMessage(instanceId, streamId);

  // agent.stream() returns streamText() result - supports toUIMessageStreamResponse
  // Pass request.signal so the agent stops when the client disconnects (stop button)
  const result = await agent.stream({
    prompt: messages,
    experimental_transform: smoothStream(),
    abortSignal: request.signal,
  });

  const streamContext = getStreamContext();
  return result.toUIMessageStreamResponse({
    headers: {
      "X-Stream-Id": streamId,
    },
    ...(streamContext
      ? {
          consumeSseStream: ({ stream }) => {
            void streamContext.createNewResumableStream(
              streamId,
              () => stream,
            );
          },
        }
      : {}),
  });
}

export async function GET(request: Request) {
  const authResult = await getAuthenticatedInstance(request);

  const { instanceId } = authResult;
  const url = new URL(request.url);
  const streamId = url.searchParams.get("streamId");

  if (!streamId) {
    return new Response("Missing streamId", { status: 400 });
  }

  const activeStreamId = await getStreamingMessage(instanceId);
  if (activeStreamId !== streamId) {
    return new Response("Stream not found or not yours", { status: 404 });
  }

  const streamContext = getStreamContext();
  if (!streamContext) {
    return new Response("Stream resumption not available", { status: 204 });
  }
  const stream = await streamContext.resumeExistingStream(streamId);
  if (!stream) {
    return new Response("Stream already completed", { status: 204 });
  }

  return new Response(stream.pipeThrough(new TextEncoderStream()), {
    headers: UI_MESSAGE_STREAM_HEADERS,
  });
}
