import { createFileRoute } from "@tanstack/react-router";
import { Mail, NotebookPen, CalendarCheck, Search, Bot } from "lucide-react";
import { AppLayout, PageHeader } from "@/components/AppLayout";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity — Rooted AI" },
      {
        name: "description",
        content:
          "A demo activity log of emails generated, meetings summarized, tasks planned, research completed and assistant interactions.",
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

const TOTALS = [
  { label: "Emails generated", value: 24, icon: Mail, tint: "bg-pink-soft" },
  { label: "Meetings summarized", value: 9, icon: NotebookPen, tint: "bg-lavender-soft" },
  { label: "Tasks planned", value: 37, icon: CalendarCheck, tint: "bg-sage-soft" },
  { label: "Research completed", value: 12, icon: Search, tint: "bg-peach-soft" },
  { label: "Assistant interactions", value: 58, icon: Bot, tint: "bg-lavender-soft" },
];

const LOG = [
  { type: "Smart Email", what: "Supplier follow-up — packaging delay", when: "Today, 08:40" },
  { type: "AI Assistant", what: "Asked how to prioritise customer replies", when: "Today, 08:05" },
  { type: "Meeting Notes", what: "Team stand-up — 3 action items extracted", when: "Yesterday, 16:10" },
  { type: "Task Planner", what: "Weekly plan created (7 tasks)", when: "Yesterday, 09:05" },
  { type: "Rooted Insights", what: "Winter scalp care content ideas", when: "Mon, 14:22" },
  { type: "Smart Email", what: "Customer thank-you after first order", when: "Mon, 10:15" },
  { type: "Meeting Notes", what: "Supplier call summary", when: "Fri, 15:30" },
];

function ActivityPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Activity"
        description="Fictional demo data showing how Rooted AI usage would be tracked."
        accent="lavender"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TOTALS.map((t) => (
          <div key={t.label} className={`surface-card p-5 ${t.tint}`}>
            <t.icon className="size-5" aria-hidden />
            <p className="mt-3 text-3xl font-semibold">{t.value}</p>
            <p className="text-sm text-muted-foreground">{t.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold">Activity log (demo data)</h2>
      <ul className="surface-card divide-y divide-border">
        {LOG.map((l) => (
          <li key={l.what} className="flex flex-wrap items-center gap-2 px-5 py-4">
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">{l.type}</span>
            <span className="flex-1 text-sm">{l.what}</span>
            <span className="text-xs text-muted-foreground">{l.when}</span>
          </li>
        ))}
      </ul>
    </AppLayout>
  );
}
