import { useCallback, useEffect, useState } from "react";

export type ActivityType =
  | "Smart Email"
  | "Meeting Notes"
  | "Task Planner"
  | "Rooted Insights"
  | "AI Assistant";

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  input: string;
  output: string;
  createdAt: string;
};

const KEY = "rooted-ai:activities";
const EVENT = "rooted-ai:activities-changed";

function read(): Activity[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Activity[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(list: Activity[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT));
}

export function addActivity(entry: Omit<Activity, "id" | "createdAt">) {
  const activity: Activity = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  write([activity, ...read()]);
  return activity;
}

export function deleteActivity(id: string) {
  write(read().filter((a) => a.id !== id));
}

export function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => setActivities(read()), []);

  useEffect(() => {
    sync();
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) sync();
    };
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, [sync]);

  const remove = useCallback((id: string) => deleteActivity(id), []);

  return { activities, ready, remove };
}

export function countByType(activities: Activity[], type: ActivityType) {
  return activities.filter((a) => a.type === type).length;
}
