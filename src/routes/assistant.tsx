import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { AiDisclaimer } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { runAi } from "@/lib/ai.functions";
import { ASSISTANT_SYSTEM } from "@/lib/prompts";
import { addActivity } from "@/lib/activity";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Rooted AI Assistant — workplace chat" },
      {
        name: "description",
        content:
          "Chat with the Rooted AI Assistant for help planning your day, drafting emails, prioritising tasks and marketing ideas.",
      },
      { property: "og:title", content: "Rooted AI Assistant — workplace chat" },
      {
        property: "og:description",
        content: "A focused workplace productivity assistant for Rooted With Care.",
      },
    ],
  }),
  component: Assistant,
});

const SUGGESTIONS = [
  "Plan my day.",
  "Draft an email.",
  "Help me prioritize these tasks.",
  "Give me marketing ideas.",
  "Summarize these notes.",
];

type Msg = { role: "user" | "assistant"; content: string };

function Assistant() {
  const call = useServerFn(runAi);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (raw?: string) => {
    const content = (raw ?? input).trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await call({
        data: {
          messages: [{ role: "system" as const, content: ASSISTANT_SYSTEM }, ...next],
        },
      });
      setMessages([...next, { role: "assistant", content: res.text }]);
      addActivity({
        type: "AI Assistant",
        title: content.slice(0, 70) + (content.length > 70 ? "…" : ""),
        input: content,
        output: res.text,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="🤖 Rooted AI Assistant"
        description="Your workplace productivity assistant. Ask about planning, emails, notes and marketing."
        accent="lavender"
      />

      <section className="surface-card flex min-h-[28rem] flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {messages.length === 0 ? (
            <div className="rounded-2xl bg-lavender-soft p-5 text-sm">
              <p className="font-semibold">Hi 👋 How can I help you today?</p>
              <p className="mt-1 text-muted-foreground">Try one of these:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-border bg-card px-3 py-2 text-xs hover:bg-pink-soft"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "ml-auto max-w-[85%] rounded-2xl bg-pink-soft px-4 py-3 text-sm"
                  : "mr-auto max-w-[85%] rounded-2xl bg-muted px-4 py-3 text-sm"
              }
            >
              <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                {m.role === "user" ? (
                  <>
                    <User className="size-3.5" aria-hidden /> You
                  </>
                ) : (
                  <>
                    <Bot className="size-3.5" aria-hidden /> AI-generated content
                  </>
                )}
              </span>
              <p className="whitespace-pre-wrap break-words leading-relaxed">{m.content}</p>
            </div>
          ))}

          {loading ? (
            <p
              className="mr-auto inline-flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm"
              role="status"
            >
              <Loader2 className="size-4 animate-spin" aria-hidden /> Generating…
            </p>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-destructive/30 bg-card p-4 text-sm">
              <p className="text-destructive">{error}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => {
                  const lastUser = [...messages].reverse().find((m) => m.role === "user");
                  if (lastUser) {
                    setMessages((p) => p.filter((m) => m !== lastUser));
                    void send(lastUser.content);
                  }
                }}
              >
                Retry
              </Button>
            </div>
          ) : null}
        </div>

        <form
          className="flex flex-col gap-2 border-t border-border p-4 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your workday…"
            aria-label="Message the Rooted AI Assistant"
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
              <Send className="size-4" aria-hidden /> Send
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setMessages([]);
                setError(null);
              }}
            >
              Clear
            </Button>
          </div>
        </form>
      </section>

      <AiDisclaimer />
    </AppLayout>
  );
}
