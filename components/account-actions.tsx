"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function AccountActions() {
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (
      !window.confirm(
        "Delete your account and all data permanently? This cannot be undone.",
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) throw new Error();
      await signOut({ callbackUrl: "/" });
    } catch {
      alert("Could not delete account. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-md border border-default px-4 py-2 text-sm font-medium"
      >
        Sign out
      </button>
      <button
        onClick={onDelete}
        disabled={deleting}
        className="rounded-md border border-red-500/40 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 disabled:opacity-60"
      >
        {deleting ? "Deleting…" : "Delete account"}
      </button>
    </div>
  );
}
