import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of pathfinder.",
};

export default function TermsPage() {
  return (
    <section className="container max-w-2xl py-20">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted">Last updated: 2026</p>
      <div className="mt-8 space-y-6 leading-relaxed text-muted">
        <div>
          <h2 className="font-semibold text-[hsl(var(--foreground))]">
            Course access
          </h2>
          <p className="mt-2">
            Buying a course grants you a personal, non-transferable license to
            access its content for as long as the platform operates. You may not
            redistribute or resell course materials.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-[hsl(var(--foreground))]">
            Refunds
          </h2>
          <p className="mt-2">
            If a course is not what was described, request a refund within 14 days
            of purchase and we will make it right.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-[hsl(var(--foreground))]">
            Disclaimer
          </h2>
          <p className="mt-2">
            Course content is educational and provided as-is. Results depend on
            your own effort and circumstances.
          </p>
        </div>
      </div>
    </section>
  );
}
