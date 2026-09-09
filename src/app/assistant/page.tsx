"use client";

// AeroCPI AI Assistant — chat interface
// All AI traffic goes through the secure server route /api/ai.
// No API keys are present in client code; the client only sends messages.

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Sparkles, Send, Loader2, ShieldCheck, Info, RotateCcw } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Why did the Delhi–Mumbai airfare index move this week?",
  "Which routes experienced the largest price increase?",
  "Compare Hyderabad–Delhi fares over the last 30 days.",
  "Which advance-purchase window currently has the lowest average fare?",
  "What factors could explain the current airfare movement?",
  "Summarize the current Indian airfare trend.",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .filter((m) => m.role !== "assistant" || m.content)
            .slice(-12)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "The AI service could not process this request.");
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "" }]);
      }
    } catch {
      setError("Network error — could not reach the AI service. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const formatReply = (text: string) => {
    // Minimal Markdown-lite rendering: bold, bullets, paragraphs.
    // Content is React-escaped by JSX — no dangerouslySetInnerHTML anywhere.
    const blocks = text.split(/\n{2,}/);
    return blocks.map((block, bi) => {
      const lines = block.split("\n");
      const isList = lines.every((l) => /^\s*[-•*]\s+/.test(l));
      if (isList) {
        return (
          <ul key={bi} className="list-disc pl-5 space-y-1 my-2">
            {lines.map((l, li) => (
              <li key={li}>{renderInline(l.replace(/^\s*[-•*]\s+/, ""))}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={bi} className="my-1.5">
          {renderInline(block)}
        </p>
      );
    });
  };

  const renderInline = (text: string) => {
    // Render **bold** safely without HTML injection.
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="AI Assistant"
        description="Ask natural-language questions about the AeroCPI airfare dataset"
        icon={Sparkles}
        badge="GPT-OSS-120B"
        badgeColor="bg-[color:var(--lavender-soft)] text-[color:var(--cyan)]"
      />

      {/* Trust bar */}
      <div className="glass rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
        <div className="flex items-center gap-2 text-[color:var(--accent-strong)] font-medium">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          Grounded in AeroCPI data
        </div>
        <span className="hidden sm:block w-px h-4 bg-[color:var(--border)]" />
        <p className="text-[color:var(--muted)]">
          Answers are generated only from the platform&apos;s dataset. If something isn&apos;t in
          the data, the assistant will say so. Responses reflect demo/simulated data.
        </p>
      </div>

      {/* Chat window */}
      <div className="card-glass overflow-hidden">
        <div className="h-[480px] sm:h-[540px] overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-14 h-14 rounded-[1.1rem] bg-[color:var(--lavender-soft)] border border-[#ddd5ec] flex items-center justify-center mb-4 shadow-[0_8px_24px_-10px_rgba(126,107,168,0.4)]">
                <Sparkles className="w-7 h-7 text-[color:var(--cyan)]" />
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-1.5">
                Ask about India&apos;s airfares
              </h3>
              <p className="text-sm text-[color:var(--muted)] mb-6 max-w-md">
                Try one of these questions, or ask your own about routes, airlines, booking
                windows or the index.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-sm px-4 py-3 rounded-xl bg-white/70 border border-[color:var(--border)] hover:border-blue-300 hover:bg-white transition-colors text-[color:var(--foreground)]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-[color:var(--accent)] text-[#fff8f2] rounded-br-md shadow-[0_8px_20px_-8px_rgba(176,83,44,0.5)]"
                    : "bg-white/85 border border-[color:var(--border)] text-[color:var(--foreground)] rounded-bl-md"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="space-y-0.5">{formatReply(m.content)}</div>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/80 border border-[color:var(--border)] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[color:var(--accent)]" />
                <span className="text-sm text-[color:var(--muted)]">Analyzing AeroCPI data…</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 sm:mx-6 mb-3 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-[#f7e7e2]/80 border border-[#e8c8c0] text-sm text-[color:var(--up)]">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              {error}
              {(error.includes("not configured") || error.includes("GROQ_API_KEY")) && (
                <a href="/admin/ai-setup" className="ml-1 underline font-medium">
                  Open the AI Setup Guide →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Composer */}
        <form onSubmit={handleSubmit} className="border-t border-[color:var(--border)] p-3 sm:p-4 bg-white/50">
          <div className="flex items-end gap-2">
            <label htmlFor="ai-input" className="sr-only">
              Ask a question about AeroCPI airfare data
            </label>
            <textarea
              id="ai-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="e.g. Which routes had the largest fare increase this week?"
              rows={1}
              maxLength={2000}
              className="flex-1 resize-none px-4 py-3 rounded-xl bg-white/90 border border-[color:var(--border)] text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted)]/60 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/40 max-h-32"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="btn-primary p-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="w-5 h-5" />
            </button>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                aria-label="Clear conversation"
                className="p-3 rounded-xl border border-[color:var(--border)] bg-white/70 hover:bg-white transition-colors text-[color:var(--muted)]"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="mt-2 text-[11px] text-[color:var(--muted)]/70 px-1">
            The assistant answers from the AeroCPI demo dataset and will decline questions it
            cannot support with data. Rate limit: 10 questions per minute.
          </p>
        </form>
      </div>
    </div>
  );
}
