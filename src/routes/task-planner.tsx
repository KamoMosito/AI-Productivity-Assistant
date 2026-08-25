import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
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
import { buildPlannerPrompt, type PlannerTask } from "@/lib/prompts";
import { toast } from "sonner";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Rooted AI" },
      {
        name: "description",
        content:
          "Prioritise tasks by urgency, importance, deadline and duration, and build a realistic daily or weekly schedule.",
      },
      { property: "og:title", content: "AI Task Planner — Rooted AI" },
      {
        property: "og:description",
        content: "Build a realistic daily or weekly plan for Rooted With Care.",
      },
    ],
  }),
  component: TaskPlanner,
});

const EMPTY: PlannerTask = {
  task: "",
  deadline: "",
  importance: "Medium",
  duration: "",
  notes: "",
};

const EXAMPLES = [
  "Order ingredients",
  "Follow up with packaging supplier",
  "Prepare social media content",
  "Respond to customer messages",
  "Review weekly sales",
  "Research hair-care trends",
  "Prepare product launch",
];

function TaskPlanner() {
  const [tasks, setTasks] = useState<PlannerTask[]>([{ ...EMPTY }]);
  const [mode, setMode] = useState<"Daily" | "Weekly">("Daily");
  const ai = useAi();

  const update = (i: number, patch: Partial<PlannerTask>) =>
    setTasks((prev) => prev.map((t, n) => (n === i ? { ...t, ...patch } : t)));

  const submit = () => {
    const filled = tasks.filter((t) => t.task.trim());
    if (filled.length === 0) {
      toast.error("Add at least one task.");
      return;
    }
    void ai.generate([
      {
        role: "system",
        content:
          "You are a productivity planner. You never change user-provided deadlines and never add tasks.",
      },
      { role: "user", content: buildPlannerPrompt(filled, mode) },
    ]);
  };

  return (
    <AppLayout>
      <PageHeader
        title="📅 AI Task Planner"
        description="Add your tasks and Rooted AI builds a prioritised, realistic plan — and explains its reasoning."
        accent="sage"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-5 p-5">
          <div className="space-y-2">
            <Label htmlFor="mode">Plan type</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as "Daily" | "Weekly")}>
              <SelectTrigger id="mode" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily plan</SelectItem>
                <SelectItem value="Weekly">Weekly plan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {tasks.map((t, i) => (
            <div key={i} className="space-y-3 rounded-2xl bg-sage-soft p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Task {i + 1}</span>
                {tasks.length > 1 ? (
                  <button
                    type="button"
                    aria-label={`Remove task ${i + 1}`}
                    onClick={() => setTasks((p) => p.filter((_, n) => n !== i))}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`task-${i}`}>Task</Label>
                <Input
                  id={`task-${i}`}
                  value={t.task}
                  onChange={(e) => update(i, { task: e.target.value })}
                  placeholder="e.g. Order ingredients"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`deadline-${i}`}>Deadline</Label>
                  <Input
                    id={`deadline-${i}`}
                    value={t.deadline}
                    onChange={(e) => update(i, { deadline: e.target.value })}
                    placeholder="e.g. Friday 17:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`importance-${i}`}>Importance</Label>
                  <Select
                    value={t.importance}
                    onValueChange={(v) => update(i, { importance: v })}
                  >
                    <SelectTrigger id={`importance-${i}`} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`duration-${i}`}>Estimated duration</Label>
                <Input
                  id={`duration-${i}`}
                  value={t.duration}
                  onChange={(e) => update(i, { duration: e.target.value })}
                  placeholder="e.g. 45 minutes"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`notes-${i}`}>Notes</Label>
                <Textarea
                  id={`notes-${i}`}
                  value={t.notes}
                  onChange={(e) => update(i, { notes: e.target.value })}
                  placeholder="Anything the planner should know"
                  className="min-h-20"
                />
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setTasks((p) => [...p, { ...EMPTY }])}>
              <Plus className="size-4" aria-hidden /> Add task
            </Button>
            <Button onClick={submit} disabled={ai.loading}>
              {ai.loading ? "Planning…" : `Create ${mode.toLowerCase()} plan`}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setTasks([{ ...EMPTY }]);
                ai.clear();
              }}
            >
              Clear
            </Button>
          </div>

          <div className="rounded-2xl bg-muted p-4">
            <p className="text-xs font-semibold">Common Rooted With Care tasks</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {EXAMPLES.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() =>
                    setTasks((p) => {
                      const idx = p.findIndex((t) => !t.task.trim());
                      if (idx >= 0)
                        return p.map((t, n) => (n === idx ? { ...t, task: e } : t));
                      return [...p, { ...EMPTY, task: e }];
                    })
                  }
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:bg-sage-soft"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div>
          {ai.loading ? (
            <LoadingState label="Rooted AI is building your schedule" />
          ) : ai.error ? (
            <ErrorState message={ai.error} onRetry={ai.regenerate} />
          ) : ai.text ? (
            <AiResultCard
              text={ai.text}
              demo={ai.demo}
              onRegenerate={ai.regenerate}
              onClear={ai.clear}
              title="AI-generated content — your plan"
            />
          ) : (
            <EmptyState>
              Your prioritised order, schedule, reasoning and deadline warnings will appear here.
              Deadlines you enter are never changed silently.
            </EmptyState>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
