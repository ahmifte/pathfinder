import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How pathfinder handles your data.",
};

export default function PrivacyPage() {
  return (
    <section className="container max-w-2xl py-20">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: 2026</p>
      <div className="mt-8 space-y-6 leading-relaxed text-muted">
        <p>
          pathfinder stores your account identity (via your sign-in provider),
          your course purchases, and your lesson progress. That is all we need to
          run the platform.
        </p>
        <div>
          <h2 className="font-semibold text-[hsl(var(--foreground))]">
            Payments
          </h2>
          <p className="mt-2">
            Payments are processed by Stripe. We never see or store your card
            number.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-[hsl(var(--foreground))]">
            Your rights
          </h2>
          <p className="mt-2">
            You can delete your account and all associated data at any time from
            the dashboard. We do not sell personal data.
          </p>
        </div>
      </div>
    </section>
  );
}
