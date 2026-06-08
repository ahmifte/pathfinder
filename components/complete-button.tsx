"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

export function CompleteButton({
  courseId,
  lessonSlug,
  initialCompleted,
}: {
  courseId: string;
  lessonSlug: string;
  initialCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const next = !completed;
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, lessonSlug, completed: next }),
      });
      if (!res.ok) throw new Error();
      setCompleted(next);
    } catch {
      alert("Could not update progress.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-md border border-default px-4 py-2 text-sm font-medium hover:bg-[hsl(var(--border))]/30 disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : completed ? (
        <CheckCircle2 className="h-4 w-4 text-accent" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {completed ? "Completed" : "Mark complete"}
    </button>
  );
}
