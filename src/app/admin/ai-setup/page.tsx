"use client";

// AeroCPI — AI Setup Guide (developer/admin documentation page)
// SECURITY NOTE: This page NEVER collects, stores or transmits API keys.
// Keys live only in server-side environment variables (.env.local locally,
// Vercel server-side env vars in production).

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  KeyRound,
  ShieldAlert,
  Terminal,
  FlaskConical,
  Wrench,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

interface HealthData {
  status: string;
  model: string;
  message: string;
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-[color:var(--ink-navy)] text-blue-100 rounded-xl p-4 text-sm overflow-x-auto leading-relaxed my-3">
      <code>{children}</code>
    </pre>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-6 mb-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[color:var(--accent-soft)] to-white border border-blue-100/60 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-[color:var(--accent)]" />
        </div>
        <h2 className="text-lg font-semibold text-[color:var(--foreground)]">{title}</h2>
      </div>
      <div className="text-sm text-[color:var(--muted)] leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

export default function AiSetupPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [checking, setChecking] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/ai/health", { cache: "no-store" });
      setHealth(await res.json());
    } catch {
      setHealth(null);
    } finally {
      setChecking(false);
    }
  };

  // Initial health check — fire-and-forget so no setState runs synchronously in the effect.
  useEffect(() => {
    const id = setTimeout(() => void checkHealth(), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="AI Setup Guide"
        description="Configure the gpt-oss-120b assistant — keys stay server-side, always"
        icon={KeyRound}
        badge="ADMIN"
        badgeColor="bg-cyan-100 text-cyan-800"
      />

      {/* Live status */}
      <div className="glass rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {checking ? (
              <Loader2 className="w-5 h-5 animate-spin text-[color:var(--accent)]" />
            ) : health?.status === "ONLINE" ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-600" />
            )}
            <div>
              <p className="font-semibold text-[color:var(--foreground)] text-sm">
                AI Service: {health?.status ?? "CHECKING…"}
              </p>
              <p className="text-xs text-[color:var(--muted)]">{health?.message}</p>
            </div>
          </div>
          <button
            onClick={checkHealth}
            className="text-sm px-3 py-1.5 rounded-lg border border-[color:var(--border)] bg-white/70 hover:bg-white font-medium text-[color:var(--accent-strong)] transition-colors"
          >
            Re-check
          </button>
        </div>
      </div>

      {/* Security warning */}
      <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50/80 border border-red-200">
        <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-red-800">
          <p className="font-semibold mb-0.5">Never commit API keys to GitHub or expose them in frontend code.</p>
          <p>
            Keys must exist only in server-side environment variables. Anyone with the key can
            bill usage to your account.
          </p>
        </div>
      </div>

      <Section icon={KeyRound} title="1 · Obtain an API key">
        <p>
          The assistant uses the <strong>gpt-oss-120b</strong> model, served by OpenAI-compatible
          providers (e.g. Groq, OpenRouter, or a self-hosted vLLM endpoint). Create an account
          with your chosen provider and generate an API key from their dashboard.
        </p>
        <p>Choose a provider whose catalogue includes <code>gpt-oss-120b</code>.</p>
      </Section>

      <Section icon={Terminal} title="2 · Configure environment variables">
        <p>
          Add the following to <code>.env.local</code> (local development) or your hosting
          provider&apos;s server-side environment settings (production):
        </p>
        <CodeBlock>{`AI_API_KEY=your-secret-key-here
AI_MODEL=gpt-oss-120b
AI_BASE_URL=https://api.groq.com/openai/v1
AI_PROVIDER=groq`}</CodeBlock>
        <p>
          Variable meanings: <code>AI_API_KEY</code> (secret), <code>AI_MODEL</code> (model id),
          <code> AI_BASE_URL</code> (OpenAI-compatible endpoint), <code>AI_PROVIDER</code>{" "}
          (display label). If your provider requires different variable names, set them in the
          provider abstraction at <code>src/lib/ai/provider.ts</code>.
        </p>
      </Section>

      <Section icon={RefreshCw} title="3 · Restart the application">
        <p>Environment variables are read at startup:</p>
        <CodeBlock>{`# Local development
npm run dev

# Production build
npm run build && npm start`}</CodeBlock>
      </Section>

      <Section icon={FlaskConical} title="4 · Test the AI connection">
        <p>
          The status panel above calls <code>/api/ai/health</code>. When the service shows{" "}
          <strong>ONLINE</strong>, open the{" "}
          <a href="/assistant" className="text-[color:var(--accent)] font-medium underline">
            AI Assistant
          </a>{" "}
          and ask a test question, e.g. <em>&ldquo;Summarize the current Indian airfare trend.&rdquo;</em>
        </p>
        <p>Server-side smoke test without the UI:</p>
        <CodeBlock>{`curl -s http://localhost:3000/api/ai/health | jq

curl -s -X POST http://localhost:3000/api/ai \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"What is the current AeroCPI index?"}]}' | jq`}</CodeBlock>
      </Section>

      <Section icon={Wrench} title="5 · Troubleshooting">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>&ldquo;AI service is not configured&rdquo;</strong> — <code>AI_API_KEY</code> is
            missing from the server environment. Add it and restart.
          </li>
          <li>
            <strong>&ldquo;Rejected the configured credentials&rdquo;</strong> — the key is invalid,
            expired, or lacks access to the model. Generate a fresh key.
          </li>
          <li>
            <strong>&ldquo;Rate-limited&rdquo;</strong> — the provider quota is exhausted or the
            app&apos;s own limiter (10 req/min/IP) triggered. Wait and retry.
          </li>
          <li>
            <strong>Timeouts</strong> — increase <code>AI_TIMEOUT_MS</code> (default 30000) or check
            provider status.
          </li>
          <li>
            <strong>Model not found</strong> — verify <code>AI_MODEL</code> matches the
            provider&apos;s exact model id.
          </li>
        </ul>
      </Section>

      <Section icon={RefreshCw} title="6 · Rotate or revoke the key">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Revoke the old key in the provider dashboard (immediate).</li>
          <li>Generate a new key and update <code>AI_API_KEY</code> in the server environment.</li>
          <li>Redeploy/restart so the new value is picked up.</li>
          <li>
            If a key ever leaks: revoke it <strong>immediately</strong>, rotate, and audit usage in
            the provider dashboard.
          </li>
        </ul>
      </Section>

      <div className="mt-8 mb-12 p-4 rounded-xl bg-[color:var(--accent-soft)] border border-blue-200/60 text-sm text-[color:var(--accent-strong)]">
        <strong>Deployment note:</strong> On Vercel, set these variables under Project → Settings →
        Environment Variables (server-side). Never prefix them with <code>NEXT_PUBLIC_</code> —
        that would expose them in the browser bundle.
      </div>
    </div>
  );
}
