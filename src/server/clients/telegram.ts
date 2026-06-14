import { env } from "~/env";

export function isTelegramConfigured(): boolean {
  return !!env.TELEGRAM_BOT_TOKEN && !!env.TELEGRAM_BOT_USERNAME;
}

function getTelegramApiBase(): string {
  if (!env.TELEGRAM_BOT_TOKEN) {
    throw new Error("Telegram not configured");
  }
  return `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}`;
}

export type TelegramReplyMarkup = {
  inline_keyboard: Array<
    Array<{
      text: string;
      url?: string;
      callback_data?: string;
      web_app?: { url: string };
      login_url?: unknown;
      switch_inline_query?: string;
      switch_inline_query_current_chat?: string;
      callback_game?: unknown;
      pay?: boolean;
    }>
  >;
};

/**
 * Send a rich message using Telegram Bot API 10.1+.
 * Supports tables, nested lists, headers, math, code blocks, inline media,
 * collages, slideshows, and inline keyboards.
 */
export async function sendTelegramRichMessage(
  chatId: string,
  markdown: string,
  options?: { reply_markup?: TelegramReplyMarkup },
): Promise<void> {
  const TELEGRAM_API_BASE = getTelegramApiBase();
  const response = await fetch(`${TELEGRAM_API_BASE}/sendRichMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      rich_message: { markdown },
      ...(options?.reply_markup ? { reply_markup: options.reply_markup } : {}),
    }),
  });

  if (response.ok) return;

  const body = await response.text().catch(() => "(no body)");
  console.error(
    `[telegram] sendRichMessage failed: ${response.status}`,
    { chatId, markdownLength: markdown.length, body },
  );
  throw new Error(
    `Telegram sendRichMessage failed: ${response.status} - ${body}`,
  );
}

const RICH_MESSAGE_MAX_LENGTH = 32768;
const LEGACY_MESSAGE_MAX_LENGTH = 4096;

export async function sendTelegramMessage(
  chatId: string,
  text: string,
): Promise<void> {
  const TELEGRAM_API_BASE = getTelegramApiBase();

  // Try rich message first (Bot API 10.1+ supports tables, lists, headers, math, etc.)
  if (text.length <= RICH_MESSAGE_MAX_LENGTH) {
    const richResponse = await fetch(`${TELEGRAM_API_BASE}/sendRichMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        rich_message: { markdown: text },
      }),
    });

    if (richResponse.ok) return;

    const richBody = await richResponse.text().catch(() => "(no body)");
    console.warn(
      `[telegram] sendRichMessage failed: ${richResponse.status}, falling back to sendMessage`,
      { chatId, textLength: text.length, body: richBody },
    );
  }

  // Fallback: sendMessage with Markdown formatting
  const markdownText =
    text.length > LEGACY_MESSAGE_MAX_LENGTH
      ? text.slice(0, LEGACY_MESSAGE_MAX_LENGTH)
      : text;
  const markdownResponse = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: markdownText,
      parse_mode: "Markdown",
    }),
  });

  if (markdownResponse.ok) return;

  // Markdown parsing failed (e.g. underscores in URLs) - retry as plain text
  const plainResponse = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: markdownText,
    }),
  });

  if (!plainResponse.ok) {
    const body = await plainResponse.text().catch(() => "(no body)");
    console.error(
      `[telegram] sendMessage failed: ${plainResponse.status}`,
      { chatId, textLength: text.length, body },
    );
    throw new Error(
      `Telegram sendMessage failed: ${plainResponse.status} - ${body}`,
    );
  }
}

export async function sendChatAction(
  chatId: string,
  action: "typing",
): Promise<void> {
  const TELEGRAM_API_BASE = getTelegramApiBase();
  const response = await fetch(`${TELEGRAM_API_BASE}/sendChatAction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      action,
    }),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "(no body)");
    console.error(
      `[telegram] sendChatAction failed: ${response.status}`,
      { chatId, action, body },
    );
    throw new Error(`Telegram sendChatAction failed: ${response.status} - ${body}`);
  }
}
