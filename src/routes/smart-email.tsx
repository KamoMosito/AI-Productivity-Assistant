import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { AiResultCard, EmptyState, ErrorState, LoadingState } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { buildEmailPrompt } from "@/lib/prompts";
import { toast } from "sonner";

export const Route = createFileRoute("/smart-email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Rooted AI" },
      {
        name: "description",
        content:
          "Generate professional emails for customers, suppliers, managers and team members with structured prompt engineering.",
      },
      { property: "og:title", content: "Smart Email Generator — Rooted AI" },
      {
        property: "og:description",
        content: "Draft on-brand business emails for Rooted With Care in seconds.",
      },
    ],
  }),
  component: SmartEmail,
});

const AUDIENCES = ["Customer", "Supplier", "Manager", "Team Member", "Business Partner"];
const TONES = ["Formal", "Friendly", "Persuasive"];
const LENGTHS = ["Short", "Medium", "Detailed"];

function SmartEmail() {
  const [audience, setAudience] = useState<string>("Customer");
  const [tone, setTone] = useState<string>("Friendly");
  const [length, setLength] = useState<string>("Medium");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const ai = useAi();

  const submit = () => {
    if (!purpose.trim() || !keyPoints.trim()) {
      toast.error("Please add a purpose and at least one key point.");
      return;
    }
    void ai.generate([
      { role: "system", content: "You write business emails and follow instructions exactly." },
      { role: "user", content: buildEmailPrompt({ audience, purpose, keyPoints, tone, length }) },
    ]);
  };

  const clearAll = () => {
    setPurpose("");
    setKeyPoints("");
    ai.clear();
  };

  return (
    <AppLayout>
      <PageHeader
        title="✉️ Smart Email Generator"
        description="Describe what you need and Rooted AI drafts a professional email that keeps your meaning intact."
        accent="pink"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="audience">Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger id="audience" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Follow up with the packaging supplier about the delayed order"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Key points</Label>
            <Textarea
              id="points"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder={"One point per line, e.g.\n- Order placed two weeks ago\n- Need delivery date confirmation"}
              className="min-h-40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="length">Length</Label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger id="length" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LENGTHS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button onClick={submit} disabled={ai.loading}>
              {ai.loading ? "Generating…" : "Generate email"}
            </Button>
            <Button variant="ghost" onClick={clearAll}>
              Clear
            </Button>
          </div>
        </section>

        <div>
          {ai.loading ? (
            <LoadingState label="Rooted AI is drafting your email" />
          ) : ai.error ? (
            <ErrorState message={ai.error} onRetry={ai.regenerate} />
          ) : ai.text ? (
            <AiResultCard
              text={ai.text}
              demo={ai.demo}
              onRegenerate={ai.regenerate}
              onClear={ai.clear}
            />
          ) : (
            <EmptyState>
              Fill in the audience, purpose and key points, then generate. Rooted AI never invents
              names, dates or prices — it will use [placeholders] instead.
            </EmptyState>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
