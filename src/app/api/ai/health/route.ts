// AeroCPI AI health-check endpoint — Server-side ONLY
// Reports whether the AI service is configured, WITHOUT leaking the key,
// provider name or base URL. Used by the Admin console status panel.

import { NextResponse } from "next/server";
import { isAiConfigured, getAiConfig } from "@/lib/ai/provider";
import { getClientIdentifier, checkRateLimit, safeErrorResponse } from "@/lib/security";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const rl = checkRateLimit(`ai-health:${getClientIdentifier(req)}`, 30, 60 * 1000);
  if (!rl.allowed) {
    return safeErrorResponse("Too many requests.", 429);
  }

  const configured = isAiConfigured();
  const { model } = getAiConfig();

  return NextResponse.json(
    {
      service: "ai",
      status: configured ? "ONLINE" : "NOT_CONFIGURED",
      model, // model name is not a secret
      message: configured
        ? "AI assistant is configured and ready."
        : "AI_API_KEY is not set. See the AI Setup Guide for configuration steps.",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
