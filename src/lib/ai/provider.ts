// AeroCPI AI Provider Abstraction
// Server-side ONLY. Never import this file from client components.
//
// The assistant targets the gpt-oss-120b model. The model is served by
// several OpenAI-compatible providers (Groq, OpenRouter, self-hosted
// vLLM/ollama endpoints, etc.). This abstraction lets the provider be
// selected purely through environment variables — no code changes needed:
//
//   AI_API_KEY      – secret key for the provider (server-side only!)
//   AI_MODEL        – defaults to "gpt-oss-120b"
//   AI_BASE_URL     – OpenAI-compatible base URL, e.g. https://api.groq.com/openai/v1
//   AI_PROVIDER     – optional label used in health checks
//
// SECURITY: the key is read only inside this module and is only ever sent
// to the configured provider base URL over the server→provider connection.

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionResult {
  ok: boolean;
  content?: string;
  error?: string;
  status?: number;
}

export function getAiConfig() {
  const apiKey = process.env.AI_API_KEY || "";
  const model = process.env.AI_MODEL || "gpt-oss-120b";
  const baseUrl = process.env.AI_BASE_URL || "https://api.groq.com/openai/v1";
  const provider = process.env.AI_PROVIDER || "openai-compatible";
  return { apiKey, model, baseUrl, provider };
}

export function isAiConfigured(): boolean {
  return getAiConfig().apiKey.length > 0;
}

/**
 * Calls an OpenAI-compatible chat completions endpoint.
 * Returns a safe result — the raw provider error is logged server-side,
 * never returned to the client.
 */
export async function chatCompletion(
  messages: ChatMessage[],
  options?: { maxTokens?: number; temperature?: number }
): Promise<ChatCompletionResult> {
  const { apiKey, model, baseUrl } = getAiConfig();

  if (!apiKey) {
    return {
      ok: false,
      error:
        "The AI service is not configured. An administrator must set AI_API_KEY in the server environment. See the AI Setup Guide.",
      status: 503,
    };
  }

  const controller = new AbortController();
  const timeoutMs = Number(process.env.AI_TIMEOUT_MS || "30000");
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: options?.maxTokens ?? 700,
        temperature: options?.temperature ?? 0.3,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      // Log details server-side; return a generic error to the client.
      const detail = await res.text().catch(() => "");
      console.error(
        `[ai-provider] provider returned ${res.status}: ${detail.slice(0, 300).replace(/(sk-|gsk_)[A-Za-z0-9-_]+/g, "[REDACTED]")}`
      );
      return {
        ok: false,
        error:
          res.status === 401 || res.status === 403
            ? "The AI service rejected the configured credentials. An administrator must verify AI_API_KEY."
            : res.status === 429
            ? "The AI service is rate-limited right now. Please try again in a moment."
            : "The AI service is temporarily unavailable. Please try again later.",
        status: res.status === 429 ? 429 : 502,
      };
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return { ok: false, error: "The AI service returned an empty response.", status: 502 };
    }
    return { ok: true, content };
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    console.error(
      `[ai-provider] ${aborted ? "request timed out" : err instanceof Error ? err.message : "unknown error"}`
    );
    return {
      ok: false,
      error: aborted
        ? "The AI service took too long to respond. Please try again."
        : "The AI service could not be reached. Please try again later.",
      status: aborted ? 504 : 502,
    };
  } finally {
    clearTimeout(timeout);
  }
}
