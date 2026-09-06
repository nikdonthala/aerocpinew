// AeroCPI Security Utilities
// Shared server-side helpers: rate limiting, input validation, safe errors.
// These run ONLY on the server (imported from API routes), never shipped to the client.

import { NextRequest, NextResponse } from "next/server";

// ============================================================
// Rate limiting — in-memory sliding window (per serverless instance).
// For multi-instance production deployments, swap the store for a
// shared backend (e.g. Redis/Upstash) without changing callers.
// ============================================================

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Prevent unbounded memory growth: periodically clear expired entries.
let lastSweep = Date.now();
function sweepExpired(now: number, windowMs: number) {
  if (now - lastSweep < windowMs) return;
  lastSweep = now;
  for (const [key, entry] of rateLimitStore) {
    if (now - entry.windowStart > windowMs) rateLimitStore.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweepExpired(now, windowMs);

  const entry = rateLimitStore.get(identifier);
  if (!entry || now - entry.windowStart > windowMs) {
    rateLimitStore.set(identifier, { count: 1, windowStart: now });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    const retryAfterSeconds = Math.ceil((entry.windowStart + windowMs - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }
  return { allowed: true, remaining: limit - entry.count, retryAfterSeconds: 0 };
}

function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return ip;
}

// ============================================================
// Input validation helpers
// ============================================================

export function validateString(
  value: unknown,
  maxLength: number
): { ok: true; value: string } | { ok: false; error: string } {
  if (typeof value !== "string") return { ok: false, error: "Expected a string" };
  const trimmed = value.trim();
  if (trimmed.length === 0) return { ok: false, error: "Value cannot be empty" };
  if (trimmed.length > maxLength)
    return { ok: false, error: `Value exceeds maximum length of ${maxLength}` };
  // Reject control characters that should never appear in user text
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(trimmed))
    return { ok: false, error: "Value contains invalid characters" };
  return { ok: true, value: trimmed };
}

export function validateIataCode(value: unknown): { ok: true; value: string } | { ok: false; error: string } {
  const result = validateString(value, 3);
  if (!result.ok) return result;
  if (!/^[A-Z]{3}$/.test(result.value.toUpperCase()))
    return { ok: false, error: "Invalid airport code format" };
  return { ok: true, value: result.value.toUpperCase() };
}

// ============================================================
// Safe JSON responses — never leak stack traces, env vars,
// provider names or internal architecture details.
// ============================================================

export function safeErrorResponse(
  message: string,
  status: number,
  extraHeaders?: Record<string, string>
): NextResponse {
  return NextResponse.json(
    { error: message },
    { status, headers: extraHeaders }
  );
}

export function logServerErrorSafe(scope: string, err: unknown): void {
  // Server-side log only — sanitize anything that might contain secrets.
  const message = err instanceof Error ? err.message : "Unknown error";
  const safeMessage = message.replace(
    /(sk-|ghp_|gho_|AKIA)[A-Za-z0-9-_]{8,}/g,
    "[REDACTED]"
  );
  console.error(`[${scope}] ${safeMessage}`);
}

// ============================================================
// Request body guard — enforce max payload size
// ============================================================

export async function readJsonBodySafe(
  req: NextRequest,
  maxBytes: number
): Promise<{ ok: true; body: unknown } | { ok: false; error: string; status: number }> {
  const contentLength = Number(req.headers.get("content-length") || "0");
  if (contentLength > maxBytes) {
    return { ok: false, error: "Request body too large", status: 413 };
  }

  try {
    const text = await req.text();
    if (text.length > maxBytes) {
      return { ok: false, error: "Request body too large", status: 413 };
    }
    const body = JSON.parse(text);
    if (body === null || typeof body !== "object") {
      return { ok: false, error: "Invalid JSON body", status: 400 };
    }
    return { ok: true, body };
  } catch {
    return { ok: false, error: "Invalid JSON body", status: 400 };
  }
}

export { getClientIdentifier };
