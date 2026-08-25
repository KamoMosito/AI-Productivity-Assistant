import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { AiResultCard, EmptyState, ErrorState, LoadingState } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAi } from "@/lib/useAi";
import { buildInsightsPrompt } from "@/lib/prompts";
import { toast } from "sonner";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Rooted Insights Research Assistant — Rooted AI" },
      {
        name: "description",
        content:
          "Research marketing ideas, customers, product launches and social content with summaries, insights and next steps.",
      },
      { property: "og:title", content: "Rooted Insights Research Assistant — Rooted AI" },
      {
        property: "og:description",
        content: "Business research support for Rooted With Care with clearly labelled AI suggestions.",
      },
    ],
  }),
  component: Insights,
});

const FOCUS = [
  "Marketing ideas",
  "Customer research",
  "Product launch ideas",
  "Social media ideas",
  "Business research",
  "Summarise a pasted article",
];

function Insights() {
  const [focus, setFocus] = useState<string>("Marketing ideas");
  const [topic, setTopic] = useState("");
  const ai = useAi();

  const submit = () => {
    if (topic.trim().length < 5) {
      toast.error("Tell Rooted Insights what to research first.");
      return;
    }
    void ai.generate([
      {
        role: "system",
        content:
          "You are a careful business research assistant. You never present unverified medical or scientific claims as fact.",
      },
      { role: "user", content: buildInsightsPrompt(topic, focus) },
    ]);
  };

  return (
    <AppLayout>
      <PageHeader
        title="🔎 Rooted Insights"
        description="A research assistant for marketing, customers and product ideas. All suggestions are clearly labelled as AI-generated."
        accent="peach"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-4 p-5">
          <div className="space-y-2">
            <Label htmlFor="focus">Research focus</Label>
            <Select value={focus} onValueChange={setFocus}>
              <SelectTrigger id="focus" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FOCUS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">Topic, question or pasted article</Label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Ideas to grow repeat purchases of the Hydrating Scalp Mist in winter"
              className="min-h-64"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={submit} disabled={ai.loading}>
              {ai.loading ? "Researching…" : "Run research"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setTopic("");
                ai.clear();
              }}
            >
              Clear
            </Button>
          </div>
        </section>

        <div>
          {ai.loading ? (
            <LoadingState label="Rooted Insights is working" />
          ) : ai.error ? (
            <ErrorState message={ai.error} onRetry={ai.regenerate} />
          ) : ai.text ? (
            <AiResultCard
              text={ai.text}
              demo={ai.demo}
              onRegenerate={ai.regenerate}
              onClear={ai.clear}
              title="AI-generated content — research output"
            />
          ) : (
            <EmptyState>
              You'll get a summary, key insights, AI-generated recommendations and next steps.
              Product claims are not presented as verified science.
            </EmptyState>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
