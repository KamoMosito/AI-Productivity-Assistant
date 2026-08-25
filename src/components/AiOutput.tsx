import { Copy, RefreshCw, Trash2, Pencil, Loader2, AlertTriangle, Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const AI_DISCLAIMER =
  "AI-generated content. Please review this output before using it for business decisions. AI can make mistakes and should not replace human judgment.";

export function AiDisclaimer() {
  return (
    <p className="mt-4 rounded-xl bg-peach-soft px-4 py-3 text-xs leading-relaxed text-foreground/80">
      {AI_DISCLAIMER}
    </p>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="surface-card flex min-h-56 flex-col items-center justify-center gap-2 p-8 text-center">
      <Sparkles className="size-6 text-primary" aria-hidden />
      <p className="max-w-sm text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <div
      className="surface-card flex min-h-56 flex-col items-center justify-center gap-3 p-8 text-center"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">Generating…</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="surface-card flex min-h-40 flex-col items-center justify-center gap-3 border-destructive/30 p-8 text-center">
      <AlertTriangle className="size-6 text-destructive" aria-hidden />
      <p className="text-sm font-medium">Something went wrong</p>
      <p className="max-w-md text-xs text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw className="size-4" aria-hidden /> Retry
      </Button>
    </div>
  );
}

export function AiResultCard({
  text,
  demo,
  onRegenerate,
  onClear,
  title = "AI-generated content",
}: {
  text: string;
  demo?: boolean;
  onRegenerate?: () => void;
  onClear?: () => void;
  title?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);

  useEffect(() => {
    setValue(text);
    setEditing(false);
  }, [text]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy — please select and copy manually");
    }
  };

  return (
    <section className="surface-card overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-lavender-soft px-4 py-3 sm:px-5">
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-lavender" aria-hidden />
          {title}
        </span>
        {demo ? (
          <span className="rounded-full bg-peach px-2.5 py-1 text-xs font-medium text-foreground">
            Demo response
          </span>
        ) : null}
      </header>

      <div className="p-4 sm:p-5">
        {editing ? (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-h-72 text-sm"
            aria-label="Edit AI output"
          />
        ) : (
          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">
            {value}
          </pre>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={copy}>
            <Copy className="size-4" aria-hidden /> Copy
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setEditing((v) => !v)}>
            <Pencil className="size-4" aria-hidden /> {editing ? "Done editing" : "Edit"}
          </Button>
          {onRegenerate ? (
            <Button size="sm" variant="outline" onClick={onRegenerate}>
              <RefreshCw className="size-4" aria-hidden /> Regenerate
            </Button>
          ) : null}
          {onClear ? (
            <Button size="sm" variant="ghost" onClick={onClear}>
              <Trash2 className="size-4" aria-hidden /> Clear
            </Button>
          ) : null}
        </div>

        <AiDisclaimer />
      </div>
    </section>
  );
}
