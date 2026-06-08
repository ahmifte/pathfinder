"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export function BuyButton({
  courseId,
  priceLabel,
}: {
  courseId: string;
  priceLabel: string;
}) {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (status !== "authenticated") {
      void signIn("github");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Could not start checkout.");
        setLoading(false);
      }
    } catch {
      alert("Could not start checkout.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 font-medium text-accent-fg hover:opacity-90 disabled:opacity-60"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      Get the course · {priceLabel}
    </button>
  );
}
