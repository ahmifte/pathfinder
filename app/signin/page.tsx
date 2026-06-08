"use client";

import { signIn } from "next-auth/react";
import { Github } from "lucide-react";

export default function SignInPage() {
  return (
    <section className="container flex min-h-[70vh] items-center justify-center py-20">
      <div className="w-full max-w-sm rounded-xl border border-default bg-card p-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Sign in to pathfinder
        </h1>
        <p className="mt-2 text-sm text-muted">
          Use your GitHub account to access your courses.
        </p>
        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 font-medium text-accent-fg hover:opacity-90"
        >
          <Github className="h-4 w-4" />
          Continue with GitHub
        </button>
      </div>
    </section>
  );
}
