import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, NotebookPen, CalendarCheck, Search, Bot } from "lucide-react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  countByType,
  formatWhen,
  useActivities,
  type Activity,
  type ActivityType,
} from "@/lib/activity";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity — Rooted AI" },
      {
        name: "description",
        content:
          "Your complete Rooted AI activity history: emails generated, meetings summarized, tasks planned, research completed and assistant interactions.",
      },
      { property: "og:title", content: "Activity — Rooted AI" },
      {
        property: "og:description",
        content: "Track Rooted AI usage across emails, meetings, tasks and research.",
      },
    ],
  }),
  component: ActivityPage,
});

const TOTALS: { label: string; type: ActivityType; icon: typeof Mail; tint: string }[] = [
  { label: "Emails generated", type: "Smart Email", icon: Mail, tint: "bg-pink-soft" },
  { label: "Meetings summarized", type: "Meeting Notes", icon: NotebookPen, tint: "bg-lavender-soft" },
  { label: "Tasks planned", type: "Task Planner", icon: CalendarCheck, tint: "bg-sage-soft" },
  { label: "Research completed", type: "Rooted Insights", icon: Search, tint: "bg-peach-soft" },
  { label: "Assistant interactions", type: "AI Assistant", icon: Bot, tint: "bg-lavender-soft" },
];

function ActivityPage() {
  const { activities, remove } = useActivities();
  const [viewing, setViewing] = useState<Activity | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Activity | null>(null);

  return (
    <AppLayout>
      <PageHeader
        title="Activity"
        description="Your complete history of completed Rooted AI activities."
        accent="lavender"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TOTALS.map((t) => (
          <div key={t.label} className={`surface-card p-5 ${t.tint}`}>
            <t.icon className="size-5" aria-hidden />
            <p className="mt-3 text-3xl font-semibold">{countByType(activities, t.type)}</p>
            <p className="text-sm text-muted-foreground">{t.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold">Activity history</h2>
      {activities.length === 0 ? (
        <div className="surface-card px-5 py-8 text-center">
          <p className="text-sm font-medium">No recent activity</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your completed AI activities will appear here.
          </p>
        </div>
      ) : (
        <ul className="surface-card divide-y divide-border">
          {activities.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-2 px-5 py-4">
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">{a.type}</span>
              <span className="flex-1 text-sm">{a.title}</span>
              <span className="text-xs text-muted-foreground">{formatWhen(a.createdAt)}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setViewing(a)}>
                  View
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPendingDelete(a)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={viewing !== null} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewing?.title}</DialogTitle>
            <DialogDescription>
              {viewing ? `${viewing.type} · ${formatWhen(viewing.createdAt)}` : null}
            </DialogDescription>
          </DialogHeader>
          {viewing ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Your input</p>
                <pre className="mt-1 whitespace-pre-wrap break-words rounded-xl bg-muted p-4 font-sans text-sm leading-relaxed">
                  {viewing.input}
                </pre>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  AI-generated output
                </p>
                <pre className="mt-1 whitespace-pre-wrap break-words rounded-xl bg-lavender-soft p-4 font-sans text-sm leading-relaxed">
                  {viewing.output}
                </pre>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this activity?</AlertDialogTitle>
            <AlertDialogDescription>
              This activity will be permanently removed from your activity history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) remove(pendingDelete.id);
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
