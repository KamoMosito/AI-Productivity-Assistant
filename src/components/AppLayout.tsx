import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  CalendarCheck,
  Search,
  Bot,
  Activity,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/smart-email", label: "Smart Email", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Notes", icon: NotebookPen },
  { to: "/task-planner", label: "Task Planner", icon: CalendarCheck },
  { to: "/insights", label: "Rooted Insights", icon: Search },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/25 text-foreground shadow-soft"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-4.5 shrink-0" aria-hidden />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <Link to="/" className="px-1">
          <Logo showTagline />
        </Link>
        <div className="mt-8 flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <p className="px-2 text-xs text-muted-foreground">
          Internal platform for Rooted With Care
        </p>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-sidebar/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground"
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-sidebar px-4 py-5 shadow-card">
            <div className="flex items-start justify-between">
              <Logo showTagline />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}

      <main className="px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  accent = "pink",
}: {
  title: string;
  description: string;
  accent?: "pink" | "lavender" | "sage" | "peach";
}) {
  const bar = {
    pink: "bg-primary",
    lavender: "bg-lavender",
    sage: "bg-sage",
    peach: "bg-peach",
  }[accent];
  return (
    <div className="mb-6 flex gap-4">
      <span className={cn("mt-1 w-1.5 shrink-0 rounded-full", bar)} aria-hidden />
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
