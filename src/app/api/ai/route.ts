// AeroCPI AI Assistant API Route — Server-side ONLY
// Security controls:
//   • Rate limiting (10 req/min per IP) — AI calls are expensive
//   • Strict input validation (message length, message count)
//   • Request body size limit (16 KB)
//   • Secrets never leave the server; provider errors are sanitized
//   • Grounding context built from AeroCPI data — the model may not invent data

import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIdentifier,
  readJsonBodySafe,
  safeErrorResponse,
  validateString,
  logServerErrorSafe,
} from "@/lib/security";
import { chatCompletion, ChatMessage } from "@/lib/ai/provider";
import { buildGroundingContext, buildSystemPrompt } from "@/lib/ai/grounding";

export const runtime = "nodejs";

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 1000;

export async function POST(req: NextRequest) {
  // --- Rate limiting (per IP) ---
  const clientId = getClientIdentifier(req);
  const rl = checkRateLimit(`ai:${clientId}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rl.allowed) {
    return safeErrorResponse(
      "Too many AI requests. Please wait a moment before trying again.",
      429,
      { "Retry-After": String(Math.max(1, rl.retryAfterSeconds)) }
    );
  }

  // --- Body size + JSON validation ---
  const bodyResult = await readJsonBodySafe(req, MAX_BODY_BYTES);
  if (!bodyResult.ok) {
    return safeErrorResponse(bodyResult.error, bodyResult.status);
  }

  // --- Payload shape validation ---
  const { body } = bodyResult;
  const rawMessages = (body as { messages?: unknown }).messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return safeErrorResponse("Field 'messages' is required and must not be empty.", 400);
  }
  if (rawMessages.length > MAX_MESSAGES) {
    return safeErrorResponse(`Too many messages. Maximum is ${MAX_MESSAGES}.`, 400);
  }

  const validated: ChatMessage[] = [];
  for (const m of rawMessages) {
    const role = (m as { role?: unknown })?.role;
    const content = (m as { content?: unknown })?.content;
    if (role !== "user" && role !== "assistant") {
      return safeErrorResponse("Invalid message role.", 400);
    }
    const v = validateString(content, MAX_MESSAGE_LENGTH);
    if (!v.ok) return safeErrorResponse(`Invalid message content: ${v.error}`, 400);
    validated.push({ role, content: v.value });
  }
  // The client may only send user/assistant turns; the system prompt is built server-side.
  if (validated[0]?.role === "assistant") validated.shift();
  if (validated.length === 0 || validated[validated.length - 1]?.role !== "user") {
    return safeErrorResponse("The last message must be from the user.", 400);
  }

  // --- Grounding: build the data snapshot from AeroCPI's own engine ---
  const grounding = buildGroundingContext();
  const systemPrompt = buildSystemPrompt(grounding);

  const messages: ChatMessage[] = [{ role: "system", content: systemPrompt }, ...validated];

  // --- Call the provider (server → provider only) ---
  try {
    const result = await chatCompletion(messages, { maxTokens: 700, temperature: 0.3 });
    if (!result.ok) {
      return safeErrorResponse(result.error || "The AI service is unavailable.", result.status || 502);
    }
    return NextResponse.json(
      { reply: result.content, grounded: true, dataset: "demo" },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    logServerErrorSafe("ai-chat", err);
    return safeErrorResponse(
      "An unexpected error occurred while contacting the AI service. Please try again.",
      500
    );
  }
}
