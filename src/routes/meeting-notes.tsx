import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { AiResultCard, EmptyState, ErrorState, LoadingState } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAi } from "@/lib/useAi";
import { buildMeetingPrompt } from "@/lib/prompts";
import { toast } from "sonner";
import { addActivity } from "@/lib/activity";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Rooted AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a summary with key decisions, action items, responsible people and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Rooted AI" },
      {
        property: "og:description",
        content: "Extract decisions, owners and deadlines from messy meeting notes.",
      },
    ],
  }),
  component: MeetingNotes,
});

function MeetingNotes() {
  const [notes, setNotes] = useState("");
  const ai = useAi();

  const submit = () => {
    if (notes.trim().length < 20) {
      toast.error("Please paste a bit more of your meeting notes.");
      return;
    }
    void ai
      .generate([
        {
          role: "system",
          content:
            "You extract structured information from meeting notes. You never invent details and write 'Not specified.' when information is absent.",
        },
        { role: "user", content: buildMeetingPrompt(notes) },
      ])
      .then((text) => {
        if (!text) return;
        addActivity({
          type: "Meeting Notes",
          title: `Meeting summary — ${notes.trim().slice(0, 60)}${notes.trim().length > 60 ? "…" : ""}`,
          input: notes,
          output: text,
        });
      });
  };

  return (
    <AppLayout>
      <PageHeader
        title="📝 Meeting Notes Summarizer"
        description="Paste your raw notes — Rooted AI extracts only what is actually there and marks anything missing as “Not specified.”"
        accent="lavender"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-4 p-5">
          <div className="space-y-2">
            <Label htmlFor="notes">Meeting notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your meeting notes here…"
              className="min-h-80"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={submit} disabled={ai.loading}>
              {ai.loading ? "Summarizing…" : "Summarize notes"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setNotes("");
                ai.clear();
              }}
            >
              Clear
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Avoid pasting customer ID numbers, payment details or other confidential information.
          </p>
        </section>

        <div>
          {ai.loading ? (
            <LoadingState label="Rooted AI is reading your notes" />
          ) : ai.error ? (
            <ErrorState message={ai.error} onRetry={ai.regenerate} />
          ) : ai.text ? (
            <AiResultCard
              text={ai.text}
              demo={ai.demo}
              onRegenerate={ai.regenerate}
              onClear={ai.clear}
              title="AI-generated content — meeting summary"
            />
          ) : (
            <EmptyState>
              Your summary, key decisions, action items, responsible people, deadlines and follow-up
              items will appear here.
            </EmptyState>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
