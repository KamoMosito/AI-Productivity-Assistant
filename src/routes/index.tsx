import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, CalendarCheck, Search, Bot } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { countByType, formatWhen, useActivities } from "@/lib/activity";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rooted AI Dashboard — Smarter business. Rooted in care." },
      {
        name: "description",
        content:
          "Rooted AI is the internal AI productivity dashboard for Rooted With Care: smart emails, meeting summaries and task planning in one place.",
      },
      { property: "og:title", content: "Rooted AI Dashboard — Smarter business. Rooted in care." },
      {
        property: "og:description",
        content:
          "AI-powered workplace productivity for Rooted With Care: smart emails, meeting summaries and task planning.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/smart-email" as const,
    icon: Mail,
    emoji: "✉️",
    name: "Smart Email",
    desc: "Draft professional emails for customers, suppliers and your team in seconds.",
    cta: "Write an email",
    tint: "bg-pink-soft",
    dot: "bg-primary",
  },
  {
    to: "/meeting-notes" as const,
    icon: NotebookPen,
    emoji: "📝",
    name: "Meeting Notes",
    desc: "Turn messy notes into a summary with decisions, action items and deadlines.",
    cta: "Summarize notes",
    tint: "bg-lavender-soft",
    dot: "bg-lavender",
  },
  {
    to: "/task-planner" as const,
    icon: CalendarCheck,
    emoji: "📅",
    name: "Task Planner",
    desc: "Prioritise your tasks and build a realistic daily or weekly schedule.",
    cta: "Plan my tasks",
    tint: "bg-sage-soft",
    dot: "bg-sage",
  },
  {
    to: "/insights" as const,
    icon: Search,
    emoji: "🔎",
    name: "Rooted Insights",
    desc: "Research marketing, customers and product launch ideas with clear next steps.",
    cta: "Start research",
    tint: "bg-peach-soft",
    dot: "bg-peach",
  },
  {
    to: "/assistant" as const,
    icon: Bot,
    emoji: "🤖",
    name: "AI Assistant",
    desc: "Ask the Rooted AI Assistant anything about your day-to-day workplace tasks.",
    cta: "Open assistant",
    tint: "bg-lavender-soft",
    dot: "bg-primary",
  },
];

const STATS = [
  { label: "Emails generated", type: "Smart Email" as const, tint: "bg-pink-soft" },
  { label: "Meetings summarized", type: "Meeting Notes" as const, tint: "bg-lavender-soft" },
  { label: "Tasks planned", type: "Task Planner" as const, tint: "bg-sage-soft" },
];

function Dashboard() {
  const { activities, ready } = useActivities();
  const recent = activities.slice(0, 5);

  return (
    <AppLayout>
      <section className="surface-card mb-8 bg-gradient-to-br from-pink-soft via-card to-lavender-soft p-6 sm:p-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">Hello, Rootie 👋</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Let's grow the business, one task at a time.
        </p>
        <p className="mt-4 max-w-xl text-xs text-muted-foreground">
          Rooted AI is the internal productivity platform for Rooted With Care — relief, hydration,
          growth.
        </p>
      </section>

      <h2 className="mb-4 text-lg font-semibold">Your AI toolkit</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {FEATURES.map((f) => (
          <article key={f.to} className={`surface-card flex flex-col p-5 ${f.tint}`}>
            <span
              className={`inline-flex size-11 items-center justify-center rounded-2xl ${f.dot}/40`}
              aria-hidden
            >
              <f.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold">
              {f.emoji} {f.name}
            </h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{f.desc}</p>
            <Button asChild className="mt-4 w-full sm:w-auto">
              <Link to={f.to}>{f.cta}</Link>
            </Button>
          </article>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold">Productivity overview</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className={`surface-card p-5 ${s.tint}`}>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-3xl font-semibold">
              {ready ? countByType(activities, s.type) : 0}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold">Recent activity</h2>
      {recent.length === 0 ? (
        <div className="surface-card px-5 py-8 text-center">
          <p className="text-sm font-medium">No recent activity</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your completed AI activities will appear here.
          </p>
        </div>
      ) : (
        <ul className="surface-card divide-y divide-border">
          {recent.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-2 px-5 py-4">
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                {a.type}
              </span>
              <span className="flex-1 text-sm">{a.title}</span>
              <span className="text-xs text-muted-foreground">{formatWhen(a.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </AppLayout>
  );
}

